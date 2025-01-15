interface AnswerBoxProps {
    question: string;
    colour: 'red-400' | 'yellow-400' | 'green-400' | 'blue-400';
    onClick: () => void;
}

function AnswerBox({ question, colour, onClick }: AnswerBoxProps) {
    return (
        <div  
            className={`border answercontainer border-${colour} hover:bg-${colour}`} 
            onClick={onClick}
        >
            <h1>{question}</h1>
        </div>
    );
}

export default AnswerBox;