import { LitElement, html, type PropertyValues, type TemplateResult } from 'lit'
import { property, queryAssignedElements } from 'lit/decorators.js'
import {
  OverlayController,
  type OverlayHost,
  type OverlayDismissReason,
  type BeforeCloseCallback,
  isPromiseLike,
} from '../../../controllers/OverlayController.js'

export type MdFabPlacement = 'bottom-end' | 'bottom-start' | 'top-start' | 'top-end' | 'inline'

/**
 * Material Design 3 Floating Action Button (FAB) and FAB Menu Container.
 *
 * This component acts as a composition container that positions a trigger button
 * (such as `<ui-icon-button>` or `<ui-button>`) and optionally coordinates an expandable
 * FAB action menu according to Material Design 3 guidelines.
 *
 * Features:
 * - Compositional architecture: uses standard buttons in slots without recreating button logic.
 * - Positioning on screen: `bottom-end` (default), `bottom-start`, `top-start`, `top-end`, or `inline`.
 * - Responsive margin scaling (16dp compact/medium, 24dp expanded).
 * - Fast upward opening animation from button to the top element.
 * - Right-to-left individual item entrance animation (mirrored in RTL).
 * - Focus & accessibility: initial focus remains on the close button, with roving tabindex
 *   and keyboard arrow navigation (up/down).
 * - Overflow scroll handling behind the close button on constrained viewports.
 *
 * Use when:
 * - Highlighting the primary positive action on a screen.
 * - Presenting 2–6 related primary actions via an expandable FAB speed-dial menu.
 *
 * Don't use when:
 * - A standard non-floating toolbar button or page button is sufficient.
 * - Destructive or minor actions need to be promoted.
 *
 * @fires open - Dispatched when the FAB menu opens.
 * @fires closing - A cancelable, non-bubbling event dispatched before the FAB menu closes.
 * @fires close - A non-bubbling event dispatched when the FAB menu closes.
 * @fires change - Dispatched when the open state changes.
 * @fires select - Dispatched when a menu item is clicked/selected.
 *
 * @example
 * ```html
 * <!-- Standalone FAB -->
 * <ui-fab placement="bottom-end">
 *   <ui-icon-button color="filled" aria-label="Add item">
 *     <ui-icon>add</ui-icon>
 *   </ui-icon-button>
 * </ui-fab>
 *
 * <!-- FAB Menu -->
 * <ui-fab placement="bottom-end">
 *   <ui-icon-button color="filled" aria-label="Quick Actions">
 *     <ui-icon>add</ui-icon>
 *   </ui-icon-button>
 *
 *   <ui-button slot="menu" color="tonal">
 *     <ui-icon slot="icon">edit</ui-icon>
 *     Document
 *   </ui-button>
 *   <ui-button slot="menu" color="tonal">
 *     <ui-icon slot="icon">share</ui-icon>
 *     Share
 *   </ui-button>
 * </ui-fab>
 * ```
 */
export default class Fab extends LitElement implements OverlayHost {
  /**
   * The screen placement of the floating action button.
   * - 'bottom-end': Lower trailing corner (default).
   * - 'bottom-start': Lower leading corner.
   * - 'top-start': Upper leading corner (e.g. navigation rail).
   * - 'top-end': Upper trailing corner.
   * - 'inline': Positioned in document flow without fixed anchoring.
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor placement: MdFabPlacement = 'bottom-end'

  /**
   * Whether the FAB menu is expanded/open.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor open = false

  /**
   * Whether pressing the Escape key dismisses the FAB menu.
   * @default true
   */
  @property({ attribute: false })
  accessor closeOnEscape: boolean | undefined = true

  /**
   * Whether clicking outside the FAB menu dismisses it.
   * @default true
   */
  @property({ attribute: false })
  accessor closeOnOutsideClick: boolean | undefined = true

  /**
   * Optional callback to verify whether the FAB menu can be closed.
   * Return `false` to prevent the menu from closing.
   */
  @property({ attribute: false })
  accessor beforeClose: BeforeCloseCallback | undefined

  /**
   * Controller managing overlay stack registration and outside-click/escape dismissal.
   */
  protected overlayController = new OverlayController(this)

  @queryAssignedElements({ slot: 'trigger', flatten: true })
  private accessor explicitTriggers: HTMLElement[] = []

  @queryAssignedElements({ flatten: true })
  private accessor defaultAssignedElements: HTMLElement[] = []

  @queryAssignedElements({ slot: 'menu', flatten: true })
  private accessor assignedMenuItems: HTMLElement[] = []

  private restoreFocusOnClose = false

  protected observer?: MutationObserver

  private lastDismissReason?: OverlayDismissReason

  private closedByController = false

  constructor() {
    super()
    this.addEventListener('click', this.handleClick.bind(this))
    this.addEventListener('keydown', this.handleKeyDown.bind(this))
  }

  /**
   * Returns the primary trigger button element slotted in the component.
   */
  get trigger(): HTMLElement | null {
    if (this.explicitTriggers && this.explicitTriggers.length > 0) {
      return this.explicitTriggers[0]
    }
    const defaultEl = this.defaultAssignedElements.find(
      (el) => el instanceof HTMLElement && (!el.hasAttribute('slot') || el.getAttribute('slot') !== 'menu')
    )
    return defaultEl || null
  }

  /**
   * Returns the list of menu item elements managed by this FAB menu.
   */
  get menuItems(): HTMLElement[] {
    const items: HTMLElement[] = []
    for (const el of this.assignedMenuItems) {
      if (el instanceof HTMLElement) {
        if (el.tagName.toLowerCase().includes('button')) {
          items.push(el)
        } else {
          const subButtons = Array.from(
            el.querySelectorAll<HTMLElement>('ui-button, ui-icon-button, [role="menuitem"], [role="button"], button')
          )
          if (subButtons.length > 0) {
            items.push(...subButtons)
          } else {
            items.push(el)
          }
        }
      }
    }
    return items
  }

  /**
   * Returns the list of enabled (non-disabled) menu item elements.
   */
  get enabledMenuItems(): HTMLElement[] {
    return this.menuItems.filter((item) => !this.isElementDisabled(item))
  }

  /**
   * True if there are one or more action menu items slotted.
   */
  get hasMenu(): boolean {
    return this.menuItems.length > 0
  }

  override connectedCallback(): void {
    super.connectedCallback()

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'group')
    }

    this.setupMutationObserver()
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this.observer?.disconnect()
    this.observer = undefined
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties)

    if (changedProperties.has('open') && !this.open && Boolean(changedProperties.get('open'))) {
      const active = document.activeElement
      if (this.lastDismissReason === 'outside-click') {
        this.restoreFocusOnClose = false
      } else {
        this.restoreFocusOnClose = Boolean(active && (this.contains(active) || this.shadowRoot?.contains(active)))
      }
    }
  }

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties)
    this.updateTriggerA11y()
    this.updateItemsAnimation()
    this.updateTabIndices()
  }

  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties)
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties)

    if (changedProperties.has('open')) {
      this.handleOpenStateChange(Boolean(changedProperties.get('open')))
    }

    if (changedProperties.has('placement')) {
      this.updateItemsAnimation()
    }
  }

  /**
   * Opens the FAB menu.
   */
  show(): void {
    if (!this.open && this.hasMenu) {
      this.open = true
    }
  }

  /**
   * Closes the FAB menu, coordinating with OverlayController and pre-close guards.
   *
   * @param reason The reason triggering the close request. Defaults to 'programmatic'.
   * @param onPrevented Optional callback invoked if closure is prevented by event or guard.
   * @returns True (or Promise<true>) if closed, or false (or Promise<false>) if prevented.
   */
  hide(reason: OverlayDismissReason = 'programmatic', onPrevented?: () => void): boolean | Promise<boolean> {
    if (!this.open) {
      return true
    }

    if (this.overlayController.closing) {
      this.open = false
      return true
    }

    this.lastDismissReason = reason
    this.closedByController = true
    const result = this.overlayController.requestClose(reason, () => {
      this.closedByController = false
      onPrevented?.()
    })

    if (isPromiseLike<boolean>(result)) {
      return result.then((closed) => {
        if (!closed) {
          this.closedByController = false
        }
        return closed
      })
    }

    if (!result) {
      this.closedByController = false
    }
    return result
  }

  /**
   * Requests dismissal of the FAB menu via OverlayController, matching OverlayHost standard API.
   *
   * @param reason The reason triggering the close request. Defaults to 'programmatic'.
   * @param onPrevented Optional callback invoked if closure is prevented.
   * @returns True if closed, false if prevented, or a Promise resolving to a boolean.
   */
  requestClose(reason: OverlayDismissReason = 'programmatic', onPrevented?: () => void): boolean | Promise<boolean> {
    return this.hide(reason, onPrevented)
  }

  /**
   * Toggles the open/closed state of the FAB menu.
   */
  toggle(): void {
    if (this.open) {
      void this.hide('close-button')
    } else {
      this.show()
    }
  }

  /**
   * Supplies the event detail object for closing and close events.
   */
  getCloseEventDetail(reason: OverlayDismissReason): Record<string, unknown> {
    return { reason }
  }

  /**
   * Handles changes to the open state.
   */
  protected handleOpenStateChange(previousOpen: boolean): void {
    this.updateTriggerA11y()
    this.updateItemsAnimation()

    if (this.open) {
      this.updateTabIndices(this.trigger || undefined)
      // Focus remains on the close button (trigger) when opened while focused inside
      const active = document.activeElement
      if (active && (this.contains(active) || this.shadowRoot?.contains(active))) {
        this.trigger?.focus()
      }
      this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }))
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { open: true } }))
    } else if (previousOpen) {
      this.updateTabIndices()
      if (this.restoreFocusOnClose) {
        this.restoreFocusOnClose = false
        this.trigger?.focus()
      }
      if (!this.closedByController) {
        this.dispatchEvent(
          new CustomEvent('close', {
            bubbles: false,
            composed: false,
            detail: { reason: this.lastDismissReason ?? 'programmatic' },
          })
        )
      }
      this.closedByController = false
      this.lastDismissReason = undefined
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { open: false } }))
    }
  }

  /**
   * Checks if an element is disabled.
   */
  protected isElementDisabled(element: HTMLElement): boolean {
    if ('disabled' in element && Boolean(element.disabled)) {
      return true
    }
    if (element.hasAttribute('disabled')) {
      return true
    }
    return element.getAttribute('aria-disabled') === 'true'
  }

  /**
   * Sets up MutationObserver to detect slotted child modifications.
   */
  protected setupMutationObserver(): void {
    this.observer = new MutationObserver(() => {
      this.updateTriggerA11y()
      this.updateItemsAnimation()
      this.updateTabIndices()
    })

    this.observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'slot'],
    })
  }

  /**
   * Updates ARIA attributes on the trigger button based on menu availability and state.
   */
  protected updateTriggerA11y(): void {
    const { trigger, hasMenu, open } = this
    if (!trigger) {
      return
    }

    if (hasMenu) {
      trigger.setAttribute('aria-haspopup', 'menu')
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false')
    } else {
      trigger.removeAttribute('aria-haspopup')
      trigger.removeAttribute('aria-expanded')
    }
  }

  /**
   * True if the placement is on the top edge of the screen.
   */
  get isTopPlacement(): boolean {
    return this.placement === 'top-start' || this.placement === 'top-end'
  }

  /**
   * Calculates and assigns staggered animation delays to menu items.
   * - When placed at the bottom: items animate upwards from the item closest to the trigger up to the top item.
   * - When placed at the top: items animate downwards from the item closest to the trigger down to the bottom item.
   */
  protected updateItemsAnimation(): void {
    const items = this.menuItems
    const total = items.length
    const isTop = this.isTopPlacement

    items.forEach((item, index) => {
      // index 0 is top item; index total - 1 is bottom item
      // For bottom placement: item closest to button is total - 1 -> delay 0ms
      // For top placement: item closest to button is 0 -> delay 0ms
      const distanceFromButton = isTop ? index : total - 1 - index
      const delay = distanceFromButton * 25
      item.style.setProperty('--_item-delay', `${delay}ms`)
    })
  }

  /**
   * Updates roving tabindex on the trigger and menu items.
   *
   * When closed:
   * - Trigger has tabIndex = 0.
   * - Menu items have tabIndex = -1.
   *
   * When open:
   * - Active element has tabIndex = 0.
   * - All other elements have tabIndex = -1.
   */
  updateTabIndices(activeElement?: HTMLElement): void {
    const { trigger, menuItems } = this

    if (!this.open) {
      if (trigger) {
        trigger.tabIndex = 0
      }
      menuItems.forEach((item) => {
        item.tabIndex = -1
      })
      return
    }

    const enabledItems = this.enabledMenuItems
    let target = activeElement

    if (!target) {
      target = trigger || undefined
    }

    if (trigger) {
      trigger.tabIndex = target === trigger ? 0 : -1
    }

    enabledItems.forEach((item) => {
      item.tabIndex = target === item ? 0 : -1
    })

    // Disabled items should always have tabIndex = -1
    menuItems.forEach((item) => {
      if (this.isElementDisabled(item)) {
        item.tabIndex = -1
      }
    })
  }

  /**
   * Handles click events inside the FAB container.
   */
  protected handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null
    if (!target) {
      return
    }

    const { trigger } = this
    if (trigger && (trigger === target || trigger.contains(target))) {
      if (this.hasMenu && !this.isElementDisabled(trigger)) {
        this.toggle()
      }
      return
    }

    const clickedItem = this.menuItems.find((item) => item === target || item.contains(target))
    if (clickedItem && !this.isElementDisabled(clickedItem)) {
      this.dispatchEvent(
        new CustomEvent('select', {
          bubbles: true,
          composed: true,
          detail: { item: clickedItem },
        })
      )
      void this.hide('programmatic')
    }
  }

  /**
   * Handles keyboard navigation within the FAB and its menu.
   */
  protected handleKeyDown(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return
    }

    const { key } = event

    if (key === 'Escape') {
      if (this.open) {
        if (!this.closeOnEscape) {
          return
        }
        event.preventDefault()
        event.stopPropagation()
        void this.hide('escape')
      }
      return
    }

    if (!this.open) {
      if ((key === 'ArrowUp' || key === 'ArrowDown') && this.hasMenu) {
        const { trigger } = this
        if (
          trigger &&
          !this.isElementDisabled(trigger) &&
          (trigger === document.activeElement || trigger.contains(document.activeElement))
        ) {
          event.preventDefault()
          this.show()
        }
      }
      return
    }

    switch (key) {
      case 'ArrowDown':
        event.preventDefault()
        this.navigateDown()
        break
      case 'ArrowUp':
        event.preventDefault()
        this.navigateUp()
        break
      case 'Home':
        event.preventDefault()
        this.focusTopItem()
        break
      case 'End':
        event.preventDefault()
        this.focusTrigger()
        break
      default:
        break
    }
  }

  /**
   * Moves focus downward:
   * - If on close button (trigger): moves to the top menu item.
   * - If on a menu item: moves to the next menu item below it, wrapping to the close button.
   */
  protected navigateDown(): void {
    const enabled = this.enabledMenuItems
    const { trigger } = this

    if (enabled.length === 0) {
      return
    }

    const current = this.currentFocusedNavigable
    if (!current || current === trigger) {
      this.focusElement(enabled[0])
      return
    }

    const index = enabled.indexOf(current)
    if (index >= 0 && index < enabled.length - 1) {
      this.focusElement(enabled[index + 1])
    } else if (trigger) {
      this.focusElement(trigger)
    }
  }

  /**
   * Moves focus upward:
   * - If on close button (trigger): moves to the bottom-most menu item directly above it.
   * - If on a menu item: moves to the menu item above it, wrapping to the close button.
   */
  protected navigateUp(): void {
    const enabled = this.enabledMenuItems
    const { trigger } = this

    if (enabled.length === 0) {
      return
    }

    const current = this.currentFocusedNavigable
    if (!current || current === trigger) {
      this.focusElement(enabled[enabled.length - 1])
      return
    }

    const index = enabled.indexOf(current)
    if (index > 0) {
      this.focusElement(enabled[index - 1])
    } else if (trigger) {
      this.focusElement(trigger)
    }
  }

  /**
   * Focuses the top menu item.
   */
  protected focusTopItem(): void {
    const enabled = this.enabledMenuItems
    if (enabled.length > 0) {
      this.focusElement(enabled[0])
    }
  }

  /**
   * Focuses the trigger / close button.
   */
  protected focusTrigger(): void {
    if (this.trigger) {
      this.focusElement(this.trigger)
    }
  }

  /**
   * Focuses a navigable element and updates roving tabindex.
   */
  protected focusElement(element: HTMLElement): void {
    this.updateTabIndices(element)
    element.focus()
  }

  /**
   * Identifies which navigable element currently has focus.
   */
  protected get currentFocusedNavigable(): HTMLElement | null {
    const active = document.activeElement
    if (!active) {
      return null
    }

    const { trigger } = this
    if (trigger && (trigger === active || trigger.contains(active))) {
      return trigger
    }

    for (const item of this.enabledMenuItems) {
      if (item === active || item.contains(active)) {
        return item
      }
    }

    return null
  }

  protected handleTriggerSlotChange(): void {
    this.updateTriggerA11y()
    this.updateTabIndices()
  }

  protected handleMenuSlotChange(): void {
    this.updateTriggerA11y()
    this.updateItemsAnimation()
    this.updateTabIndices()
  }

  override render(): TemplateResult {
    return html`
      <div class="menu-container" role="menu" aria-hidden="${!this.open}">
        <slot name="menu" @slotchange=${this.handleMenuSlotChange}></slot>
      </div>
      <div class="trigger-container">
        <slot name="trigger" @slotchange=${this.handleTriggerSlotChange}>
          <slot @slotchange=${this.handleTriggerSlotChange}></slot>
        </slot>
      </div>
    `
  }
}
