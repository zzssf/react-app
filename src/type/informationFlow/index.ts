import { EFileType } from '../enum'

export interface ItemType {
  id: string
  content: string
  comment: string
  author: string
  image: string[] | null
  fileType: EFileType
  video: string | null
  userProfile?: {
    avatar: string
    nickname: string
    isFollowed?: boolean
  }
}
