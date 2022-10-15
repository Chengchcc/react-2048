import { useCallback, useEffect, useRef, useState } from 'react'
import { TileState } from '../composables/tileState'
import { calcLocation, calcTileSize } from '../utils'

export function useTileState(tile: TileState) {
  const ref = useRef<HTMLDivElement>(null)

  const [size, setSize] = useState(() => {
    const { ctx } = tile
    return calcTileSize(ctx.gridSize, ctx.rows, ctx.cols, ctx.spacing)
  })
  const [value, setValue] = useState(()=> {
    return tile.value
  })
  const [isMerging, setIsMerging] = useState(false)

  const [isNew, setIsNew] = useState(true)

  const getLoation = useCallback(()=> {
    const { col, row, ctx } = tile
    const size = calcTileSize(ctx.gridSize, ctx.rows, ctx.cols, ctx.spacing)
    const location =({
      top: calcLocation(size.width, col, ctx.spacing),
      left: calcLocation(size.height, row, ctx.spacing)
    })
    return location
  }, [tile])

  useEffect(() => {
    tile.onRefresh((event) => {
      setIsNew(false)
      if (event == 'Merge') {
        setIsMerging(true)
        setValue(tile.value)
      } else {
        setIsMerging(false)
      }
      const location = getLoation();
      if(ref.current){
        ref.current.style.transform =  `translate(${location.top}px, ${location.left}px)`
      }
    })
  }, [isMerging, isNew])

  return {
    size,
    ref,
    value,
    isMerging,
    getLoation,
    isNew
  }
}
