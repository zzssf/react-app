import { EFileType } from "src/type/enum";
import { VirtualScroll } from "../virtualScroll";
import styles from "./index.module.scss";
import { ItemType } from "src/type/informationFlow";

const data: ItemType[] = [
  {
    content: "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一",
    comment: "174评",
    author: "惜蕊说历史",
    fileType: EFileType.SINGLE_PICTURE,
    image: [
      "https:images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60",
    ],
    video:null
  },
  {
    content:
      "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我",
    comment: "50评",
    author: "小易寒",
    fileType: EFileType.SINGLE_PICTURE,
    image: [
      "https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80",
    ],
    video:null
  },
  {
    content:
      "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美",
    comment: "50评",
    author: "小易寒",
    fileType: EFileType.MULTI_PICTURE,
    image: [
      "https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80",
      "https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80",
    ],
    video:null
  },
  {
    content:
      "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武",
    comment: "50评",
    author: "小易寒",
    fileType: EFileType.MULTI_PICTURE,
    image: [
      "https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80",
      "https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80",
      "https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80",
    ],
    video:null
  },
  {
    content: "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司",
    comment: "50评",
    author: "小易寒",
    image: null,
    video:null,
    fileType: EFileType.IS_ONLY_TEXT,
  },
  {
    content: "一旦我国武统台湾,美将 打击",
    comment: "50评",
    author: "小易寒",
    image: null,
    video: "https:www.runoob.com/try/demo_source/mov_bbb.mp4",
    fileType: EFileType.SINGLE_VIDEO,
  },
];

const List = () => {
  return (
    <div className={styles.container}>
      <VirtualScroll data={data} />
    </div>
  );
};

export default List;
