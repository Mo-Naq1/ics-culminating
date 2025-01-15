import './App.css'
import AnswerBox from './answerBox'
import { useState, useEffect } from 'react'
function App() {
  const [score, setScore] = useState(5)
  function handleAnswerClick(change: number) {
    setScore((score) => score + change)
  }
  useEffect(() => {
    console.log(score)
  })

  return (
    <>
    <div className='flex items-end h-screen pb-36'>
      <div className='grid grid-cols-2 items-center justify-center'>
        <AnswerBox colour="red-400" question="Answer 1" onClick={() => handleAnswerClick(1)} />
        <AnswerBox colour="yellow-400" question="Answer 2" onClick={() => handleAnswerClick(1)} />
        <AnswerBox colour="green-400" question="Answer 3" onClick={() => handleAnswerClick(-1)}/>
        <AnswerBox colour="blue-400" question="Answer 4" onClick={() => handleAnswerClick(-1)} /> 
      </div>
    </div>
    </>
  )
}

export default App
