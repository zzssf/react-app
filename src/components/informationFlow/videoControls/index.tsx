import React from 'react'

import styles from './index.module.scss'

interface VideoControlsProps {
  playCount: string
  duration: string
}

export const VideoControls: React.FC<VideoControlsProps> = ({ playCount, duration }) => (
  <>
    <div className={styles.playButton} />
    <div className={styles.videoInfo}>
      <span className={styles.playCount}>{playCount}次播放</span>
      <span>{duration}</span>
    </div>
  </>
)
