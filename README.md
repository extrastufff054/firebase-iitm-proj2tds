# Quiz Solver AI

This is a Next.js application built with Firebase Studio that uses Generative AI (via Genkit) to automatically solve quizzes. The application can analyze quiz questions, process context data, generate answers, and submit them to a remote server.

## Features

- **AI-Powered Quiz Solving**: Leverages Large Language Models to understand and answer complex questions based on provided context.
- **Automated Quiz API**: An API endpoint at `/api/quiz` that can receive quiz tasks and solve them asynchronously.
- **Prompt Engineering UI**: A dedicated "Prompt Tester" page for experimenting with different questions and contexts to refine AI performance.
- **Modern UI**: Built with Next.js, React, Tailwind CSS, and ShadCN for a responsive and polished user experience.
- **Serverless Deployment**: Configured for easy, one-command deployment to Firebase App Hosting.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN](https://ui.shadcn.com/)
- **AI/LLM Integration**: [Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models.
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/hosting)

## Project Structure

Here is an overview of the key files and directories in the project:

```
.
├── src
│   ├── app
│   │   ├── api/quiz/route.ts   # The API endpoint for receiving quiz tasks.
│   │   ├── quiz/               # Contains the main quiz UI, prompt tester, and results pages.
│   │   ├── page.tsx            # The main login page.
│   │   └── layout.tsx          # The root layout for the application.
│   │
│   ├── ai
│   │   ├── flows/              # Contains all the Genkit flows for AI logic.
│   │   │   └── solve-quiz-flow.ts # The core logic for fetching, analyzing, and solving quizzes.
│   │   └── genkit.ts           # Genkit configuration file.
│   │
│   ├── components
│   │   ├── ui/                 # Reusable UI components from ShadCN.
│   │   └── quiz-client.tsx     # The main client component for the interactive quiz page.
│   │
│   └── lib
│       └── quiz-data.ts        # Sample data for the interactive quiz.
│
├── public/                     # Static assets.
├── apphosting.yaml             # Configuration for Firebase App Hosting.
├── next.config.ts              # Next.js configuration.
└── package.json                # Project dependencies and scripts.
```

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- `npm` (comes with Node.js)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd <project-directory>
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

### Running the Development Server

To run the application in development mode, use the following command. This will start the Next.js app and the Genkit developer UI.

```bash
npm run dev
```

- Your application will be available at `http://localhost:9002`.
- The Genkit development server will be available at `http://localhost:4000`.

## API Endpoint: `/api/quiz`

The application exposes a `POST` endpoint at `/api/quiz` to receive and process quiz tasks automatically.

### Request

The endpoint expects a `POST` request with a JSON body containing your email, a secret key, and the URL of the quiz to solve.

**Payload:**

```json
{
  "email": "your-email@example.com",
  "secret": "your_secret_key",
  "url": "https://quiz-task-url.com"
}
```

### Responses

- **`200 OK`**: If the request is valid, the endpoint will immediately respond with a `200` status and a message indicating that the process has started. The actual quiz-solving happens asynchronously.
  ```json
  {
    "message": "Quiz solving process initiated"
  }
  ```
- **`400 Bad Request`**: If the request body is not valid JSON.
- **`403 Forbidden`**: If the `secret` provided in the payload does not match the one configured in the environment.

## Deployment

This application is configured for deployment to **Firebase App Hosting**.

### Prerequisites

- [Firebase CLI](https://firebase.google.com/docs/cli) installed and configured.
- You must be logged into your Firebase account (`firebase login`).
- Your local project must be connected to a Firebase project (`firebase init`).

### Deploying the Application

1.  **Build the project for production**:
    ```bash
    npm run build
    ```

2.  **Deploy to Firebase**:
    ```bash
    firebase deploy --only apphosting
    ```

After the deployment is complete, the Firebase CLI will provide you with the public URL where your application is live on the internet.
