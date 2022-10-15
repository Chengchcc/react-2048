interface ScoreBoardProps {
    title: string
    score: number
}

export function ScoreBoard({title, score}: ScoreBoardProps) {
    return (
        <div className="flex flex-col justify-center items-center bg-secondary color-white border-rd-3px w-92px py-8px mx-4px">
            <span className="text-[12px] color-tertiary font-bold ">{title}</span>
            <span className="text-[18px] color-white font-bold">{score}</span>
        </div>
    )
}