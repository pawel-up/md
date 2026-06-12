import { html, PropertyValues, TemplateResult } from 'lit'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import Menu from './Menu.js'
import UiListItem from '../../list/internals/ListItem.js'
import { findElementInShadowRoots } from '../../../lib/Dom.js'
import type MenuItem from './MenuItem.js'

/**
 * Material Design 3 Sub-Menu component.
 * Extends the main Menu component to provide sub-menu functionality.
 * Uses Popover API and Anchor Positioning API for modern positioning.
 *
 * @slot - The sub-menu items
 * @fires select - Dispatched when a sub-menu item is selected
 * @fires close - Dispatched when the sub-menu is closed
 */
export default class UiSubMenu extends Menu {
  /**
   * The ID of the anchor element (parent menu item)
   * @attribute
   */
  @property({ type: String }) accessor anchor: string | undefined

  /**
   * Reference to the parent menu
   */
  parentMenu: Menu | null = null

  /**
   * Reference to the anchor element
   */
  override get menuItemAnchor(): MenuItem | null {
    if (!this.anchor) return null
    return findElementInShadowRoots(this.anchor, this) as MenuItem | null
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.setAttribute('role', 'menu')
    this.setAttribute('aria-label', 'Submenu')
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties)

    if (changedProperties.has('anchor')) {
      this.updateAnchorPositioning()
    }
  }

  /**
   * Updates anchor positioning using CSS Anchor Positioning API
   */
  protected updateAnchorPositioning(): void {
    const anchor = this.menuItemAnchor
    if (!anchor) return
    const anchorName = `--anchor-${this.id}`

    // Set anchor name on the parent menu item
    anchor.style.setProperty('anchor-name', anchorName)

    // Set anchor positioning on the submenu
    this.style.setProperty('position-anchor', anchorName)
  }

  /**
   * Shows the submenu
   */
  override show(): void {
    if (!this.menuItemAnchor) {
      return
    }

    // Update positioning before showing
    this.updateAnchorPositioning()

    // Close any other open submenus in the parent menu
    if (this.parentMenu) {
      this.parentMenu.closeSubMenu()
      this.parentMenu.setActiveSubMenu(this)
    }

    // Show the popover
    this.showPopover()
    this.open = true
    this.focus()

    this.dispatchEvent(
      new CustomEvent('open', {
        bubbles: true,
        composed: true,
        detail: { submenu: this },
      })
    )
  }

  /**
   * Hides the submenu
   */
  override hide(): void {
    super.hide()

    // Clear parent menu's active submenu reference
    const parentMenu = this.parentMenu
    if (parentMenu) {
      parentMenu.setActiveSubMenu(null)
    }
    const anchor = this.menuItemAnchor
    if (anchor) {
      anchor.closeSubMenu()
    }
  }

  /**
   * Sets the parent menu reference
   */
  setParentMenu(menu: Menu): void {
    this.parentMenu = menu
  }

  /**
   * Handles selection events - bubbles them up to parent menu
   */
  override notifySelect(item: UiListItem): boolean {
    // First hide this submenu
    this.hide()

    // If we have a parent menu, hide it too and bubble the selection
    if (this.parentMenu) {
      this.parentMenu.hide()
    }

    // Call parent implementation to dispatch the select event
    return super.notifySelect(item)
  }

  /**
   * Handles keyboard navigation specific to submenus
   */
  override handleKeydown(e: KeyboardEvent): void {
    if (!this.open || e.defaultPrevented) return

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        this.hide()
        // Return focus to parent menu item
        if (this.menuItemAnchor) {
          this.menuItemAnchor.focus()
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        this.hide()
        // Return focus to parent menu item
        if (this.menuItemAnchor) {
          this.menuItemAnchor.focus()
        }
        break
      default:
        // Let the parent handle other keys
        super.handleKeydown(e)
    }
  }

  override render(): TemplateResult {
    const classes = {
      'submenu-container': true,
      'submenu-open': this.open,
    }

    return html`
      <div class=${classMap(classes)}>
        <slot></slot>
      </div>
    `
  }
}
