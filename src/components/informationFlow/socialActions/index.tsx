import React from 'react'

import styles from './index.module.scss'

interface SocialActionsProps {
  likes?: string
  stars?: string
  comments?: string
  onShare?: () => void
  onLike?: () => void
  onStar?: () => void
  onComment?: () => void
}

export const SocialActions: React.FC<SocialActionsProps> = ({
  likes = '190',
  stars = '392',
  comments = '14',
  onShare,
  onLike,
  onStar,
  onComment
}) => (
  <div className={styles.socialActions}>
    <div className={styles.actionItem} onClick={onShare}>
      <i className={styles.shareIcon} />
      <span>分享</span>
    </div>
    <div className={styles.actionItem} onClick={onLike}>
      <i className={styles.likeIcon} />
      <span>{likes}</span>
    </div>
    <div className={styles.actionItem} onClick={onStar}>
      <i className={styles.starIcon} />
      <span>{stars}</span>
    </div>
    <div className={styles.actionItem} onClick={onComment}>
      <i className={styles.commentIcon} />
      <span>{comments}</span>
    </div>
  </div>
)
