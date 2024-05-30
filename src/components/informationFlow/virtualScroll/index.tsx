import { useEffect, useRef } from "react";
import { VariableSizeList, VariableSizeListRef } from "../variableSizeList";
import ItemRender from "../item";
import { DEFAULT_HEIGHT } from "src/type/constant";

// 列表项组件的类型声明
interface ItemProps<T> {
  index: number;
  data: T[];
  setHeight: (index: number, height: number) => void;
}

// 列表项组件
const Item = <T,>({ index, data, setHeight }: ItemProps<T>) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itemRef.current) {
      setHeight(index, itemRef.current.getBoundingClientRect().height);
    }

    console.log({ ...data[index] });
  }, [index]);

  return (
    <div ref={itemRef}>
      <ItemRender {...data[index]} index={index} />
    </div>
  );
};

export const VirtualScroll = <T,>(props: { data: T[] }) => {
  const { data } = props;
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
        itemCount={data.length}
        getItemHeight={getHeight}
        itemData={data}
      >
        {({ index, style, data }) => (
          <div style={style}>
            <Item {...{ index, data, setHeight }} />
          </div>
        )}
      </VariableSizeList>
    </>
  );
};
