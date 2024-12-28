import { useEffect, useState } from 'react'

import { EFileType } from 'src/type/enum'
import { ItemType } from 'src/type/informationFlow'

import ItemRender from '../item'
import { VirtualScroll } from '../virtualScroll'

import styles from './index.module.scss'

// 生成唯一ID的辅助函数
const generateUniqueId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Mock 数据生成函数
const generateMockData = (): ItemType[] => [
  {
    id: generateUniqueId(),
    content: '女人花不花心，看嘴唇一目了然\n第一、嘴巴小，男人最爱\n第二、嘴唇薄，情感多变。',
    comment: '14',
    author: '骏马',
    fileType: EFileType.USER_PROFILE,
    image: [
      'https://images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80'
    ],
    video: null,
    userProfile: {
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80',
      nickname: '骏马',
      isFollowed: false
    }
  },
  {
    id: generateUniqueId(),
    content: '一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一',
    comment: '174评',
    author: '惜蕊说历史',
    fileType: EFileType.SINGLE_PICTURE,
    image: [
      'https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60'
    ],
    video: null
  },
  {
    id: generateUniqueId(),
    content: '一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我',
    comment: '50评',
    author: '小易寒',
    fileType: EFileType.SINGLE_PICTURE,
    image: [
      'https://images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80'
    ],
    video: null
  },
  {
    id: generateUniqueId(),
    content:
      '一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武，一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武，一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武',
    comment: '50评',
    author: '小易寒',
    fileType: EFileType.MULTI_PICTURE,
    image: [
      'https://images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80',
      'https://images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80',
      'https://images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80'
    ],
    video: null
  },
  {
    id: generateUniqueId(),
    content: '一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司',
    comment: '50评',
    author: '小易寒',
    image: null,
    video: null,
    fileType: EFileType.IS_ONLY_TEXT
  },
  {
    id: generateUniqueId(),
    content: '一旦我国武统台湾,美将 打击',
    comment: '50评',
    author: '小易寒',
    image: null,
    video: 'https://www.runoob.com/try/demo_source/mov_bbb.mp4',
    fileType: EFileType.SINGLE_VIDEO
  }
]

// 模拟API调用
const mockApi = {
  fetchData: async (start: number, end: number): Promise<ItemType[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const mockData = generateMockData()
    return Array.from({ length: end - start }, (_, i) => ({
      ...mockData[Math.floor(Math.random() * mockData.length)],
      id: generateUniqueId(),
      userProfile: mockData[0].userProfile && {
        ...mockData[0].userProfile,
        isFollowed: Math.random() > 0.5
      }
    }))
  },

  refreshData: async (): Promise<ItemType[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return generateMockData().map((item) => ({
      ...item,
      id: generateUniqueId()
    }))
  }
}

const List = () => {
  const [items, setItems] = useState<ItemType[]>([])
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    handleRefresh()
  }, [])

  const handleLoadMore = async () => {
    if (items.length >= 100) {
      setHasMore(false)
      return
    }
    const newItems = await mockApi.fetchData(items.length, items.length + 10)
    setItems((prevItems) => [...prevItems, ...newItems])
  }

  const handleRefresh = async () => {
    const newItems = await mockApi.refreshData()
    setItems(newItems)
    setHasMore(true)
  }

  return (
    <div className={styles.container}>
      <VirtualScroll
        data={items}
        hasMore={hasMore}
        loadMore={handleLoadMore}
        pullDownRefresh={handleRefresh}
        renderItem={(item) => <ItemRender {...item} />}
      />
    </div>
  )
}

export default List
