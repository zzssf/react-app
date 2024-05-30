import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from "react";
import { flushSync } from "react-dom";
import { findFirstGreaterThan } from "../../../utils";
import { BOUNDARY_QUANTITY } from "src/type/constant";

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
      const heightArray: number[] = [];
      heightArray[0] = getItemHeight(0);
      for (let i = 1; i < itemCount; i++) {
        heightArray[i] = getItemHeight(i) + heightArray[i - 1];
      }
      return heightArray;
    };

    const [offsets, setOffsets] = useState(genOffsets);
    let startIdx = useMemo(
      () => findFirstGreaterThan(offsets, scrollTop),
      [offsets, scrollTop]
    );
    let endIdx = useMemo(
      () => findFirstGreaterThan(offsets, scrollTop + containerHeight),
      [offsets, scrollTop, containerHeight]
    );
    if (endIdx === -1) endIdx = itemCount;

    startIdx = useMemo(
      () => Math.max(startIdx - BOUNDARY_QUANTITY, 0),
      [startIdx]
    );
    endIdx = useMemo(
      () => Math.min(endIdx + BOUNDARY_QUANTITY, itemCount - 1),
      [endIdx, itemCount]
    );

    const contentHeight = offsets[offsets.length - 1];

    const itemRender = useMemo(() => {
      const items = [];
      for (let offsetIndex = startIdx; offsetIndex <= endIdx; offsetIndex++) {
        const top = offsetIndex === 0 ? 0 : offsets[offsetIndex - 1];
        const height =
          offsetIndex === 0
            ? offsets[0]
            : offsets[offsetIndex] - offsets[offsetIndex - 1];

        items.push(
          <Component
            key={offsetIndex}
            index={offsetIndex}
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
      return items;
    }, [startIdx, endIdx, itemData, offsets, Component]);

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
        <div style={{ height: contentHeight }}>{itemRender}</div>
      </div>
    );
  }
);
