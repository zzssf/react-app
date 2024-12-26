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
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const touchStartY = useRef(0)
  const initialScrollTop = useRef(0)

  // 处理下拉刷新
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
      // 减小下拉距离，增加阻尼效果
      setPullDistance(Math.pow(distance, 0.7) * 0.6)
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance > 30 && !isRefreshing && pullDownRefresh) {
      setIsRefreshing(true)
      await pullDownRefresh()
      setIsRefreshing(false)
    }
    setPullDistance(0)
  }

  // 处理上拉加载更多
  const handleScroll = async () => {
    if (!containerRef.current || !loadMore || isLoadingMore || !hasMore) return

    const { scrollTop, clientHeight, scrollHeight } = containerRef.current
    const threshold = 50 // 距离底部多少像素时触发加载

    if (scrollHeight - (scrollTop + clientHeight) < threshold) {
      setIsLoadingMore(true)
      try {
        await loadMore()
      } finally {
        setIsLoadingMore(false)
      }
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('touchstart', handleTouchStart)
      container.addEventListener('touchmove', handleTouchMove, { passive: false })
      container.addEventListener('touchend', handleTouchEnd)
      container.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart)
        container.removeEventListener('touchmove', handleTouchMove)
        container.removeEventListener('touchend', handleTouchEnd)
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [pullDistance, isRefreshing, isLoadingMore, hasMore])

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
        {isLoadingMore && (
          <div className={styles.loadingMore}>
            <span>加载中...</span>
          </div>
        )}
        {!hasMore && data.length > 0 && (
          <div className={styles.noMore}>
            <span>没有更多了</span>
          </div>
        )}
      </div>
    </div>
  )
}
