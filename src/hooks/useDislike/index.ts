import { useState, useCallback } from 'react'

export interface UseDislikeResult {
  showDislike: boolean
  setShowDislike: (show: boolean) => void
  handleDislike: (category: string, item: string) => void
  handleClose: () => void
}

export const useDislike = (): UseDislikeResult => {
  const [showDislike, setShowDislike] = useState(false)

  const handleDislike = useCallback((category: string, item: string) => {
    console.log('Dislike:', category, item)
    // 这里可以添加处理不喜欢选项的逻辑
    setShowDislike(false)
  }, [])

  const handleClose = useCallback(() => {
    setShowDislike(false)
  }, [])

  return {
    showDislike,
    setShowDislike,
    handleDislike,
    handleClose
  }
}
