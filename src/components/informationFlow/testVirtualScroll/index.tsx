import React, { useEffect, useRef, useState } from "react";
import { VariableSizeList, VariableSizeListRef } from "../variableSizeList";
import { faker } from "@faker-js/faker";

// 列表项组件的类型声明
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
  }, [setHeight, index]);

  return (
    <div
      ref={itemRef}
      style={{
        backgroundColor: index % 2 === 0 ? "burlywood" : "cadetblue",
      }}
    ></div>
  );
}

// App 组件
export default function App() {
  const [list, setList] = useState<string[]>(
    new Array(1000).fill(0).map(() => faker.lorem.paragraph())
  );
  const listRef = useRef<VariableSizeListRef>(null);
  const heightsRef = useRef<number[]>(new Array(100).fill(40));

  const getHeight = (index: number): number => {
    return heightsRef.current[index] || 40;
  };

  const setHeight = (index: number, height: number) => {
    if (heightsRef.current[index] !== height) {
      heightsRef.current[index] = height;
      listRef.current?.resetHeight();
    }
  };

  return (
    <>
      <h1>列表项高度动态 - 虚拟列表实现</h1>
      <VariableSizeList
        ref={listRef}
        containerHeight={300}
        itemCount={list.length}
        getItemHeight={getHeight}
        itemData={list}
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
