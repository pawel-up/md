import { html, nothing, PropertyValues, TemplateResult } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { ClassInfo, classMap } from 'lit/directives/class-map.js'
import type { BeginPressConfig, EndPressConfig } from '../../../controllers/ActionController.js'
import type UiRipple from '../../ripple/internals/ripple.js'
import { isDisabled, setDisabled } from '../../../lib/disabled.js'
import { UiElement } from '../../UiElement.js'
import type { SizingInfo, TabsPriority } from './Tabs.js'

import '../../ripple/ui-ripple.js'
import '../../focus-ring/ui-focus-ring.js'

/**
 * A Material Design 3 tab component.
 *
 * Supports icons, labels, and badges. Position of badges dynamically conforms to M3 specs:
 * anchored 6dp overlapping the icon when stacked or icon-only, or placed inline with 4dp gap
 * after the label text.
 *
 * @slot icon - The tab icon element.
 * @slot badge - The tab badge element (typically a `<ui-badge>`).
 * @slot - The default slot for tab label text.
 */
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

  /**
   * Indicates whether the tab has a slotted badge.
   * This is set automatically when the "badge" slot is populated.
   */
  @state() protected accessor hasBadge = false

  @query('ui-ripple') protected accessor ripple!: UiRipple | null

  constructor() {
    super()
    this.priority = 'primary'
    this.selected = false
    this.indicated = false
    this.hasIcon = false
    this.iconOnly = true
    this.hasBadge = false
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
    this.checkSlottedNodes()
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tab')
    }
    if (!this.hasAttribute('aria-selected')) {
      this.setAttribute('aria-selected', 'false')
    }
  }

  /**
   * Inspects light-DOM children on initial connection so layout states are known
   * before the first render.
   */
  private checkSlottedNodes(): void {
    this.hasIcon = this.querySelector('[slot="icon"]') !== null
    this.hasBadge = this.querySelector('[slot="badge"]') !== null
    let hasLabel = false
    for (const child of this.childNodes) {
      if (child.nodeType === Node.TEXT_NODE && !!(child as Text).wholeText.match(/\S/)) {
        hasLabel = true
        break
      }
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement
        const slotAttr = el.getAttribute('slot')
        if (!slotAttr) {
          hasLabel = true
          break
        }
      }
    }
    this.iconOnly = !hasLabel
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
    const slot = e.target as HTMLSlotElement | null
    if (!slot) {
      return
    }
    this.hasIcon = slot.assignedNodes().length > 0
  }

  /**
   * Sets the `hasBadge` state property when the "badge" slot change event is dispatched.
   */
  protected handleBadgeSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement | null
    if (!slot) {
      return
    }
    const nodes = slot.assignedNodes()
    this.hasBadge = nodes.some((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return true
      }
      return node.nodeType === Node.TEXT_NODE && !!(node as Text).wholeText.match(/\S/)
    })
  }

  /**
   * Determines whether the badge should be placed over the icon (stacked or icon-only mode)
   * or inline next to the label (inline mode).
   */
  get isBadgeOnIcon(): boolean {
    return this.hasIcon && (this.iconOnly || this.priority === 'primary')
  }

  /**
   * Indicates whether the tab has slotted badge content.
   */
  get hasSlottedBadge(): boolean {
    return this.hasBadge
  }

  protected handleSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement | null
    if (!slot) {
      return
    }
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
    const isPrimary = this.priority === 'primary'
    const element = isPrimary ? this.shadowRoot?.querySelector('.tab-content') : this
    if (!element) {
      return { width: 0, left: 0 }
    }
    const rect = element.getBoundingClientRect()
    if (isPrimary) {
      // Inset 2dp on each side per MD3 spec, with a 24dp minimum length
      const width = Math.max(24, rect.width - 4)
      const left = rect.left + (rect.width - width) / 2
      return { width, left }
    }
    return {
      width: rect.width,
      left: rect.left,
    }
  }

  protected override render(): TemplateResult {
    const isPrimary = this.priority === 'primary'
    const containerClasses = {
      'surface': true,
      'has-icon': this.hasIcon,
      'has-label': !this.iconOnly,
      'has-badge': this.hasBadge,
      'stacked': isPrimary,
    }
    return html`
      ${this.renderFocusRing()} ${this.renderRipple()}
      <div class="${classMap(containerClasses)}">
        <div class="tab-content">
          ${this.renderIcon()}
          <span class="label-wrapper">
            <span class="label">
              <slot @slotchange="${this.handleSlotChange}"></slot>
            </span>
            ${!this.isBadgeOnIcon ? this.renderBadge() : nothing}
          </span>
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
    return html`
      <span class="icon">
        <slot name="icon" @slotchange="${this.handleIconSlotChange}"></slot>
        ${this.isBadgeOnIcon ? this.renderBadge() : nothing}
      </span>
    `
  }

  protected renderBadge(): TemplateResult {
    return html`<slot name="badge" class="badge-slot" @slotchange="${this.handleBadgeSlotChange}"></slot>`
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
