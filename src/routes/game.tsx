import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { usePeer } from '@/hooks/usePeer'
import { Board } from '@/pages/game/components/Board'
import { Connect } from '@/pages/game/components/Connect'
import { useGameStore } from '@/pages/game/state/useGameStore'

export const Route = createFileRoute('/game')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isWon, winner, player, reset] = useGameStore(
    useShallow((state) => [
      state.isWon,
      state.winner,
      state.player,
      state.reset,
    ]),
  )

  const [isDialogShown, setIsDialogShown] = useState(false)
  const { id, connect, isConnected, sendPiece, restart, isPeerOpen } = usePeer()

  useEffect(() => {
    reset()
  }, [])

  useEffect(() => {
    isWon ? setIsDialogShown(true) : setIsDialogShown(false)
  }, [isWon])

  if (!isConnected) {
    return <Connect id={id} connect={connect} isPeerOpen={isPeerOpen} />
  }
  return (
    <div>
      <AlertDialog open={isDialogShown} onOpenChange={setIsDialogShown}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{`You ${winner === player.me ? 'win' : 'lose'}`}</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to play again?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogShown(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-green-600" onClick={restart}>
              Restart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Board sendPiece={sendPiece} restart={restart} />
    </div>
  )
}
