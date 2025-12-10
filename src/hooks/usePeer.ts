import { useEffect, useRef, useState } from 'react'
import { Peer } from 'peerjs'
import { Action, useHandleAction } from './useHandleAction'
import type { DataConnection } from 'peerjs'
import { useGameStore } from '@/pages/game/state/useGameStore'

export function usePeer() {
  const peer = useRef<Peer | undefined>(null)
  const connRef = useRef<DataConnection | undefined>(null)
  const [id, setId] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isPeerOpen, setIsPeerOpen] = useState(false)

  const actionHandler = useHandleAction()

  const setIsMyTurn = useGameStore((state) => state.setIsMyTurn)

  useEffect(() => {
    peer.current = new Peer('', {
      // host: "localhost",
      // port: 9000,
      // path: "/",
      // debug: 3,
    })

    peer.current.on('open', (receivedId: string) => {
      setId(receivedId)
      setIsPeerOpen(true)
    })

    peer.current.on('connection', (conn: DataConnection) => {
      connRef.current = conn
      conn.on('open', () => {
        setIsConnected(true)
      })
      conn.on('data', (data: any) => {
        actionHandler.handleAction(data, conn)
      })
      conn.on('close', () => {
        console.log('close')
      })
      conn.on('error', (e) => {
        console.log(e)
      })
    })

    return () => {
      peer.current?.destroy()
    }
  }, [])

  function connect(connectId: string) {
    if (!isPeerOpen) return
    if (peer.current) {
      connRef.current = peer.current.connect(connectId)
      const conn = connRef.current
      conn.on('open', () => {
        setIsConnected(true)
        actionHandler.initialGame(conn)
      })
      conn.on('data', (data: any) => {
        actionHandler.handleAction(data, conn)
      })
      conn.on('close', () => {
        console.log('close')
      })
      conn.on('error', (e) => {
        console.log(e)
      })
    }
  }

  function sendPiece(x: number, y: number) {
    const conn = connRef.current
    setIsMyTurn(false)
    if (conn) {
      conn.send({
        action: Action.Place,
        x,
        y,
      })
    }
  }

  function restart() {
    if (connRef.current) {
      actionHandler.restart(connRef.current)
    }
  }

  return { id, connect, isConnected, sendPiece, restart, isPeerOpen }
}
