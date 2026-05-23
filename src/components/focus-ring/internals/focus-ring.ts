import { LitElement, type PropertyValues } from 'lit'
import { property } from 'lit/decorators.js'

/**
 * A focus ring component that provides a visible focus indicator.
 * This component automatically manages the visibility of the focus ring
 * based on the focus state of its control element.
 *
 * @fires visibility-changed - Dispatched when the focus ring visibility changes.
 *                           - `detail`: An object with a `visible` property (boolean).
 */
export default class UiFocusRing extends LitElement {
  /**
   * The control element that this focus ring is associated with.
   * When the control gains or loses focus, the focus ring will show or hide.
   */
  @property({ type: Object }) accessor control: HTMLElement | undefined

  /**
   * An element to attach the focus ring to. Defaults to the parent element.
   * This is typically used when the focus ring should be positioned relative
   * to a different element than the control.
   */
  @property({ type: Object }) accessor attach: HTMLElement | undefined

  /**
   * An ID of an element that this focus ring is for.
   * Alternative to setting the `control` property directly.
   * @attribute
   */
  @property({ type: String }) accessor for: string | undefined

  /**
   * Whether the focus ring should render inward instead of outward.
   * When true, the focus ring will be positioned inside the control bounds.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor inward = false

  /**
   * The internal visibility state of the focus ring.
   */
  @property({ type: Boolean, reflect: true }) accessor visible = false

  private abortController?: AbortController

  constructor() {
    super()
    this.addEventListener('visibility-changed', this.onVisibilityChanged as EventListener)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.setupControl()
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this.cleanupListeners()
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('for') || changedProperties.has('control')) {
      this.setupControl()
    }
  }

  /**
   * Sets up the control element and event listeners.
   */
  private setupControl(): void {
    this.cleanupListeners()

    const control = this.getControl()
    if (!control) return

    this.abortController = new AbortController()
    const { signal } = this.abortController

    // Listen for focus and blur events
    control.addEventListener('focus', this.handleFocus, { signal })
    control.addEventListener('blur', this.handleBlur, { signal })
    control.addEventListener('pointerdown', this.handlePointerDown, { signal })

    // Set initial state
    this.visible = control.matches(':focus-visible')
  }

  /**
   * Cleans up event listeners.
   */
  private cleanupListeners(): void {
    this.abortController?.abort()
    this.abortController = undefined
  }

  /**
   * Gets the control element from either the `control` property,
   * the `for` attribute, or defaults to the parent element.
   */
  private getControl(): HTMLElement | null {
    if (this.control) {
      return this.control
    }

    if (this.for) {
      const root = this.getRootNode() as Document | ShadowRoot
      return root.getElementById(this.for)
    }

    return this.parentElement
  }

  /**
   * Handles focus events from the control element.
   */
  private handleFocus = (event: FocusEvent): void => {
    // Only show focus ring for keyboard navigation
    if (this.shouldShowFocusRing(event)) {
      this.show()
    }
  }

  /**
   * Handles blur events from the control element.
   */
  private handleBlur = (): void => {
    this.hide()
  }

  /**
   * Handles pointer down events to hide focus ring during mouse interaction.
   */
  private handlePointerDown = (): void => {
    this.hide()
  }

  /**
   * Determines if the focus ring should be shown based on the focus event.
   * The focus ring should only show for keyboard navigation, not mouse clicks.
   */
  private shouldShowFocusRing(event: FocusEvent): boolean {
    const control = event.target as HTMLElement
    return control?.matches(':focus-visible') ?? false
  }

  /**
   * Shows the focus ring.
   */
  show(): void {
    if (this.visible) return
    this.visible = true
  }

  /**
   * Hides the focus ring.
   */
  hide(): void {
    if (!this.visible) return
    this.visible = false
  }

  /**
   * Handles the visibility changed event.
   */
  private onVisibilityChanged = (event: Event): void => {
    // Stop propagation to prevent multiple focus rings from interfering
    event.stopPropagation()
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties)

    if (changedProperties.has('visible')) {
      this.dispatchEvent(
        new CustomEvent('visibility-changed', {
          detail: { visible: this.visible },
          bubbles: false,
          composed: true,
        })
      )
    }
  }
}
