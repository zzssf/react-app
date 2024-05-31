export const findFirstGreaterThan = (offsets: number[], scrollTop: number): number => {
  let left = 0
  let right = offsets.length - 1

  while (left <= right) {
    const mid = left + ((right - left) >> 1)
    if (offsets[mid] <= scrollTop) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  // 由于 left 是递增的，如果 left 达到了数组长度，则不需要进一步检查
  return left < offsets.length ? left : -1
}
