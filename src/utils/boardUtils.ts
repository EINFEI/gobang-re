type boardParamsType = {
  line: number
  blockCount: number
  padding: number
  blockWidth: number
  boardWidth: number
}

export function getBoardParams(boardSize: number) {
  const line = 15
  const blockCount = line - 1
  const padding = boardSize / blockCount / 2
  const blockWidth = (boardSize - padding * 2) / blockCount
  const boardWidth = blockWidth * blockCount

  const boardParams: boardParamsType = {
    line,
    blockCount,
    padding,
    blockWidth,
    boardWidth,
  }

  return boardParams
}

export function drawBoard(boardCanvas: HTMLCanvasElement, boardSize: number) {
  const { line, padding, blockWidth, boardWidth } = getBoardParams(boardSize)

  for (let i = 0; i < line; i++) {
    const ctx = boardCanvas.getContext('2d')
    //* vertical line

    ctx?.beginPath()
    ctx?.moveTo(padding + i * blockWidth, padding)
    ctx?.lineTo(padding + i * blockWidth, padding + boardWidth)
    ctx?.stroke()
    ctx?.restore()

    //* horizontal line
    ctx?.beginPath()
    ctx?.moveTo(padding, padding + i * blockWidth)
    ctx?.lineTo(padding + boardWidth, padding + i * blockWidth)
    ctx?.stroke()
    ctx?.restore()

    ctx?.beginPath()
    ctx?.arc(boardSize / 2, boardSize / 2, padding / 4, 0, 2 * Math.PI)
    ctx?.fill()
    ctx?.stroke()
    ctx?.restore()
  }
}
