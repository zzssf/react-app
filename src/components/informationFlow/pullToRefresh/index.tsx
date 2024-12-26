import React from 'react'

import styles from './index.module.scss'

interface PullToRefreshProps {
  distance: number
  loading: boolean
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ distance, loading }) => {
  const height = Math.min(distance, 100)
  const opacity = Math.min(distance / 100, 1)

  return (
    <div
      className={styles.refreshContainer}
      style={{
        height: `${height}px`,
        opacity
      }}
    >
      <div className={`${styles.refreshIcon} ${loading ? styles.loading : ''}`}>
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
        </svg>
      </div>
      <span className={styles.refreshText}>{loading ? '刷新中...' : '下拉刷新'}</span>
    </div>
  )
}

export default PullToRefresh
