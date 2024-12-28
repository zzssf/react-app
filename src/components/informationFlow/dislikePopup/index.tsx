import React from 'react'

import { Popup } from 'antd-mobile'

import styles from './index.module.scss'

interface DislikeOption {
  title: string
  items: string[]
}

interface DislikePopupProps {
  visible: boolean
  onClose: () => void
  onSelect: (category: string, item: string) => void
}

const dislikeOptions: DislikeOption[] = [
  {
    title: '选择不喜欢的类型',
    items: ['不感兴趣', '爱情攻略', '屏蔽作者']
  },
  {
    title: '反馈内容问题',
    items: ['标题党', '封面反感', '色情低俗', '过时旧闻', '内容质量差', '政治敏感']
  }
]

export const DislikePopup: React.FC<DislikePopupProps> = ({ visible, onClose, onSelect }) => {
  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{ height: 'auto', maxHeight: '70vh' }}
      position="bottom"
      className={styles.dislikePopup}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          {dislikeOptions.map((option) => (
            <div key={option.title} className={styles.section}>
              <div className={styles.titleRow}>
                <span className={styles.sectionTitle}>{option.title}</span>
                {option.title === '选择不喜欢的类型' && <span className={styles.subtitle}>将减少此类内容推荐</span>}
              </div>
              <div className={styles.items}>
                {option.items.map((item) => (
                  <div
                    key={item}
                    className={styles.item}
                    onClick={() => {
                      onSelect(option.title, item)
                      onClose()
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Popup>
  )
}
