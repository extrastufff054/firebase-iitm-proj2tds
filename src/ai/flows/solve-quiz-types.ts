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
