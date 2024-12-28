import React from 'react'

import { Image } from 'antd-mobile'

import styles from './index.module.scss'

interface UserProfileProps {
  avatar: string
  nickname: string
  isFollowed?: boolean
  onFollow?: () => void
}

export const UserProfile: React.FC<UserProfileProps> = ({ avatar, nickname, isFollowed = false, onFollow }) => (
  <div className={styles.userProfile}>
    <div className={styles.userInfo}>
      <Image src={avatar} className={styles.avatar} />
      <span className={styles.nickname}>{nickname}</span>
    </div>
    <button className={`${styles.followButton} ${isFollowed ? styles.followed : ''}`} onClick={onFollow}>
      {isFollowed ? '已关注' : '关注'}
    </button>
  </div>
)
