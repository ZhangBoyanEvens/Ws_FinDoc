import imagesLoaded from 'imagesloaded'

/**
 * @param {string} selector
 * @param {ParentNode} [root=document]
 */
export const preloadImages = (selector = 'img', root = document) => {
  return new Promise((resolve) => {
    const nodes = root.querySelectorAll(selector)
    if (!nodes.length) {
      resolve()
      return
    }
    imagesLoaded(nodes, resolve)
  })
}

export const isInViewport = (elem) => {
  const bounding = elem.getBoundingClientRect()
  return (
    ((bounding.bottom >= 0 &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)) ||
      (bounding.top >= 0 &&
        bounding.top <= (window.innerHeight || document.documentElement.clientHeight))) &&
    ((bounding.right >= 0 &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)) ||
      (bounding.left >= 0 &&
        bounding.left <= (window.innerWidth || document.documentElement.clientWidth)))
  )
}
