import React, { useEffect, useRef, useState, ReactNode, useCallback } from 'react'

import { useDebounceFn } from 'ahooks'

import styles from './index.module.scss'

interface InfiniteScrollProps {
  style?: React.CSSProperties
  children: ReactNode
  loadMore?: () => Promise<void>
  hasMore?: boolean
  pullDownRefresh?: () => Promise<void>
  pullDownThreshold?: number
  pullDownText?: string
  onScroll?: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  style,
  children,
  loadMore,
  hasMore,
  pullDownRefresh,
  pullDownThreshold = 50,
  pullDownText,
  onScroll
}) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isPullingDown, setIsPullingDown] = useState(false)
  const [translateY, setTranslateY] = useState(0) // 添加状态来控制transform属性
  const sentinelRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef<number | null>(null)

  const handleScroll = useCallback(async () => {
    if (isLoadingMore || !hasMore || !sentinelRef.current || !containerRef.current) return

    const rect = sentinelRef.current.getBoundingClientRect()
    if (rect.top <= window.innerHeight) {
      setIsLoadingMore(true)
      await loadMore?.()
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, hasMore, loadMore])

  /**加载更多方案二 */
  // const handleScroll = useCallback(() => {
  //   if (
  //     !isLoadingMore &&
  //     hasMore &&
  //     containerRef.current &&
  //     containerRef.current.scrollHeight - containerRef.current.scrollTop <=
  //       containerRef.current.clientHeight + pullDownThreshold
  //   ) {
  //     setIsLoadingMore(true)
  //     loadMore?.().finally(() => setIsLoadingMore(false))
  //   }
  // }, [isLoadingMore, hasMore, loadMore, pullDownThreshold])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const { run } = useDebounceFn(() => pullDownRefresh?.(), {
    wait: 500
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoadingMore && hasMore && !isPullingDown) {
          handleScroll()
        }
      },
      {
        root: containerRef.current,
        threshold: 0.1
      }
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current)
      }
    }
  }, [isLoadingMore, hasMore, isPullingDown])

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startYRef.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startYRef.current === null) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startYRef.current

    if (!pullDownRefresh) {
      return
    }

    if (distance > 0 && containerRef.current && containerRef.current.scrollTop === 0) {
      setIsPullingDown(true)
      setTranslateY(Math.min(distance / 2, 45)) // 更新translateY以实现跟随下拉效果
    }
  }

  const handleTouchEnd = async () => {
    if (!isPullingDown || !pullDownRefresh || !containerRef.current || startYRef.current === null) return

    const endY = containerRef.current.scrollTop
    const distance = Math.abs(endY - startYRef.current)

    if (distance >= pullDownThreshold) {
      run()
    }

    // 等待1秒钟后再进行回弹
    setTimeout(() => {
      // 重置下拉状态
      setIsPullingDown(false)
      // 复位translateY以实现回弹效果
      setTranslateY(0)
    }, 500)
  }

  return (
    <div
      style={style}
      ref={containerRef}
      className={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onScroll={onScroll}
    >
      <div
        className={styles.content}
        style={{
          transform: `translateY(${translateY}px)` // 应用translateY以实现下拉和回弹效果
        }}
      >
        <div className={`${styles.pullDown} ${isPullingDown ? styles.pullDownActive : ''}`}>
          <div className={styles.spinner}></div>
          <span>{pullDownText}</span>
        </div>
        {children}
        <div ref={sentinelRef} className={styles.sentinel}></div>
        {isLoadingMore && <div className={styles.loading}>Loading...</div>}
      </div>
    </div>
  )
}

export default InfiniteScroll
