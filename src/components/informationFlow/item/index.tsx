import React, { useMemo } from 'react'

import { Ellipsis, Image } from 'antd-mobile'
import { CloseOutline } from 'antd-mobile-icons'

import { EFileType } from 'src/type/enum'
import { ItemType } from 'src/type/informationFlow'

import styles from './index.module.scss'

const Item: React.FC<ItemType> = ({ content, comment, author, image = [], fileType, video }) => {
  // 渲染图片的函数
  const renderImage = (src: string) => (
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

  const relativeInformation = useMemo(() => {
    return (
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
  }, [author, comment])

  const renderPicture = useMemo(() => {
    const pictureMaps = new Map<EFileType, JSX.Element>([
      [
        EFileType.SINGLE_PICTURE,
        <div className={styles.singleContainer} key={fileType}>
          <div className={styles.singlePicture}>{renderImage(image?.[0] || '')}</div>
          <div className={styles.content}>
            <div className={styles.main}>{content || ''}</div>
            {relativeInformation}
          </div>
        </div>
      ],
      [
        EFileType.MULTI_PICTURE,
        <div className={styles.multiPicture} key={fileType}>
          <div className={styles.pictures}>
            {image?.map((imageUrl, key) => (
              <div key={key}>{renderImage(imageUrl)}</div>
            ))}
          </div>
          {relativeInformation}
        </div>
      ],
      [
        EFileType.SINGLE_VIDEO,
        <div className={styles.videoContainer} key={fileType}>
          <video controls className={styles.videoStyle}>
            <source src={video || ''} type="video/mp4"></source>
          </video>
          {relativeInformation}
        </div>
      ],
      [EFileType.IS_ONLY_TEXT, relativeInformation]
    ])

    return pictureMaps.get(fileType)
  }, [fileType, image, relativeInformation, video, content])

  const containerStyle = useMemo(() => {
    const containerStylesMap = new Map([
      [EFileType.SINGLE_PICTURE, [styles.container].join(' ')],
      [EFileType.MULTI_PICTURE, [styles.setMultiPicture, styles.container].join(' ')],
      [EFileType.SINGLE_VIDEO, [styles.setSingleVideo, styles.container].join(' ')],
      [EFileType.IS_ONLY_TEXT, [styles.setOnlyText, styles.container].join(' ')]
    ])

    return containerStylesMap.get(fileType)
  }, [fileType])

  return (
    <div className={containerStyle}>
      {EFileType.SINGLE_PICTURE !== fileType && <div className={styles.main}>{content || ''}</div>}
      {renderPicture}
    </div>
  )
}

export default Item
