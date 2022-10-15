import { useContext, useEffect, useMemo, useState } from 'react'
import { TileState } from '../composables/tileState'
import { GameContext } from '../hooks/useGameContext'
import { Tile } from './Tile'

export function Game() {
  const gameState = useContext(GameContext)
  const { rows, cols, gridSize } = gameState
  const [tiles, setTiles] = useState<TileState[]>(() => {
    return gameState?.tileStates
  })

  useEffect(() => {
    const unregister = gameState.onRefresh((modified) => {
      if (modified) {
        setTiles([...gameState.tileStates])
      }
    })
    return () => {
      unregister()
    }
  }, [tiles])

  const tilesEl = useMemo(() => {
    return Array.from({ length: rows }, (_, r) => {
      return Array.from({ length: cols }, (_, c) => (
        <div key={r * rows + c} className="bg-secondary" />
      ))
    }).flat()
  }, [rows, cols])

  return (
    <div className='relative'>
      <div
        grid="~"
        border="solid primary rd-4px"
        className="bg-primary box-border"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: gameState?.spacing,
          borderWidth: gameState?.spacing,
          width: gridSize,
          height: gridSize
        }}
      >
        {tilesEl}
      </div>
      <div className="absolute top-0 left-0 w-100% h-100%">
        {tiles.map((tile) => (
          <Tile tile={tile} key={tile.id} />
        ))}
      </div>
    </div>
  )
}
