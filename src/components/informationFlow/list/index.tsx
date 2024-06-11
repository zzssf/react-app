import { useState } from 'react'

import { EFileType } from 'src/type/enum'
import { ItemType } from 'src/type/informationFlow'

import ItemRender from '../item'
import { VirtualScroll } from '../virtualScroll'

import styles from './index.module.scss'

const generateData = (start: number, end: number) => {
  return Array.from({ length: end - start }, (_, i) => data[Math.floor(Math.random() * 6)])
}

const data: ItemType[] = [
  {
    content: '一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一',
    comment: '174评',
    author: '惜蕊说历史',
    fileType: EFileType.SINGLE_PICTURE,
    image: [
      'https:images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60'
    ],
    video: null
  },
  {
    content: '一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我',
    comment: '50评',
    author: '小易寒',
    fileType: EFileType.SINGLE_PICTURE,
    image: [
      'https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80'
    ],
    video: null
  },
  {
    content: '一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美',
    comment: '50评',
    author: '小易寒',
    fileType: EFileType.MULTI_PICTURE,
    image: [
      'https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80',
      'https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80'
    ],
    video: null
  },
  {
    content: '一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武',
    comment: '50评',
    author: '小易寒',
    fileType: EFileType.MULTI_PICTURE,
    image: [
      'https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80',
      'https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80',
      'https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80'
    ],
    video: null
  },
  {
    content: '一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司',
    comment: '50评',
    author: '小易寒',
    image: null,
    video: null,
    fileType: EFileType.IS_ONLY_TEXT
  },
  {
    content: '一旦我国武统台湾,美将 打击',
    comment: '50评',
    author: '小易寒',
    image: null,
    video: 'https:www.runoob.com/try/demo_source/mov_bbb.mp4',
    fileType: EFileType.SINGLE_VIDEO
  }
]

const List = () => {
  const [items, setItems] = useState<ItemType[]>(generateData(0, 10))
  const [hasMore, setHasMore] = useState(true)

  // 图片和视频预加载函数
  const preloadMedia = (items: ItemType[]) => {
    const uniqueImages = new Set<string>()
    const uniqueVideos = new Set<string>()

    items.forEach((item) => {
      item.image?.forEach((img) => uniqueImages.add(img))
      if (item.video) uniqueVideos.add(item.video)
    })

    uniqueImages.forEach((src) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = src
      link.as = 'image'
      document.head.appendChild(link)
    })

    uniqueVideos.forEach((src) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = src
      link.as = 'video'
      document.head.appendChild(link)
    })
  }

  // 图片和视频预加载方案二
  // const preloadMedia = (items: ItemType[]) => {
  //   const uniqueImages = new Set<string>()
  //   const uniqueVideos = new Set<string>()

  //   items.forEach((item) => {
  //     item.image?.forEach((img) => uniqueImages.add(img))
  //     if (item.video) uniqueVideos.add(item.video)
  //   })

  //   uniqueImages.forEach((src) => {
  //     const img = new Image()
  //     img.src = src
  //   })

  //   uniqueVideos.forEach((src) => {
  //     const video = document.createElement('video')
  //     video.src = src
  //   })
  // }

  return (
    <div className={styles.container}>
      <VirtualScroll
        data={items}
        hasMore={hasMore}
        loadMore={async () => {
          if (items.length >= 100) {
            setHasMore(false)
            return
          }
          await new Promise((resolve) => setTimeout(resolve, 1500))
          console.log('loadMore')
          setItems((prevItems) => [...prevItems, ...generateData(prevItems.length, prevItems.length + 10)])
        }}
        pullDownRefresh={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1500))
          setItems(generateData(0, 10))
          setHasMore(true)
          console.log('pullDownRefresh')
        }}
        renderItem={(item) => <ItemRender {...(item as ItemType)} />}
        preloadMedia={preloadMedia}
      />
    </div>
  )
}

export default List
