import React, { useState, useImperativeHandle, forwardRef, useMemo } from 'react'

import { flushSync } from 'react-dom'
import InfiniteScroll from 'react-infinite-scroll-component'

import { BOUNDARY_QUANTITY } from 'src/type/constant'

import { findFirstGreaterThan } from '../../../utils'

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
  pullUp?: () => Promise<void>
  pullDown?: () => Promise<void>
}

// VariableSizeList 组件的 ref 类型声明
export interface VariableSizeListRef {
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
      pullUp,
      pullDown
    } = props

    useImperativeHandle(
      ref,
      () => {
        return {
          resetHeight: () => {
            setOffsets(genOffsets())
          }
        }
      },
      []
    )

    const Component = children as React.FunctionComponent<ListItemProps<T>>
    const [scrollTop, setScrollTop] = useState(0) // 滚动高度

    const genOffsets = () => {
      const heightArray: number[] = []
      heightArray[0] = getItemHeight(0)
      for (let i = 1; i < itemCount; i++) {
        heightArray[i] = getItemHeight(i) + heightArray[i - 1]
      }
      return heightArray
    }

    const [offsets, setOffsets] = useState(genOffsets)
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
    }, [startIdx, endIdx, itemData, offsets, Component])

    return (
      <div
        style={{
          height: containerHeight,
          overflow: 'auto',
          position: 'relative'
        }}
        id="scrollableDiv"
        onScroll={(e) => {
          flushSync(() => {
            setScrollTop((e.target as HTMLDivElement).scrollTop)
          })
        }}
      >
        <InfiniteScroll
          dataLength={itemData.length}
          next={() => pullUp?.()}
          hasMore={true}
          loader={<h3 style={{ textAlign: 'center' }}>Loading...</h3>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          refreshFunction={() => pullDown?.()}
          pullDownToRefresh
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={<h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>}
          releaseToRefreshContent={<h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>}
          scrollableTarget="scrollableDiv"
        >
          <div style={{ height: contentHeight }}>{itemRender}</div>
        </InfiniteScroll>
      </div>
    )
  }
)

VariableSizeList.displayName = 'VariableSizeList'
