import { html, PropertyValues, TemplateResult } from 'lit'
import { property } from 'lit/decorators.js'
import { UiElement } from '../../UiElement.js'
import { setDisabled } from '../../../lib/disabled.js'

/**
 * @fires transitioning - When the element is transitioning.
 * @slot - Main slot for the content
 */
export default class UiCollapse extends UiElement {
  /**
   * Whether the chip is disabled. The user can't interact with the chip when `true`.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor disabled = false

  /**
   * Set noAnimation to true to disable animations.
   * @attr
   */
  @property({ type: Boolean, reflect: true }) accessor noAnimation: boolean | undefined

  /**
   * Renders the collapse horizontally when true and vertically otherwise
   * @attribute
   */
  @property({ type: Boolean }) accessor horizontal = false

  /**
   * Set opened to true to show the collapse element and to false to hide it.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor open = false

  get dimension(): 'width' | 'height' {
    return this.horizontal ? 'width' : 'height'
  }

  /**
   * `maxWidth` or `maxHeight`.
   * @private
   */
  get dimensionMax(): 'maxWidth' | 'maxHeight' {
    return this.horizontal ? 'maxWidth' : 'maxHeight'
  }

  /**
   * `max-width` or `max-height`.
   * @private
   */
  get dimensionMaxCss(): 'max-width' | 'max-height' {
    return this.horizontal ? 'max-width' : 'max-height'
  }

  get isAttached(): boolean {
    return !!this.parentNode
  }

  protected transitioningInternal = false

  /**
   * @return When true, the element is transitioning its open state. When false,
   * the element has finished opening/closing.
   */
  get transitioning(): boolean {
    return this.transitioningInternal
  }

  /**
   * Stores the desired size of the collapse body.
   */
  protected desiredSize = ''

  constructor() {
    super()
    this.addEventListener('transitionend', this.handleTransitionEnd.bind(this))
  }

  override connectedCallback(): void {
    super.connectedCallback()
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'group')
    }
    if (!this.hasAttribute('aria-hidden')) {
      this.setAttribute('aria-hidden', 'true')
    }
  }

  protected override willUpdate(cp: PropertyValues<this>): void {
    if (cp.has('open')) {
      this.handleOpenChange()
    }
    if (cp.has('horizontal')) {
      this.handleHorizontalChange()
    }
    if (cp.has('disabled')) {
      setDisabled(this, cp.get('disabled'))
    }
    super.willUpdate(cp)
  }

  /**
   * Toggle the opened state.
   */
  toggle(): void {
    this.open = !this.open
    this.dispatchEvent(new Event('toggle'))
  }

  /**
   * Updates the size of the element.
   * @param size The new value for `maxWidth`/`maxHeight` as css property value, usually `auto` or `0px`.
   * @param animated if `true` updates the size with an animation, otherwise without.
   */
  protected updateSize(size: string, animated?: boolean): void {
    // Consider 'auto' as '', to take full size.
    let sizeValue = size === 'auto' ? '' : size

    let willAnimate = animated && !this.noAnimation && this.isAttached
    this.desiredSize = sizeValue

    this.updateTransition(false)
    // If we can animate, must do some prep work.
    if (willAnimate) {
      // Animation will start at the current size.
      const startSize = this.calcSize()
      // For `auto` we must calculate what is the final size for the animation.
      // After the transition is done, _transitionEnd will set the size back to
      // `auto`.
      if (sizeValue === '') {
        // Temporarily remove constraint to measure natural size
        const currentMaxDimension = this.style[this.dimensionMax]
        this.style[this.dimensionMax] = ''
        sizeValue = this.calcSize()
        this.style[this.dimensionMax] = currentMaxDimension
      }
      // Go to startSize without animation.

      this.style[this.dimensionMax] = startSize
      // Force layout to ensure transition will go. Set scrollTop to itself
      // so that compilers won't remove it.
      // eslint-disable-next-line no-self-assign
      this.scrollTop = this.scrollTop
      // Enable animation.
      this.updateTransition(true)
      // If final size is the same as startSize it will not animate.
      willAnimate = sizeValue !== startSize
    }
    // Set the final size.

    this.style[this.dimensionMax] = sizeValue
    // If it won't animate, call transitionEnd to set correct styles.
    if (!willAnimate) {
      this.transitionEnd()
    }
  }

  protected updateTransition(enabled?: boolean): void {
    this.style.transitionDuration = enabled && !this.noAnimation ? '' : '0s'
  }

  /**
   * Calculates the size of the element when opened.
   */
  protected calcSize(): string {
    const value = this.getBoundingClientRect()[this.dimension]
    return `${value}px`
  }

  protected transitionEnd(): void {
    this.style[this.dimensionMax] = this.desiredSize
    this.toggleAttribute('collapse-closed', !this.open)
    this.toggleAttribute('collapse-opened', this.open)
    this.updateTransition(false)
    this.notifyResize()
    this.transitioningInternal = false
    this.notifyTransitioning()
  }

  protected notifyResize(): void {
    this.dispatchEvent(new Event('resize', { bubbles: true, composed: true, cancelable: true }))
  }

  protected notifyTransitioning(): void {
    this.dispatchEvent(new Event('transitioning', { bubbles: true, composed: true, cancelable: true }))
  }

  protected handleTransitionEnd(e: Event): void {
    const target = e.composedPath().find((node) => node === this)
    if (target) {
      this.transitionEnd()
    }
  }

  protected handleOpenChange(): void {
    const { open } = this
    this.setAttribute('aria-hidden', String(!open))
    this.transitioningInternal = true
    this.notifyTransitioning()
    this.toggleAttribute('collapse-closed', false)
    this.toggleAttribute('collapse-opened', false)
    this.updateSize(open ? 'auto' : '0px', true)

    // Focus the current collapse.
    if (open) {
      this.focus()
    }
  }

  protected handleHorizontalChange(): void {
    this.style.transitionProperty = this.dimensionMaxCss
    const otherDimension = this.dimensionMax === 'maxWidth' ? 'maxHeight' : 'maxWidth'
    this.style[otherDimension] = ''
    this.updateSize(this.open ? 'auto' : '0px', false)
  }

  override render(): TemplateResult {
    return html`<slot></slot>`
  }
}
