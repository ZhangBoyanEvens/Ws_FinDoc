import imagesLoaded from 'imagesloaded'

export function preloadImages(selector) {
  return new Promise((resolve) => {
    imagesLoaded(document.querySelectorAll(selector), resolve)
  })
}

