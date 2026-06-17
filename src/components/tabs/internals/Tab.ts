import { html, nothing, PropertyValues, TemplateResult } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { ClassInfo, classMap } from 'lit/directives/class-map.js'
import type { BeginPressConfig, EndPressConfig } from '../../../controllers/ActionController.js'
import type UiRipple from '../../ripple/internals/ripple.js'
import { isDisabled, setDisabled } from '../../../lib/disabled.js'
import { UiElement } from '../../UiElement.js'
import type { SizingInfo, TabsPriority } from './Tabs.js'
import { Easing } from '../../motion/animation.js'

import '../../ripple/ui-ripple.js'
import '../../focus-ring/ui-focus-ring.js'

export default class UiTab extends UiElement {
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

  /**
   * Whether the tab is selected. Note, this does not correspond to the `selected` state
   * in the `ui-tabs`. This is only to render the tab in the selected state.
   * @attribute
   */
  @property({ reflect: true, type: Boolean }) accessor selected

  /**
   * @attribute
   */
  @property({ reflect: true, type: String }) accessor priority: TabsPriority

  /**
   * @attribute
   */
  @property({ reflect: true, type: Boolean }) accessor indicated

  /**
   * Indicates whether the tab has an icon.
   * This is set automatically when the "icon" slot is populated.
   */
  @state() protected accessor hasIcon
  /**
   * Indicates whether the tab only has an icon and no text.
   * This is set automatically when the default slot is populated with only an icon.
   */
  @state() protected accessor iconOnly

  @query('ui-ripple') protected accessor ripple!: UiRipple | null

  constructor() {
    super()
    this.priority = 'primary'
    this.selected = false
    this.indicated = false
    this.hasIcon = false
    this.iconOnly = true
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
      this.setAttribute('role', 'tab')
    }
    if (!this.hasAttribute('aria-selected')) {
      this.setAttribute('aria-selected', 'false')
    }
  }

  protected override willUpdate(cp: PropertyValues<this>): void {
    super.willUpdate(cp)
    if (cp.has('selected')) {
      this.setAttribute('aria-selected', String(this.selected))
    }
  }

  override beginPress(options: BeginPressConfig): void {
    super.beginPress(options)
    this.classList.add('pressed')
    this.ripple?.beginPress(options.positionEvent)
  }

  override endPress(config: EndPressConfig): void {
    super.endPress(config)
    this.classList.remove('pressed')
    this.ripple?.endPress()
    const { cancelled, reason } = config
    if (cancelled) {
      return
    }
    if (reason === 'enter' || reason === 'space') {
      this.click()
    }
  }

  override handleClick(e: MouseEvent): void {
    super.handleClick(e)
    if (this.disabled) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    this.endPress({ cancelled: false, actionData: { event: e } })
  }

  override handlePointerEnter(e: PointerEvent): void {
    super.handlePointerEnter(e)
    if (this.ripple) {
      this.ripple.beginHover(e)
    }
  }

  override handlePointerLeave(e: PointerEvent): void {
    super.handlePointerLeave(e)
    if (this.ripple) {
      this.ripple.endHover()
    }
  }

  override handleKeyUp(e: KeyboardEvent): void {
    super.handleKeyUp(e)
    if (this.disabled) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
  }

  /**
   * Sets the `_hasIcon` state property when the "icon" slot change event is dispatched.
   */
  protected handleIconSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement
    this.hasIcon = !!slot.assignedNodes().length
  }

  protected handleSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement
    // Check if there's any label text or elements. If not, then there is only
    // an icon.
    for (const node of slot.assignedNodes()) {
      const hasTextContent = node.nodeType === Node.TEXT_NODE && !!(node as Text).wholeText.match(/\S/)
      if (node.nodeType === Node.ELEMENT_NODE || hasTextContent) {
        this.iconOnly = false
        return
      }
    }
    this.iconOnly = true
  }

  public getIndicatorSizing(): SizingInfo {
    const element = this.priority === 'primary' ? this.shadowRoot?.querySelector('.tab-content') : this
    if (!element) {
      return { width: 0, left: 0 }
    }
    const rect = element.getBoundingClientRect()
    return {
      width: rect.width,
      left: rect.left,
    }
  }

  /**
   * When `indicated` is `true` it animates the indicator to highlight the position of the tab.
   */
  public highlight(): void {
    if (!this.indicated) {
      return
    }
    const pointer = this.shadowRoot?.querySelector('.pointer')
    if (!pointer) {
      return
    }
    const frames: Keyframe[] = [
      {
        width: `40px`,
      },
      {
        width: `80px`,
      },
      {
        width: `40px`,
      },
    ]

    pointer.animate(frames, {
      duration: 360,
      iterations: 1,
      easing: Easing.STANDARD,
    })
  }

  protected override render(): TemplateResult {
    const isPrimary = this.priority === 'primary'
    const containerClasses = {
      'surface': true,
      'has-icon': this.hasIcon,
      'has-label': !this.iconOnly,
      'stacked': isPrimary,
    }
    return html`
      ${this.renderFocusRing()} ${this.renderRipple()}
      <div class="${classMap(containerClasses)}">
        <div class="tab-content">
          ${this.renderIcon()}
          <slot @slotchange="${this.handleSlotChange}"></slot>
          ${isPrimary ? this.renderIndicator() : nothing}
        </div>
      </div>
      ${!isPrimary ? this.renderIndicator() : nothing}
    `
  }

  protected renderFocusRing(): TemplateResult {
    return html`<ui-focus-ring
      part="focus-ring"
      class="focus-ring"
      inward
      .control="${this as HTMLElement}"
    ></ui-focus-ring>`
  }

  protected renderRipple(): TemplateResult {
    return html`<ui-ripple class="ripple" ?disabled="${this.disabled}"></ui-ripple>`
  }

  protected renderIcon(): TemplateResult {
    return html` <slot name="icon" @slotchange="${this.handleIconSlotChange}"></slot> `
  }

  protected renderIndicator(): TemplateResult | typeof nothing {
    const { indicated, priority } = this
    if (!indicated) {
      return nothing
    }
    const classes: ClassInfo = {
      indicator: true,
      primary: priority === 'primary',
    }
    return html`<div class="${classMap(classes)}"></div>`
  }
}
