import {  useRef, memo, useEffect } from "react";
import { useInformationFlowContext } from "../../../context/informationFlowContext";
import Item from "../item";
import { EImagePosition } from "../../../type/enum";
import { ItemType } from "../../../type/informationFlow";
import { VariableSizeList } from "react-window";

interface RowProps {
  index: number;
  style: React.CSSProperties;
  listRef:React.RefObject<VariableSizeList<any>>
}
//TODO:待修改
const data: ItemType[] = [
  {
    content:
      "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极",
    commentInfo: "174评",
    author: "惜蕊说历史",
    imagePosition: EImagePosition.right,
    image: [
      "https:images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60",
    ],
  },
  {
    content:
      "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极",
    commentInfo: "50评",
    author: "小易寒",
    imagePosition: EImagePosition.left,
    image: [
      "https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80",
    ],
  },
  {
    content:
      "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极",
    commentInfo: "50评",
    author: "小易寒",
    imagePosition: EImagePosition.bottom,
    image: [
      "https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80",
      "https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80",
    ],
  },
  {
    content:
      "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极",
    commentInfo: "50评",
    author: "小易寒",
    imagePosition: EImagePosition.bottom,
    image: [
      "https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80",
      "https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80",
      "https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80",
    ],
  },
  {
    content:
      "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极",
    commentInfo: "50评",
    author: "小易寒",
    image: undefined,
  },
  {
    content:
      "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极",
    commentInfo: "50评",
    author: "小易寒",
    video: "https:www.runoob.com/try/demo_source/mov_bbb.mp4",
    imagePosition: EImagePosition.videoBottom,
  },
];

const Row = ({ index, style,listRef }: RowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const { sizesRef} = useInformationFlowContext();

  useEffect(() => {
    if (!rowRef.current) {
      return;
    }
    const rowHeight = rowRef.current.getBoundingClientRect().height;
    
    sizesRef.current[index]= rowHeight
  }, [index]);

  return (
    <div ref={rowRef} style={{...style,height:sizesRef.current[index]}} >
      <Item {...data[index]} index={index} />
    </div>
  );
};

export default memo(Row);
