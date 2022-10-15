import { useCallback, useContext, useState } from 'react'
import { GameContext } from '../../hooks/useGameContext'
import { Stepper } from './Stepper'

export function GameController() {
  const gameState = useContext(GameContext)
  const [rows, setRows] = useState(() => {
    return gameState.rows
  })
  const [cols, setCols] = useState(() => {
    return gameState.cols
  })

  const onSetRows = useCallback(
    (val: number) => {
      gameState.rows = val
      gameState.retry()
      setRows(val)
    },
    [rows]
  )

  const onSetCols = useCallback(
    (val: number) => {
      gameState.cols = val
      gameState.retry()
      setCols(val)
    },
    [cols]
  )

  return (
    <div className='mt-4px mb-20px w-100%'>
      <div className="flex justify-between items-center w-100%">
        <button
          onClick={() => gameState.retry()}
          className="px-16px py-8px border-none border-rd-3px bg-primary color-white cursor-pointer leading-[1.75]"
        >
            <span className='leading-[1.5] text-[16px]'>
                New Game
            </span>
        </button>
        <div className="flex items-center">
          <Stepper
            value={rows}
            onChange={(val) => onSetRows(val)}
            min={4}
            max={8}
            title="ROWS"
            className="mr-20px"
          />
          <Stepper
            value={cols}
            onChange={(val) => onSetCols(val)}
            min={4}
            max={8}
            title="COLS"
          />
        </div>
      </div>
    </div>
  )
}
