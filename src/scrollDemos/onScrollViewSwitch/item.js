/**
 * Class representing an Item element (.item)
 */
export class Item {
  DOM = {
    el: null,
    caption: null,
    imageWrap: null,
    image: null,
    imageInner: null,
    title: null,
    titleInner: null,
    number: null,
    numberInner: null,
    description: null,
  }

  /**
   * @param {Element} DOM_el - main element (.item)
   */
  constructor(DOM_el) {
    this.DOM.el = DOM_el
    this.DOM.caption = this.DOM.el.querySelector('.item__caption')
    this.DOM.imageWrap = this.DOM.el.querySelector('.item__image-wrap')
    this.DOM.image = this.DOM.el.querySelector('.item__image')
    this.DOM.imageInner = this.DOM.image.querySelector('.item__image-inner')
    this.DOM.title = this.DOM.el.querySelector('.item__caption-title')
    this.DOM.titleInner = this.DOM.title.querySelector('.oh__inner')
    this.DOM.number = this.DOM.el.querySelector('.item__caption-number')
    this.DOM.numberInner = this.DOM.number.querySelector('.oh__inner')
    this.DOM.description = this.DOM.el.querySelector('.item__caption-description')
  }
}
