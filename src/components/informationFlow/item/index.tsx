import React, { useMemo } from 'react'

import { Image } from 'antd-mobile'
import { CloseOutline } from 'antd-mobile-icons'

import { EFileType } from 'src/type/enum'
import { ItemType } from 'src/type/informationFlow'

import styles from './index.module.scss'

// 提取图片渲染组件
const ImageRenderer = ({ src }: { src: string }) => (
  <div className={styles.imageWrapper}>
    <Image
      src={src}
      fit="cover"
      lazy
      className={styles.actualImage}
      placeholder={<div className={styles.placeholder} />}
      fallback={<div className={styles.placeholder} />}
    />
  </div>
)

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
