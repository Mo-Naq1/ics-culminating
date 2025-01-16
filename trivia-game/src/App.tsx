import "./App.css";
import AnswerBox from "./answerBox";
import QuestionBox from "./questionBox";
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [score, setScore] = useState(10);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question index
  const [questions, setQuestions] = useState<any[]>([]); // Store all questions
  const [isLoading, setIsLoading] = useState(true); // Show a loader during fetching

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const fetchAIContent = async () => {
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Generate 10 structured JSON responses with trivia questions. Each should have 4 possible answers, with only one being correct. Generate unique ones each time. 
        The output should be an array following this schema:
        [
          {
            "response": {
              "question": "string",
              "answers": [
                { "text": "string", "correct": "boolean" },
                { "text": "string", "correct": "boolean" },
                { "text": "string", "correct": "boolean" },
                { "text": "string", "correct": "boolean" }
              ]
            }
          }
        ]
      `;

      const response = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 3000, // Higher to handle multiple questions
          temperature: 0.1,
        },
      });

      const rawText = response.response.text();
      const cleanedText = rawText.replace(/```json|```/g, "").trim();
      const parsedQuestions = JSON.parse(cleanedText); // Parse all 10 questions

      setQuestions(parsedQuestions); // Save questions to state
    } catch (error) {
      console.error("Error fetching or parsing AI content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAIContent();
  }, []);

  const handleAnswerClick = (correct: boolean) => {
    if (!correct) setScore((prev) => prev - 1);

    // Move to the next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      alert("Quiz complete!"); // Or handle end of quiz logic
    }
    console.log(score);
    console.log(questions);
  };

  if (isLoading) {
    return (
      <div className="text-5xl text-slate-200 font-extrabold itali">
        <i>Loading questions...</i>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const options = new Map<string, boolean>(
    currentQuestion.response.answers.map((answer: any) => [
      answer.text,
      answer.correct,
    ])
  );

  const isTrue: boolean =
    questions[currentQuestionIndex].response.answers[0].correct === true;

  return (
    <>
      <div className="mt-10 text-5xl font-extrabold text-center">
        <div>Mo' Trivia</div>
        <div className="mt-5">Mo' Problems</div>
      </div>
      <div className="flex flex-col h-[79vh] pb-16">
        <div className="mt-32 text-left text-xl w-36  ml-5">
          Question {currentQuestionIndex + 1}
        </div>
        <div className="flex questioncontainer justify-center text-2xl items-center">
          <QuestionBox question={currentQuestion.response.question} />
        </div>
        <div className="grid grid-cols-2 items-center justify-center">
          <AnswerBox
            colour="red-400"
            question={questions[currentQuestionIndex].response.answers[0].text}
            onClick={() =>
              handleAnswerClick(
                questions[currentQuestionIndex].response.answers[0].correct ===
                  true
              )
            }
          />
          <AnswerBox
            colour="yellow-400"
            question={questions[currentQuestionIndex].response.answers[1].text}
            onClick={() =>
              handleAnswerClick(
                questions[currentQuestionIndex].response.answers[1].correct ===
                  true
              )
            }
          />
          <AnswerBox
            colour="green-400"
            question={questions[currentQuestionIndex].response.answers[2].text}
            onClick={() =>
              handleAnswerClick(
                questions[currentQuestionIndex].response.answers[2].correct ===
                  true
              )
            }
          />
          <AnswerBox
            colour="blue-400"
            question={questions[currentQuestionIndex].response.answers[3].text}
            onClick={() =>
              handleAnswerClick(
                questions[currentQuestionIndex].response.answers[3].correct ===
                  true
              )
            }
          />
        </div>
      </div>
    </>
  );
}

export default App;
