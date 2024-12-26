import React, { useEffect, useRef, useState } from 'react'

import PullToRefresh from '../pullToRefresh'

import styles from './index.module.scss'

interface VirtualScrollProps<T> {
  data: T[]
  loadMore?: () => Promise<void>
  pullDownRefresh?: () => Promise<void>
  renderItem: (item: T) => React.ReactNode
  hasMore?: boolean
}

export function VirtualScroll<T>({ data, loadMore, pullDownRefresh, renderItem, hasMore }: VirtualScrollProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const touchStartY = useRef(0)
  const initialScrollTop = useRef(0)

  const handleTouchStart = (e: TouchEvent) => {
    if (containerRef.current) {
      touchStartY.current = e.touches[0].clientY
      initialScrollTop.current = containerRef.current.scrollTop
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!containerRef.current || isRefreshing) return

    const touchY = e.touches[0].clientY
    const scrollTop = containerRef.current.scrollTop
    const distance = touchY - touchStartY.current

    if (scrollTop <= 0 && distance > 0) {
      e.preventDefault()
      setPullDistance(Math.pow(distance, 0.8)) // 添加阻尼效果
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance > 50 && !isRefreshing && pullDownRefresh) {
      setIsRefreshing(true)
      await pullDownRefresh()
      setIsRefreshing(false)
    }
    setPullDistance(0)
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('touchstart', handleTouchStart)
      container.addEventListener('touchmove', handleTouchMove, { passive: false })
      container.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart)
        container.removeEventListener('touchmove', handleTouchMove)
        container.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [pullDistance, isRefreshing])

  return (
    <div className={styles.virtualScrollContainer} ref={containerRef}>
      <PullToRefresh distance={pullDistance} loading={isRefreshing} />
      <div
        className={styles.content}
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: pullDistance ? 'none' : 'transform 0.2s ease'
        }}
      >
        {data.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
      </div>
    </div>
  )
}
