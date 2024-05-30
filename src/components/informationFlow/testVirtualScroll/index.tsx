import { useEffect, useRef } from "react";
import { VariableSizeList, VariableSizeListRef } from "../variableSizeList";
import ItemRender from "../item";
import { ItemType } from "src/type/informationFlow";
import { EImagePosition } from "src/type/enum";
import { DEFAULT_HEIGHT } from "src/type/constant";

// 列表项组件的类型声明

//TODO:待修改
const datas: ItemType[] = [
  {
    content: "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一",
    commentInfo: "174评",
    author: "惜蕊说历史",
    imagePosition: EImagePosition.right,
    image: [
      "https:images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60",
    ],
  },
  {
    content:
      "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我",
    commentInfo: "50评",
    author: "小易寒",
    imagePosition: EImagePosition.left,
    image: [
      "https:images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80",
    ],
  },
  {
    content:
      "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武统台湾,美",
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
      "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司令嚣张至极 一旦我国武",
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
    content: "一旦我国武统台湾,美将 打击中方核武库和火箭军, 美司",
    commentInfo: "50评",
    author: "小易寒",
    image: undefined,
  },
  {
    content: "一旦我国武统台湾,美将 打击",
    commentInfo: "50评",
    author: "小易寒",
    video: "https:www.runoob.com/try/demo_source/mov_bbb.mp4",
    imagePosition: EImagePosition.videoBottom,
  },
];
interface ItemProps<T> {
  index: number;
  data: T[];
  setHeight: (index: number, height: number) => void;
}

// 列表项组件
function Item<T>({ index, data, setHeight }: ItemProps<T>) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itemRef.current) {
      setHeight(index, itemRef.current.getBoundingClientRect().height);
    }

    console.log({ ...data[index] });
  }, [index]);

  return (
    <div ref={itemRef}>
      <ItemRender
        {...(data[index] as ItemType & { index: number })}
        index={index}
      />
    </div>
  );
}

// App 组件
export default function VirtualScroll() {
  const listRef = useRef<VariableSizeListRef>(null);
  const heightsRef = useRef<number[]>([]);

  const getHeight = (index: number): number => {
    return heightsRef.current[index] || DEFAULT_HEIGHT;
  };

  const setHeight = (index: number, height: number) => {
    if (heightsRef.current[index] !== height) {
      heightsRef.current[index] = height;
      listRef.current?.resetHeight();
    }
  };

  return (
    <>
      <VariableSizeList
        ref={listRef}
        containerHeight={884}
        itemCount={datas.length}
        getItemHeight={getHeight}
        itemData={datas}
      >
        {({ index, style, data }) => (
          <div style={style}>
            <Item {...{ index, data, setHeight }} />
          </div>
        )}
      </VariableSizeList>
    </>
  );
}
