import { Eventbus } from './eventbus';
import { TileState } from './tileState';

type Tile = { id: string; value: number }

export type Position = { r: number; c: number }

const Direction = {
  left: [0, 1],
  right: [0, -1],
  up: [1, 0],
  down: [-1, 0]
}

type DirectionKey = keyof typeof Direction

type GameStatus = 'win' | 'lost' | 'playing' | 'continue'

export class GameState {
  private tiles: Tile[][]

  gamestatus: GameStatus = 'playing'

  cols = 4

  rows = 4

  get tilesFlatted() {
    return this.tiles.flat()
  }

  get tilsTable() {
    return Array.from({ length: this.rows }, (_, r) =>
      Array.from({ length: this.cols }, (_, c) => this.tiles[r][c].value)
    )
  }

  get score(){
    return this.tilsTable.flat().reduce((acc, el)=> acc+el, 0)
  }

  readonly eventbus = new Eventbus<TileState['onEvent']>()

  readonly selfChannel = new Eventbus()

  tileStates: TileState[] = []

  private __uid = 1

  getUid() {
    return ++this.__uid + ''
  }

  constructor(
    readonly gridSize: number,
    readonly spacing: number
  ) {
    this.tiles = this.init()
  }

  init() {
    return Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => ({
        id: '',
        value: 0
      }))
    )
  }

  setTile(pos: Position, tile: Tile) {
    if (this.isInvalidPos(pos)) {
      this.tiles[pos.r][pos.c] = tile
    }
  }

  isInvalidPos(pos: Position) {
    const { r, c } = pos
    return !(r < 0 || r >= this.rows || c < 0 || c >= this.cols)
  }

  refresh(modified: boolean) {
    this.selfChannel.broadcast(modified)
  }

  traverse(pos: Position, dir: DirectionKey) {
    let curPos = { ...pos }
    const moves = Direction[dir]
    const stack: Tile[] = []
    const getPos = (offset: number) => {
      return {
        r: pos.r + offset * moves[0],
        c: pos.c + offset * moves[1]
      }
    }

    let modified = false
    // push to stack
    let offset = 0
    while (this.isInvalidPos(curPos)) {
      const { r, c } = curPos
      const tile = this.tiles[r][c]
      if (tile.value) {
        if(stack.length === 0){
          this.eventbus.dispatch(tile.id, 'MoveTo', getPos(0))
          stack.push(tile)
          if(offset){
            modified = true
          }
        }else {
          const top = stack[stack.length - 1]
          if (top.value == tile.value) {
            top.value += tile.value
            this.eventbus.dispatch(tile.id, 'MoveTo', getPos(stack.length -1))
            this.eventbus.dispatch(tile.id, 'Disappear')
            this.eventbus.dispatch(top.id, 'Merge')
            modified = true
          } else if (top?.value !== tile.value) {
            this.eventbus.dispatch(tile.id, 'MoveTo', getPos(stack.length))
            stack.push(tile)
            if(offset != stack.length - 1) {
              modified = true
            }
          }
        }
      }
      curPos = getPos(++offset)
    }

    // recover stack
    curPos = { ...pos }
    offset = 0
    while (this.isInvalidPos(curPos)) {
      const { r, c } = curPos
      const tile = stack.shift() ?? { id: '', value: 0 }
      this.tiles[r][c] = tile
      curPos = getPos(++offset)
    }
    return modified
  }

  getPosVal(pos: Position){
    if(this.isInvalidPos(pos)){
      return this.tiles[pos.r][pos.c].value
    }else {
      return 0
    }
  }

  isLost(){
    const dfs = (pos: Position):boolean => {
      if(!this.isInvalidPos(pos)){
        return true
      }
      const curVal = this.getPosVal(pos)
      if(curVal == 0){
        return false
      }
      const rightPos = {r: pos.r + 0, c: pos.c + 1}
      const downPos = {r: pos.r+ 1, c: pos.c}
      const rightVal= this.getPosVal(rightPos)
      if(rightVal == curVal){
        return false
      }
      const downVal = this.getPosVal(downPos)
      if(downVal == curVal){
        return false
      }
      return true && dfs(rightPos) && dfs(downPos)
    }

    return dfs({r:0, c:0})

  }

  onMove(dir: DirectionKey) {
    let startPos: Position[]
    switch (dir) {
      case 'left':
        startPos = Array.from({ length: this.rows }, (_, idx) => ({
          r: idx,
          c: 0
        }))
        break
      case 'right':
        startPos = Array.from({ length: this.rows }, (_, idx) => ({
          r: idx,
          c: this.cols - 1
        }))
        break
      case 'up':
        startPos = Array.from({ length: this.cols }, (_, idx) => ({
          r: 0,
          c: idx
        }))
        break
      case 'down':
        startPos = Array.from({ length: this.cols }, (_, idx) => ({
          r: this.rows - 1,
          c: idx
        }))
        break
      default:
        startPos = []
    }

    const modified = startPos.map((pos) => this.traverse(pos, dir))
    .reduce((acc, modified)=> acc || modified, false)

    if(modified){
      this.generateTile()
    }

    if(modified && this.isLost()){
      // no modified and board is full
      this.gamestatus = 'lost'
    }

    if(Math.max(...this.tilesFlatted.map(tile=> tile.value)) == 2048 ){
      // max is 2048
      if(this.gamestatus === 'playing') {
        this.gamestatus = 'win'
      }
    }

    this.refresh(modified)
  }

  onRefresh(handler: (modified: boolean) => void) {
    return this.selfChannel.register('refresh', handler)
  }

  retry() {
    // clear board
    this.tiles = this.init()
    this.tileStates = []
    this.gamestatus = 'playing'
    // flush eventbus
    this.eventbus.subscribers.clear()
    // regenerate 2 tiles
    this.generateTile()
    this.generateTile()
    // refresh ui
    this.refresh(true)
  }

  generateTile() {
    const hasEmpty = this.tilesFlatted.map(tile=> tile.value).filter(Boolean).length != this.tilesFlatted.length
    if(hasEmpty) {
      const tileState = new TileState(this)
      this.tileStates.push(tileState)
    }
  }
}
