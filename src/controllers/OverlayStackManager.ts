import { type OverlayController } from './OverlayController.js'

/**
 * The reason an overlay was requested to close.
 */
export type OverlayDismissReason = 'escape' | 'outside-click' | 'close-button' | 'programmatic' | 'confirm'

/**
 * Representation of an active overlay stored in the OverlayStackManager.
 */
export interface OverlayEntry {
  /**
   * Unique identifier of the overlay entry.
   */
  readonly id: string

  /**
   * The DOM element representing the overlay host.
   */
  readonly element: HTMLElement

  /**
   * The controller associated with this entry.
   */
  readonly controller: OverlayController

  /**
   * Determines whether the given node is contained within this overlay.
   */
  contains(node: Node): boolean
}

/**
 * Central stack manager tracking active overlays in LIFO order.
 *
 * Captures global `Escape` key and outside `pointerdown` interactions,
 * delegating them exclusively to the topmost open overlay.
 *
 * ## Use when:
 * - Querying or coordinating active overlay stack state across the application.
 * - Implementing custom overlay management, testing overlay stacks, or clearing global overlays via `reset()`.
 *
 * ## Don't use when:
 * - Building standard components that attach an overlay; prefer instantiating an `OverlayController`
 *   which registers with the default manager automatically.
 *
 * @example
 * ```typescript
 * const manager = OverlayStackManager.getInstance()
 * console.log(`Active overlays: ${manager.size}`)
 * if (manager.top) {
 *   console.log(`Top overlay ID: ${manager.top.id}`)
 * }
 * ```
 */
export class OverlayStackManager {
  private static defaultInstance?: OverlayStackManager

  private readonly stack: OverlayEntry[] = []

  private isListening = false

  /**
   * Returns the shared singleton instance of the OverlayStackManager.
   */
  static getInstance(): OverlayStackManager {
    if (!OverlayStackManager.defaultInstance) {
      OverlayStackManager.defaultInstance = new OverlayStackManager()
    }
    return OverlayStackManager.defaultInstance
  }

  /**
   * Returns the top-most active (open) overlay entry in the stack,
   * or undefined if the stack is empty or all overlays are closed.
   */
  get top(): OverlayEntry | undefined {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      if (this.stack[i].controller.isOpen) {
        return this.stack[i]
      }
    }
    return undefined
  }

  /**
   * Returns the number of currently registered overlays in the stack.
   */
  get size(): number {
    return this.stack.length
  }

  /**
   * Returns a copy of the active overlay entries in the stack.
   */
  get entries(): readonly OverlayEntry[] {
    return [...this.stack]
  }

  /**
   * Finds the index of an overlay entry by entry instance or ID.
   *
   * @param entryOrId The OverlayEntry or ID string to find.
   * @returns The zero-based index of the entry, or -1 if not found.
   */
  indexOf(entryOrId: OverlayEntry | string): number {
    const targetId = typeof entryOrId === 'string' ? entryOrId : entryOrId.id
    return this.stack.findIndex((item) => item.id === targetId)
  }

  /**
   * Registers an overlay onto the top of the stack.
   *
   * @param entry The OverlayEntry to register.
   * @returns The new zero-based index of the overlay in the stack.
   */
  register(entry: OverlayEntry): number {
    const existingIndex = this.indexOf(entry.id)
    if (existingIndex >= 0) {
      this.stack.splice(existingIndex, 1)
    }
    this.stack.push(entry)
    this.ensureListeners()
    return this.stack.length - 1
  }

  /**
   * Removes an overlay from the stack.
   *
   * @param entryOrId The OverlayEntry or ID string to unregister.
   */
  unregister(entryOrId: OverlayEntry | string): void {
    const index = this.indexOf(entryOrId)
    if (index >= 0) {
      this.stack.splice(index, 1)
    }
    if (this.stack.length === 0) {
      this.teardownListeners()
    }
  }

  /**
   * Clears the entire stack and detaches all global listeners.
   */
  reset(): void {
    this.stack.length = 0
    this.teardownListeners()
  }

  /**
   * Attaches window-level listeners for Escape and pointerdown events if not already listening.
   */
  private ensureListeners(): void {
    if (this.isListening || typeof window === 'undefined') {
      return
    }
    window.addEventListener('keydown', this.handleCaptureKeyDown, { capture: true })
    window.addEventListener('keydown', this.handleBubbleKeyDown, { capture: false })
    window.addEventListener('pointerdown', this.handlePointerDown, { capture: true })
    this.isListening = true
  }

  /**
   * Detaches window-level listeners when no overlays remain in the stack.
   */
  private teardownListeners(): void {
    if (!this.isListening || typeof window === 'undefined') {
      return
    }
    window.removeEventListener('keydown', this.handleCaptureKeyDown, { capture: true })
    window.removeEventListener('keydown', this.handleBubbleKeyDown, { capture: false })
    window.removeEventListener('pointerdown', this.handlePointerDown, { capture: true })
    this.isListening = false
  }

  /**
   * Handles global Escape key events during window capture phase.
   *
   * If the event originated inside the topmost overlay, lets the event proceed down to
   * the overlay so its local keyboard handler can process it. If it originated outside,
   * stops immediate propagation to protect lower overlays and native dialogs, and closes
   * the topmost overlay.
   */
  private handleCaptureKeyDown = async (e: KeyboardEvent): Promise<void> => {
    if (e.key !== 'Escape') {
      return
    }
    const currentTop = this.top
    if (!currentTop) {
      return
    }

    const path = e.composedPath()
    const isInsideTop = path.some(
      (node) =>
        node instanceof Node &&
        (currentTop.element === node ||
          currentTop.element.contains(node) ||
          currentTop.element.shadowRoot?.contains(node))
    )
    if (isInsideTop) {
      // Allow event to reach the topmost overlay target so local keydown handlers can run
      return
    }

    // Event originated outside the top overlay: stop immediate propagation to prevent lower overlays
    // or native browser dialogs from also closing, then request dismissal on top overlay
    e.preventDefault()
    e.stopImmediatePropagation()

    if (currentTop.controller.closeOnEscape) {
      await currentTop.controller.requestClose('escape')
    }
  }

  /**
   * Handles Escape key events that bubbled to window without being intercepted or prevented.
   *
   * Ensures that overlays without local keydown handlers (like UiDropdownList and UiDatePickerInput)
   * are still dismissed when focused elements inside them receive an unhandled Escape key.
   */
  private handleBubbleKeyDown = async (e: KeyboardEvent): Promise<void> => {
    if (e.key !== 'Escape' || e.defaultPrevented) {
      return
    }
    const currentTop = this.top
    if (!currentTop) {
      return
    }

    e.preventDefault()
    e.stopImmediatePropagation()

    if (currentTop.controller.closeOnEscape) {
      await currentTop.controller.requestClose('escape')
    }
  }

  /**
   * Handles global pointerdown events during window capture phase.
   *
   * Checks whether the clicked element is within the topmost overlay.
   * If outside and closeOnOutsideClick is enabled, requests dismissal.
   */
  private handlePointerDown = async (e: PointerEvent): Promise<void> => {
    const currentTop = this.top
    if (!currentTop) {
      return
    }

    const path = e.composedPath()
    const isInsideTop = path.some((node) => node instanceof Node && currentTop.contains(node))
    if (isInsideTop) {
      return
    }

    if (currentTop.controller.closeOnOutsideClick) {
      await currentTop.controller.requestClose('outside-click')
    }
  }
}
