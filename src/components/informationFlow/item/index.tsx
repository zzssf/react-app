import React, { useMemo, useEffect, useRef, useState, useCallback } from 'react'

import { Image } from 'antd-mobile'
import { CloseOutline } from 'antd-mobile-icons'

import { VIDEO_CONSTANTS } from 'src/constants/video'
import { EFileType } from 'src/type/enum'
import { ItemType } from 'src/type/informationFlow'
import { preloadImage } from 'src/utils/imageOptimizer'

import { DislikePopup } from '../dislikePopup'
import { SocialActions } from '../socialActions'
import { UserProfile } from '../userProfile'
import { VideoPlayer } from '../videoPlayer'

import styles from './index.module.scss'

// 优化图片URL工具函数
const getOptimizedImageUrl = (url: string, width: number, height: number) => {
  try {
    const urlObj = new URL(url)
    urlObj.searchParams.set('w', width.toString())
    urlObj.searchParams.set('h', height.toString())
    urlObj.searchParams.set('fit', 'crop') // 裁剪模式
    urlObj.searchParams.set('auto', 'format') // 自动格式化
    urlObj.searchParams.set('q', '80') // 设置质量
    return urlObj.toString()
  } catch {
    return url
  }
}

// 图片渲染组件
const ImageRenderer = ({ src }: { src: string }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [optimizedSrc, setOptimizedSrc] = useState('')
  const imageRef = useRef<HTMLDivElement>(null)

  // 算容器尺寸并优化图片URL
  useEffect(() => {
    if (imageRef.current) {
      const updateImageSize = () => {
        const rect = imageRef.current?.getBoundingClientRect()
        if (rect) {
          // 获取实际渲染尺寸，考虑设备像素比
          const dpr = 1 || window.devicePixelRatio
          const width = Math.round(rect.width * dpr)
          const height = Math.round(rect.height * dpr)
          // 优化URL
          const optimized = getOptimizedImageUrl(src, width, height)
          setOptimizedSrc(optimized)
        }
      }

      // 初始计算
      updateImageSize()
      // 监听窗口大小变化
      const resizeObserver = new ResizeObserver(updateImageSize)
      resizeObserver.observe(imageRef.current)

      return () => resizeObserver.disconnect()
    }
  }, [src])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '100px 0px',
        threshold: 0.1
      }
    )

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isInView && optimizedSrc) {
      const loadImage = async () => {
        try {
          await preloadImage(optimizedSrc)
          setIsLoaded(true)
        } catch (error) {
          console.error('Image load failed:', error)
          // 如果优化的URL加载失败，尝试加载原始URL
          try {
            await preloadImage(src)
            setIsLoaded(true)
          } catch (fallbackError) {
            console.error('Fallback image load failed:', fallbackError)
          }
        }
      }
      loadImage()
    }
  }, [isInView, optimizedSrc, src])

  return (
    <div ref={imageRef} className={styles.imageWrapper}>
      {isInView && (
        <Image
          src={optimizedSrc || src}
          fit="cover"
          lazy={false}
          className={`${styles.actualImage} ${isLoaded ? styles.loaded : ''}`}
          placeholder={<div className={styles.placeholder} />}
          fallback={<div className={styles.placeholder} />}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            console.error('Image load error:', optimizedSrc)
            // 如果优化的URL加载失败，回退到原始URL
            if (optimizedSrc !== src) {
              setOptimizedSrc(src)
            }
          }}
        />
      )}
      {!isInView && <div className={styles.placeholder} />}
    </div>
  )
}

// 提取作者信息组件
const AuthorInfo = ({ author, comment }: { author: string; comment: string }) => {
  const [showDislike, setShowDislike] = useState(false)

  const handleDislike = (category: string, item: string) => {
    console.log('Dislike:', category, item)
    // 这里可以添加处理不喜欢选项的逻辑
  }

  return (
    <>
      <div className={styles.otherInformation}>
        <div>
          <span>{author}</span>
          <span> {comment}</span>
        </div>
        <div className={styles.iconContainer} onClick={() => setShowDislike(true)}>
          <CloseOutline className={styles.icon} />
        </div>
      </div>
      <DislikePopup visible={showDislike} onClose={() => setShowDislike(false)} onSelect={handleDislike} />
    </>
  )
}

// 提取内容组件
const Content = ({ content }: { content: string }) => <div className={styles.main}>{content || ''}</div>

const Item: React.FC<ItemType> = ({
  content,
  comment,
  author,
  image = [],
  fileType,
  video,
  userProfile,
  publishTime
}) => {
  // 获取容器样式
  const containerStyle = useMemo(() => {
    const styleMap = {
      [EFileType.SINGLE_PICTURE]: styles.container,
      [EFileType.USER_PROFILE]: `${styles.setMultiPicture} ${styles.container}`,
      [EFileType.MULTI_PICTURE]: `${styles.setMultiPicture} ${styles.container}`,
      [EFileType.SINGLE_VIDEO]: `${styles.setSingleVideo} ${styles.container}`,
      [EFileType.IS_ONLY_TEXT]: `${styles.setOnlyText} ${styles.container}`
    }
    return styleMap[fileType]
  }, [fileType])

  // 渲染内容
  const renderContent = useMemo(() => {
    const contentMap = {
      [EFileType.SINGLE_PICTURE]: (
        <div className={styles.singleContainer}>
          <div className={styles.singlePicture}>
            <ImageRenderer src={image?.[0] || ''} />
          </div>
          <div className={styles.content}>
            <Content content={content} />
            <AuthorInfo author={author} comment={comment} />
          </div>
        </div>
      ),
      [EFileType.MULTI_PICTURE]: (
        <div className={styles.multiPicture}>
          <div className={image?.length === 1 ? styles.singleImageWrapper : styles.pictures}>
            {image?.map((url, index) => (
              <div key={`${url}_${index}`} className={styles.imageItem}>
                <ImageRenderer src={url} />
              </div>
            ))}
          </div>
          <AuthorInfo author={author} comment={comment} />
        </div>
      ),
      [EFileType.SINGLE_VIDEO]: (
        <>
          <VideoPlayer
            video={video || ''}
            poster={image?.[0]}
            playCount={VIDEO_CONSTANTS.DEFAULT_PLAY_COUNT}
            duration={VIDEO_CONSTANTS.DEFAULT_DURATION}
            defaultPoster={VIDEO_CONSTANTS.DEFAULT_POSTER}
          />
          <AuthorInfo author={author} comment={comment} />
        </>
      ),
      [EFileType.IS_ONLY_TEXT]: <AuthorInfo author={author} comment={comment} />,
      [EFileType.USER_PROFILE]: (
        <>
          {userProfile && (
            <UserProfile
              avatar={userProfile.avatar}
              nickname={userProfile.nickname}
              publishTime={publishTime}
              isFollowed={userProfile.isFollowed}
              onFollow={() => console.log('Follow clicked')}
            />
          )}
          <div className={styles.contentWrapper}>
            <Content content={content} />
            <div className={image?.length === 1 ? styles.singleImageWrapper : styles.multiImageWrapper}>
              {image?.map((url, index) => (
                <div key={`${url}_${index}`} className={styles.imageItem}>
                  <ImageRenderer src={url} />
                </div>
              ))}
            </div>
          </div>
          <SocialActions likes="190" stars="392" comments={comment} />
        </>
      )
    }
    return contentMap[fileType]
  }, [fileType, image, author, comment, content, video, userProfile, publishTime])

  return (
    <div className={containerStyle}>
      {![EFileType.USER_PROFILE, EFileType.SINGLE_PICTURE].includes(fileType) && <Content content={content} />}
      {renderContent}
    </div>
  )
}

export default Item
