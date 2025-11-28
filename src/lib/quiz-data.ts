export interface QuizQuestion {
  id: number;
  question: string;
  context: string;
  correctAnswer: string;
}

export const quizData: QuizQuestion[] = [
  {
    id: 1,
    question: "Based on the provided text about the solar system, which planet is known as the 'Red Planet'?",
    context: "The solar system consists of the Sun and the objects that orbit it. Mercury is the closest planet to the Sun. Venus is the second. Earth is the third, known for its vast oceans. Mars, the fourth planet, is often called the 'Red Planet' due to its reddish appearance caused by iron oxide on its surface. Jupiter is the largest planet in our solar system.",
    correctAnswer: "Mars",
  },
  {
    id: 2,
    question: "From the dataset, what was the total revenue for 'Product A' in Q1?",
    context: "Data: { \"sales\": [ {\"quarter\": \"Q1\", \"product\": \"Product A\", \"revenue\": 15000}, {\"quarter\": \"Q1\", \"product\": \"Product B\", \"revenue\": 22000}, {\"quarter\": \"Q2\", \"product\": \"Product A\", \"revenue\": 18000} ] }",
    correctAnswer: "15000",
  },
  {
    id: 3,
    question: "According to the historical document summary, in what year did the Declaration of Independence get signed?",
    context: "Document Title: A Brief History of the United States. Summary: The United States was formed after the 13 colonies declared independence from Great Britain. This pivotal event, marked by the signing of the Declaration of Independence, occurred in 1776. The American Revolutionary War ended in 1783.",
    correctAnswer: "1776",
  },
  {
    id: 4,
    question: "What is the capital of France, as mentioned in the geography notes?",
    context: "Geography Quick Facts: Italy's capital is Rome. Germany's capital is Berlin. France, a country in Western Europe, has Paris as its capital city, which is renowned for its art, fashion, and culture.",
    correctAnswer: "Paris",
  },
];
