import { LitElement, type PropertyValues, type TemplateResult, html } from 'lit'
import { property, queryAssignedElements } from 'lit/decorators.js'
import UiButtonElement from './button.js'
import type { MdButtonShape, MdButtonSize } from './button.js'

export type MdGroupType = 'standard' | 'connected'
export type MdGroupShape = MdButtonShape

/**
 * A group of buttons that can be selected, following Material Design 3 Expressive guidelines.
 *
 * When a group of buttons is added to the group element, the group element
 * becomes the manager of the buttons type, size, shape, selection state, and keyboard navigation.
 *
 * All buttons added to the group will inherit the size and shape from the group.
 *
 * In connected button groups, buttons are visually connected with 2px gap,
 * outer corners are rounded, inner corners match MD3 corner tokens, and selected
 * buttons have all 4 corners rounded.
 *
 * Keyboard Navigation & Accessibility:
 * - The button group container is not a focusable element (`role="group"`).
 * - Initial focus lands on the first enabled button in the group.
 * - Use `Tab` to navigate to/from the button group (roving tabindex: only the active button has `tabindex="0"`).
 * - Use the arrow keys (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`) to navigate between items.
 *   Navigation wraps around edges, skips disabled buttons, and automatically adapts to RTL layouts.
 * - Use `Home` and `End` keys to jump to the first and last enabled buttons.
 * - Use `Space` or `Enter` to select/activate the focused button.
 *
 * Use when:
 * - Organizing related actions into visual groups (standard or connected).
 * - Implementing single or multi-select toggle button sets.
 *
 * Don't use when:
 * - Standalone buttons without visual grouping are needed.
 *
 * @fires change - Fired when the selection state of the group changes via user interaction.
 *
 * @example
 * ```html
 * <ui-button-group type="connected" size="s">
 *   <ui-button toggle selected>Day</ui-button>
 *   <ui-button toggle>Week</ui-button>
 *   <ui-button toggle>Month</ui-button>
 * </ui-button-group>
 * ```
 */
export default class ButtonGroup extends LitElement {
  /**
   * If true, multiple buttons can be selected.
   * When set to false, the group deselects all other buttons when one is selected.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor multiple = false

  /**
   * The type of button group.
   * - 'standard': Standard button group with spacing between buttons.
   * - 'connected': Connected button group (buttons are visually connected with 2px gap).
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor type: MdGroupType = 'standard'

  /**
   * The size of the buttons used with this group.
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor size: MdButtonSize = 's'

  /**
   * The default shape of the buttons used with this group.
   * - 'round': Pill/round outer shape.
   * - 'square': Rounded rectangle matching MD3 corner size tokens.
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor shape: MdButtonShape = 'round'

  @queryAssignedElements({ flatten: true, selector: 'ui-button' })
  private accessor assignedButtons: UiButtonElement[] = []

  /**
   * The MutationObserver instance used to watch for changes in slotted children.
   */
  protected observer?: MutationObserver

  /**
   * Returns all child buttons managed by this group.
   */
  get buttons(): UiButtonElement[] {
    if (this.assignedButtons && this.assignedButtons.length > 0) {
      return this.assignedButtons
    }
    return Array.from(this.querySelectorAll<UiButtonElement>('ui-button'))
  }

  /**
   * The list of non-disabled child buttons available for keyboard focus.
   */
  get enabledButtons(): UiButtonElement[] {
    return this.buttons.filter((button) => !button.disabled)
  }

  /**
   * The list of currently selected child buttons in the group.
   */
  get selectedButtons(): UiButtonElement[] {
    return this.buttons.filter((button) => button.selected)
  }

  /**
   * The currently focused button in the group, if any.
   */
  get focusedButton(): UiButtonElement | undefined {
    const root = this.getRootNode() as Document | ShadowRoot | null
    const active = root?.activeElement ?? (typeof document !== 'undefined' ? document.activeElement : null)
    return this.buttons.find((button) => button === active || button.matches(':focus-within'))
  }

  /**
   * Whether the element layout direction is right-to-left.
   */
  get isRtl(): boolean {
    if (typeof window === 'undefined') {
      return false
    }
    return window.getComputedStyle(this).direction === 'rtl'
  }

  constructor() {
    super()
    this.addEventListener('toggle', this.handleToggle.bind(this))
    this.addEventListener('focusin', this.handleFocusIn.bind(this))
    this.addEventListener('keydown', this.handleKeyDown.bind(this))
  }

  override connectedCallback(): void {
    super.connectedCallback()
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'group')
    }
    this.removeAttribute('tabindex')
    this.observer = new MutationObserver(this.handleMutations.bind(this))
    this.observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['selected', 'disabled'],
    })
    this.updateChildren()
    this.updateTabIndices()
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this.observer?.disconnect()
    this.observer = undefined
  }

  protected override firstUpdated(changed: PropertyValues): void {
    this.updateChildren()
    this.updateTabIndices()
    super.firstUpdated(changed)
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('size') || changed.has('shape') || changed.has('type') || changed.has('multiple')) {
      this.updateChildren()
      this.updateTabIndices()
    }
  }

  /**
   * Delegates focus to the currently active or first enabled button in the group.
   */
  override focus(options?: FocusOptions): void {
    const target = this.enabledButtons.find((btn) => btn.tabIndex === 0) ?? this.enabledButtons[0]
    if (target) {
      target.focus(options)
    }
  }

  /**
   * Handles slotchange events when slotted buttons are inserted or removed.
   */
  protected handleSlotChange(): void {
    this.updateChildren()
    this.updateTabIndices()
  }

  /**
   * Handles toggle events bubbling up from child buttons for instant selection changes.
   */
  protected handleToggle(e: Event): void {
    const target = e.target
    if (target instanceof UiButtonElement && this.buttons.includes(target)) {
      if (target.selected) {
        this.activate(target)
      }
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    }
  }

  /**
   * Handles focusin events to synchronize roving tab indices when a child button is focused.
   */
  protected handleFocusIn(event: FocusEvent): void {
    const target = event.target
    if (target instanceof UiButtonElement && this.buttons.includes(target) && !target.disabled) {
      this.updateTabIndices(target)
    }
  }

  /**
   * Handles keyboard navigation inside the button group (Arrow keys, Home, End).
   */
  protected handleKeyDown(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return
    }

    const target = event.target as HTMLElement | null
    const button = target?.closest('ui-button')
    if (!button || !this.buttons.includes(button as UiButtonElement)) {
      return
    }

    const isLeft = event.key === 'ArrowLeft'
    const isRight = event.key === 'ArrowRight'
    const isUp = event.key === 'ArrowUp'
    const isDown = event.key === 'ArrowDown'
    const isHome = event.key === 'Home'
    const isEnd = event.key === 'End'

    if (!isLeft && !isRight && !isUp && !isDown && !isHome && !isEnd) {
      return
    }

    const { enabledButtons } = this
    if (enabledButtons.length === 0) {
      return
    }

    event.preventDefault()

    if (isHome) {
      this.focusFirstButton()
      return
    }

    if (isEnd) {
      this.focusLastButton()
      return
    }

    const forward = isDown || (this.isRtl ? isLeft : isRight)
    if (forward) {
      this.navigateForward()
    } else {
      this.navigateBackward()
    }
  }

  /**
   * Focuses the first enabled button in the group.
   */
  private focusFirstButton(): void {
    const target = this.enabledButtons[0]
    if (target) {
      this.focusButton(target)
    }
  }

  /**
   * Focuses the last enabled button in the group.
   */
  private focusLastButton(): void {
    const enabled = this.enabledButtons
    const target = enabled[enabled.length - 1]
    if (target) {
      this.focusButton(target)
    }
  }

  /**
   * Navigates to the next enabled button, wrapping to the start if at the end.
   */
  private navigateForward(): void {
    const enabled = this.enabledButtons
    if (enabled.length === 0) {
      return
    }
    const current = this.focusedButton
    if (!current) {
      this.focusFirstButton()
      return
    }
    const currentIndex = enabled.indexOf(current)
    const nextIndex = currentIndex < 0 || currentIndex >= enabled.length - 1 ? 0 : currentIndex + 1
    const target = enabled[nextIndex]
    if (target) {
      this.focusButton(target)
    }
  }

  /**
   * Navigates to the previous enabled button, wrapping to the end if at the start.
   */
  private navigateBackward(): void {
    const enabled = this.enabledButtons
    if (enabled.length === 0) {
      return
    }
    const current = this.focusedButton
    if (!current) {
      this.focusLastButton()
      return
    }
    const currentIndex = enabled.indexOf(current)
    const prevIndex = currentIndex <= 0 ? enabled.length - 1 : currentIndex - 1
    const target = enabled[prevIndex]
    if (target) {
      this.focusButton(target)
    }
  }

  /**
   * Focuses the given button and updates roving tab indices across the group.
   */
  private focusButton(button: UiButtonElement): void {
    this.updateTabIndices(button)
    button.focus()
  }

  /**
   * Handles mutations on slotted children, including attribute changes and child additions/removals.
   */
  protected handleMutations(mutations: MutationRecord[]): void {
    let updateChildrenNeeded = false
    let updateTabIndicesNeeded = false

    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        const target = mutation.target
        if (target instanceof UiButtonElement && this.buttons.includes(target)) {
          if (mutation.attributeName === 'selected' && target.selected) {
            this.activate(target)
          } else if (mutation.attributeName === 'disabled') {
            updateTabIndicesNeeded = true
          }
        }
      } else if (mutation.type === 'childList') {
        updateChildrenNeeded = true
        updateTabIndicesNeeded = true
      }
    }

    if (updateChildrenNeeded) {
      this.updateChildren()
    }
    if (updateTabIndicesNeeded) {
      this.updateTabIndices()
    }
  }

  /**
   * Propagates size and shape properties to all child buttons and enforces single-select constraint.
   */
  protected updateChildren(): void {
    this.buttons.forEach((button) => {
      button.size = this.size
      button.shape = this.shape
    })
    if (!this.multiple) {
      let foundSelected = false
      this.buttons.forEach((button) => {
        if (button.selected) {
          if (foundSelected) {
            button.selected = false
          } else {
            foundSelected = true
          }
        }
      })
    }
  }

  /**
   * Updates roving tabindex values for child buttons.
   * Exactly one enabled button in the group will have tabIndex = 0 (focusable via Tab),
   * while all others will have tabIndex = -1.
   *
   * @param activeButton Optional specific button to make active.
   */
  updateTabIndices(activeButton?: UiButtonElement): void {
    const { buttons, enabledButtons } = this
    if (buttons.length === 0) {
      return
    }

    if (enabledButtons.length === 0) {
      buttons.forEach((btn) => {
        btn.removeAttribute('tabindex')
      })
      return
    }

    let target: UiButtonElement | undefined = activeButton
    if (!target || target.disabled || !buttons.includes(target)) {
      target = this.focusedButton
    }
    if (!target || target.disabled) {
      target = buttons.find((btn) => !btn.disabled && btn.tabIndex === 0)
    }
    if (!target || target.disabled) {
      target = enabledButtons[0]
    }

    buttons.forEach((btn) => {
      if (btn.disabled) {
        btn.removeAttribute('tabindex')
      } else if (btn === target) {
        btn.tabIndex = 0
      } else {
        btn.tabIndex = -1
      }
    })
  }

  /**
   * In multi selection mode, this method does nothing.
   * In single selection mode, it activates the clicked button and deactivates all others.
   *
   * @param button The button to activate.
   */
  activate(button: UiButtonElement): void {
    if (this.multiple) {
      // In multiselection, we don't need to do anything here
      return
    }
    this.buttons.forEach((btn) => {
      if (btn === button || !btn.selected) {
        return
      }
      btn.selected = false
    })
    if (!button.selected) {
      button.selected = true
    }
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.handleSlotChange}></slot>`
  }
}
