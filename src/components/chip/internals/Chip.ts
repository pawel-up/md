import { html, nothing, PropertyValues, TemplateResult } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { UiElement } from '../../UiElement.js'
import UiRipple from '../../ripple/internals/ripple.js'
import { close, arrowDropDown, check } from '../../icons/Icons.js'
import { setDisabled } from '../../../lib/disabled.js'
import { BeginPressConfig, EndPressConfig } from '../../../controllers/ActionController.js'
import '../../ripple/ui-ripple.js'
import { cancelEvent } from '../../../lib/events.js'

export enum ChipType {
  assist = 'assist',
  filter = 'filter',
  input = 'input',
  suggestion = 'suggestion',
}

/**
 * @slot The content of the chip.
 * @slot icon - The leading icon, sized 18x18 px
 * @slot avatar - The leading image, sized 24x24 px
 * @fires select - When the checked state changed through a user interaction. This only related to
 *                 `filter` chips. Note, `select` is dispatched just before the `click` event.
 * @fires remove - When the user clicks the "remove" icon on the chip.
 */
export default class UiChip extends UiElement {
  /**
   * Whether the chip is disabled. The user can't interact with the chip when `true`.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor disabled = false

  /**
   * The type of the rendered chip.
   * @attribute
   *
   * @see https://m3.material.io/components/chips/guidelines
   */
  @property({ type: String }) accessor type: ChipType

  /**
   * Whether the chip should be rendered as elevated.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor elevated: boolean | undefined

  /**
   * Whether the chip renders the "close" icon at the end.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor removable: boolean | undefined

  /**
   * Whether the chip is currently checked.
   * Note, this controls the presentation layer only. It has no meaning when it comes to forms and inputs.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor checked: boolean | undefined

  /**
   * When set, the chip will render a trailing icon that indicates that the chip is associated
   * with a list. It does not do anything.
   *
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor list: boolean | undefined

  @query('ui-ripple') protected accessor ripple!: UiRipple | null

  /**
   * Determines when the element has an icon in the "icon" slot.
   */
  @state() protected accessor hasIcon: boolean

  /**
   * Determines when the element has an image in the "avatar" slot.
   */
  @state() protected accessor hasAvatar: boolean

  constructor() {
    super()

    this.disabled = false
    this.type = ChipType.assist
    this.hasIcon = false
    this.hasAvatar = false

    this.actionController.cancelKeyboardEvents = true

    this.addEventListener('keydown', this.handleKeyDown.bind(this))
    this.addEventListener('keyup', this.handleKeyUp.bind(this))
    this.addEventListener('click', this.handleClick.bind(this))
    this.addEventListener('pointerdown', this.handlePointerDown.bind(this))
    this.addEventListener('pointerup', this.handlePointerUp.bind(this))
    this.addEventListener('pointercancel', this.handlePointerCancel.bind(this))
    this.addEventListener('pointerleave', this.handlePointerLeave.bind(this))
    this.addEventListener('pointerenter', this.handlePointerEnter.bind(this))
    this.addEventListener('contextmenu', this.handleContextMenu.bind(this))
    this.addEventListener('focus', this.handleFocus.bind(this))
    this.addEventListener('blur', this.handleBlur.bind(this))
  }

  override connectedCallback(): void {
    super.connectedCallback()
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button')
    }
    if (!this.hasAttribute('tabindex') && !this.disabled) {
      this.setAttribute('tabindex', '0')
    }
  }

  protected override willUpdate(cp: PropertyValues<this>): void {
    if (cp.has('disabled')) {
      setDisabled(this, cp.get('disabled'))
    }
  }

  override beginPress(options: BeginPressConfig): void {
    super.beginPress(options)
    this.classList.add('pressed')
    this.ripple?.beginPress(options.positionEvent)
  }

  override async handleKeyDown(e: KeyboardEvent): Promise<void> {
    super.handleKeyDown(e)
    if (this.removable && e.code === 'Backspace') {
      e.preventDefault()
      this.removeAction()
    }
  }

  protected async handleFocus(): Promise<void> {
    this.ripple?.beginFocus()
  }

  protected async handleBlur(): Promise<void> {
    this.ripple?.endFocus()
  }

  override endPress(info: EndPressConfig): void {
    super.endPress(info)
    this.classList.remove('pressed')
    this.ripple?.endPress()
    const { cancelled, reason } = info
    if (cancelled) {
      return
    }
    if (reason === 'enter' || reason === 'space') {
      this.click()
    }
  }

  override handleClick(e: MouseEvent): void {
    super.handleClick(e)
    if (this.type === ChipType.filter) {
      this.toggleChecked()
    }
  }

  override handlePointerEnter(e: PointerEvent): void {
    super.handlePointerEnter(e)
    this.ripple?.beginHover(e)
  }

  override handlePointerLeave(e: PointerEvent): void {
    super.handlePointerLeave(e)
    this.ripple?.endHover()
  }

  /**
   * Toggles the "filter" type of the chip.
   */
  toggleChecked(): void {
    this.checked = !this.checked
    this.dispatchEvent(new Event('select'))
  }

  /**
   * Sets the `hasIcon` state property when the "icon" slot change event is dispatched.
   */
  protected handleIconSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement
    this.hasIcon = !!slot.assignedNodes().length
  }

  /**
   * Sets the `_hasAvatar` state property when the "avatar" slot change event is dispatched.
   */
  protected handleAvatarSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement
    this.hasAvatar = !!slot.assignedNodes().length
  }

  protected handleClose(e: Event): void {
    e.preventDefault()
    e.stopPropagation()
    this.removeAction()
  }

  protected async removeAction(): Promise<void> {
    this.dispatchEvent(new Event('remove'))
  }

  protected override render(): TemplateResult {
    const containerClasses = {
      'surface': true,
      'has-icon': this.hasIcon,
      'has-avatar': this.hasAvatar,
      'has-trailing-icon': this.hasTrailingIcon,
    }
    return html`
      ${this.renderRipple()}
      <div class="${classMap(containerClasses)}">
        ${this.renderLeadingIcon()} ${this.renderAvatar()}
        <slot></slot>
        ${this.renderTrailingIcon()}
      </div>
    `
  }

  protected renderRipple(): TemplateResult {
    return html`<ui-ripple class="ripple" ?disabled="${this.disabled}"></ui-ripple>`
  }

  protected renderLeadingIcon(): TemplateResult | typeof nothing {
    const { type } = this
    if (type === ChipType.suggestion) {
      return nothing
    }
    if (type === ChipType.filter) {
      const iconClasses = {
        'leading-icon': true,
        'check-mark': true,
        'checked': !!this.checked,
      }
      return html`<span class="${classMap(iconClasses)}" role="presentation">${check}</span>`
    }
    return html`<slot class="leading-icon" name="icon" @slotchange="${this.handleIconSlotChange}"></slot>`
  }

  protected renderAvatar(): TemplateResult | typeof nothing {
    return html`<slot name="avatar" @slotchange="${this.handleAvatarSlotChange}"></slot>`
  }

  protected renderTrailingIcon(): TemplateResult | typeof nothing {
    const { removable = false, list, type } = this
    if (type === ChipType.filter && list) {
      return html`<span class="trailing-icon" role="presentation">${arrowDropDown}</span>`
    }
    if (type === ChipType.input && removable) {
      return html`<span
        class="trailing-icon"
        @click="${this.handleClose}"
        @keypress="${cancelEvent}"
        role="button"
        aria-label="Activate to close or disabled this chip."
        >${close}</span
      >`
    }
    return nothing
  }

  get hasTrailingIcon(): boolean {
    const { removable = false, list, type } = this
    if (type === ChipType.filter && list) {
      return true
    }
    if (type === ChipType.input && removable) {
      return true
    }
    return false
  }
}
