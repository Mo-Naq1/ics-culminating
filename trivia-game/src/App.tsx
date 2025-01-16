import './App.css'
import AnswerBox from './answerBox'
import QuestionBox from './questionBox'
import { useState, useEffect } from 'react'

function App() {
  const [score, setScore] = useState(10)
  const [currentQuestion, setCurrentQuestion] = useState(1)

  function handleAnswerClick(correct: boolean) {
    setCurrentQuestion((currentQuestion) => currentQuestion + 1)
    if (correct === true) { 
      console.log('Correct')
    } else {
      console.log('Incorrect')
      setScore((score) => score - 1)
    }
  }

  useEffect(() => {
    console.log(`Score updated: ${score}`);
  }, [score]); 

  return (
    <>
    <div className="mt-10 text-5xl font-extrabold text-center">
    <div>Mo' Trivia</div>
    <div className="mt-5">Mo' Problems</div>
    </div>
      <div className='flex flex-col h-[79vh] pb-16'>  
        <div className='mt-32 text-left text-xl w-36  ml-5'>Question {currentQuestion}</div>
        <div className="flex questioncontainer justify-center items-center">
          <QuestionBox />
        </div>
        <div className='grid grid-cols-2 items-center justify-center'>
          <AnswerBox colour="red-400" question="Answer 1" onClick={() => handleAnswerClick(true)} />
          <AnswerBox colour="yellow-400" question="Answer 2" onClick={() => handleAnswerClick(false)} />
          <AnswerBox colour="green-400" question="Answer 3" onClick={() => handleAnswerClick(false)} />
          <AnswerBox colour="blue-400" question="Answer 4" onClick={() => handleAnswerClick(false)} /> 
        </div>
      </div>
    </>
  )
}

export default App
