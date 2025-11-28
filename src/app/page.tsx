'use client';

import { useState } from 'react';
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
          variant: 'default',
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BrainCircuit className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            Quiz Solver AI
          </CardTitle>
          <CardDescription className="pt-2">
            Enter the secret key to begin your session.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Verifying...' : 'Unlock'}
          </Button>
        </CardFooter>
      </Card>
      <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Quiz Solver AI. All Rights Reserved.</p>
        <p className="text-xs mt-1">Hint: The secret is 'secret123'</p>
      </footer>
    </main>
  );
}
