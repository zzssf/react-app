export interface CommentType {
  id: string
  content: string
  author: {
    avatar: string
    nickname: string
  }
  publishTime: string
  likes: number
  replies?: CommentType[]
}
