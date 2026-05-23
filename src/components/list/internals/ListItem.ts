import { html, type PropertyValues, type TemplateResult, nothing } from 'lit'
import { property, state, query } from 'lit/decorators.js'
import { classMap, ClassInfo } from 'lit/directives/class-map.js'
import { UiElement } from '../../UiElement.js'
import { BeginPressConfig, EndPressConfig } from '../../../controllers/ActionController.js'
import UiRipple from '../../ripple/internals/ripple.js'
import { setDisabled } from '../../../lib/disabled.js'

import '../../focus-ring/ui-focus-ring.js'
import '../../ripple/ui-ripple.js'

export enum ListItemLines {
  one = 'one',
  two = 'two',
  three = 'three',
  auto = 'auto',
}

export enum ListItemImage {
  icon = 'icon',
  avatar = 'avatar',
  image = 'image',
  video = 'video',
  auto = 'auto',
}

/**
 * @slot - The main content of the list item, typically a label or title.
 * @slot overline - The text displayed above the main content.
 * @slot start - The content displayed at the start of the list item.
 * @slot end - The content displayed at the end of the list item.
 * @slot end-text - The text displayed at the end of the list item.
 * @slot supporting-text - The supporting text displayed below the main content.
 */
export default class UiListItem extends UiElement {
  @query('ui-ripple') accessor ripple!: UiRipple

  #lines: ListItemLines = ListItemLines.one

  get lines(): ListItemLines {
    if (this.#lines === ListItemLines.auto) {
      return this.hasOverline || this.hasSupportingText ? ListItemLines.two : ListItemLines.one
    }
    return this.#lines
  }

  /**
   * The number of lines to render the list template for.
   * @default ListItemLines.one
   * @attribute
   */
  @property({ type: String, reflect: true })
  set lines(value: ListItemLines) {
    const oldValue = this.#lines
    this.#lines = value
    this.requestUpdate('lines', oldValue)
  }

  /**
   * Whether the list item is disabled. The user can't interact with the list item when `true`.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor disabled = false

  /**
   * The type of the list image.
   * @default ListItemImage.icon
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor image: ListItemImage

  /**
   * Whether the list item is static and should not be focusable.
   * The ripple effect will not be applied when `true`.
   * @default false
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor static = false

  /**
   * Whether the item acts as a parent/group header for other items.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor group = false

  @property({ type: Number, reflect: true }) override accessor tabIndex = -1

  /**
   * The ID of the parent list item. Used for collapsable lists.
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor parent: string | undefined

  /**
   * Whether the parent item is expanded to show its children.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor open = false

  /**
   * Whether the item is hidden because its parent is collapsed.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor collapsed = false

  @state() accessor hasStartItem = false
  @state() accessor hasEndItem = false
  @state() accessor hasEndTextItem = false
  @state() accessor hasOverline = false
  @state() accessor hasSupportingText = false

  constructor() {
    super()

    this.image = ListItemImage.icon
    this.lines = ListItemLines.one

    this.addEventListener('click', this.handleClick.bind(this))
    this.addEventListener('pointerdown', this.handlePointerDown.bind(this))
    this.addEventListener('pointerup', this.handlePointerUp.bind(this))
    this.addEventListener('pointercancel', this.handlePointerCancel.bind(this))
    this.addEventListener('pointerleave', this.handlePointerLeave.bind(this))
    this.addEventListener('pointerenter', this.handlePointerEnter.bind(this))
    this.addEventListener('contextmenu', this.handleContextMenu.bind(this))
    this.addEventListener('keydown', this.handleKeyDown.bind(this))
    this.addEventListener('keyup', this.handleKeyUp.bind(this))
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties)
    if (changedProperties.has('tabIndex') && (this.tabIndex === -1 || this.tabIndex === null)) {
      this.ripple?.endPress()
    }
  }

  override connectedCallback(): void {
    super.connectedCallback()
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'listitem')
    }
  }

  protected override willUpdate(cp: PropertyValues<this>): void {
    if (cp.has('disabled')) {
      setDisabled(this, cp.get('disabled'))
    }
  }

  override handleKeyDown(e: KeyboardEvent): void {
    if (this.disabled) {
      e.stopPropagation()
      e.preventDefault()
      return
    }
    if (this.static) return
    if (e.key !== ' ' && e.key !== 'Enter') return
    // do not prevent default, so that parent elements can handle the key event
    this.beginPress({ positionEvent: e })
  }

  override handleKeyUp(e: KeyboardEvent): void {
    if (this.disabled) {
      e.stopPropagation()
      e.preventDefault()
      return
    }
    if (this.static) return
    if (e.key !== ' ' && e.key !== 'Enter') return

    // do not prevent default, so that parent elements can handle the key event
    this.endPress({ cancelled: false, actionData: { item: this } })
  }

  override beginPress(options: BeginPressConfig): void {
    if (this.disabled || this.static) {
      return
    }
    super.beginPress(options)
    this.ripple.beginPress(options.positionEvent)
  }

  override endPress(options: EndPressConfig): void {
    if (this.disabled || this.static) {
      return
    }
    super.endPress(options)
    this.ripple.endPress()
  }

  override handlePointerEnter(e: PointerEvent): void {
    if (this.disabled || this.static) {
      e.stopPropagation()
      e.preventDefault()
      return
    }
    this.ripple.beginHover(e)
  }

  override handlePointerLeave(e: PointerEvent): void {
    if (this.disabled || this.static) {
      e.stopPropagation()
      e.preventDefault()
      return
    }
    super.handlePointerLeave(e)

    this.ripple.endHover()
  }

  /**
   * Focuses list item and makes list item focusable via keyboard.
   */
  activate(): void {
    if (this.disabled || this.static) {
      return
    }
    this.setAttribute('tabindex', '0')
    this.focus()
  }

  /**
   * Returns true if list item is currently focused and is focusable.
   */
  isActive(): boolean {
    if (this.disabled || this.static) {
      return false
    }
    return this.getAttribute('tabindex') === '0'
  }

  /**
   * Removes list item from sequential keyboard navigation.
   */
  deactivate(): void {
    if (this.disabled || this.static) {
      return
    }
    this.removeAttribute('tabindex')
  }

  private _handleSlotChange(event: Event): boolean {
    const slot = event.target as HTMLSlotElement
    return slot.assignedNodes({ flatten: true }).length > 0
  }

  protected handleOverlineSlotChange(event: Event): void {
    this.hasOverline = this._handleSlotChange(event)
    this.requestUpdate()
  }

  protected handleSupportingTextSlotChange(event: Event): void {
    this.hasSupportingText = this._handleSlotChange(event)
    this.requestUpdate()
  }

  protected handleStartSlotChange(event: Event): void {
    this.hasStartItem = this._handleSlotChange(event)
    this.requestUpdate()
  }

  protected handleEndSlotChange(event: Event): void {
    this.hasEndItem = this._handleSlotChange(event)
    this.requestUpdate()
  }

  protected handleEndTextSlotChange(event: Event): void {
    this.hasEndTextItem = this._handleSlotChange(event)
    this.requestUpdate()
  }

  getSurfaceClasses(): ClassInfo {
    const result: ClassInfo = {
      'surface': true,
      'one-line': this.lines === ListItemLines.one,
      'two-lines': this.lines === ListItemLines.two,
      'three-lines': this.lines === ListItemLines.three,
    }
    return result
  }

  protected override render(): TemplateResult {
    return html`
      ${this.renderFocusRing()} ${this.renderRipple()}
      <div class="${classMap(this.getSurfaceClasses())}" part="surface">
        ${this.renderStart()} ${this.renderBody()} ${this.renderEnd()}
      </div>
    `
  }

  protected renderRipple(): TemplateResult {
    return html`<ui-ripple part="ripple" class="ripple" ?disabled="${this.disabled || this.static}"></ui-ripple>`
  }

  protected renderFocusRing(): TemplateResult {
    return html`<ui-focus-ring
      part="focus-ring"
      class="focus-ring"
      .control="${this as HTMLElement}"
      inward
    ></ui-focus-ring>`
  }

  protected getStartClasses(): ClassInfo {
    return {
      'start': true,
      'has-start': this.hasStartItem,
    }
  }

  protected renderStart(): TemplateResult | typeof nothing {
    return html`<div class="${classMap(this.getStartClasses())}">
      <slot name="start" @slotchange=${this.handleStartSlotChange}></slot>
    </div>`
  }

  protected getEndClasses(): ClassInfo {
    return {
      'end': true,
      'has-end': this.hasEndItem,
      'has-end-text': this.hasEndTextItem,
    }
  }

  protected renderEnd(): TemplateResult {
    return html`<div class="${classMap(this.getEndClasses())}">
      <slot name="end-text" class="trailing-supporting-text" @slotchange=${this.handleEndTextSlotChange}></slot>
      <slot name="end" @slotchange=${this.handleEndSlotChange}></slot>
    </div>`
  }

  protected renderBody(): TemplateResult {
    return html`
      <div class="body">
        <slot name="overline" @slotchange=${this.handleOverlineSlotChange}></slot>
        <span class="headline"><slot></slot></span>
        <span class="supporting-text"
          ><slot name="supporting-text" @slotchange=${this.handleSupportingTextSlotChange}></slot
        ></span>
      </div>
    `
  }
}
