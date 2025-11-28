# **App Name**: Quiz Solver AI

## Core Features:

- Secret Verification: Verify the provided secret against the stored secret.
- Quiz Page Processing: Fetch the quiz page content, render JavaScript using a headless browser, and access the questions.
- Data Analysis and Question Solving: Use an LLM tool to interpret the questions, analyze data from various formats (text, data, PDF, etc.), potentially involving file downloads and parsing, and generate an answer.
- Response Submission: Submit the answer to the provided endpoint in the required JSON format, handling API errors and response code rules.
- Iterative Quiz Solving: Handle the iterative quiz process by submitting answers, processing responses, and proceeding to the next quiz URL until the quiz is over, managing the quiz chain state.
- Answer Validation and Resubmission: Re-submit answers, in the event of receiving a wrong response, while adhering to constraints like the 3-minute timer window, using defined re-submission decision logic.
- Timer and Deadline Enforcement: Enforce timers and deadlines for quiz completion and submission.
- Security Considerations: Implement security measures to protect against vulnerabilities.
- Logging & Monitoring: Implement logging and monitoring to track the application's performance and identify issues.
- System Prompt Design & Testing Strategy: Design and test system prompts to optimize LLM performance.
- Repo & Licensing Completeness: Ensure the repository is complete and the licensing is correct.

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5) to convey intelligence and focus.
- Background color: Very light gray (#F5F5F5), almost white.
- Accent color: Muted Green (#4CAF50), an analogous color for indicating correctness and forward progress.
- Body and headline font: 'Inter', sans-serif.
- Use simple, geometric icons to represent different data analysis tasks.
- Subtle loading animations and transitions when fetching and processing data.