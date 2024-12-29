import React, { useEffect, useRef, useState, useCallback } from 'react'

import styles from './index.module.scss'

interface FloatingRefreshButtonProps {
  onRefresh: () => void
}

export const FloatingRefreshButton: React.FC<FloatingRefreshButtonProps> = ({ onRefresh }) => {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({
    x: window.innerWidth - 70,
    y: window.innerHeight * 0.8
  })
  const [isDragging, setIsDragging] = useState(false)
  const positionRef = useRef(position)
  const startPosRef = useRef({ x: 0, y: 0 })
  const [isRotating, setIsRotating] = useState(false)
  const rafRef = useRef<number>()

  useEffect(() => {
    positionRef.current = position
  }, [position])

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      const buttonSize = 56
      const newX = Math.min(Math.max(0, clientX - startPosRef.current.x), window.innerWidth - buttonSize)
      const newY = Math.min(Math.max(0, clientY - startPosRef.current.y), window.innerHeight - buttonSize)
      setPosition({ x: newX, y: newY })
    })
  }, [])

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (!buttonRef.current) return
      setIsDragging(true)
      const touch = e.touches[0]
      startPosRef.current = {
        x: touch.clientX - positionRef.current.x,
        y: touch.clientY - positionRef.current.y
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const touch = e.touches[0]
      updatePosition(touch.clientX, touch.clientY)
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }

    const button = buttonRef.current
    if (button) {
      button.addEventListener('touchstart', handleTouchStart, { passive: true })
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      if (button) {
        button.removeEventListener('touchstart', handleTouchStart)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isDragging, updatePosition])

  useEffect(() => {
    const handleResize = () => {
      if (!isDragging) {
        setPosition({
          x: window.innerWidth - 70,
          y: window.innerHeight * 0.8
        })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isDragging])

  const handleClick = useCallback(() => {
    if (!isDragging) {
      setIsRotating(true)
      onRefresh()
      setTimeout(() => setIsRotating(false), 1000)
    }
  }, [isDragging, onRefresh])

  return (
    <div
      ref={buttonRef}
      className={`${styles.floatingButton} ${isRotating ? styles.rotating : ''} ${isDragging ? styles.dragging : ''}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`
      }}
      onClick={handleClick}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
      </svg>
    </div>
  )
}
