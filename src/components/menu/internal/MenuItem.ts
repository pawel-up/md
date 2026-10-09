import { html, PropertyValues, TemplateResult } from 'lit'
import { property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import UiListItem from '../../list/internals/ListItem.js'
import UiSubMenu from './SubMenu.js'
import { findElementInShadowRoots } from '../../../lib/Dom.js'
import { randomId } from '../../../lib/random.js'
import type Menu from './Menu.js'

import '../../icons/ui-icon.js'

/**
 * Material Design 3 Menu Item component.
 *
 * @slot - The menu item content (label, icon, etc.)
 * @fires select - Dispatched when the menu item is selected
 * @fires submenu-open - Dispatched when a sub-menu is opened
 */
export default class UiMenuItem extends UiListItem {
  /**
   * The ID of the associated submenu
   * @attribute
   */
  @property({ type: String }) accessor submenu: string | undefined

  /**
   * Whether this menu item is selected
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor selected = false

  /**
   * The value associated with this menu item. Use it to identify value associated with the menu item,
   * when selected.
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor value: string | undefined

  /**
   * Whether to automatically show a check icon when selected
   * @attribute
   */
  @property({ type: Boolean }) accessor showSelectionIcon = false

  /**
   * Color mapping variant.
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor variant: 'standard' | 'vibrant' | undefined

  /**
   * Whether the menu item has a sub-menu
   */
  get hasSubMenu(): boolean {
    return !!this.submenu && !!this.subMenuElement
  }

  /**
   * Reference to the sub-menu element
   */
  get subMenuElement(): UiSubMenu | null {
    if (!this.submenu) return null
    return findElementInShadowRoots(this.submenu, this) as UiSubMenu | null
  }

  /**
   * Whether the sub-menu is open
   */
  @state() protected accessor subMenuOpen = false

  constructor() {
    super()
    this.addEventListener('mouseenter', this.handleMouseEnter.bind(this))
    this.addEventListener('mouseleave', this.handleMouseLeave.bind(this))
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.setAttribute('role', 'menuitem')

    // Generate ID if not present (needed for submenu anchoring)
    if (!this.id) {
      this.id = randomId()
    }

    // Initialize selection state
    this.updateSelectionState()
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties)

    if (changedProperties.has('submenu')) {
      this.updateAccessibility()
      this.setupSubmenuConnection()
    }

    if (changedProperties.has('selected')) {
      this.updateSelectionState()
    }
  }

  /**
   * Sets up the connection between this menu item and its submenu
   */
  protected async setupSubmenuConnection(): Promise<void> {
    const subMenu = this.subMenuElement
    if (subMenu) {
      await customElements.whenDefined(subMenu.localName)
      subMenu.anchor = this.id

      // Find parent menu and set it on the submenu
      const parentMenu = this.closest('ui-menu, ui-sub-menu') as Menu
      if (parentMenu) {
        subMenu.setParentMenu(parentMenu)
      }
    }
  }

  /**
   * Updates accessibility attributes
   */
  protected updateAccessibility(): void {
    if (this.hasSubMenu) {
      this.setAttribute('aria-haspopup', 'true')
      this.setAttribute('aria-expanded', String(this.subMenuOpen))
    } else {
      this.removeAttribute('aria-haspopup')
      this.removeAttribute('aria-expanded')
    }
  }

  /**
   * Updates the selection state styling and accessibility attributes
   */
  public updateSelectionState(): void {
    const parentMenu = this.closest('ui-menu, ui-sub-menu') as Menu | null
    const isMultiSelect = Boolean(parentMenu?.multiSelect)

    if (isMultiSelect) {
      this.setAttribute('role', 'menuitemcheckbox')
      this.setAttribute('aria-checked', String(this.selected))
      this.removeAttribute('aria-selected')
    } else {
      this.setAttribute('role', 'menuitem')
      if (this.selected) {
        this.setAttribute('aria-selected', 'true')
      } else {
        this.setAttribute('aria-selected', 'false')
      }
    }

    if (this.selected) {
      this.classList.add('select')
    } else {
      this.classList.remove('select')
    }
  }

  /**
   * Handles mouse enter events
   */
  protected handleMouseEnter(): void {
    if (this.hasSubMenu && !this.subMenuOpen) {
      this.openSubMenu()
    }
  }

  /**
   * Handles mouse leave events
   */
  protected handleMouseLeave(): void {
    // Close sub-menu after a delay to allow moving to sub-menu
    setTimeout(() => {
      if (this.subMenuOpen && !this.matches(':hover') && !this.subMenuElement?.matches(':hover')) {
        this.closeSubMenu()
      }
    }, 100)
  }

  /**
   * Handles click events
   */
  public override handleClick(e: MouseEvent): void {
    if (this.hasSubMenu) {
      e.preventDefault()
      e.stopPropagation()
      // If the submenu is already open (e.g. opened via hover), clicking the trigger
      // is a no-op to keep it open and prevent accidental closure when aiming to interact.
      if (!this.subMenuOpen) {
        this.openSubMenu()
      }
      return
    }
    super.handleClick(e)
  }

  /**
   * Opens the sub-menu
   */
  openSubMenu(): void {
    if (!this.hasSubMenu || this.subMenuOpen) return

    this.subMenuOpen = true
    this.updateAccessibility()
    this.subMenuElement?.show()

    this.dispatchEvent(
      new CustomEvent('submenu-open', {
        detail: { subMenu: this.subMenuElement },
        bubbles: false,
        composed: true,
      })
    )
  }

  /**
   * Closes the sub-menu
   */
  closeSubMenu(): void {
    if (!this.subMenuOpen) return

    this.subMenuOpen = false
    this.updateAccessibility()
    if (this.subMenuElement?.open) {
      this.subMenuElement.hide()
    }
  }

  /**
   * Toggles the sub-menu
   */
  toggleSubMenu(): void {
    if (this.subMenuOpen) {
      this.closeSubMenu()
    } else {
      this.openSubMenu()
    }
  }

  /**
   * Handles sub-menu item selection
   */
  protected handleSubMenuSelect(e: CustomEvent): void {
    // Bubble up the selection event
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: e.detail,
        bubbles: false,
        composed: true,
      })
    )
  }

  override render(): TemplateResult {
    const classes = {
      'surface': true,
      'menu-item': true,
      'menu-item-with-submenu': this.hasSubMenu,
      'submenu-open': this.subMenuOpen,
    }

    return html`
      ${this.renderFocusRing()} ${this.renderRipple()}
      <div class=${classMap(classes)}>${this.renderStart()} ${this.renderBody()} ${this.renderEnd()}</div>
    `
  }

  protected override renderEnd(): TemplateResult {
    return html`<div class="end">
      <slot name="end" @slotchange=${this.handleEndSlotChange}></slot>
      <span class="trailing-supporting-text"><slot name="end-text"></slot></span>
      ${this.hasSubMenu ? html`<ui-icon class="menu-item-arrow">arrow_right</ui-icon>` : ''}
    </div>`
  }

  protected override renderStart(): TemplateResult {
    const parentMenu = this.closest('ui-menu, ui-sub-menu') as Menu | null
    const isSelectable = Boolean(this.showSelectionIcon || parentMenu?.multiSelect || parentMenu?.selectOnActivate)
    const showCheckIcon = isSelectable && this.selected

    return html`<div class="start">
      ${showCheckIcon ? html`<ui-icon class="selection-check">check</ui-icon>` : ''}
      <slot name="start" @slotchange=${this.handleStartSlotChange}></slot>
    </div>`
  }
}
