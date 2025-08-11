import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export function checkWin(
  ox: number,
  oy: number,
  player: string,
  board: Array<Array<string>>,
): { isWon: boolean; winner: string } {
  const deltas = [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
  ]
  let isWon = false

  for (const delta of deltas) {
    let count = 1
    let i = 1

    while (
      ox + delta.x >= 0 &&
      ox + delta.x < board.length &&
      oy + delta.y >= 0 &&
      oy + delta.y < board[0].length
    ) {
      if (count >= 5) {
        isWon = true
        break
      } else if (board[ox + i * delta.x][oy + i * delta.y] === player) {
        count += 1
        i++
      } else {
        break
      }
    }

    i = 1

    while (
      ox - delta.x >= 0 &&
      ox - delta.x < board.length - 1 &&
      oy - delta.y >= 0 &&
      oy - delta.y < board[0].length - 1
    ) {
      if (count >= 5) {
        isWon = true
        break
      } else if (board[ox - i * delta.x][oy - i * delta.y] === player) {
        count += 1
        i++
      } else {
        break
      }
    }
  }

  return { isWon, winner: player }
}

export const checkDraw = (board: Array<Array<string>>) => {
  if (board.length === 225) {
    return true
  } else {
    return false
  }
}

type Player = 'white' | 'black' | ''

type State = {
  isWon: boolean
  isDraw: boolean
  isMyTurn: boolean
  board: Array<Array<Player>>
  piecePos: Array<{ x: number; y: number; player: Player }>
  player: { me: Player; opponent: Player }
  winner: string
}

type Actions = {
  setIsWin: () => void
  setIsDraw: () => void
  placePiece: (x: number, y: number, who: 'me' | 'opponent') => void
  setPlayer: (me: Player) => void
  setIsMyTurn: (is: boolean) => void
  reset: () => void
}

const initialState: State = {
  isWon: false,
  isDraw: false,
  isMyTurn: false,
  board: new Array(15).fill(null).map(() => new Array(15).fill('')),
  piecePos: [],
  player: { me: 'white', opponent: 'black' },
  winner: '',
}

export const useGameStore = create<State & Actions>()(
  immer((set, get) => ({
    ...initialState,
    setIsWin: () =>
      set((state) => {
        state.isWon = true
      }),
    setIsDraw: () =>
      set((state) => {
        state.isDraw = true
      }),
    setIsMyTurn: (isMyTurn) =>
      set((state) => {
        state.isMyTurn = isMyTurn
      }),
    placePiece: (x, y, who) =>
      set((state) => {
        state.piecePos.push({ x, y, player: state.player[who] })
        state.board[x][y] = state.player[who]

        const { isWon, winner } = checkWin(x, y, get().player[who], get().board)
        if (isWon) {
          state.isWon = true
          state.winner = winner
          state.isMyTurn = false
        }
        if (checkDraw(get().board)) {
          state.isDraw = true
          state.isMyTurn = false
        }
      }),
    setPlayer: (me) =>
      set((state) => {
        if (me === 'white') {
          state.player = { me: 'white', opponent: 'black' }
        } else {
          state.player = { me: 'black', opponent: 'white' }
        }
      }),

    reset: () => set(initialState),
  })),
)
