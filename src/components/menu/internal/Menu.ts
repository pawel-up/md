import { html, PropertyValues, TemplateResult } from 'lit'
import { property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { randomId } from '../../../lib/random.js'
import UiList, { type UiListItemsChange } from '../../list/internals/List.js'
import type UiMenuItem from './MenuItem.js'
import type UiSubMenu from './SubMenu.js'
import { setDisabled } from '../../../lib/disabled.js'
import UiListItem from '../../list/internals/ListItem.js'
import { bound } from '../../../decorators/bound.js'
import { positionOverlay } from '../../../lib/ElementPositioning.js'
import * as ScrollHelper from '../../../lib/ScrollHelper.js'
import type MenuItem from './MenuItem.js'
import {
  OverlayController,
  isPromiseLike,
  type OverlayHost,
  type BeforeCloseCallback,
  type OverlayDismissReason,
} from '../../../controllers/OverlayController.js'

/**
 * Material Design 3 Menu component with sub-menu support.
 * Uses Popover API and Anchor Positioning API for modern positioning,
 * and integrates with OverlayController for unified overlay stack management and pre-close lifecycle hooks.
 *
 * ## Use when:
 * - Displaying contextual action menus, dropdown lists, or hierarchical options.
 * - Needing coordinated overlay stack behavior where Escape dismisses in LIFO order.
 * - Needing cancelable close lifecycle hooks (`closing`, `close`, `beforeClose`).
 *
 * ## Don't use when:
 * - Displaying static non-collapsible lists; use `ui-list` instead.
 * - Building modal dialogs with complex forms; use `ui-dialog` instead.
 *
 * @fires select - Dispatched when a menu item is selected
 * @fires open - Dispatched when the menu is opened
 * @fires closing - Cancelable event dispatched before the menu closes
 * @fires close - Dispatched when the menu is closed
 */
export default class Menu extends UiList implements OverlayHost {
  /**
   * Whether the menu is currently open.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor open = false

  /**
   * Whether pressing Escape dismisses the menu.
   *
   * @attribute
   * @default true
   */
  @property({ type: Boolean }) accessor closeOnEscape = true

  /**
   * Whether clicking outside the menu dismisses it.
   *
   * @attribute
   * @default true
   */
  @property({ type: Boolean }) accessor closeOnOutsideClick = true

  /**
   * Optional callback to verify whether the menu can be closed.
   * Returning false (or a Promise resolving to false) prevents dismissal.
   */
  @property({ attribute: false }) accessor beforeClose: BeforeCloseCallback | undefined

  /**
   * Controller managing overlay stack registration, Escape key, and outside click dismissal.
   */
  protected overlayController = new OverlayController(this)

  /**
   * Optional anchor element to position relative to in case CSS Anchor Positioning is not supported.
   */
  @property({ attribute: false }) accessor positionAnchor: HTMLElement | undefined

  /**
   * Whether the menu is disabled
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor disabled = false

  /**
   * Whether to select menu items when they are activated.
   * When true, clicking or pressing Enter/Space on a menu item will mark it as selected.
   * When false (default), menu items will not be marked as selected when activated.
   *
   * Note, this is different than `selectActive` as this property controls the class names
   * set on the menu item.
   * @attribute
   */
  @property({ type: Boolean }) accessor selectOnActivate = false

  /**
   * Whether the menu allows selecting multiple items.
   * Multi-select menus remain open when items are activated.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor multiSelect = false

  /**
   * Density level of the menu items (web only).
   * Valid values are '0' (default, 48px), '-1' (44px), '-2' (40px), '-3' (36px).
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor density: '0' | '-1' | '-2' | '-3' = '0'

  /**
   * Color mapping variant.
   * - 'standard': Surface-based color mapping (default)
   * - 'vibrant': Tertiary-based color mapping with higher visual emphasis
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor variant: 'standard' | 'vibrant' = 'standard'

  /**
   * Currently active sub-menu
   */
  @state() accessor activeSubMenu: UiSubMenu | null = null

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  get menuItemAnchor(): MenuItem | null {
    // It is here so the SubMenu can override it and set the anchor element
    return null
  }

  constructor() {
    super()
    this.selector = 'ui-menu-item'
    this.addEventListener('beforetoggle', this.handleBeforeToggle)
    this.addEventListener('group-items-change', this.handleGroupItemsChange)
  }

  @bound
  protected handleGroupItemsChange(): void {
    this.updateItems()
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.setAttribute('role', 'menu')
    this.setAttribute('tabindex', '-1')
    if (!this.hasAttribute('popover')) {
      this.setAttribute('popover', 'auto')
    }
    if (!this.id) {
      this.id = randomId()
    }
    this.ariaExpanded = String(this.open)
    if (this.open && !this.matches(':popover-open')) {
      this.showPopover()
    }
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties)

    if (changedProperties.has('disabled')) {
      setDisabled(this, this.disabled)
    }

    if (changedProperties.has('multiSelect')) {
      this.queryMenuItems().forEach((item) => {
        item.updateSelectionState()
        item.requestUpdate()
      })
    }

    if (changedProperties.has('density')) {
      this.syncDensity()
    }

    if (changedProperties.has('variant')) {
      this.syncVariant()
    }

    if (changedProperties.has('open')) {
      this.ariaExpanded = String(this.open)
      this.tabIndex = this.open ? 0 : -1
      if (this.open) {
        if (this.isConnected && !this.matches(':popover-open')) {
          this.showPopover()
        }
      } else {
        this.performHidePopover()
      }
    }
  }

  /**
   * Determines whether the given node is contained within this menu,
   * its active submenu, its position anchor, or its parent component host (e.g. UiSelect).
   *
   * @param node The node to check.
   * @returns True if the node belongs to this overlay tree.
   */
  containsOverlayNode(node: Node): boolean {
    if (this.contains(node)) {
      return true
    }
    const shadowRoot = this.shadowRoot
    if (shadowRoot && shadowRoot.contains(node)) {
      return true
    }
    if (this.activeSubMenu && this.activeSubMenu.containsOverlayNode(node)) {
      return true
    }
    const anchor = this.positionAnchor || this.menuItemAnchor
    if (anchor && (anchor === node || anchor.contains(node))) {
      return true
    }
    const root = this.getRootNode()
    if (root instanceof ShadowRoot && root.host.localName === 'ui-select') {
      if (root.contains(node) || root.host.contains(node)) {
        return true
      }
    }
    return false
  }

  override togglePopover(force?: boolean): boolean {
    const shouldOpen = force !== undefined ? force : !this.open
    if (shouldOpen) {
      if (this.disabled) {
        return false
      }
      this.show()
      return true
    } else {
      const closed = this.hide()
      if (isPromiseLike<boolean>(closed)) {
        void closed.then((didClose) => {
          if (!didClose) {
            this.reopenNativePopover()
          }
        })
        return false
      }
      return !closed
    }
  }

  protected queryMenuItems(): UiMenuItem[] {
    if (this.items && this.items.length > 0) {
      return this.items as UiMenuItem[]
    }
    const slot = this.shadowRoot?.querySelector('slot')
    if (!slot) return []
    const assigned = slot.assignedElements({ flatten: true })
    const items: UiMenuItem[] = []
    for (const el of assigned) {
      if (el.matches(this.selector)) {
        items.push(el as UiMenuItem)
      } else if (el.localName === 'ui-menu-group') {
        const group = el as HTMLElement & { items?: UiMenuItem[] }
        if (group.items) {
          items.push(...group.items)
        } else {
          items.push(...(Array.from(group.querySelectorAll(this.selector)) as UiMenuItem[]))
        }
      }
    }
    return items
  }

  protected override updateItems(): void {
    const elements = this.assignedElements || []
    const items: UiMenuItem[] = []
    let hasGroups = false

    for (const el of elements) {
      if (this.isListItem(el)) {
        items.push(el as UiMenuItem)
      } else if (el.localName === 'ui-menu-group') {
        hasGroups = true
        const group = el as HTMLElement & { items?: UiMenuItem[] }
        if (group.items && Array.isArray(group.items)) {
          items.push(...group.items)
        } else {
          items.push(...(Array.from(group.querySelectorAll(this.selector)) as UiMenuItem[]))
        }
      }
    }

    this.toggleAttribute('has-groups', hasGroups)
    this.items = items

    if (this.delegateFocus) {
      items.forEach((item) => item.removeAttribute('tabindex'))
    }
    if (this.activeListItem && !items.includes(this.activeListItem as UiMenuItem)) {
      this.activeListItem = null
    }
    if (this.highlightListItem && !items.includes(this.highlightListItem as UiMenuItem)) {
      this.highlightListItem = null
    }
    this.updateChildrenVisibility()
    this.syncDensity()
    this.syncVariant()
    this.dispatchEvent(
      new CustomEvent<UiListItemsChange>('itemschange', { bubbles: false, composed: false, detail: { items } })
    )
  }

  /**
   * Synchronizes density setting down to slotted items and groups.
   */
  protected syncDensity(): void {
    const { density } = this
    const elements = this.assignedElements || []
    for (const el of elements) {
      if (el.localName === 'ui-menu-group') {
        const group = el as HTMLElement & { density?: '0' | '-1' | '-2' | '-3' }
        group.density = density
      }
    }
    const items = this.queryMenuItems()
    for (const item of items) {
      item.density = density
    }
  }

  /**
   * Synchronizes color variant setting down to slotted items and groups.
   */
  protected syncVariant(): void {
    const { variant } = this
    const elements = this.assignedElements || []
    for (const el of elements) {
      if (el.localName === 'ui-menu-group') {
        const group = el as HTMLElement & { variant?: 'standard' | 'vibrant' }
        group.variant = variant
      }
    }
    const items = this.queryMenuItems()
    for (const item of items) {
      item.variant = variant
    }
  }

  /**
   * Shows the menu popover.
   */
  show(): void {
    this.showPopover()
  }

  /**
   * Hides the menu.
   *
   * @param reason The dismiss reason triggering the closure. Defaults to 'programmatic'.
   * @returns True if closed, false if prevented, or a Promise resolving to a boolean.
   */
  hide(reason: OverlayDismissReason = 'programmatic'): boolean | Promise<boolean> {
    return this.hidePopover(reason)
  }

  /**
   * Closes the menu. Alias for `hide()`.
   *
   * @param reason The dismiss reason triggering the closure. Defaults to 'programmatic'.
   * @returns True if closed, false if prevented, or a Promise resolving to a boolean.
   */
  close(reason: OverlayDismissReason = 'programmatic'): boolean | Promise<boolean> {
    return this.hide(reason)
  }

  /**
   * Requests dismissal of the menu via OverlayController,
   * firing cancelable closing events and evaluating beforeClose guards.
   *
   * @param reason The reason triggering the close request. Defaults to 'programmatic'.
   * @param onPrevented Optional callback invoked if dismissal is prevented.
   * @returns True if closed, false if prevented, or a Promise resolving to a boolean.
   */
  requestClose(reason: OverlayDismissReason = 'programmatic', onPrevented?: () => void): boolean | Promise<boolean> {
    return this.overlayController.requestClose(reason, onPrevented)
  }

  /**
   * Shows the menu popover and registers with the overlay stack.
   */
  override showPopover(): void {
    if (this.open && this.matches(':popover-open')) {
      return
    }
    this.tabIndex = 0 // Make menu focusable
    this.ariaExpanded = 'true'
    this.positionMenu()
    super.showPopover()
    this.open = true
    this.focus()
    this.dispatchEvent(new CustomEvent('open'))

    // Add scroll/resize listeners for fallback positioning
    const supportsAnchor =
      'anchorName' in document.documentElement.style || 'positionAnchor' in document.documentElement.style
    const anchorEl = this.positionAnchor || this.menuItemAnchor
    if (!supportsAnchor && anchorEl) {
      ScrollHelper.addListeners(this, this.positionMenu.bind(this))
    }
  }

  /**
   * Hides the menu popover.
   * Coordinates dismissal with OverlayController, respecting beforeClose guards and cancelable events.
   *
   * @param reason Optional dismiss reason. Defaults to 'programmatic'.
   * @returns True if closed, false if prevented, or a Promise resolving to a boolean.
   */
  override hidePopover(reason: OverlayDismissReason = 'programmatic'): boolean | Promise<boolean> {
    if (!this.open && !this.matches(':popover-open')) {
      return true
    }

    if (this.overlayController.closing) {
      this.performHidePopover()
      return true
    }

    const result = this.overlayController.requestClose(reason)
    if (isPromiseLike<boolean>(result)) {
      return result.then((closed) => {
        if (closed) {
          this.performHidePopover()
        }
        return closed
      })
    }

    if (result) {
      this.performHidePopover()
    }
    return result
  }

  /**
   * Performs DOM cleanup and native popover hiding.
   */
  protected performHidePopover(): void {
    this.tabIndex = -1
    this.ariaExpanded = 'false'
    this.open = false
    this.closeSubMenu()
    if (this.matches(':popover-open')) {
      try {
        super.hidePopover()
      } catch {
        // Ignored if popover was already hidden
      }
    }
    ScrollHelper.removeListeners(this)
  }

  positionMenu(): void {
    const supportsAnchor =
      'anchorName' in document.documentElement.style || 'positionAnchor' in document.documentElement.style
    const anchorEl = this.positionAnchor || this.menuItemAnchor

    if (!supportsAnchor && anchorEl) {
      // Clear measurements class just in case
      this.classList.remove('measurements')
      // Reset any previous manual positioning to start clean
      this.style.removeProperty('min-width')
      const styles = positionOverlay(this, anchorEl, {
        vertical: 'auto',
        horizontal: 'auto',
        noOverlap: true,
        constrain: true,
        constrainPaddingY: 20,
      })
      Object.entries(styles).forEach(([key, val]) => {
        if (val !== undefined) {
          this.style.setProperty(key, val as string)
        }
      })
      if (styles.maxWidth) {
        this.style.minWidth = '0px'
      }

      // Get the rect after positioning to decide animation class (positioned above/below)
      const box = this.getBoundingClientRect()
      const viewportMiddle = innerHeight / 2
      const isMenuInUpperHalf = box.top < viewportMiddle
      if (isMenuInUpperHalf) {
        this.classList.add('menu-positioned-below')
        this.classList.remove('menu-positioned-above')
      } else {
        this.classList.add('menu-positioned-above')
        this.classList.remove('menu-positioned-below')
      }
      return
    }

    // for the frame, make the element visible (without animations)
    // to take measurements correctly.
    this.classList.add('measurements')

    // Reset any previous manual positioning to let CSS anchor positioning work
    this.style.removeProperty('position-area')
    this.style.removeProperty('max-height')
    this.style.removeProperty('max-width')
    this.style.removeProperty('min-width')

    // Let CSS anchor positioning handle the positioning automatically
    // Only intervene if we need to set max-height for overflow cases
    const box = this.getBoundingClientRect()
    this.classList.remove('measurements')

    // Check if the menu content is being clipped
    const isVerticallyClipped = this.scrollHeight > this.clientHeight
    const isHorizontallyClipped = this.scrollWidth > this.clientWidth

    // Get the actual bottom and right edges of the menu
    const menuBottom = box.top + box.height
    const menuRight = box.left + box.width

    // Detect if menu is positioned above or below the anchor
    // by checking if the menu is in the upper or lower half of the viewport
    const viewportMiddle = innerHeight / 2
    const isMenuInUpperHalf = box.top < viewportMiddle

    // Add CSS class to control animation direction
    if (isMenuInUpperHalf) {
      this.classList.add('menu-positioned-below')
      this.classList.remove('menu-positioned-above')
    } else {
      this.classList.add('menu-positioned-above')
      this.classList.remove('menu-positioned-below')
    }
    // Only set max-height if the menu would overflow the viewport OR is already clipped
    if (menuBottom > innerHeight || isVerticallyClipped) {
      let availableHeight: number

      if (isMenuInUpperHalf) {
        // Menu is positioned below the anchor - available space is from top to bottom of viewport
        availableHeight = innerHeight - box.top
      } else {
        // Menu is positioned above the anchor - available space is from top of viewport to bottom of menu
        availableHeight = box.top + box.height
      }

      this.style.maxHeight = `${Math.max(200, availableHeight - 20)}px`
    }

    // Only set max-width if the menu would overflow the viewport OR is already clipped
    let availableWidth = innerWidth
    let hasOverflow = false

    if (box.left < 0 && menuRight > innerWidth) {
      availableWidth = innerWidth
      hasOverflow = true
    } else if (box.left < 0) {
      availableWidth = box.right
      hasOverflow = true
    } else if (menuRight > innerWidth) {
      availableWidth = innerWidth - box.left
      hasOverflow = true
    }

    if (hasOverflow || isHorizontallyClipped) {
      const maxWidth = Math.max(180, availableWidth - 20)
      this.style.maxWidth = `${maxWidth}px`
      this.style.minWidth = '0px'
    }
  }

  /**
   * Handles beforetoggle event from popover
   */
  /**
   * Reopens native popover when closure was prevented by an event or beforeClose guard.
   */
  private reopenNativePopover(): void {
    queueMicrotask(() => {
      if (this.open && !this.matches(':popover-open') && this.isConnected) {
        try {
          super.showPopover()
        } catch {
          // Ignored if popover cannot be reopened in current DOM state
        }
      }
    })
  }

  /**
   * Handles beforetoggle event from native popover API.
   * Reopens native popover if closure is prevented by closing event or beforeClose guard.
   */
  @bound
  protected handleBeforeToggle(e: Event): void {
    const toggleEvent = e as ToggleEvent
    if (toggleEvent.newState === 'closed') {
      if (this.overlayController.closing) {
        this.performHidePopover()
        return
      }

      if (this.open) {
        if (!this.closeOnOutsideClick) {
          this.reopenNativePopover()
          return
        }

        const closed = this.overlayController.requestClose('outside-click', () => {
          this.reopenNativePopover()
        })

        if (isPromiseLike<boolean>(closed)) {
          void closed.then((didClose) => {
            if (!didClose) {
              this.reopenNativePopover()
            } else {
              this.performHidePopover()
            }
          })
          return
        }

        if (!closed) {
          this.reopenNativePopover()
          return
        }
      }

      this.performHidePopover()
    }
  }

  /**
   * Handles keyboard navigation for the menu
   */
  override handleKeydown(e: KeyboardEvent): void {
    if (!this.open || e.defaultPrevented) return

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        e.stopImmediatePropagation()
        if (this.activeSubMenu) {
          void this.activeSubMenu.hide('escape')
          break
        }
        if (this.closeOnEscape) {
          void this.hide('escape')
        }
        break
      case 'ArrowRight':
        e.preventDefault()
        this.openSubMenu()
        break
      case 'ArrowLeft':
        e.preventDefault()
        this.closeSubMenu()
        break
      default:
        if (e.defaultPrevented) return
        // Let the parent UiList handle other keys
        super.handleKeydown(e)
    }
  }

  @bound
  handleSubMenuSelect(e: CustomEvent): void {
    super.notifySelect(e.detail.item, e.detail.index)
  }

  /**
   * Opens the sub-menu for the currently active item
   */
  protected openSubMenu(): void {
    const activeItem = this.activeListItem as UiMenuItem
    if (activeItem?.hasSubMenu) {
      activeItem.openSubMenu()
    }
  }

  /**
   * Closes the currently open sub-menu
   */
  closeSubMenu(): void {
    if (this.activeSubMenu) {
      this.activeSubMenu.removeEventListener('select', this.handleSubMenuSelect as EventListener)
      this.activeSubMenu.hide()
      this.activeSubMenu = null
    }
  }

  /**
   * Sets the active sub-menu
   */
  setActiveSubMenu(subMenu: UiSubMenu | null): void {
    if (this.activeSubMenu && this.activeSubMenu !== subMenu) {
      this.activeSubMenu.removeEventListener('select', this.handleSubMenuSelect as EventListener)
    }
    this.activeSubMenu = subMenu
    subMenu?.addEventListener('select', this.handleSubMenuSelect as EventListener)
  }

  override notifySelect(item: UiListItem & { selected?: boolean }, index?: number): boolean {
    if (this.multiSelect) {
      item.selected = !item.selected
      ;(item as UiMenuItem).updateSelectionState?.()
      item.requestUpdate()
      return super.notifySelect(item, index)
    }

    // Only handle selection if selectOnActivate is enabled
    if (this.selectOnActivate) {
      this.clearSelection()
      item.selected = true
    }
    const result = super.notifySelect(item, index)
    this.hide()
    return result
  }

  /**
   * Clears selection from all menu items
   */
  protected clearSelection(): void {
    const items = this.queryMenuItems()
    items.forEach((menuItem) => {
      menuItem.selected = false
    })
  }

  /**
   * Gets the currently selected menu item (for single-select menus)
   */
  get selectedItem(): UiMenuItem | null {
    const items = this.queryMenuItems()
    return items.find((item) => item.selected) || null
  }

  /**
   * Gets all currently selected menu items (for multi-select menus)
   */
  get selectedItems(): UiMenuItem[] {
    const items = this.queryMenuItems()
    return items.filter((item) => item.selected)
  }

  /**
   * Sets the selected menu item
   */
  setSelectedItem(item: UiMenuItem | null): void {
    this.clearSelection()
    if (item) {
      item.selected = true
    }
  }

  /**
   * Handles sub-menu opening
   */
  protected handleSubMenuOpen(e: CustomEvent): void {
    const subMenu = e.detail.subMenu
    this.setActiveSubMenu(subMenu)
  }

  /**
   * Handles slot changes to update menu items
   */
  protected handleSlotChange(): void {
    // Update the items list when slot content changes
    this.updateItems()
  }

  override render(): TemplateResult {
    const classes = {
      'menu-container': true,
    }

    return html`
      <div class=${classMap(classes)}>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `
  }
}
