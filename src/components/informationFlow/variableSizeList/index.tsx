import React, { useState, useImperativeHandle, forwardRef, useMemo, useRef, useEffect } from 'react'

import { flushSync } from 'react-dom'

import { InfiniteScroll, InfiniteScrollRef } from 'src/components/infiniteScroll'
import { BOUNDARY_QUANTITY } from 'src/type/constant'
import { findFirstGreaterThan } from 'src/utils'

// ListItem 组件的 props 类型声明
interface ListItemProps<T> {
  index: number
  data: T[]
  style: React.CSSProperties
}

// VariableSizeList 组件的 props 类型声明
export interface VariableSizeListProps<T> {
  containerHeight?: number
  getItemHeight: (index: number) => number
  itemCount: number
  itemData: T[]
  children: React.FunctionComponent<ListItemProps<T>>
  loadMore?: () => Promise<void>
  pullDownRefresh?: () => Promise<void>
  hasMore?: boolean
}

// VariableSizeList 组件的 ref 类型声明
export interface VariableSizeListRef extends InfiniteScrollRef {
  resetHeight: () => void
}

// 动态列表组件
export const VariableSizeList = forwardRef(
  <T,>(props: VariableSizeListProps<T>, ref: React.Ref<VariableSizeListRef>) => {
    const {
      containerHeight = window.innerHeight,
      getItemHeight,
      itemCount,
      itemData,
      children,
      loadMore,
      pullDownRefresh,
      hasMore
    } = props
    const infiniteScrollRef = useRef<InfiniteScrollRef>(null)
    const Component = children as React.FunctionComponent<ListItemProps<T>>
    const [scrollTop, setScrollTop] = useState(0) // 滚动高度
    const [offsets, setOffsets] = useState<number[]>([])

    useImperativeHandle(
      ref,
      () => {
        return {
          resetHeight: () => {
            setOffsets(genOffsets())
          },
          containerRef: infiniteScrollRef?.current?.containerRef
        }
      },
      []
    )

    const genOffsets = () => {
      const heightArray: number[] = []
      heightArray[0] = getItemHeight(0)
      for (let i = 1; i < itemCount; i++) {
        heightArray[i] = getItemHeight(i) + heightArray[i - 1]
      }
      return heightArray
    }

    useEffect(() => {
      setOffsets(genOffsets())
    }, [itemCount])

    let startIdx = useMemo(() => findFirstGreaterThan(offsets, scrollTop), [offsets, scrollTop])
    let endIdx = useMemo(
      () => findFirstGreaterThan(offsets, scrollTop + containerHeight),
      [offsets, scrollTop, containerHeight]
    )
    if (endIdx === -1) endIdx = itemCount

    startIdx = useMemo(() => Math.max(startIdx - BOUNDARY_QUANTITY, 0), [startIdx])
    endIdx = useMemo(() => Math.min(endIdx + BOUNDARY_QUANTITY, itemCount - 1), [endIdx, itemCount])

    const contentHeight = offsets[offsets.length - 1]

    const itemRender = useMemo(() => {
      const items = []
      for (let offsetIndex = startIdx; offsetIndex <= endIdx; offsetIndex++) {
        const top = offsetIndex === 0 ? 0 : offsets[offsetIndex - 1]
        const height = offsetIndex === 0 ? offsets[0] : offsets[offsetIndex] - offsets[offsetIndex - 1]

        items.push(
          <Component
            key={offsetIndex}
            index={offsetIndex}
            data={itemData}
            style={{
              position: 'absolute',
              left: 0,
              top,
              width: '100%',
              height
            }}
          />
        )
      }
      return items
    }, [startIdx, endIdx, itemData, Component, offsets])

    return (
      <InfiniteScroll
        ref={infiniteScrollRef}
        hasMore={hasMore}
        loadMore={loadMore}
        pullDownRefresh={pullDownRefresh}
        style={{
          height: containerHeight,
          overflow: 'auto',
          position: 'relative'
        }}
        onScroll={(e) => {
          flushSync(() => {
            setScrollTop((e.target as HTMLDivElement).scrollTop)
          })
        }}
      >
        <div style={{ height: contentHeight }}>{itemRender}</div>
      </InfiniteScroll>
    )
  }
)

VariableSizeList.displayName = 'VariableSizeList'
