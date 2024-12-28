import React, { useCallback, useEffect, useRef, useState } from 'react'

import { VIDEO_CONSTANTS } from 'src/constants/video'
import { formatDuration, handleVideoPlayback } from 'src/utils/videoUtils'

import { VideoControls } from '../videoControls'

import styles from './index.module.scss'

interface VideoPlayerProps {
  video: string
  poster?: string
  playCount?: string
  duration?: string
  defaultPoster?: string
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  poster,
  playCount = VIDEO_CONSTANTS.DEFAULT_PLAY_COUNT,
  duration = VIDEO_CONSTANTS.DEFAULT_DURATION,
  defaultPoster = VIDEO_CONSTANTS.DEFAULT_POSTER
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(poster || defaultPoster)

  const generateThumbnail = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (poster) {
      setThumbnailUrl(poster)
      return
    }

    setThumbnailUrl(defaultPoster)

    video.addEventListener(
      'loadedmetadata',
      () => {
        if (video.duration) {
          const formattedDuration = formatDuration(video.duration)
          console.log('Video duration:', formattedDuration)
        }
      },
      { once: true }
    )
  }, [poster, defaultPoster])

  useEffect(() => {
    generateThumbnail()
  }, [generateThumbnail])

  const handleClick = () => {
    handleVideoPlayback(videoRef, isPlaying, setIsPlaying)
  }

  return (
    <div className={styles.videoContainer} onClick={handleClick}>
      <video
        ref={videoRef}
        className={styles.videoStyle}
        poster={thumbnailUrl}
        preload={VIDEO_CONSTANTS.METADATA_PRELOAD}
      >
        <source src={video} type="video/mp4" />
      </video>
      {!isPlaying && <VideoControls playCount={playCount} duration={duration} />}
    </div>
  )
}
