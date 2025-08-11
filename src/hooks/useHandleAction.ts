import type { DataConnection } from 'peerjs'
import { useGameStore } from '@/pages/game/state/useGameStore'

export enum Action {
  Initial = 'INITIAL',
  Place = 'PLACE',
  Restart = 'RESTART',
}

export function useHandleAction() {
  const setPlayer = useGameStore((state) => state.setPlayer)
  const placePiece = useGameStore((state) => state.placePiece)
  const setIsMyTurn = useGameStore((state) => state.setIsMyTurn)
  const reset = useGameStore((state) => state.reset)

  function placeOppoPiece(data: any) {
    if (typeof data.x === 'number' && typeof data.y === 'number') {
      setIsMyTurn(true)
      placePiece(data.x, data.y, 'opponent')
    }
  }

  function initialGame(conn: DataConnection) {
    const oppoPlayer = (Math.floor(Math.random() * 10) + 1) % 2
    if (oppoPlayer === 0) {
      setPlayer('white')
    } else {
      setPlayer('black')
      setIsMyTurn(true)
    }
    conn.send({
      action: Action.Initial,
      player: oppoPlayer,
    })
  }

  function restart(conn: DataConnection) {
    conn.send({
      action: Action.Restart,
    })
  }

  function handleAction(data: any, conn: DataConnection) {
    switch (data.action) {
      case Action.Initial:
        reset()
        if (data.player === 0) {
          setPlayer('black')
          setIsMyTurn(true)
        } else if (data.player === 1) {
          setPlayer('white')
        }
        break

      case Action.Place:
        placeOppoPiece(data)
        break

      case Action.Restart: {
        const isRestart = confirm('Do you want to restart?')
        if (isRestart) {
          reset()
          initialGame(conn)
        } else {
          conn.close()
        }
      }
    }
  }

  return { initialGame, handleAction, placeOppoPiece, restart }
}
