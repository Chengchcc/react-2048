import { useCallback, useContext, useEffect, useState } from "react"
import { GameState } from "../composables/gameState"
import { GameContext } from "../hooks/useGameContext"

export function Notification() {

    const gameState =  useContext(GameContext)

    const [gameStatus, setGameStatus] = useState<GameState['gamestatus']>('playing')


    const onRetry = useCallback(()=> {
        if(gameState.gamestatus == 'win'){
            gameState.gamestatus ='continue'
            setGameStatus(gameState.gamestatus)
        }else if(gameState.gamestatus === 'lost') {
            gameState.retry()
        }
    }, [gameState])

    useEffect(()=> {
        const unregister = gameState.selfChannel.register('notification', ()=> {
            setGameStatus(gameState.gamestatus)
        })
        return ()=> {
            unregister();
        }
    }, [gameState])


    return (
     gameStatus == 'win' || gameStatus  == 'lost' ?
        <div className="absolute top-0 left-0 w-100% h-100% z-9999 is-notification flex flex-col justify-center items-center">
            <div className="absolute top-0 left-0 w-100% h-100% bg-backdrop op-70 z-[-1]"></div>
            <div className="flex justify-center items-center p-16px">
                <span className="color-primary text-[20px]">
                    {gameStatus == 'win' ? 'You win! Continue?' : 'Oops...Game Over!'}
                </span>
            </div>
            <button onClick={()=> onRetry()}  className="py-8px px-16px border-rd-3px bg-primary color-white outline-none border-none text-[18px] cursor-pointer">{gameStatus == 'win' ? 'Continue' : 'Retry'}</button>
        </div> : null
    )
}