'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SECRET_KEY = 'secret123';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [secret, setSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleLogin = () => {
    setError('');
    if (!secret) {
      setError('Secret key is required.');
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (secret === SECRET_KEY) {
        toast({
          title: 'Access Granted',
          description: 'Welcome to Quiz Solver AI.',
        });
        router.push('/quiz');
      } else {
        setError('Invalid secret key. Please try again.');
        toast({
          title: 'Access Denied',
          description: 'The provided secret key is incorrect.',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 selection:bg-primary/20">
       <div className="absolute top-0 left-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BrainCircuit className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tighter text-foreground">
            Quiz Solver <span className="text-primary">AI</span>
          </CardTitle>
          <CardDescription className="pt-2 text-base">
            Enter the secret key to begin your session.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secret">Secret Key</Label>
              <Input
                id="secret"
                type="password"
                placeholder="Enter your secret key"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                disabled={isLoading}
                className="h-12 text-lg"
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-4">
          <Button
            className="w-full h-12 text-base"
            onClick={handleLogin}
            disabled={isLoading}
            size="lg"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Verifying...' : 'Unlock'}
          </Button>
        </CardFooter>
      </Card>
      <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        {year && <p>&copy; {year} Quiz Solver AI. All Rights Reserved.</p>}
        <p className="text-xs mt-1">Hint: The secret is 'secret123'</p>
      </footer>
    </main>
  );
}
