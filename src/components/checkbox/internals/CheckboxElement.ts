import { html, SVGTemplateResult, TemplateResult, nothing } from 'lit'
import { query } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import CheckedElement from './CheckedElement.js'
import { check, checkIndeterminate } from '../../icons/Icons.js'
import type UiRipple from '../../ripple/internals/ripple.js'
import type { BeginPressConfig, EndPressConfig } from '../../../controllers/ActionController.js'

import '../../ripple/ui-ripple.js'
import '../../focus-ring/ui-focus-ring.js'

/**
 * A form-associated Material Design 3 checkbox.
 *
 * Checkboxes allow users to select one or more items from a set, or to turn an option on or off.
 * Supports unchecked, checked, and indeterminate states, as well as native form validation.
 *
 * ### Example
 * ```html
 * <label>
 *   <ui-checkbox name="agree" value="yes" required></ui-checkbox>
 *   I agree to the terms and conditions
 * </label>
 * ```
 *
 * ### Use when:
 * - Selecting one or multiple independent options from a list.
 * - Toggling a standalone setting that requires form submission or confirmation.
 * - Representing hierarchical selections with an indeterminate state (e.g., select-all when some children are checked).
 *
 * ### Don't use when:
 * - Selecting only a single option from mutually exclusive choices (use `ui-radio` instead).
 * - Toggling a setting with immediate on/off application without form submission (use `ui-switch` instead).
 *
 * @fires change - Dispatched when the checked state changes.
 * @fires input - Dispatched when the checked state changes (form input parity).
 */
export default class CheckboxElement extends CheckedElement {
  /**
   * Resolves the SVG icon corresponding to the current state.
   * Returns a checkmark icon when checked, a dash when indeterminate, or `nothing` when unchecked.
   */
  protected get _icon(): SVGTemplateResult | typeof nothing {
    const { indeterminate, checked } = this
    if (indeterminate) {
      return checkIndeterminate
    }
    if (checked) {
      return check
    }
    return nothing
  }

  /**
   * Reference to the internal `ui-ripple` element responsible for hover, focus, and press state layers.
   */
  @query('ui-ripple') protected accessor ripple!: UiRipple | null

  /**
   * Initiates the ripple press animation if the ripple element is available and not already pressed.
   *
   * @param options - Press configuration carrying the triggering position event.
   */
  protected pressRipple(options: BeginPressConfig): void {
    const element = this.ripple
    if (element && !element.isPressed) {
      element.beginPress(options.positionEvent as PointerEvent)
    }
  }

  /**
   * Completes or cancels an active ripple press animation.
   */
  protected endRipple(): void {
    this.ripple?.endPress()
  }

  /**
   * Hook called when a press gesture starts. Triggers the ripple press state.
   *
   * @param options - Configuration containing the initiating event.
   */
  override beginPress(options: BeginPressConfig): void {
    super.beginPress(options)
    this.pressRipple(options)
  }

  /**
   * Hook called when a press gesture ends. Terminates the ripple press state.
   *
   * @param config - Configuration detailing whether the press was completed or cancelled.
   */
  override endPress(config: EndPressConfig): void {
    super.endPress(config)
    this.endRipple()
  }

  /**
   * Handles keyboard keydown events. Triggers the ripple press animation when the Space key is held.
   *
   * @param e - The keyboard event.
   */
  override handleKeyDown(e: KeyboardEvent): void {
    super.handleKeyDown(e)
    if (['Space'].includes(e.code)) {
      this.ripple?.beginPress()
    }
  }

  /**
   * Handles keyboard keyup events. Releases the ripple press animation when the Space key is released.
   *
   * @param e - The keyboard event.
   */
  override handleKeyUp(e: KeyboardEvent): void {
    super.handleKeyUp(e)
    if (['Space'].includes(e.code)) {
      this.ripple?.endPress()
    }
  }

  /**
   * Handles pointer enter events. Activates the ripple hover state layer.
   *
   * @param e - The pointer event.
   */
  override handlePointerEnter(e: PointerEvent): void {
    super.handlePointerEnter(e)
    this.ripple?.beginHover(e)
  }

  /**
   * Handles pointer leave events. Clears the ripple hover state layer.
   *
   * @param e - The pointer event.
   */
  override handlePointerLeave(e: PointerEvent): void {
    super.handlePointerLeave(e)
    this.ripple?.endHover()
  }

  /**
   * Renders the checkbox template including focus ring, surface container, state layer, ripple, and check icon.
   */
  protected override render(): TemplateResult {
    const { pressed = false } = this
    const containerClasses = {
      surface: true,
      pressed,
    }
    return html`
      <ui-focus-ring part="focus-ring" .control="${this as HTMLElement}"></ui-focus-ring>
      <div class=${classMap(containerClasses)}>
        <div class="container"></div>
        <div class="state"></div>
        <ui-ripple class="ripple" unbounded ?disabled="${this.disabled}"></ui-ripple>
        <div class="icon">${this._icon}</div>
      </div>
    `
  }
}
