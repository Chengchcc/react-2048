import { useMemo } from 'react'
import { TileState } from '../composables/tileState'
import { useTileState } from '../hooks/useTileState'

export interface TileProps {
  tile: TileState
}

export function Tile({ tile }: TileProps) {
  const { size, ref, value, getLoation, isMerging, isNew } = useTileState(tile)

  const animate = useMemo(() => {
    const base = []
    if (isMerging) {
      base.push('is-merge')
    }
    if (isNew) {
      base.push('is-new')
    }
    return base.join(' ')
  }, [isMerging, isNew])

  const fontSize = useMemo(()=> {
    const {width, height} = size
    const factor = value >=1024 ? 2.8 : 2;
    return Math.min(width, height) / factor
  }, [value, size])

  const bg = useMemo(()=> {
    return 'bg-tile-' + (value.toString(2).length - 1) * 50
  }, [value])

  const color = useMemo(()=> {
    return value > 4 ? 'color-foreground' : 'color-primary'
  }, [value])

  const className = useMemo(()=> {
    const base = ['flex justify-center items-center border-rd-3px w-100% h-100%']
    base.push(animate)
    base.push(bg)
    base.push(color)
    return base.join(' ')
  }, [animate, bg, color])

  const location = getLoation();
  return (
    <div
      ref={ref}
      className="absolute flex transition-transform-150 ease-in-out"
      style={{
        width: size.width,
        height: size.height,
        transform: `translate(${location.top}px, ${location.left}px)`
      }}
    >
      <div
        className={className}
        style={{
            fontSize,
        }}
      >
        {value}
      </div>
    </div>
  )
}
