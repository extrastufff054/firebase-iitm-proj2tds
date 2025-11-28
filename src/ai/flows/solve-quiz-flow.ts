'use server';
/**
 * @fileOverview A flow for solving a complete quiz task.
 *
 * This flow handles fetching the quiz page, analyzing its content,
 * generating an answer, and submitting it.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const SolveQuizInputSchema = z.object({
  email: z.string().describe('The user email address.'),
  secret: z.string().describe('The secret string for verification.'),
  url: z.string().url().describe('The URL of the quiz task.'),
});
export type SolveQuizInput = z.infer<typeof SolveQuizInputSchema>;

export const SolveQuizOutputSchema = z.object({
  finalAnswer: z.any().optional().describe('The final answer submitted for the last question.'),
  finalUrl: z.string().url().optional().describe('The last URL that was processed.'),
  isCorrect: z.boolean().optional().describe('Whether the final answer was correct.'),
  error: z.string().optional().describe('Any error that occurred during the process.'),
  log: z.array(z.string()).describe('A log of the steps taken.'),
});
export type SolveQuizOutput = z.infer<typeof SolveQuizOutputSchema>;


async function fetchAndDecode(url: string, log: (message: string) => void): Promise<string> {
  log(`Fetching content from ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const html = await response.text();
  log('Successfully fetched HTML.');

  const scriptContentRegex = /<script>([\s\S]*?)<\/script>/;
  const match = html.match(scriptContentRegex);
  
  if (match && match[1]) {
    const scriptContent = match[1];
    log('Found script tag.');
    
    const atobRegex = /atob\(`([^`]+)`\)/;
    const atobMatch = scriptContent.match(atobRegex);

    if (atobMatch && atobMatch[1]) {
        log('Found atob() call, decoding content.');
        // Using Buffer for robust base64 decoding
        return Buffer.from(atobMatch[1], 'base64').toString('utf-8');
    }
  }
  log('No base64 content found, returning raw HTML.');
  return html;
}

const questionAnalysisPrompt = ai.definePrompt({
  name: 'questionAnalysisPrompt',
  system: 'You are an expert at analyzing text to find a question, a submission URL, and the required JSON format for an answer. Extract these three pieces of information from the provided text.',
  input: { schema: z.string() },
  output: {
    schema: z.object({
      question: z.string().describe('The question to be answered.'),
      submissionUrl: z.string().url().describe('The URL to POST the answer to.'),
      jsonFormat: z.string().describe('The example JSON payload to be used for submission, as a string.'),
    }),
  },
  prompt: 'Analyze the following text and extract the required information:\n\n{{{input}}}'
});


const answerGenerationPrompt = ai.definePrompt({
  name: 'answerGenerationPrompt',
  system: 'You are a powerful data analysis AI. You will be given a question and context. You must answer the question based *only* on the provided context. The context may include text, raw data, or summaries of files. Your answer must be in a format that can be directly substitued into a JSON payload.',
  input: {
    schema: z.object({
      question: z.string(),
      context: z.string(),
    }),
  },
  output: {
    schema: z.object({
      answer: z.any().describe('The answer to the question. This could be a string, number, boolean, or even a JSON object.'),
      reasoning: z.string().describe('A step-by-step explanation of how you arrived at the answer.')
    })
  },
  prompt: `
Context:
---
{{{context}}}
---

Question:
---
{{{question}}}
---

Based on the context, provide the answer and your reasoning.
`
});


export const solveQuiz = ai.defineFlow(
  {
    name: 'solveQuizFlow',
    inputSchema: SolveQuizInputSchema,
    outputSchema: SolveQuizOutputSchema,
  },
  async (input) => {
    const log: string[] = [];
    const logMessage = (msg: string) => {
      console.log(`[solveQuizFlow] ${msg}`);
      log.push(msg);
    };

    let currentUrl: string | undefined = input.url;

    try {
        logMessage(`Starting quiz at ${currentUrl}`);
        const decodedContent = await fetchAndDecode(currentUrl, logMessage);
        logMessage('Decoded content successfully.');

        logMessage('Analyzing content to extract question and submission details...');
        const analysis = await questionAnalysisPrompt(decodedContent);
        if (!analysis.output) {
          throw new Error("Could not analyze quiz content.");
        }

        const { question, submissionUrl, jsonFormat } = analysis.output;
        logMessage(`Question: ${question}`);
        logMessage(`Submission URL: ${submissionUrl}`);

        logMessage('Generating answer...');
        const answerResult = await answerGenerationPrompt({ question, context: decodedContent });
        if (!answerResult.output) {
          throw new Error("Could not generate an answer.");
        }

        const { answer, reasoning } = answerResult.output;
        logMessage(`AI Answer: ${JSON.stringify(answer)}`);
        logMessage(`AI Reasoning: ${reasoning}`);

        logMessage('Preparing submission payload...');
        let submissionPayload;
        try {
            submissionPayload = JSON.parse(jsonFormat);
        } catch (e) {
            throw new Error('Failed to parse submission JSON format.');
        }

        submissionPayload.email = input.email;
        submissionPayload.secret = input.secret;
        submissionPayload.url = currentUrl;
        submissionPayload.answer = answer;
        
        logMessage(`Submitting answer to ${submissionUrl}`);

        const submitResponse = await fetch(submissionUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionPayload),
        });

        if (!submitResponse.ok) {
          const errorBody = await submitResponse.text();
          throw new Error(`Submission failed with status ${submitResponse.status}: ${errorBody}`);
        }

        const submitResult = await submitResponse.json();
        logMessage(`Submission response: ${JSON.stringify(submitResult)}`);

        return {
          finalAnswer: answer,
          finalUrl: currentUrl,
          isCorrect: submitResult.correct,
          log,
        };

    } catch (error: any) {
        logMessage(`An error occurred: ${error.message}`);
        return {
            error: error.message,
            log,
        };
    }
  }
);
