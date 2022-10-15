import { throttle } from 'lodash-es'
import { useEffect, useState } from 'react'
import { GameState } from '../composables/gameState'
import { GameContext } from '../hooks/useGameContext'
import { GameController } from './GameController'
import { GameScore } from './GameScore'
import { Notification } from './Notification'

interface GameProviderProps {
  children: JSX.Element | JSX.Element[]
  gridSize: number
}
export function GameProvider({ children, gridSize }: GameProviderProps) {
  const [gameState, setGameState] = useState<GameState>()
  useEffect(() => {
    const _gameState = new GameState(gridSize, 8)
    _gameState.generateTile()
    _gameState.generateTile()
    const handler = (evt: KeyboardEvent) => {
      switch (evt.key) {
        case 'Left':
        case 'ArrowLeft':
          _gameState.onMove('left')
          break
        case 'Right':
        case 'ArrowRight':
          _gameState.onMove('right')
          break
        case 'Up':
        case 'ArrowUp':
          _gameState.onMove('up')
          break
        case 'Down':
        case 'ArrowDown':
          _gameState.onMove('down')
          break
      }
    }
    const throttledHandler = throttle(handler, 150)
    setGameState(_gameState)
    window.addEventListener('keydown', throttledHandler)
    // @ts-ignore
    window.gameState = _gameState
    return () => {
      window.removeEventListener('keydown', throttledHandler)
    }
  }, [])

  return gameState ? (
    <GameContext.Provider value={gameState}>
      <div flex="~ col" className="justify-center items-center relative">
        <GameScore/>
        <GameController />
        {children}
        <Notification />
        <div className='flex flex-col justify-center items-center color-primary my-12px'>
          <p className='m-0 leading-[2]'>
          ✨ Join tiles with the same value to get 2048
          </p>
          <p className='m-0 leading-[2]'>
          🕹️ Play with arrow keys or swipe
          </p>
        </div>
      </div>
    </GameContext.Provider>
  ) : null
}
