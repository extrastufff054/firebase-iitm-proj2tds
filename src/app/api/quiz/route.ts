'use server';
import { NextResponse } from 'next/server';
import { solveQuizAction } from '@/app/quiz/actions';

const SECRET_KEY = process.env.QUIZ_SECRET || 'secret123';

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { email, secret, url } = body;

  if (secret !== SECRET_KEY) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 403 });
  }

  if (!email || !url) {
    return NextResponse.json({ error: 'Missing email or url' }, { status: 400 });
  }

  // Asynchronously start the quiz solving process
  // We don't await this so we can return a 200 response immediately
  solveQuizAction({ email, secret, url }).catch(console.error);

  // Respond immediately to acknowledge receipt of the task
  return NextResponse.json({ message: 'Quiz solving process initiated' }, { status: 200 });
}
