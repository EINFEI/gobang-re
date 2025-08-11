import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import { useMemo, useRef } from 'react'
import { Circle, Group, Image, Layer, Rect, Stage } from 'react-konva'
import { useNavigate } from '@tanstack/react-router'
import { useShallow } from 'zustand/react/shallow'
import { useGameStore } from '../state/useGameStore'
import type { Stage as StageType } from 'konva/lib/Stage'
import { useGetBoardSize } from '@/hooks/useGetBoardSize'

import { drawBoard, getBoardParams } from '@/utils/boardUtils'

export function Board({ sendPiece, restart }: IBoard) {
  const boardSize = useGetBoardSize()

  const stageRef = useRef<StageType | null>(null)
  const nav = useNavigate()

  const toHome = () => nav({ to: '/' })

  const [piecePos, board, isMyTurn, isWon, placePiece] = useGameStore(
    useShallow((state) => [
      state.piecePos,
      state.board,
      state.isMyTurn,
      state.isWon,
      state.placePiece,
    ]),
  )

  const boardCanvas = useMemo(() => {
    const createdBoard = document.createElement('canvas')
    createdBoard.width = boardSize
    createdBoard.height = boardSize

    drawBoard(createdBoard, boardSize)

    return createdBoard
  }, [boardSize])

  const handlePlacePiece = () => {
    if (!isMyTurn) return

    pipe(
      O.fromNullable(stageRef.current?.getPointerPosition()),
      O.chain((position) => {
        return typeof position.x == 'number' || typeof position.y == 'number'
          ? O.some(position)
          : O.none
      }),
      O.chain((position) => {
        const { padding, blockWidth } = getBoardParams(boardSize)
        const indexX = Math.round((position.x + padding) / blockWidth) - 1
        const indexY = Math.round((position.y + padding) / blockWidth) - 1

        return !board[indexX][indexY] ? O.some({ indexX, indexY }) : O.none
      }),
      O.match(
        () => {},
        ({ indexX, indexY }) => {
          placePiece(indexX, indexY, 'me')
          sendPiece(indexX, indexY)
        },
      ),
    )
  }

  return (
    <div className="bg-black bg-cover aspect-auto w-screen h-screen">
      {isMyTurn && (
        <h1 className="absolute top-8 right-8 z-10  text-white">Your Turn</h1>
      )}
      <div className="mx-auto w-screen h-full flex items-center justify-center">
        {isWon && (
          <div className="flex justify-start absolute top-8 left-8 z-10">
            <button
              className="m-2 bg-white hover:bg-gray-300 text-black
               font-bold py-2 px-4 border border-gray-300 rounded top-8 left-8"
              onClick={toHome}
            >
              back
            </button>
            <button
              className="m-2 bg-green-500 hover:bg-green-700 text-white
               font-bold py-2 px-4 border border-green-700 rounded  top-8 left-8"
              onClick={restart}
            >
              Restart
            </button>
          </div>
        )}

        <Stage width={boardSize} height={boardSize} ref={stageRef}>
          <Layer>
            <Rect width={boardSize} height={boardSize} fill="#A1662F"></Rect>

            <Image
              onTap={handlePlacePiece}
              onClick={handlePlacePiece}
              width={boardSize}
              height={boardSize}
              image={boardCanvas}
            />

            {piecePos.map((pos, key) => {
              const { padding, blockWidth } = getBoardParams(boardSize)
              const pieceX = padding + pos.x * blockWidth
              const pieceY = padding + pos.y * blockWidth

              return (
                <Group key={key}>
                  <Circle
                    x={pieceX}
                    y={pieceY}
                    radius={padding * 0.9}
                    fill={pos.player === 'black' ? 'black' : 'white'}
                    // fillPatternImage={background}
                  />
                  {key === piecePos.length - 1 && (
                    <Circle
                      x={pieceX}
                      y={pieceY}
                      radius={padding * 0.2}
                      fill={'red'}
                    />
                  )}
                </Group>
              )
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

interface IBoard {
  sendPiece: (x: number, y: number) => void
  restart: () => void
}
