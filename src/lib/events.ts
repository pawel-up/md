/**
 * Prevents the default browser behavior for the given event.
 * @param e The event to cancel.
 */
export function cancelEvent(e: Event): void {
  e.preventDefault()
  e.stopImmediatePropagation()
  e.stopPropagation()
}
