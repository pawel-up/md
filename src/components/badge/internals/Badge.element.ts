import { html, LitElement, TemplateResult } from 'lit'
import { property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

/**
 * A Material Design 3 badge component that displays notifications, counts, or status information.
 *
 * Badges can be rendered as a small dot indicator (6dp × 6dp) or a large badge
 * with numeric counts or text labels supplied via slotted content (16dp height, 8dp corner radius pill).
 * The badge preserves author-provided content as-is and performs no truncation.
 *
 * Use when:
 * - Displaying unread or status notifications on navigation items, tabs, and icons.
 * - Conveying numeric counts such as unread messages, pending tasks, or shopping cart items.
 * - Highlighting updated or newly available content.
 *
 * Don't use when:
 * - A standalone interactive button or clickable chip is needed (use `<ui-button>` or `<ui-chip>`).
 * - Displaying large blocks of text or non-numeric descriptors (use `<ui-chip>` or tooltips).
 *
 * @example
 * ```html
 * <!-- Small dot badge -->
 * <ui-badge></ui-badge>
 *
 * <!-- Large badge with count -->
 * <ui-badge>3</ui-badge>
 *
 * <!-- Multi-digit large badge with author-formatted overflow count -->
 * <ui-badge>99+</ui-badge>
 *
 * <!-- Force dot indicator even if content is present -->
 * <ui-badge dot>5</ui-badge>
 *
 * <!-- Attached to an icon -->
 * <div style="position: relative; display: inline-block;">
 *   <ui-icon>mail</ui-icon>
 *   <ui-badge attached>5</ui-badge>
 * </div>
 * ```
 *
 * @cssprop [--ui-badge-color=var(--md-sys-color-error)] - The background fill color of the badge.
 * @cssprop [--ui-badge-label-color=var(--md-sys-color-on-error)] - The text color for large badge labels.
 * @cssprop [--ui-badge-shape-small=3px] - Corner radius of the small dot badge.
 * @cssprop [--ui-badge-shape-large=8px] - Corner radius of the large badge container.
 * @cssprop [--ui-badge-size-small=6px] - Diameter of the small dot badge.
 * @cssprop [--ui-badge-size-large=16px] - Height and minimum width of the large badge container.
 * @cssprop [--ui-badge-offset-x=0px] - Additional horizontal translation offset when attached.
 * @cssprop [--ui-badge-offset-y=0px] - Additional vertical translation offset when attached.
 *
 * @csspart badge - The badge container element.
 * @csspart label - The label wrapper element (in large badge mode).
 *
 * @slot - The default slot for badge text/content (e.g. counts or short labels).
 */
export default class UiBadge extends LitElement {
  /**
   * When true, forces the badge to render as a small dot indicator (6dp × 6dp),
   * hiding any slotted text.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor dot = false

  /**
   * When true, positions the badge absolutely at the top-trailing corner of its relative container.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor attached = false

  /**
   * Tracks whether slotted text content exists inside the default slot.
   */
  @state() private accessor hasSlottedContent = false

  /**
   * Indicates whether the badge is currently in small dot mode.
   */
  get isDot(): boolean {
    if (this.dot) {
      return true
    }
    return !this.hasSlottedContent
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.checkSlottedContent()
  }

  /**
   * Inspects host textContent on initial connection.
   */
  private checkSlottedContent(): void {
    const trimmed = this.textContent ? this.textContent.trim() : ''
    this.hasSlottedContent = trimmed !== ''
  }

  /**
   * Observes slot changes to detect custom slotted content and re-evaluates display mode.
   *
   * @param e - The slotchange event
   */
  protected handleSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement | null
    if (!slot) {
      return
    }

    const assigned = slot.assignedNodes()
    let text = ''
    for (const node of assigned) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += (node as Text).wholeText
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        text += (node as HTMLElement).textContent ?? ''
      }
    }

    const trimmed = text.trim()
    this.hasSlottedContent = assigned.length > 0 && trimmed !== ''
  }

  protected override render(): TemplateResult {
    const { isDot } = this

    const classes = {
      badge: true,
      small: isDot,
      large: !isDot,
    }

    return html`
      <div class="${classMap(classes)}" part="badge">
        <span class="label" part="label" ?hidden="${isDot}">
          <slot @slotchange="${this.handleSlotChange}"></slot>
        </span>
      </div>
    `
  }
}
