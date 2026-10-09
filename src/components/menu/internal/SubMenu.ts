import { html, PropertyValues, TemplateResult } from 'lit'
import { property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import Menu from './Menu.js'
import UiListItem from '../../list/internals/ListItem.js'
import { findElementInShadowRoots } from '../../../lib/Dom.js'
import type MenuItem from './MenuItem.js'
import { positionOverlay } from '../../../lib/ElementPositioning.js'
import { type OverlayDismissReason } from '../../../controllers/OverlayController.js'

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

  protected override get defaultPopover(): 'auto' | 'manual' {
    return 'manual'
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.setAttribute('role', 'menu')
    this.setAttribute('aria-label', 'Submenu')
    if (this.getAttribute('popover') !== 'manual') {
      this.setAttribute('popover', 'manual')
    }
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

    // Submenus require popover="manual" to avoid native light-dismiss on parent anchor interaction
    if (this.getAttribute('popover') !== 'manual') {
      this.setAttribute('popover', 'manual')
    }

    // Close any other open submenus in the parent menu
    if (this.parentMenu && this.parentMenu.activeSubMenu !== this) {
      this.parentMenu.closeSubMenu()
      this.parentMenu.setActiveSubMenu(this)
    }

    // Show the popover
    this.showPopover()
    this.focus()
  }

  /**
   * Hides the submenu.
   *
   * @param reason The dismiss reason triggering the closure. Defaults to 'programmatic'.
   * @returns True if closed, false if prevented, or a Promise resolving to a boolean.
   */
  override hide(reason: OverlayDismissReason = 'programmatic'): boolean | Promise<boolean> {
    return super.hide(reason)
  }

  /**
   * Cleans up internal submenu state, clears parent submenu reference,
   * resets anchor menu item state, and restores focus if needed.
   */
  protected override cleanupPopoverState(): void {
    const shouldRestoreFocus = this.matches(':focus-within') || this.contains(document.activeElement)
    super.cleanupPopoverState()
    const parentMenu = this.parentMenu
    if (parentMenu && parentMenu.activeSubMenu === this) {
      parentMenu.setActiveSubMenu(null)
    }
    const anchor = this.menuItemAnchor
    if (anchor) {
      anchor.closeSubMenu()
      if (shouldRestoreFocus) {
        anchor.focus()
      }
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
    // Call parent implementation to dispatch the select event and hide this submenu
    const result = super.notifySelect(item)

    // If we have a parent menu, hide it too
    if (this.parentMenu) {
      void this.parentMenu.hide('programmatic')
    }

    return result
  }

  /**
   * Handles keyboard navigation specific to submenus
   */
  override handleKeydown(e: KeyboardEvent): void {
    if (!this.open || e.defaultPrevented) return

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        e.stopImmediatePropagation()
        if (this.closeOnEscape) {
          void this.hide('escape')
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        void this.hide('programmatic')
        break
      default:
        if (e.defaultPrevented) return
        // Let the parent handle other keys
        super.handleKeydown(e)
    }
  }

  /**
   * Positions the sub-menu relative to its anchor (parent menu item).
   * Overrides the parent implementation to handle sub-menu specific fallback positioning
   * where vertical alignment needs to align top/bottom edges of the menu item and submenu
   * (no vertical overlap), while horizontal alignment needs to place the submenu adjacent to the right/left
   * of the parent menu item.
   */
  override positionMenu(): void {
    const supportsAnchor =
      'anchorName' in document.documentElement.style || 'positionAnchor' in document.documentElement.style
    const anchorEl = this.menuItemAnchor

    if (!supportsAnchor && anchorEl) {
      // Clear measurements class just in case
      this.classList.remove('measurements')
      // Reset any previous manual positioning to start clean
      this.style.removeProperty('min-width')

      // Get separate style sets for vertical and horizontal alignments to avoid IPositioningOptions.noOverlap conflict
      const verticalStyles = positionOverlay(this, anchorEl, {
        vertical: 'auto',
        noOverlap: false,
        constrain: true,
        constrainPaddingY: 20,
      })

      const horizontalStyles = positionOverlay(this, anchorEl, {
        horizontal: 'auto',
        noOverlap: true,
        constrain: true,
      })

      const styles = {
        top: verticalStyles.top,
        maxHeight: verticalStyles.maxHeight,
        overflowY: verticalStyles.overflowY,
        left: horizontalStyles.left,
        maxWidth: horizontalStyles.maxWidth,
        overflowX: horizontalStyles.overflowX,
      }

      Object.entries(styles).forEach(([key, val]) => {
        if (val !== undefined) {
          this.style.setProperty(key, val as string)
        }
      })

      if (styles.maxWidth) {
        this.style.minWidth = '0px'
      }

      // Decides animation origin class based on whether the submenu is positioned above or below
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

    super.positionMenu()
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
