export const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(() => resolve(0), milliseconds))
}

export const calcSegmentSize = (
  length: number,
  segmentNum: number,
  spacing: number
) => (length - (segmentNum + 1) * spacing) / segmentNum

export const calcTileSize = (
  gridSize: number,
  rows: number,
  cols: number,
  spacing: number
) => ({
  width: calcSegmentSize(gridSize, cols, spacing),
  height: calcSegmentSize(gridSize, rows, spacing)
})

export const calcLocation = (l: number, c: number, spacing: number) =>
  (spacing + l) * c + spacing
