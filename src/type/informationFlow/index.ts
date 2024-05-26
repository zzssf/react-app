import { EImagePosition } from "../enum";

export interface ItemType {
  content?: string;
  commentInfo?: string;
  author?: string;
  image?: string[];
  imagePosition?: EImagePosition;
  video?: string;
}
