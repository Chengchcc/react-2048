import { useContext, useEffect, useState } from "react"
import { GameContext } from "../../hooks/useGameContext"
import { useLocalStorage } from "../../hooks/useLocalStorage"
import { ScoreBoard } from "./ScoreBoard"

export function GameScore() {
    const gamestate = useContext(GameContext)
    const [score, setScore] = useState(()=> {
       return  gamestate.score
    })

    const [bestScore, setBestScore] = useLocalStorage('bestScore', 0)

    useEffect(()=> {
        return gamestate.selfChannel.register('score', ()=> {
            console.log('refresh score', gamestate.score)
            setScore(gamestate.score)
            if(gamestate.score > bestScore) {
                setBestScore(gamestate.score)
            }
        })
    }, [score, bestScore])

    return (
        <div className="flex justify-between items-center w-100%">
            <div className="flex items-center">
                <span className="text-[48px] font-bold color-primary">2048</span>
            </div>
            <div className="flex items-center justify-center">
                <ScoreBoard title="SCORE" score={score}/>
                <ScoreBoard title="BEST" score={bestScore} />
            </div>
        </div>
    )
}