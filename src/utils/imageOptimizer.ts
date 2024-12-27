export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve()
    img.onerror = reject
  })
}

export const preloadImages = async (srcs: string[]): Promise<void> => {
  const promises = srcs.map((src) => preloadImage(src))
  await Promise.all(promises)
}
