import React from 'react'

import { Image } from 'antd-mobile'

import styles from './index.module.scss'

interface UserProfileProps {
  avatar: string
  nickname: string
  publishTime?: string
  isFollowed?: boolean
  onFollow?: () => void
}

export const UserProfile: React.FC<UserProfileProps> = ({
  avatar,
  nickname,
  publishTime,
  isFollowed = false,
  onFollow
}) => (
  <div className={styles.userProfile}>
    <div className={styles.userInfo}>
      <Image src={avatar} className={styles.avatar} />
      <div className={styles.userMeta}>
        <span className={styles.nickname}>{nickname}</span>
        {publishTime && <span className={styles.publishTime}>{publishTime}</span>}
      </div>
    </div>
    <a className={`${styles.followLink} ${isFollowed ? styles.followed : ''}`} onClick={onFollow}>
      {isFollowed ? '已关注' : '关注'}
    </a>
  </div>
)
