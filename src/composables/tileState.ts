import { Eventbus } from './eventbus'
import { GameState, Position } from './gameState'

type TileEvent = 'MoveTo' | 'Merge' | 'Disappear'

export class TileState {
  id = ''
  value: number
  row: number
  col: number

  unregister: () => void

  readonly selfChannel = new Eventbus()

  onRefresh(handler: (event?: TileEvent) => void) {
    this.selfChannel.register('refresh', handler)
    return this
  }

  constructor(readonly ctx: GameState) {
    const pos = this.genPositon()
    this.id = this.ctx.getUid()
    this.row = pos.r
    this.col = pos.c
    this.value = 2
    this.ctx.setTile(pos, { id: this.id, value: this.value })
    this.unregister = this.ctx.eventbus.register(this.id, this.onEvent.bind(this))
  }

  genPositon(): Position {
    const emptyPos = this.ctx.tilesFlatted
      .map((tile, idx) => (tile.id ? -1 : idx))
      .filter(idx=> idx != -1)
      .map((idx) => ({
        r: Math.floor(idx / this.ctx.cols),
        c: idx % this.ctx.cols
      }))
    return emptyPos[Math.floor(Math.random() * emptyPos.length)]
  }

  onEvent(name: TileEvent, pos?: Position): void {
    if (name === 'MoveTo' && pos) {
      this.col = pos.c
      this.row = pos.r
      this.refresh()
    } else if (name === 'Merge') {
      this.value = this.value * 2
      this.refresh(name)
    } else if (name == 'Disappear') {
      this.removeFromCtx()
    }
  }

  refresh(event?: TileEvent) {
    this.selfChannel.dispatch('refresh', event)
  }

  removeFromCtx() {
    this.unregister && this.unregister()

    this.ctx.tileStates.splice(
      this.ctx.tileStates.findIndex((t) => t.id === this.id),
      1
    )

    this.ctx.refresh(true)
  }
}
