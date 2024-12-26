import React from 'react'

import styles from './index.module.scss'

interface SkeletonProps {
  count?: number
}

const Skeleton: React.FC<SkeletonProps> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.skeleton}>
          <div className={styles.title} />
          <div className={styles.imageContainer}>
            {Array.from({ length: 3 }).map((_, imgIndex) => (
              <div key={imgIndex} className={styles.image} />
            ))}
          </div>
          <div className={styles.info}>
            <div className={styles.author} />
            <div className={styles.comment} />
          </div>
        </div>
      ))}
    </>
  )
}

export default Skeleton
