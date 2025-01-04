import React, { useState, useRef } from 'react'

import { Popup, Avatar, Input } from 'antd-mobile'
import type { InputRef } from 'antd-mobile/es/components/input'
import { LeftOutline, HeartOutline, DownOutline } from 'antd-mobile-icons'

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

const CommentItem: React.FC<{
  comment: CommentType
  onReply: (nickname: string) => void
}> = ({ comment, onReply }) => {
  const [showReplies, setShowReplies] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [replies, setReplies] = useState(() => comment.replies?.slice(0, 2) || [])
  const BATCH_SIZE = 5

  const remainingReplies = (comment.replies?.length || 0) - replies.length

  const handleLoadMore = async () => {
    setLoadingMore(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const currentLength = replies.length
    const newReplies = comment.replies?.slice(currentLength, currentLength + BATCH_SIZE) || []
    setReplies([...replies, ...newReplies])
    setLoadingMore(false)
  }

  const handleCollapse = () => {
    setTimeout(() => {
      setReplies(comment.replies?.slice(0, 2) || [])
    }, 0)
  }

  const handleExpand = () => {
    setReplies(comment.replies?.slice(0, 2) || [])
    setShowReplies(true)
  }

  return (
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
            <span className={styles.reply} onClick={() => onReply(comment.author.nickname)}>
              回复
            </span>
          </div>
        </div>

        {comment.replies && comment.replies.length > 2 && showReplies && (
          <div className={styles.repliesWrapper}>
            <div className={styles.replies}>
              {replies.map((reply) => (
                <div key={reply.id} className={styles.replyItem}>
                  <div className={styles.replyContent}>
                    <div className={styles.userInfo}>
                      <div className={styles.userLeft}>
                        <Avatar src={reply.author.avatar} className={styles.replyAvatar} />
                        <span className={styles.replyNickname}>{reply.author.nickname}</span>
                      </div>
                      <div className={styles.likeWrapper}>
                        <HeartOutline className={styles.likeIcon} />
                        <span className={styles.likeCount}>{reply.likes}</span>
                      </div>
                    </div>
                    <div className={styles.text}>{reply.content}</div>
                    <div className={styles.bottomInfo}>
                      <div className={styles.actionGroup}>
                        <span className={styles.time}>{reply.publishTime}</span>
                        <span className={styles.location}>河南</span>
                        <span className={styles.more}>更多</span>
                        <span className={styles.reply} onClick={() => onReply(reply.author.nickname)}>
                          回复
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {remainingReplies > 0 ? (
                <div className={`${styles.loadMore} ${loadingMore ? styles.loading : ''}`} onClick={handleLoadMore}>
                  {loadingMore ? '加载中...' : `展开${remainingReplies}条回复`}
                </div>
              ) : (
                <div className={styles.collapseButton} onClick={handleCollapse}>
                  收起回复
                </div>
              )}
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 2 && !showReplies && (
          <div className={styles.repliesToggle} onClick={handleExpand}>
            <span className={styles.replyCount}>查看{comment.replies.length}条回复</span>
          </div>
        )}
      </div>
    </div>
  )
}

export const CommentList: React.FC<CommentListProps> = ({ visible, onClose, comments, originalContent }) => {
  const [replyTo, setReplyTo] = useState('')
  const inputRef = useRef<InputRef>(null)
  const [inputValue, setInputValue] = useState('')

  const handleReply = (nickname: string) => {
    setReplyTo(nickname)
    // 延迟聚焦，确保键盘能正常弹出
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handleSend = () => {
    if (inputValue) {
      console.log('发送回复:', { replyTo, content: inputValue })
      // 这里可以添加发送回复的逻辑
      setInputValue('')
      setReplyTo('')
    }
  }

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
            <CommentItem key={comment.id} comment={comment} onReply={handleReply} />
          ))}
        </div>

        <div className={styles.inputBar}>
          <div className={styles.inputWrapper}>
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={setInputValue}
              placeholder={replyTo ? `回复 ${replyTo}` : '说点什么...'}
              onBlur={() => setReplyTo('')}
            />
          </div>
          <div className={`${styles.sendButton} ${inputValue ? styles.active : ''}`} onClick={handleSend}>
            发送
          </div>
        </div>
      </div>
    </Popup>
  )
}
