import React from 'react'

import { CloseOutline, HeartOutline, StarOutline, MessageOutline } from 'antd-mobile-icons'

import { useDislike } from 'src/hooks/useDislike'

import { DislikePopup } from '../dislikePopup'

import styles from './index.module.scss'

interface SocialActionsProps {
  likes?: string
  stars?: string
  comments?: string
}

export const SocialActions: React.FC<SocialActionsProps> = ({ likes = '190', stars = '392', comments = '14' }) => {
  const { showDislike, setShowDislike, handleDislike, handleClose } = useDislike()

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
          <span className={styles.actionItem}>
            <MessageOutline className={styles.actionIcon} />
            {comments}
          </span>
        </div>
        <div className={styles.iconContainer} onClick={() => setShowDislike(true)}>
          <CloseOutline className={styles.icon} />
        </div>
      </div>
      <DislikePopup visible={showDislike} onClose={handleClose} onSelect={handleDislike} />
    </>
  )
}
