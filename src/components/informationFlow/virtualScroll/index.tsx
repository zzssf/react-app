import { memo, useEffect, useRef } from 'react'

import { DEFAULT_HEIGHT } from 'src/type/constant'

import { VariableSizeList, VariableSizeListRef } from '../variableSizeList'

// 列表项组件的类型声明
interface ItemProps<T> {
  index: number
  data: T[]
  setHeight: (index: number, height: number) => void
  renderItem: <T>(props: T) => JSX.Element
}

// 列表项组件
const Item = memo(<T,>({ index, data, setHeight, renderItem }: ItemProps<T>) => {
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (itemRef.current) {
      setHeight(index, itemRef.current.getBoundingClientRect().height)
    }
  }, [index])

  return <div ref={itemRef}>{renderItem(data[index])}</div>
})

Item.displayName = 'Item'

export const VirtualScroll = <T,>(props: {
  data: T[]
  loadMore?: () => Promise<void>
  pullDownRefresh?: () => Promise<void>
  renderItem: <T>(props: T) => JSX.Element
  hasMore?: boolean
  preloadMedia?: (data: T[]) => void
}) => {
  const { data, loadMore, pullDownRefresh, renderItem, hasMore, preloadMedia } = props
  const listRef = useRef<VariableSizeListRef>(null)
  const heightsRef = useRef<number[]>([])
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const getHeight = (index: number): number => {
    return heightsRef.current[index] || DEFAULT_HEIGHT
  }

  const setHeight = (index: number, height: number) => {
    if (heightsRef.current[index] !== height) {
      heightsRef.current[index] = height
      listRef.current?.resetHeight()
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'))
            const itemsToPreload = [
              ...data.slice(Math.max(0, index - 10), index), // 预加载当前项上方的 10 项
              ...data.slice(index + 1, Math.min(index + 11, data.length - 1)) // 预加载当前项下方的 10 项
            ]
            preloadMedia?.(itemsToPreload)
          }
        })
      },
      { root: listRef.current?.containerRef?.current, rootMargin: '25px' } // 在元素进入视口200px时触发预加载
    )

    if (itemRefs.current) {
      itemRefs.current.forEach((item) => {
        if (item) {
          observer.observe(item)
        }
      })
    }

    return () => observer.disconnect()
  }, [data])

  return (
    <>
      <VariableSizeList
        ref={listRef}
        itemCount={data.length}
        getItemHeight={getHeight}
        itemData={data}
        loadMore={loadMore}
        pullDownRefresh={pullDownRefresh}
        hasMore={hasMore}
      >
        {({ index, style, data }) => (
          <div style={style} data-index={index} ref={(el) => (itemRefs.current[index] = el)}>
            <Item {...{ index, data, setHeight, renderItem }} />
          </div>
        )}
      </VariableSizeList>
    </>
  )
}
