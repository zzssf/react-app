import { EImagePosition } from "../enum";

export interface ISinglePictureItemType {
    content?: string;
    commentInfo?: string;
    author?: string;
    image?:string [];
    imagePosition?: EImagePosition;
    video?: string;
}