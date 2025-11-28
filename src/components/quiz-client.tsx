'use client';

import { useEffect, useReducer, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bot,
  CheckCircle2,
  ChevronRight,
  FileText,
  Loader2,
  Lightbulb,
  XCircle,
  Clock,
} from 'lucide-react';
import { quizData, type QuizQuestion } from '@/lib/quiz-data';
import { solveQuestionAction } from '@/app/quiz/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const QUIZ_TIME_LIMIT = 180; // 3 minutes per question

type State = {
  status: 'idle' | 'analyzing' | 'solved' | 'evaluating' | 'finished';
  currentQuestionIndex: number;
  aiAnswer: string;
  aiReasoning: string;
  score: number;
  timeLeft: number;
  feedback: 'correct' | 'wrong' | null;
};

type Action =
  | { type: 'START_ANALYSIS' }
  | { type: 'SET_ANSWER'; payload: { answer: string; reasoning: string } }
  | { type: 'EVALUATE_ANSWER' }
  | { type: 'SET_FEEDBACK'; payload: 'correct' | 'wrong' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'FINISH_QUIZ' }
  | { type: 'TICK' }
  | { type: 'RESET_TIMER' };

const initialState: State = {
  status: 'idle',
  currentQuestionIndex: 0,
  aiAnswer: '',
  aiReasoning: '',
  score: 0,
  timeLeft: QUIZ_TIME_LIMIT,
  feedback: null,
};

function quizReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START_ANALYSIS':
      return { ...state, status: 'analyzing', aiAnswer: '', aiReasoning: '' };
    case 'SET_ANSWER':
      return { ...state, status: 'solved', aiAnswer: action.payload.answer, aiReasoning: action.payload.reasoning };
    case 'EVALUATE_ANSWER':
      return { ...state, status: 'evaluating', feedback: null };
    case 'SET_FEEDBACK':
      return { ...state, feedback: action.payload, score: action.payload === 'correct' ? state.score + 1 : state.score };
    case 'NEXT_QUESTION':
      if (state.currentQuestionIndex < quizData.length - 1) {
        return { ...initialState, currentQuestionIndex: state.currentQuestionIndex + 1, score: state.score };
      }
      return { ...state, status: 'finished' };
    case 'FINISH_QUIZ':
      return { ...state, status: 'finished' };
    case 'TICK':
      return { ...state, timeLeft: state.timeLeft > 0 ? state.timeLeft - 1 : 0 };
    case 'RESET_TIMER':
      return { ...state, timeLeft: QUIZ_TIME_LIMIT };
    default:
      return state;
  }
}

export function QuizClient() {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const router = useRouter();
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout>();

  const currentQuestion = quizData[state.currentQuestionIndex];

  const startTimer = useCallback(() => {
    dispatch({ type: 'RESET_TIMER' });
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [state.currentQuestionIndex, startTimer]);

  useEffect(() => {
    if (state.timeLeft === 0 && state.status !== 'finished') {
      toast({
        title: 'Time is up!',
        description: 'Moving to the next question.',
        variant: 'destructive',
      });
      handleNextQuestion();
    }
  }, [state.timeLeft, state.status]);

  useEffect(() => {
    if (state.status === 'finished') {
      clearInterval(timerRef.current);
      localStorage.setItem('quizResult', JSON.stringify({ score: state.score, total: quizData.length }));
      router.push('/quiz/results');
    }
  }, [state.status, state.score, router]);

  const handleSolve = async () => {
    dispatch({ type: 'START_ANALYSIS' });
    try {
      const result = await solveQuestionAction({
        question: currentQuestion.question,
        contextData: currentQuestion.context,
      });
      dispatch({ type: 'SET_ANSWER', payload: { answer: result.answer, reasoning: result.reasoning || 'No reasoning provided.' } });
    } catch (error) {
      toast({ title: 'AI Error', description: 'Could not generate an answer.', variant: 'destructive' });
      // Reset to idle state if AI fails
      dispatch({ type: 'NEXT_QUESTION' }); // This effectively resets the question state
      dispatch({ type: 'RESET_TIMER' });
    }
  };

  const handleSubmit = () => {
    dispatch({ type: 'EVALUATE_ANSWER' });
    setTimeout(() => {
        const isCorrect = state.aiAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
        dispatch({ type: 'SET_FEEDBACK', payload: isCorrect ? 'correct' : 'wrong' });
        toast({
            title: isCorrect ? 'Correct!' : 'Incorrect',
            description: isCorrect ? 'The AI submitted the correct answer.' : 'The AI submitted the wrong answer.',
            variant: isCorrect ? 'default' : 'destructive',
            className: isCorrect ? 'bg-green-500 border-green-500 text-white' : ''
        });
    }, 1000);
  };

  const handleNextQuestion = () => {
    if (state.currentQuestionIndex < quizData.length - 1) {
      dispatch({ type: 'NEXT_QUESTION' });
    } else {
      dispatch({ type: 'FINISH_QUIZ' });
    }
  };

  const isLoading = state.status === 'analyzing' || state.status === 'evaluating';

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Question {state.currentQuestionIndex + 1} of {quizData.length}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{Math.floor(state.timeLeft / 60)}:{(state.timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">{currentQuestion.question}</p>
          <Progress value={((state.currentQuestionIndex + 1) / quizData.length) * 100} className="mt-4 h-2" />
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText size={20} /> Context Data</CardTitle>
            <CardDescription>The data AI will use to answer the question.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-mono bg-muted p-4 rounded-md whitespace-pre-wrap">{currentQuestion.context}</p>
          </CardContent>
        </Card>

        <Card className="min-h-[280px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot size={20} /> AI Generated Answer</CardTitle>
            <CardDescription>The answer generated by the Large Language Model.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {state.status === 'idle' && (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-8">
                <Lightbulb className="w-10 h-10 mb-4 text-primary/50"/>
                <p>Click "Let AI Solve" to generate an answer.</p>
              </div>
             )}
             {state.status === 'analyzing' && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                </div>
             )}
             {(state.status === 'solved' || state.status === 'evaluating' || state.feedback) && (
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h3 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground"><Lightbulb size={16} /> Answer</h3>
                        <p className="text-2xl font-bold text-primary">{state.aiAnswer}</p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-sm text-muted-foreground">Reasoning</h3>
                        <p className="text-sm text-foreground/80">{state.aiReasoning}</p>
                    </div>
                </div>
             )}
             {state.feedback && (
                <Alert variant={state.feedback === 'correct' ? 'default' : 'destructive'} className={state.feedback === 'correct' ? 'bg-green-500/10 border-green-500/40 text-green-700 dark:text-green-400' : ''}>
                    {state.feedback === 'correct' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    <AlertTitle>{state.feedback === 'correct' ? 'Evaluation: Correct' : 'Evaluation: Incorrect'}</AlertTitle>
                    <AlertDescription className="text-foreground/80">
                        The correct answer was: <strong>{currentQuestion.correctAnswer}</strong>
                    </AlertDescription>
                </Alert>
             )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4 mt-2">
        {state.status === 'idle' && (
          <Button onClick={handleSolve} disabled={isLoading} size="lg">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" /> }
            Let AI Solve
          </Button>
        )}
        {state.status === 'solved' && (
          <Button onClick={handleSubmit} disabled={isLoading} size="lg">
             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" /> }
            Submit Answer
          </Button>
        )}
        {state.feedback && (
          <Button onClick={handleNextQuestion} size="lg">
            Next Question <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
