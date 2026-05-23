import { html, nothing, type PropertyValues, type TemplateResult } from 'lit'
import { property, query } from 'lit/decorators.js'
import { randomId } from '../../../lib/random.js'
import { UiElement } from '../../UiElement.js'
import type { BeginPressConfig, EndPressConfig } from '../../../controllers/ActionController.js'
import { isDisabled, setDisabled } from '../../../lib/disabled.js'
import type UiRipple from '../../ripple/internals/ripple.js'
import { findElementInShadowRoots } from '../../../lib/Dom.js'

import '../../ripple/ui-ripple.js'
import '../../focus-ring/ui-focus-ring.js'

export type ButtonType = 'submit' | 'reset' | 'button'
export type MdButtonShape = 'round' | 'square'
export type MdButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl'

/**
 * A material design button with M3 Expressive features - CSS-native implementation.
 *
 * @slot icon - A slot for the icon element
 * @slot - The default slot for the label
 * @attribute {string} form - The form associated with this element when the element is outside the form.
 * @fires {ToggleEvent} toggle - Fired when the `toggle` property is true and the button is clicked,
 *                               changing its selection state.
 *                               The event's `newState` and `oldState` properties (string values: 'selected' or
 *                               'unselected') detail this selection change.
 */
export default class BaseButton extends UiElement {
  static readonly formAssociated = true

  #internals = this.attachInternals()

  /**
   * The form associated with this element
   * @attribute
   */
  get form(): HTMLFormElement | null | string {
    return this.#internals.form
  }

  get validity() {
    return this.#internals.validity
  }

  get validationMessage() {
    return this.#internals.validationMessage
  }

  get willValidate() {
    return this.#internals.willValidate
  }

  /**
   * The name of the button, submitted as a pair with the button's value as part of the form data.
   * @attribute
   */
  @property({ type: String }) accessor name: string | undefined

  #value?: string

  get value(): string | undefined {
    return this.#value
  }

  /**
   * Defines the value associated with the button's name when it's submitted with the form data.
   * @attribute
   */
  @property({ type: String })
  set value(value: string | undefined) {
    if (this.#value === value) {
      return
    }
    this.#value = value
    this.#internals?.setFormValue(value || null)
  }

  /**
   * Whether to render the icon at the inline end of the label rather than the inline start.
   * @attribute
   */
  @property({ type: Boolean, attribute: 'trailingicon', reflect: true }) accessor trailingIcon = false

  /**
   * The default behavior of the button.
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor type: ButtonType = 'button'

  /**
   * When set, the button is a toggle button.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor toggle = false

  /**
   * Indicates that the button is currently selected.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor selected = false

  /**
   * The shape of the button.
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor shape: MdButtonShape = 'round'

  /**
   * The size of the button.
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor size: MdButtonSize = 's'

  get disabled(): boolean {
    return isDisabled(this)
  }

  /**
   * When set, the button is in a disabled state.
   * @attribute
   */
  @property({ reflect: true, type: Boolean })
  set disabled(value: boolean) {
    const old = isDisabled(this)
    setDisabled(this, value)
    this.requestUpdate('disabled', old)
  }

  @query('ui-ripple') protected accessor ripple!: UiRipple | null

  /**
   * Turns a `<ui-button>` element into a popover control button; takes the ID
   * of the popover element to control as its value.
   *
   * Note: this is required for now as the spec only allows to control popovers
   * via buttons. Custom elements are not allowed to control popovers.
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor popoverTarget: string | undefined
  /**
   * Specifies the action to be performed on a popover element being controlled
   * by a control <ui-button>. Possible values are:
   *
   * - `hide` - The button will hide a shown popover. If you try to hide an already hidden popover,
   *   no action will be taken.
   * - `show` - The button will show a hidden popover. If you try to show an already showing popover,
   *   no action will be taken.
   * - `toggle` - The button will toggle a popover between showing and hidden. If the popover is hidden,
   *   it will be shown; if the popover is showing, it will be hidden. If popoverTargetAction is omitted,
   *   "toggle" is the default action that will be performed by the control button.
   */
  @property({ type: String, reflect: true }) accessor popoverTargetAction: 'hide' | 'show' | 'toggle' | undefined
  /**
   * When true, the focus ring effect will be constrained to the inside of the button's bounds.
   * @attribute
   */
  @property({ type: Boolean }) accessor inwardFocus: boolean | undefined

  constructor() {
    super()
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

  protected override update(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('popoverTarget')) {
      this.setupPopoverTarget()
    }
    super.update(changedProperties)
  }

  protected override updated(cp: PropertyValues<this>): void {
    super.updated(cp)

    // If the button is disabled, remove the tabindex attribute
    if (cp.has('disabled')) {
      if (this.disabled) {
        this.removeAttribute('tabindex')
      } else if (!this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', '0')
      }
    }

    if (cp.has('toggle') || cp.has('selected')) {
      this.updatePressedState()
    }
  }

  protected updatePressedState(): void {
    if (this.toggle) {
      this.ariaPressed = String(this.selected)
    } else {
      this.selected = false
      this.removeAttribute('aria-pressed')
    }
  }

  checkValidity() {
    return this.#internals.checkValidity()
  }

  reportValidity() {
    return this.#internals.reportValidity()
  }

  protected override firstUpdated(): void {
    this.#internals?.setFormValue(this.value || null)
  }

  override beginPress(options: BeginPressConfig): void {
    super.beginPress(options)
    this.classList.add('pressed')
    this.ripple?.beginFocus()
  }

  override endPress(config: EndPressConfig): void {
    super.endPress(config)
    this.classList.remove('pressed')
    this.ripple?.endFocus()
    const { cancelled, reason } = config
    if (cancelled) {
      return
    }
    const allowedReasons = reason === 'enter' || reason === 'space'
    if (this.type === 'submit' && (!reason || allowedReasons)) {
      this.handleSubmit()
    } else if (this.type === 'reset' && (!reason || allowedReasons)) {
      this.handleReset()
    } else if (allowedReasons) {
      this.click()
    }
  }

  override handleClick(e: MouseEvent): void {
    if (this.disabled) {
      e.preventDefault()
      e.stopPropagation()
      return
    }

    if (this.toggle) {
      this.selected = !this.selected
      const e = new ToggleEvent('toggle', {
        bubbles: true,
        composed: true,
        newState: this.selected ? 'selected' : 'unselected',
        oldState: this.selected ? 'unselected' : 'selected',
      })
      this.dispatchEvent(e)
    }
    this.handlePopoverAction()
    // Delegate to ActionController to properly end the press and reset phase
    // state; this removes the 'pressed' class via endPress() and ensures
    // subsequent pointerdown events work again.
    super.handleClick(e)
  }

  protected setupPopoverTarget(): void {
    const id = this.popoverTarget
    if (!id) {
      return
    }
    const element = findElementInShadowRoots(id, this)
    if (!element) {
      return
    }
    // A regular button first sets its value to the popover target ID,
    this.value = id
    // create an anchor association with the popover target
    if (!this.id) {
      this.id = randomId()
    }
    const anchorName = `--anchor-${this.id}`
    this.style.setProperty('anchor-name', anchorName)
    element.style.setProperty('position-anchor', anchorName)
    this.setAttribute('aria-details', id)
    this.setAttribute('aria-controls', id)
  }

  /**
   * When the button has a popover target, this method toggles the popover
   * visibility by finding the element in the shadow roots and calling its
   * `togglePopover` method.
   */
  protected handlePopoverAction(): void {
    const id = this.popoverTarget
    if (!id) {
      return
    }
    const element = findElementInShadowRoots(id, this)
    if (!element) {
      return
    }
    const action = this.popoverTargetAction || 'toggle'
    if (action === 'hide') {
      element.hidePopover()
    } else if (action === 'show') {
      element.showPopover()
    } else {
      // default to toggle
      element.togglePopover()
    }
    element.focus()
  }

  protected handleSubmit(): void {
    const { name, value, type, disabled, form } = this
    if (!form || !type || disabled) {
      return
    }
    const typedForm = form as HTMLFormElement
    let button: HTMLButtonElement | undefined
    if (name || value) {
      button = document.createElement('button')
      if (name) {
        button.name = name
      }
      if (value) {
        button.value = value
      }
      button.type = type
      button.hidden = true
      typedForm.append(button)
    }
    try {
      typedForm.requestSubmit(button)
    } catch {
      // Ignore errors
    }
    if (button) {
      typedForm.removeChild(button)
    }
  }

  protected handleReset(): void {
    const form = this.form as HTMLFormElement
    form?.reset()
  }

  override handlePointerEnter(e: PointerEvent): void {
    super.handlePointerEnter(e)
    this.ripple?.beginHover(e)
  }

  override handlePointerLeave(e: PointerEvent): void {
    super.handlePointerLeave(e)
    this.ripple?.endHover()
  }

  protected override render(): TemplateResult {
    const { trailingIcon = false } = this
    const icon = this.renderIcon()

    return html`
      ${this.renderFocusRing()} ${this.renderRipple()} ${trailingIcon ? nothing : icon}
      <slot></slot>
      ${trailingIcon ? icon : nothing}
    `
  }

  protected renderIcon(): TemplateResult {
    return html`<slot name="icon"></slot>`
  }

  protected renderFocusRing(): TemplateResult {
    return html`<ui-focus-ring
      part="focus-ring"
      class="focus-ring"
      .control="${this}"
      ?inward="${this.inwardFocus}"
    ></ui-focus-ring>`
  }

  protected renderRipple(): TemplateResult {
    return html`<ui-ripple class="ripple" ?disabled="${this.disabled}"></ui-ripple>`
  }
}
