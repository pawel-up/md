import { html, PropertyValues, TemplateResult } from 'lit'
import { property } from 'lit/decorators.js'
import { ClassInfo, classMap } from 'lit/directives/class-map.js'
import UiListItem, { ListItemLines } from '../../list/internals/ListItem.js'
import { nanoid } from '@api-client/core/nanoid.js'

/**
 * Material Design 3 Select Option component.
 *
 * The `ui-option` component represents a selectable item within a `ui-select` dropdown.
 * It extends `UiListItem` to provide consistent styling and behavior with other list components.
 *
 * @slot - The option content (label, icon, etc.)
 * @slot start - Content to display at the start of the option (icon, avatar, etc.)
 * @slot end - Content to display at the end of the option
 * @slot supporting-text - Supporting text below the main content
 * @fires select - Dispatched when the option is selected. Contains `{ item: UiOption, value: string }` in detail
 *
 * @example
 * Basic option
 * ```html
 * <ui-option value="apple">Apple</ui-option>
 * ```
 *
 * @example
 * Option with supporting text
 * ```html
 * <ui-option value="john" lines="two">
 *   John Doe
 *   <span slot="supporting-text">john@example.com</span>
 * </ui-option>
 * ```
 */
export default class UiOption extends UiListItem {
  /**
   * The value associated with this option. Used to identify the option when selected.
   * This value is what gets set on the parent select element when this option is chosen.
   *
   * @example
   * ```html
   * <ui-option value="apple">Apple</ui-option>
   * <ui-option value="banana">Banana</ui-option>
   * ```
   */
  @property({ type: String, reflect: true }) accessor value: string | undefined

  /**
   * Whether this option is currently selected. This is typically managed automatically
   * by the parent select component, but can be set manually for styling purposes.
   *
   * @default false
   * @example
   * ```html
   * <ui-option value="apple" selected>Apple</ui-option>
   * ```
   */
  @property({ type: Boolean, reflect: true }) accessor selected = false

  /**
   * Returns the text representation of this option for display purposes.
   * This method extracts and combines text content from all child nodes,
   * including special handling for ui-icon elements.
   *
   * @readonly
   * @returns {string} The rendered text value of the option
   * @example
   * ```javascript
   * const option = document.querySelector('ui-option');
   * console.log('Option text:', option.renderValue);
   * ```
   */
  get renderValue(): string {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])')
    if (!slot) return this.value || ''
    const nodes = slot.assignedNodes({ flatten: true })
    const content: string[] = []
    for (const node of nodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        content.push(node.textContent || '')
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement
        if (element.tagName.toLowerCase() === 'ui-icon') {
          content.push(element.getAttribute('icon') || '')
        } else {
          content.push(element.textContent || '')
        }
      }
    }
    return content.join(' ').trim() || this.value || ''
  }

  constructor() {
    super()
    this.lines = ListItemLines.auto
  }

  /**
   * Initializes the option when it's connected to the DOM. Sets up ARIA attributes
   * and generates a unique ID if one isn't provided.
   */
  override connectedCallback(): void {
    super.connectedCallback()
    this.setAttribute('role', 'option')
    if (!this.id) {
      this.id = `option-${nanoid(6)}`
    }
  }

  /**
   * Handles property updates and triggers appropriate side effects.
   * Currently monitors the `selected` property to update selection state.
   */
  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties)

    if (changedProperties.has('selected')) {
      this.updateSelectionState()
    }
  }

  /**
   * Updates the visual and accessibility state when selection changes.
   * Adds/removes CSS classes and ARIA attributes based on selection state.
   *
   * @protected
   * @example
   * ```javascript
   * // This is called automatically when the selected property changes
   * option.selected = true; // Will trigger updateSelectionState()
   * ```
   */
  protected updateSelectionState(): void {
    if (this.selected) {
      this.classList.add('selected')
      this.setAttribute('aria-selected', 'true')
    } else {
      this.classList.remove('selected')
      this.setAttribute('aria-selected', 'false')
    }
  }

  /**
   * Handles click events on the option. Prevents default behavior and dispatches
   * a custom 'select' event that the parent select component can listen to.
   *
   * @param e - The click event
   * @protected
   * @fires select - Custom event with option details in event.detail
   * @example
   * ```javascript
   * // Listen for option selection
   * option.addEventListener('select', (e) => {
   *   console.log('Selected option:', e.detail.item);
   *   console.log('Selected value:', e.detail.value);
   * });
   * ```
   */
  override handleClick(e: MouseEvent): void {
    e.preventDefault()
    if (this.disabled) {
      e.stopPropagation()
      return
    }

    // Let the parent handle the selection
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: {
          item: this,
          value: this.value,
        },
        bubbles: false,
        composed: true,
      })
    )
  }

  override getSurfaceClasses(): ClassInfo {
    return {
      ...super.getSurfaceClasses(),
      selected: this.selected,
    }
  }

  /**
   * Renders the end section of the option, including the selection check icon
   * when the option is selected.
   */
  protected override renderEnd(): TemplateResult {
    return html`
      <div class="${classMap(this.getEndClasses())}">
        ${this.selected ? html`<ui-icon icon="check" class="selection-icon"></ui-icon>` : ''}
        <slot name="end" @slotchange=${this.handleEndSlotChange}></slot>
        <slot name="end-text" class="trailing-supporting-text" @slotchange=${this.handleEndTextSlotChange}></slot>
      </div>
    `
  }
}
