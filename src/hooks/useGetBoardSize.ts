import { useEffect, useState } from 'react'

export const useGetBoardSize = () => {
  const getBoardSize = (innerHeight: number, innerWidth: number) =>
    innerHeight > innerWidth ? innerWidth * 0.9 : innerHeight * 0.9

  const [boardSize, setBoardSize] = useState(
    getBoardSize(window.innerHeight, window.innerWidth),
  )

  const handleResize = () => {
    const { innerHeight, innerWidth } = window
    setBoardSize(getBoardSize(innerHeight, innerWidth))
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return Math.round(boardSize)
}
