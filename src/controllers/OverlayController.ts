import { ReactiveController, ReactiveControllerHost } from 'lit'
import { randomId } from '../lib/random.js'
import { OverlayStackManager, type OverlayDismissReason } from './OverlayStackManager.js'

export { OverlayStackManager, type OverlayEntry, type OverlayDismissReason } from './OverlayStackManager.js'

/**
 * Callback function to determine whether an overlay can be closed.
 * Return `false` to prevent the overlay from closing.
 */
export type BeforeCloseCallback = (reason: OverlayDismissReason) => boolean | Promise<boolean>

/**
 * Configuration options for elements using the overlay controller.
 */
export interface OverlayConfig {
  /**
   * Whether the overlay is currently open.
   */
  open: boolean

  /**
   * Whether pressing the Escape key dismisses the overlay.
   *
   * @default true
   */
  closeOnEscape?: boolean

  /**
   * Whether clicking outside the overlay dismisses it.
   *
   * @default true
   */
  closeOnOutsideClick?: boolean

  /**
   * Optional callback to verify whether the overlay can be closed.
   * Can be synchronous or asynchronous (e.g., displaying a confirmation dialog).
   * Returning `false` prevents dismissal.
   */
  beforeClose?: BeforeCloseCallback
}

/**
 * Required interface for a host element attaching an OverlayController.
 */
export interface OverlayHost extends ReactiveControllerHost, HTMLElement, OverlayConfig {}

/**
 * Controller to manage overlay registration, stack ordering, Escape dismissal,
 * outside-click dismissal, and pre-close guards.
 *
 * ## Use when:
 * - Building or enhancing modal dialogs, dropdowns, popup menus, date pickers, or floating panels.
 * - Needing coordinated dismiss-on-Escape behavior where only the topmost overlay closes.
 * - Needing cancelable dismissal or confirmation prompts (e.g. unsaved changes) before close.
 *
 * ## Don't use when:
 * - Building purely inline components (e.g. inline lists, standard text inputs, buttons).
 * - Elements are persistent on screen and never dismissed via Escape or outside clicks.
 *
 * @example
 * ```typescript
 * class MyOverlay extends LitElement implements OverlayHost {
 *   @property({ type: Boolean, reflect: true }) accessor open = false
 *   @property({ attribute: false }) accessor closeOnEscape = true
 *   @property({ attribute: false }) accessor closeOnOutsideClick = true
 *
 *   private overlay = new OverlayController(this)
 * }
 * ```
 */
/**
 * Helper function to determine whether a value is a Promise-like object.
 *
 * @param value The value to check.
 * @returns True if the value is an object with a then method.
 */
export function isPromiseLike<T = unknown>(value: unknown): value is Promise<T> {
  return typeof value === 'object' && value !== null && 'then' in value
}

export class OverlayController implements ReactiveController {
  /**
   * Unique identifier of this overlay controller instance.
   */
  readonly id: string

  private wasOpen = false

  private isClosing = false

  /**
   * Creates an instance of OverlayController.
   *
   * @param host The host component implementing OverlayHost.
   * @param manager The OverlayStackManager instance to register with. Defaults to the shared singleton.
   */
  constructor(
    private readonly host: OverlayHost,
    private readonly manager: OverlayStackManager = OverlayStackManager.getInstance()
  ) {
    this.id = randomId('overlay')
    this.host.addController(this)
  }

  /**
   * Whether pressing Escape should dismiss the overlay.
   */
  get closeOnEscape(): boolean {
    return this.host.closeOnEscape ?? true
  }

  /**
   * Whether clicking outside the overlay should dismiss it.
   */
  get closeOnOutsideClick(): boolean {
    return this.host.closeOnOutsideClick ?? true
  }

  /**
   * Whether the host overlay is currently open.
   */
  get isOpen(): boolean {
    return this.host.open
  }

  /**
   * The current zero-based index of this overlay in the stack, or -1 if closed.
   */
  get stackIndex(): number {
    return this.manager.indexOf(this.id)
  }

  /**
   * Whether this overlay is currently at the top of the stack.
   */
  get isTop(): boolean {
    return this.manager.top?.id === this.id
  }

  /**
   * Lifecycle hook called when the host element connects to the DOM.
   */
  hostConnected(): void {
    if (this.host.open) {
      this.registerWithStack()
      this.wasOpen = true
    }
  }

  /**
   * Lifecycle hook called when the host element disconnects from the DOM.
   */
  hostDisconnected(): void {
    this.unregisterFromStack()
    this.wasOpen = false
  }

  /**
   * Lifecycle hook called after the host element updates.
   */
  hostUpdated(): void {
    if (this.host.open && !this.wasOpen) {
      this.registerWithStack()
      this.wasOpen = true
    } else if (!this.host.open && this.wasOpen) {
      this.unregisterFromStack()
      this.wasOpen = false
    }
  }

  /**
   * Checks whether the given node is contained within the host or its shadow root.
   *
   * @param node The DOM node to test.
   * @returns True if the node is within the overlay, false otherwise.
   */
  contains(node: Node): boolean {
    const hostWithCustom = this.host as { containsOverlayNode?: (node: Node) => boolean }
    if (typeof hostWithCustom.containsOverlayNode === 'function') {
      return hostWithCustom.containsOverlayNode(node)
    }
    if (this.host.contains(node)) {
      return true
    }
    const shadowRoot = this.host.shadowRoot
    if (shadowRoot && shadowRoot.contains(node)) {
      return true
    }
    return false
  }

  /**
   * Requests dismissal of the overlay.
   *
   * Dispatches a cancelable `closing` event on the host. If the event is not prevented,
   * invokes the `beforeClose` callback if defined. If permitted, sets `host.open = false`
   * and dispatches a `close` event.
   *
   * @param reason The reason triggering the close request.
   * @param onPrevented Optional callback invoked if closure is prevented by event or guard.
   * @returns True (or Promise<true>) if closed, or false (or Promise<false>) if prevented.
   */
  requestClose(reason: OverlayDismissReason, onPrevented?: () => void): boolean | Promise<boolean> {
    if (this.isClosing) {
      return false
    }

    if (reason === 'escape' && !this.closeOnEscape) {
      return false
    }

    if (reason === 'outside-click' && !this.closeOnOutsideClick) {
      return false
    }

    this.isClosing = true

    const hostWithCustom = this.host as {
      getCloseEventDetail?: (reason: OverlayDismissReason) => Record<string, unknown>
    }
    const customDetail =
      typeof hostWithCustom.getCloseEventDetail === 'function' ? hostWithCustom.getCloseEventDetail(reason) : { reason }

    try {
      const closingEvent = new CustomEvent('closing', {
        bubbles: false,
        composed: false,
        cancelable: true,
        detail: customDetail,
      })
      const isAllowedByEvent = this.host.dispatchEvent(closingEvent)
      if (!isAllowedByEvent) {
        this.isClosing = false
        onPrevented?.()
        return false
      }

      if (this.host.beforeClose) {
        const allowed = this.host.beforeClose(reason)
        if (isPromiseLike<boolean>(allowed)) {
          return allowed
            .then((res) => {
              if (!res) {
                onPrevented?.()
                return false
              }
              this.finalizeClose(customDetail)
              return true
            })
            .finally(() => {
              this.isClosing = false
            })
        }
        if (!allowed) {
          this.isClosing = false
          onPrevented?.()
          return false
        }
      }

      this.finalizeClose(customDetail)
      this.isClosing = false
      return true
    } catch (err) {
      this.isClosing = false
      throw err
    }
  }

  /**
   * Whether this overlay is currently in the process of closing.
   */
  get closing(): boolean {
    return this.isClosing
  }

  private finalizeClose(customDetail: Record<string, unknown>): void {
    this.host.open = false
    this.unregisterFromStack()
    this.wasOpen = false
    this.host.dispatchEvent(
      new CustomEvent('close', {
        bubbles: false,
        composed: false,
        detail: customDetail,
      })
    )
  }

  /**
   * Registers this overlay entry into the OverlayStackManager.
   */
  private registerWithStack(): void {
    this.manager.register({
      id: this.id,
      element: this.host,
      controller: this,
      contains: (node: Node) => this.contains(node),
    })
  }

  /**
   * Unregisters this overlay entry from the OverlayStackManager.
   */
  private unregisterFromStack(): void {
    this.manager.unregister(this.id)
  }
}
