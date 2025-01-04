import React from 'react'

import { Popup, Avatar, Input } from 'antd-mobile'
import { LeftOutline, HeartOutline } from 'antd-mobile-icons'

import { CommentType } from 'src/type/comment'

import styles from './index.module.scss'

interface CommentListProps {
  visible: boolean
  onClose: () => void
  comments: CommentType[]
  originalContent?: {
    title: string
    content: string
    images?: string[]
  }
}

const CommentItem: React.FC<{ comment: CommentType }> = ({ comment }) => (
  <div className={styles.commentItem}>
    <div className={styles.userAvatar}>
      <Avatar src={comment.author.avatar} />
    </div>
    <div className={styles.commentContent}>
      <div className={styles.userInfo}>
        <span className={styles.nickname}>{comment.author.nickname}</span>
        <div className={styles.likeWrapper}>
          <HeartOutline className={styles.likeIcon} />
          <span className={styles.likeCount}>{comment.likes}</span>
        </div>
      </div>
      <div className={styles.text}>{comment.content}</div>
      <div className={styles.bottomInfo}>
        <div className={styles.actionGroup}>
          <span className={styles.time}>{comment.publishTime}</span>
          <span className={styles.location}>河南</span>
          <span className={styles.more}>更多</span>
          <span className={styles.reply}>回复</span>
        </div>
      </div>
    </div>
  </div>
)

export const CommentList: React.FC<CommentListProps> = ({ visible, onClose, comments, originalContent }) => {
  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="right"
      bodyStyle={{ width: '100vw', height: '100vh' }}
      className={styles.commentPopup}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.back} onClick={onClose}>
            <LeftOutline />
          </div>
          <span className={styles.title}>评论 {comments.length}</span>
          <div className={styles.share}>
            <svg className={styles.actionIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.12 17.023l-4.199-2.29a4 4 0 1 1 0-5.465l4.2-2.29a4 4 0 1 1 .959 1.755l-4.2 2.29a4.008 4.008 0 0 1 0 1.954l4.199 2.29a4 4 0 1 1-.959 1.755zM6 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm11-6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
            </svg>
          </div>
        </div>

        {originalContent && (
          <div className={styles.originalContent}>
            <div className={styles.userInfo}>
              <div className={styles.userProfile}>
                <Avatar src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" />
                <span className={styles.nickname}>骏马</span>
              </div>
              <a className={styles.followButton}>关注</a>
            </div>
            <div className={styles.title}>{originalContent.title}</div>
            <div className={styles.content}>{originalContent.content}</div>
            <div
              className={`${styles.imageWrapper} ${originalContent?.images?.length ?? 0 > 1 ? styles.multiImages : ''}`}
            >
              {originalContent.images && <img src={originalContent.images?.[0]} alt="content" />}
            </div>
          </div>
        )}

        <div className={styles.commentHeader}>
          <span className={styles.totalComments}>全部评论 {comments.length}</span>
        </div>

        <div className={styles.commentList}>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>

        <div className={styles.inputBar}>
          <div className={styles.inputWrapper}>
            <Input placeholder="说点什么..." />
          </div>
          <div className={styles.sendButton}>发送</div>
        </div>
      </div>
    </Popup>
  )
}
