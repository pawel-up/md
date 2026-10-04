import { html, LitElement, TemplateResult } from 'lit'
import { property } from 'lit/decorators.js'
import { bound } from '../../../decorators/bound.js'
import type UiMenuItem from './MenuItem.js'

/**
 * Material Design 3 Menu Group component.
 * Groups related menu items into distinct visual cards separated by gaps,
 * providing semantic WAI-ARIA group semantics and optional section headers.
 *
 * ## Accessibility:
 * The component automatically sets `role="group"`. Consumers are responsible for
 * providing an accessible label directly on the element (e.g. `aria-label="Actions"`
 * or `aria-labelledby="header-id"`) so screen readers and accessibility evaluators
 * (like axe-core) can properly identify the group.
 *
 * ## Use when:
 * - Visually and semantically bundling related menu items together in an expressive layout.
 * - Providing a divider-less separation between clusters of actions.
 *
 * ## Don't use when:
 * - Displaying scrollable menus where dividers are preferred over gaps.
 * - Wrapping non-menu components outside of a menu hierarchy.
 *
 * @fires group-items-change - Dispatched when the group's slotted items change
 */
export default class MenuGroup extends LitElement {
  /**
   * Density level of the menu group and its items (web only).
   * Valid values are '0' (default, 48px), '-1' (44px), '-2' (40px), '-3' (36px).
   * Inherited from parent `<ui-menu>` if not set.
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor density: '0' | '-1' | '-2' | '-3' | undefined

  /**
   * Color mapping variant.
   * - 'standard': Surface-based color mapping (default)
   * - 'vibrant': Tertiary-based color mapping
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor variant: 'standard' | 'vibrant' | undefined

  override connectedCallback(): void {
    super.connectedCallback()
    this.setAttribute('role', 'group')
  }

  /**
   * Returns all menu item elements slotted inside this group.
   */
  get items(): UiMenuItem[] {
    const slot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement | null
    if (!slot) return []
    return Array.from(slot.assignedElements({ flatten: true })).filter((el): el is UiMenuItem =>
      el.matches('ui-menu-item')
    )
  }

  /**
   * Handles slot changes and notifies the parent menu to re-index items.
   */
  @bound
  protected handleSlotChange(): void {
    this.dispatchEvent(
      new CustomEvent('group-items-change', {
        bubbles: true,
        composed: true,
      })
    )
  }

  override render(): TemplateResult {
    return html`
      <div class="menu-group-container">
        <slot name="header"></slot>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `
  }
}
