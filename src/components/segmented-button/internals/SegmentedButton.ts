import { html, TemplateResult } from 'lit'
import { property, query, queryAssignedElements } from 'lit/decorators.js'
import { ClassInfo, classMap } from 'lit/directives/class-map.js'
import { UiElement } from '../../UiElement.js'
import { BeginPressConfig, EndPressConfig } from '../../../controllers/ActionController.js'
import UiRipple from '../../ripple/internals/ripple.js'
import { ripple } from '../../effects/rippleDirective.js'
import { check } from '../../icons/Icons.js'
import { isDisabled, setDisabled } from '../../../lib/disabled.js'
import '../../ripple/ui-ripple.js'

/**
 * @fires trigger - When a button is triggered.
 * @slot - Default slot for the label
 * @slot icon - A slot to render an icon.
 */
export default class SegmentedButton extends UiElement {
  @query('ui-ripple') accessor ripple!: UiRipple

  /**
   * Whether the button is selected.
   * @attribute
   */
  @property({ type: Boolean }) accessor selected = false

  @queryAssignedElements({ flatten: true, slot: 'icon' }) protected accessor leadingIcons!: HTMLElement[]

  get disabled(): boolean {
    return isDisabled(this)
  }

  /**
   * When set, the button is a disabled state.
   * @attribute
   */
  @property({ reflect: true, type: Boolean })
  set disabled(value: boolean) {
    const old = isDisabled(this)
    setDisabled(this, value)
    this.requestUpdate('disabled', old)
  }

  constructor() {
    super()
    this.actionController.cancelKeyboardEvents = true
    this.addEventListener('keydown', this.handleKeyDown.bind(this))
    this.addEventListener('keyup', this.handleKeyUp.bind(this))
    this.addEventListener('click', this.handleClick.bind(this))
    this.addEventListener('pointerdown', this.handlePointerDown.bind(this))
    this.addEventListener('pointerup', this.handlePointerUp.bind(this))
    this.addEventListener('pointercancel', this.handlePointerCancel.bind(this))
    this.addEventListener('pointerenter', this.handlePointerEnter.bind(this))
    this.addEventListener('pointerleave', this.handlePointerLeave.bind(this))
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

  override beginPress(options: BeginPressConfig): void {
    super.beginPress(options)
    this.ripple.beginPress(options.positionEvent)
  }

  override endPress(options: EndPressConfig): void {
    super.endPress(options)
    this.ripple.endPress()

    if (!options.cancelled) {
      this.dispatchEvent(new Event('trigger', { bubbles: true, composed: true }))
    }
  }

  override handlePointerEnter(e: PointerEvent): void {
    this.ripple.beginHover(e)
  }

  override handlePointerLeave(e: PointerEvent): void {
    super.handlePointerLeave(e)
    this.ripple.endHover()
  }

  protected handleIconSlotChange(): void {
    this.requestUpdate()
  }

  protected override render(): TemplateResult {
    const { pressed = false, selected = false } = this
    const surfaceClasses = classMap({
      surface: true,
      pressed,
      selected,
    })

    return html`
      <div class="${surfaceClasses}" ${ripple(() => this.ripple)}>
        ${this.renderRipple()}
        <div class="content">
          ${this.leadingContent()}
          <slot></slot>
        </div>
      </div>
    `
  }

  protected leadingContent(): TemplateResult {
    const { leadingIcons } = this
    const classes: ClassInfo = {
      leading: true,
      visible: !!this.selected || !!leadingIcons.length,
    }
    return html` <div class="${classMap(classes)}">${this.renderLeadingIcon()} ${this.renderChecked()}</div> `
  }

  protected renderLeadingIcon(): TemplateResult {
    const { leadingIcons } = this
    const classes: ClassInfo = {
      'leading-icon': true,
      'with-icon': !!leadingIcons.length,
      'hidden': !!this.selected,
    }
    return html`
      <div class="${classMap(classes)}"><slot name="icon" @slotchange="${this.handleIconSlotChange}"></slot></div>
    `
  }

  protected renderChecked(): TemplateResult {
    const iconClasses = classMap({
      'check-mark': true,
      'checked': !!this.selected,
    })
    return html`<span class="${iconClasses}" role="presentation">${check}</span>`
  }

  protected renderRipple = (): TemplateResult => {
    const { disabled } = this
    return html`<ui-ripple class="ripple" ?disabled="${disabled}"></ui-ripple>`
  }
}
