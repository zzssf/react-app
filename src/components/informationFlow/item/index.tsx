import React, { useMemo, useEffect, useRef, useState } from 'react'

import { Image, ImageProps } from 'antd-mobile'
import { CloseOutline } from 'antd-mobile-icons'

import { EFileType } from 'src/type/enum'
import { ItemType } from 'src/type/informationFlow'
import { preloadImage } from 'src/utils/imageOptimizer'

import styles from './index.module.scss'

// 添加图片尺寸优化工具
const getOptimizedImageUrl = (url: string, width: number, height: number) => {
  try {
    const urlObj = new URL(url)
    // 添加尺寸参数
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

// 提取图片渲染组件
const ImageRenderer = ({ src }: { src: string }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [optimizedSrc, setOptimizedSrc] = useState('')
  const imageRef = useRef<HTMLDivElement>(null)

  // 计算容器尺寸并优化图片URL
  useEffect(() => {
    if (imageRef.current) {
      const updateImageSize = () => {
        const rect = imageRef.current?.getBoundingClientRect()
        if (rect) {
          // 获取实际渲染尺寸，考虑设备像素比
          const dpr = window.devicePixelRatio || 1
          const width = Math.round(rect.width * dpr)
          const height = Math.round(rect.height * dpr)
          // 优化图片URL
          const optimized = getOptimizedImageUrl(src, width, height)
          setOptimizedSrc(optimized)
        }
      }

      // 初始计算
      updateImageSize()

      // 监听窗口大小变化
      const resizeObserver = new ResizeObserver(updateImageSize)
      resizeObserver.observe(imageRef.current)

      return () => {
        resizeObserver.disconnect()
      }
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

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current)
      }
    }
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
const AuthorInfo = ({ author, comment }: { author: string; comment: string }) => (
  <div className={styles.otherInformation}>
    <div>
      <span>{author}</span>
      <span> {comment}</span>
    </div>
    <div className={styles.iconContainer}>
      <CloseOutline className={styles.icon} />
    </div>
  </div>
)

// 提取内容组件
const Content = ({ content }: { content: string }) => <div className={styles.main}>{content || ''}</div>

const Item: React.FC<ItemType> = ({ content, comment, author, image = [], fileType, video }) => {
  // 获取容器样式
  const containerStyle = useMemo(() => {
    const styleMap = {
      [EFileType.SINGLE_PICTURE]: styles.container,
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
          <div className={styles.pictures}>
            {image?.map((url, index) => (
              <div key={index}>
                <ImageRenderer src={url} />
              </div>
            ))}
          </div>
          <AuthorInfo author={author} comment={comment} />
        </div>
      ),
      [EFileType.SINGLE_VIDEO]: (
        <div className={styles.videoContainer}>
          <video controls className={styles.videoStyle}>
            <source src={video || ''} type="video/mp4" />
          </video>
          <AuthorInfo author={author} comment={comment} />
        </div>
      ),
      [EFileType.IS_ONLY_TEXT]: <AuthorInfo author={author} comment={comment} />
    }
    return contentMap[fileType]
  }, [fileType, image, author, comment, content, video])

  return (
    <div className={containerStyle}>
      {fileType !== EFileType.SINGLE_PICTURE && <Content content={content} />}
      {renderContent}
    </div>
  )
}

export default Item
