'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Award, RefreshCw, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

type Result = {
  score: number;
  total: number;
};

const chartConfig = {
  correct: {
    label: "Correct",
    color: "hsl(var(--accent))",
  },
  incorrect: {
    label: "Incorrect",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig

export function ResultsClient() {
  const [result, setResult] = useState<Result | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const storedResult = localStorage.getItem('quizResult');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    }
  }, []);

  const handleRestart = () => {
    localStorage.removeItem('quizResult');
    router.push('/quiz');
  };

  if (!isMounted) {
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle>Loading Results...</CardTitle>
            </CardHeader>
            <CardContent className="h-64 animate-pulse bg-muted rounded-md" />
        </Card>
    )
  }

  if (!result) {
    return (
      <Card className="w-full max-w-2xl mx-auto text-center">
        <CardHeader>
          <CardTitle>No Results Found</CardTitle>
          <CardDescription>It seems you haven't completed a quiz yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/quiz">Start a New Quiz</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { score, total } = result;
  const percentage = total > 0 ? (score / total) * 100 : 0;
  const incorrect = total - score;

  const chartData = [
    { name: "Stats", correct: score, incorrect: incorrect },
  ]
  
  let message = "Good effort!";
  if (percentage === 100) message = "Perfect Score! Outstanding!";
  else if (percentage >= 75) message = "Excellent Work!";
  else if (percentage >= 50) message = "Well Done!";

  return (
    <Card className="w-full max-w-2xl mx-auto text-center shadow-lg">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          {percentage === 100 ? <Trophy className="h-10 w-10" /> : <Award className="h-10 w-10" />}
        </div>
        <CardTitle className="text-4xl font-bold">{message}</CardTitle>
        <CardDescription className="text-lg">You have completed the quiz.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-around items-center p-4 rounded-lg bg-muted">
            <div>
                <p className="text-sm text-muted-foreground">SCORE</p>
                <p className="text-4xl font-bold text-primary">{score}/{total}</p>
            </div>
             <div>
                <p className="text-sm text-muted-foreground">ACCURACY</p>
                <p className="text-4xl font-bold text-accent">{percentage.toFixed(0)}%</p>
            </div>
        </div>

        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{left: 10}}>
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={() => ''} />
                <XAxis dataKey="correct" type="number" hide />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                />
                <Bar dataKey="correct" stackId="a" fill="var(--color-correct)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="incorrect" stackId="a" fill="var(--color-incorrect)" radius={[4, 0, 0, 4]} />
            </BarChart>
        </ChartContainer>

        <Button onClick={handleRestart} size="lg" className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Take Another Quiz
        </Button>
      </CardContent>
    </Card>
  );
}
