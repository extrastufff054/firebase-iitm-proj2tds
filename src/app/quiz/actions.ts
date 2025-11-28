'use server';

import { 
  analyzeQuizQuestionAndGenerateAnswer,
  type AnalyzeQuizQuestionInput,
  type AnalyzeQuizQuestionOutput 
} from '@/ai/flows/analyze-quiz-question-and-generate-answer';

import {
  optimizeLLMPerformance,
  type OptimizeLLMPerformanceInput,
  type OptimizeLLMPerformanceOutput,
} from '@/ai/flows/optimize-llm-performance-with-system-prompt';

export async function solveQuestionAction(input: AnalyzeQuizQuestionInput): Promise<AnalyzeQuizQuestionOutput> {
  // Simulate network latency for a better user experience
  await new Promise(resolve => setTimeout(resolve, 1500));
  return await analyzeQuizQuestionAndGenerateAnswer(input);
}

export async function testPromptAction(input: OptimizeLLMPerformanceInput): Promise<OptimizeLLMPerformanceOutput> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1500));
  return await optimizeLLMPerformance(input);
}
