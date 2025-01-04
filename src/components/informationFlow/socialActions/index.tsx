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
      likes: 8,
      replies: [
        {
          id: '1-1',
          content: '说得对，投资需要有规划',
          author: {
            avatar: 'https://example.com/avatar4.jpg',
            nickname: '投资达人'
          },
          publishTime: '12-10',
          likes: 3
        },
        {
          id: '1-2',
          content: '确实是这样，我就是这么过来的',
          author: {
            avatar: 'https://example.com/avatar5.jpg',
            nickname: '股市老兵'
          },
          publishTime: '12-10',
          likes: 2
        },
        {
          id: '1-3',
          content: '新手要注意风险控制',
          author: {
            avatar: 'https://example.com/avatar6.jpg',
            nickname: '理财专家'
          },
          publishTime: '12-10',
          likes: 4
        },
        {
          id: '1-4',
          content: '分享经验很重要',
          author: {
            avatar: 'https://example.com/avatar7.jpg',
            nickname: '股市新手'
          },
          publishTime: '12-10',
          likes: 1
        }
      ]
    },
    {
      id: '2',
      content: '不要借钱玩，2、不要重仓一只，3、不要投入超过10分之1的钱',
      author: {
        avatar: 'https://example.com/avatar2.jpg',
        nickname: '50的2'
      },
      publishTime: '12-10',
      likes: 12,
      replies: [
        {
          id: '2-1',
          content: '这三点太重要了',
          author: {
            avatar: 'https://example.com/avatar8.jpg',
            nickname: '股市小白'
          },
          publishTime: '12-10',
          likes: 6
        },
        {
          id: '2-2',
          content: '血的教训啊',
          author: {
            avatar: 'https://example.com/avatar9.jpg',
            nickname: '投资者'
          },
          publishTime: '12-10',
          likes: 5
        }
      ]
    },
    {
      id: '3',
      content: '想从资本家手里赚差点总是把钱到他手里！',
      author: {
        avatar: 'https://example.com/avatar3.jpg',
        nickname: 'Half sorrow.'
      },
      publishTime: '12-10',
      likes: 5,
      replies: [
        {
          id: '3-1',
          content: '说得太对了',
          author: {
            avatar: 'https://example.com/avatar10.jpg',
            nickname: '市场观察者'
          },
          publishTime: '12-10',
          likes: 2
        },
        {
          id: '3-2',
          content: '散户不容易啊',
          author: {
            avatar: 'https://example.com/avatar11.jpg',
            nickname: '股市老韭菜'
          },
          publishTime: '12-10',
          likes: 3
        },
        {
          id: '3-3',
          content: '要学会控制风险',
          author: {
            avatar: 'https://example.com/avatar12.jpg',
            nickname: '风险管理专家'
          },
          publishTime: '12-10',
          likes: 4
        }
      ]
    },
    {
      id: '4',
      content: '投资需要耐心和智慧',
      author: {
        avatar: 'https://example.com/avatar13.jpg',
        nickname: '智慧投资'
      },
      publishTime: '12-10',
      likes: 15,
      replies: [] // 测试无回复的情况
    },
    {
      id: '5',
      content: '市场有风险，投资需谨慎',
      author: {
        avatar: 'https://example.com/avatar14.jpg',
        nickname: '风险提示者'
      },
      publishTime: '12-10',
      likes: 7,
      replies: [
        {
          id: '5-1',
          content: '新手必看！',
          author: {
            avatar: 'https://example.com/avatar15.jpg',
            nickname: '股市新人'
          },
          publishTime: '12-10',
          likes: 2
        }
      ]
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
