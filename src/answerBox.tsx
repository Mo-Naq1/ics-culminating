interface AnswerBoxProps {
    question: string;
    colour: 'red-400' | 'yellow-400' | 'green-400' | 'blue-400';
    onClick: () => void;
}

function AnswerBox({ question, colour, onClick }: AnswerBoxProps) {
    return (
        <div  
            className={`border answercontainer cursor-pointer border-${colour} hover:bg-${colour}`} 
            onClick={onClick} //feature for tracking if the answer is correct or not
        >
            <h1>{question}</h1>
        </div>
    );
}

export default AnswerBox;