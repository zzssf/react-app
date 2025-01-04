import React, { useState } from 'react'

import { CloseOutline, HeartOutline, StarOutline, MessageOutline } from 'antd-mobile-icons'

import { useDislike } from 'src/hooks/useDislike'

import { CommentList } from '../commentList'
import { DislikePopup } from '../dislikePopup'

import styles from './index.module.scss'

interface SocialActionsProps {
  likes?: string
  stars?: string
  comments?: string
}

export const SocialActions: React.FC<SocialActionsProps> = ({ likes = '190', stars = '392', comments = '14' }) => {
  const { showDislike, setShowDislike, handleDislike, handleClose } = useDislike()
  const [showComments, setShowComments] = useState(false)

  // Mock 评论数据
  const mockComments = [
    {
      id: '1',
      content: '应该这样说，炒股票做代价，炒股中自己买车，炒股后开始做市政工程',
      author: {
        avatar: 'https://example.com/avatar1.jpg',
        nickname: '打劫脚底板的强盗'
      },
      publishTime: '12-10',
      likes: 8
    },
    {
      id: '2',
      content: '不要借钱玩，2、不要重仓一只，3、不要投入超过10分之1的钱',
      author: {
        avatar: 'https://example.com/avatar2.jpg',
        nickname: '50的2'
      },
      publishTime: '12-10',
      likes: 12
    },
    {
      id: '3',
      content: '想从资本家手里赚差点总是把钱到他手里！',
      author: {
        avatar: 'https://example.com/avatar3.jpg',
        nickname: 'Half sorrow.'
      },
      publishTime: '12-10',
      likes: 5
    }
  ]

  // 更新原文数据
  const originalContent = {
    title: '女人花不花心，看嘴唇一目了然',
    content: '第一、嘴巴小，男人最爱\n第二、嘴唇薄，情感多变。',
    image:
      'https://images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80',
    userProfile: {
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      nickname: '骏马',
      isFollowed: false
    }
  }

  return (
    <>
      <div className={styles.socialActions}>
        <div className={styles.actionGroup}>
          <span className={styles.actionItem}>
            <svg className={styles.actionIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.12 17.023l-4.199-2.29a4 4 0 1 1 0-5.465l4.2-2.29a4 4 0 1 1 .959 1.755l-4.2 2.29a4.008 4.008 0 0 1 0 1.954l4.199 2.29a4 4 0 1 1-.959 1.755zM6 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm11-6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
            </svg>
            分享
          </span>
          <span className={styles.actionItem}>
            <HeartOutline className={styles.actionIcon} />
            {likes}
          </span>
          <span className={styles.actionItem}>
            <StarOutline className={styles.actionIcon} />
            {stars}
          </span>
          <span className={styles.actionItem} onClick={() => setShowComments(true)}>
            <MessageOutline className={styles.actionIcon} />
            {comments}
          </span>
        </div>
        <div className={styles.iconContainer} onClick={() => setShowDislike(true)}>
          <CloseOutline className={styles.icon} />
        </div>
      </div>
      <DislikePopup visible={showDislike} onClose={handleClose} onSelect={handleDislike} />
      <CommentList
        visible={showComments}
        onClose={() => setShowComments(false)}
        comments={mockComments}
        originalContent={originalContent}
      />
    </>
  )
}
