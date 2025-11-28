'use server';
/**
 * @fileOverview Analyzes quiz questions and generates answers using an LLM.
 *
 * - analyzeQuizQuestionAndGenerateAnswer - A function that handles the analysis and answer generation.
 * - AnalyzeQuizQuestionInput - The input type for the analyzeQuizQuestionAndGenerateAnswer function.
 * - AnalyzeQuizQuestionOutput - The return type for the analyzeQuizQuestionAndGenerateAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeQuizQuestionInputSchema = z.object({
  question: z.string().describe('The quiz question to be answered.'),
  contextData: z.string().optional().describe('Additional context data to help answer the question. Can be text, data, or a description of a PDF.'),
});
export type AnalyzeQuizQuestionInput = z.infer<typeof AnalyzeQuizQuestionInputSchema>;

const AnalyzeQuizQuestionOutputSchema = z.object({
  answer: z.string().describe('The generated answer to the quiz question.'),
  reasoning: z.string().optional().describe('The reasoning behind the generated answer.'),
});
export type AnalyzeQuizQuestionOutput = z.infer<typeof AnalyzeQuizQuestionOutputSchema>;

export async function analyzeQuizQuestionAndGenerateAnswer(input: AnalyzeQuizQuestionInput): Promise<AnalyzeQuizQuestionOutput> {
  return analyzeQuizQuestionAndGenerateAnswerFlow(input);
}

const analyzeQuizQuestionPrompt = ai.definePrompt({
  name: 'analyzeQuizQuestionPrompt',
  input: {schema: AnalyzeQuizQuestionInputSchema},
  output: {schema: AnalyzeQuizQuestionOutputSchema},
  prompt: `You are an AI quiz solver. Analyze the provided quiz question and generate the most accurate answer based on the provided context data.

Question: {{{question}}}

Context Data: {{{contextData}}}

Answer:`,
});

const analyzeQuizQuestionAndGenerateAnswerFlow = ai.defineFlow(
  {
    name: 'analyzeQuizQuestionAndGenerateAnswerFlow',
    inputSchema: AnalyzeQuizQuestionInputSchema,
    outputSchema: AnalyzeQuizQuestionOutputSchema,
  },
  async input => {
    const {output} = await analyzeQuizQuestionPrompt(input);
    return output!;
  }
);
