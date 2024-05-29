import React, { useState, useImperativeHandle, forwardRef } from "react";
import { flushSync } from "react-dom";

// ListItem 组件的 props 类型声明
interface ListItemProps<T> {
  index: number;
  data: T[];
  style: React.CSSProperties;
}

// VariableSizeList 组件的 props 类型声明
export interface VariableSizeListProps<T> {
  containerHeight: number;
  getItemHeight: (index: number) => number;
  itemCount: number;
  itemData: T[];
  children: React.FunctionComponent<ListItemProps<T>>;
}

// VariableSizeList 组件的 ref 类型声明
export interface VariableSizeListRef {
  resetHeight: () => void;
}

// 动态列表组件
export const VariableSizeList = forwardRef(
  <T,>(
    props: VariableSizeListProps<T>,
    ref: React.Ref<VariableSizeListRef>
  ) => {
    const { containerHeight, getItemHeight, itemCount, itemData, children } =
      props;

    useImperativeHandle(
      ref,
      () => {
        return {
          resetHeight: () => {
            setOffsets(genOffsets());
          },
        };
      },
      []
    );

    const Component = children as React.FunctionComponent<ListItemProps<T>>;
    const [scrollTop, setScrollTop] = useState(0); // 滚动高度

    const genOffsets = () => {
      const a: number[] = [];
      a[0] = getItemHeight(0);
      for (let i = 1; i < itemCount; i++) {
        a[i] = getItemHeight(i) + a[i - 1];
      }
      return a;
    };

    const [offsets, setOffsets] = useState(genOffsets);

    let startIdx = offsets.findIndex((pos) => pos > scrollTop);
    let endIdx = offsets.findIndex((pos) => pos > scrollTop + containerHeight);
    if (endIdx === -1) endIdx = itemCount;

    const paddingCount = 2;
    startIdx = Math.max(startIdx - paddingCount, 0);
    endIdx = Math.min(endIdx + paddingCount, itemCount - 1);

    const contentHeight = offsets[offsets.length - 1];

    const items = [];
    for (let i = startIdx; i <= endIdx; i++) {
      const top = i === 0 ? 0 : offsets[i - 1];
      const height = i === 0 ? offsets[0] : offsets[i] - offsets[i - 1];
      items.push(
        <Component
          key={i}
          index={i}
          data={itemData}
          style={{
            position: "absolute",
            left: 0,
            top,
            width: "100%",
            height,
          }}
        />
      );
    }

    return (
      <div
        style={{
          height: containerHeight,
          overflow: "auto",
          position: "relative",
        }}
        onScroll={(e) => {
          flushSync(() => {
            setScrollTop((e.target as HTMLDivElement).scrollTop);
          });
        }}
      >
        <div style={{ height: contentHeight }}>{items}</div>
      </div>
    );
  }
);
