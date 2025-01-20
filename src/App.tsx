import "./App.css";
import AnswerBox from "./answerBox";
import QuestionBox from "./questionBox";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

type QuizResponse = {
  response: {
    question: string;
    answers: {
      text: string;
      correct: boolean;
    }[];
  };
}[];

function App() {
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuizResponse>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [gameover, setGameOver] = useState("intro");
  const [numberOfQuestions, setNumberOfQuestions] = useState<number | undefined>(undefined);
  const [topic, setTopic] = useState("General");
  const [difficulty, setDifficulty] = useState("easy");
  const [showWrongMessage, setShowWrongMessage] = useState(false);
  const [showCorrectMessage, setShowCorrectMessage] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  const fetchAIContent = async () => {
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `
        Generate ${numberOfQuestions} structured JSON responses with ${difficulty} trivia questions related to the topic: ${topic}.
        Each should have 4 possible answers, with only one being correct. Generate unique ones each time.
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
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 8964,
          temperature: 0.7,
        },
      });

      const rawText = response.response.text();
      const cleanedText = rawText.replace(/```json|```/g, "").trim();
      const parsedQuestions = JSON.parse(cleanedText);

      setQuestions(parsedQuestions);
    } catch (error) {
      console.error("Error fetching or parsing AI content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerClick = (correct: boolean) => {
    if (correct) {
      setScore((prev) => prev + 1);
      setShowCorrectMessage(true);
      setShowWrongMessage(false);
      setTimeout(() => setShowCorrectMessage(false), 1000);
    } else {
      setShowWrongMessage(true);
      setTimeout(() => setShowWrongMessage(false), 1000);
      setShowCorrectMessage(false);

    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setGameOver("end");
    }
  };

  if (gameover === "intro") {
    return (
      <div className="flex flex-col items-center overflow-hidden justify-center h-screen">
        <div className="text-5xl font-extrabold text-center mb-10">
          <div>Mo' Trivia</div>
          <div className="mt-5">Mo' Problems</div>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <input
            type="number"
            placeholder="Number of Questions"
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            onClick={() => {
              setGameOver("start");
              fetchAIContent();
            }}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-5xl text-slate-200 font-extrabold italic">
        <i>Loading questions...</i>
      </div>
    );
  }

  if (gameover === "end") {
    return (
      <div className="mt-10 text-5xl font-extrabold text-center">
        <div>Game Over</div>
        <div className="mt-5">Your final score is {score}/{numberOfQuestions}</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <div className="mt-10 text-5xl font-extrabold text-center">
        <div>Mo' Trivia</div>
        <div className="mt-5">Mo' Problems</div>
      </div>
      <div className="flex flex-col h-[79vh] pb-16">
        <div className="mt-32 text-left text-xl w-36 ml-5">
          Question {currentQuestionIndex + 1}
        </div>
        <div className="flex questioncontainer justify-center text-2xl items-center">
          <QuestionBox question={currentQuestion.response.question} />
        </div>
        <div className="grid grid-cols-2 items-center justify-center">
          <AnswerBox
            colour="red-400"
            question={currentQuestion.response.answers[0]?.text || ""}
            onClick={() =>
              handleAnswerClick(
                currentQuestion.response.answers[0]?.correct === true
              )
            }
          />
          <AnswerBox
            colour="yellow-400"
            question={currentQuestion.response.answers[1]?.text || ""}
            onClick={() =>
              handleAnswerClick(
                currentQuestion.response.answers[1]?.correct === true
              )
            }
          />
          <AnswerBox
            colour="green-400"
            question={currentQuestion.response.answers[2]?.text || ""}
            onClick={() =>
              handleAnswerClick(
                currentQuestion.response.answers[2]?.correct === true
              )
            }
          />
          <AnswerBox
            colour="blue-400"
            question={currentQuestion.response.answers[3]?.text || ""}
            onClick={() =>
              handleAnswerClick(
                currentQuestion.response.answers[3]?.correct === true
              )
            }
          />
        </div>
        
        <div>Score: {score}</div>
        {showWrongMessage && (
          <div className="text-red-500 text-3xl font-bold text-center mt-5">
            Wrong!
          </div>
        )}
        {showCorrectMessage && (
          <div className="text-green-500 text-3xl font-bold text-center mt-5">
            Correct!
          </div>
        )}
      </div>
    </>
  );
}

export default App;
