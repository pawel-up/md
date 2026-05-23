interface IDisabledInfo {
  disabled?: boolean
  tabindexBeforeDisabled?: string
}

const elements = new WeakMap<HTMLElement, IDisabledInfo>()

/**
 * A helper function to unify the way how the `disabled` state is read.
 * @param target The HTML element target.
 * @returns Whether the element is disabled
 */
export function isDisabled(target: HTMLElement): boolean {
  const state = elements.get(target)
  if (!state) {
    return false
  }
  return !!state.disabled
}

/**
 * A helper function to unify the way how the `disabled` state is set.
 * Note, call `requestUpdate()` on the element to trigger the update.
 * @param target The HTML element target.
 * @param disabled Whether the element is to be set as disabled
 */
export function setDisabled(target: HTMLElement, disabled: boolean | undefined): void {
  const state = elements.get(target) || {}
  state.disabled = disabled
  if (disabled) {
    state.tabindexBeforeDisabled = target.getAttribute('tabindex') || '0'
    target.removeAttribute('tabindex')
    target.setAttribute('aria-disabled', 'true')
  } else if (state.tabindexBeforeDisabled) {
    target.setAttribute('tabindex', state.tabindexBeforeDisabled)
    delete state.tabindexBeforeDisabled
    target.removeAttribute('aria-disabled')
  }
  elements.set(target, state)
}
