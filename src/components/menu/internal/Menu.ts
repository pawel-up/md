import { html, PropertyValues, TemplateResult } from 'lit'
import { property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { nanoid } from '@api-client/core/nanoid.js'
import UiList from '../../list/internals/List.js'
import UiMenuItem from './MenuItem.js'
import UiSubMenu from './SubMenu.js'
import { setDisabled } from '../../../lib/disabled.js'
import UiListItem from '../../list/internals/ListItem.js'
import { bound } from '../../../decorators/bound.js'

/**
 * Material Design 3 Menu component with sub-menu support.
 * Uses Popover API and Anchor Positioning API for modern positioning.
 *
 * @fires select - Dispatched when a menu item is selected
 * @fires close - Dispatched when the menu is closed
 * @fires open - Dispatched when the menu is opened
 */
export default class Menu extends UiList {
  /**
   * Whether the menu is currently open
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor open = false

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
   * Currently active sub-menu
   */
  @state() accessor activeSubMenu: UiSubMenu | null = null

  constructor() {
    super()
    this.selector = 'ui-menu-item'
    this.addEventListener('beforetoggle', this.handleBeforeToggle.bind(this))
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.setAttribute('role', 'menu')
    this.setAttribute('tabindex', '-1')
    if (!this.hasAttribute('popover')) {
      this.setAttribute('popover', 'auto')
    }
    if (!this.id) {
      this.id = nanoid()
    }
    this.ariaExpanded = 'false'
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties)

    if (changedProperties.has('disabled')) {
      setDisabled(this, this.disabled)
    }
  }

  override togglePopover(force?: boolean): boolean {
    if (!this.open && !this.disabled) {
      this.positionMenu()
    }
    this.open = !this.open
    this.ariaExpanded = String(this.open)
    this.tabIndex = this.open ? 0 : -1
    const result = super.togglePopover(force)
    if (this.open) {
      this.focus()
    }
    return result
  }

  protected queryMenuItems(): UiMenuItem[] {
    const slot = this.shadowRoot?.querySelector('slot')
    if (!slot) return []
    const { selector } = this
    return Array.from(slot.assignedElements({ flatten: true })).filter((el) => el.matches(selector)) as UiMenuItem[]
  }

  show(): void {
    this.showPopover()
  }

  hide(): void {
    this.hidePopover()
  }

  /**
   * Shows the menu
   */
  override showPopover(): void {
    this.tabIndex = 0 // Make menu focusable
    this.ariaExpanded = 'true'
    this.positionMenu()
    super.showPopover()
    this.open = true
    this.focus()
    this.dispatchEvent(new CustomEvent('open'))
  }

  /**
   * Hides the menu
   */
  override hidePopover(): void {
    this.tabIndex = -1
    this.ariaExpanded = 'false'
    super.hidePopover()
    this.open = false
    this.closeSubMenu()
    this.dispatchEvent(new CustomEvent('close'))
  }

  positionMenu(): void {
    // for the frame, make the element visible (without animations)
    // to take measurements correctly.
    this.classList.add('measurements')

    // Reset any previous manual positioning to let CSS anchor positioning work
    this.style.removeProperty('position-area')
    this.style.removeProperty('max-height')
    this.style.removeProperty('max-width')

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

    // console.log(`Menu positioned at: top=${box.top}, left=${box.left}, bottom=${menuBottom}, right=${menuRight}`)
    // console.log(
    // eslint-disable-next-line max-len
    //   `Menu is in upper half: ${isMenuInUpperHalf}, Vertically clipped: ${isVerticallyClipped}, Horizontally clipped: ${isHorizontallyClipped}`
    // )
    // Add CSS class to control animation direction
    if (isMenuInUpperHalf) {
      this.classList.add('menu-positioned-above')
      this.classList.remove('menu-positioned-below')
    } else {
      this.classList.add('menu-positioned-below')
      this.classList.remove('menu-positioned-above')
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
    if (menuRight > innerWidth || isHorizontallyClipped) {
      const availableWidth = innerWidth - box.left
      if (availableWidth < 200) {
        this.style.maxWidth = `${Math.max(180, availableWidth - 20)}px`
      }
    }
  }

  /**
   * Handles beforetoggle event from popover
   */
  protected handleBeforeToggle(e: Event): void {
    const toggleEvent = e as ToggleEvent
    if (toggleEvent.newState === 'closed') {
      this.open = false
      this.closeSubMenu()
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
        this.hide()
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
    this.activeSubMenu = subMenu
    subMenu?.addEventListener('select', this.handleSubMenuSelect as EventListener)
  }

  override notifySelect(item: UiListItem & { selected?: boolean }, index?: number): boolean {
    // Only handle selection if selectOnActivate is enabled
    if (this.selectOnActivate) {
      this.clearSelection()
      item.selected = true
    }
    this.hide()
    return super.notifySelect(item, index)
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
   * Gets the currently selected menu item
   */
  get selectedItem(): UiMenuItem | null {
    const items = this.queryMenuItems()
    return items.find((item) => item.selected) || null
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
