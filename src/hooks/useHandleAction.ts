import type { DataConnection } from 'peerjs'
import type { InitialPayload, PlacePayload, Player } from '@/types/messages'
import { useGameStore } from '@/pages/game/state/useGameStore'
import {
  Action,
  ActionSchema,
  buildInitialPayload,
  buildRestartPayload,
} from '@/types/messages'

export function useHandleAction() {
  const setPlayer = useGameStore((state) => state.setPlayer)
  const placePiece = useGameStore((state) => state.placePiece)
  const setIsMyTurn = useGameStore((state) => state.setIsMyTurn)
  const reset = useGameStore((state) => state.reset)

  function handleInitial(action: InitialPayload) {
    reset()
    if (action.player === 0) {
      setPlayer('black')
      setIsMyTurn(true)
    } else {
      setPlayer('white')
    }
  }

  function handlePlace(action: PlacePayload) {
    setIsMyTurn(true)
    placePiece(action.x, action.y, 'opponent')
  }

  function handleRestart(conn: DataConnection) {
    const isRestart = confirm('Do you want to restart?')
    if (isRestart) {
      reset()
      initialGame(conn)
    } else {
      conn.close()
    }
  }

  function initialGame(conn: DataConnection) {
    const oppoPlayer = (Math.floor(Math.random() * 10) + 1) % 2
    const player = oppoPlayer ? 'black' : 'white'
    setPlayer(player)
    if (player == 'black') {
      setIsMyTurn(true)
    }
    conn.send(buildInitialPayload(oppoPlayer as Player))
  }

  function restart(conn: DataConnection) {
    conn.send(buildRestartPayload())
  }

  function handleAction(data: unknown, conn: DataConnection) {
    const parsed = ActionSchema.safeParse(data)
    if (!parsed.success) {
      console.error('Invalid action payload', parsed.error)
      return
    }

    switch (parsed.data.action) {
      case Action.Initial:
        handleInitial(parsed.data)
        break
      case Action.Place:
        handlePlace(parsed.data)
        break
      case Action.Restart:
        handleRestart(conn)
        break
    }
  }

  return { initialGame, handleAction, handlePlace, restart }
}
