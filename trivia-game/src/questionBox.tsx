interface QuestionBoxProps {
    question: string;
}


function QuestionBox ({ question }: QuestionBoxProps) {
    return (
        <div>
            <h1>{question}</h1>
        </div>
    )
}

export default QuestionBox;