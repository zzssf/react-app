import React, { useEffect, useRef, useState, useCallback } from 'react'

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
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const touchStartY = useRef(0)
  const initialScrollTop = useRef(0)
  const loadingRef = useRef(false)

  // 使用 useCallback 包装事件处理函数
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (containerRef.current) {
      touchStartY.current = e.touches[0].clientY
      initialScrollTop.current = containerRef.current.scrollTop
    }
  }, [])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!containerRef.current || isRefreshing) return

      const touchY = e.touches[0].clientY
      const scrollTop = containerRef.current.scrollTop
      const distance = touchY - touchStartY.current

      if (scrollTop <= 0 && distance > 0) {
        e.preventDefault()
        setPullDistance(Math.pow(distance, 0.7) * 0.6)
      }
    },
    [isRefreshing]
  )

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance > 30 && !isRefreshing && pullDownRefresh) {
      setIsRefreshing(true)
      try {
        await pullDownRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
      }
    } else {
      setPullDistance(0)
    }
  }, [pullDistance, isRefreshing, pullDownRefresh])

  // 使用节流处理滚动事件
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !loadMore || loadingRef.current || !hasMore || isLoadingMore) return

    const { scrollTop, clientHeight, scrollHeight } = containerRef.current
    const threshold = 50

    if (scrollHeight - (scrollTop + clientHeight) < threshold) {
      loadingRef.current = true
      setIsLoadingMore(true)

      loadMore().finally(() => {
        setIsLoadingMore(false)
        loadingRef.current = false
      })
    }
  }, [loadMore, hasMore, isLoadingMore])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 添加事件监听
    const options = { passive: false }
    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchmove', handleTouchMove, options)
    container.addEventListener('touchend', handleTouchEnd)
    container.addEventListener('scroll', handleScroll)

    return () => {
      // 移除事件监听
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('scroll', handleScroll)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleScroll])

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
        {isLoadingMore && <div className={styles.loadingMore}>加载中...</div>}
        {!hasMore && data.length > 0 && <div className={styles.noMore}>没有更多了</div>}
      </div>
    </div>
  )
}
