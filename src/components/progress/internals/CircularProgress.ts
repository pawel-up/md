import { property } from 'lit/decorators.js'
import { isDisabled, setDisabled } from '../../../lib/disabled.js'
import { UiRange } from './Range.js'
import { type TemplateResult, html } from 'lit'

/**
 * A circular progress indicator component that displays progress in a circular format.
 *
 * This component supports both determinate and indeterminate progress states:
 * - **Determinate**: Shows a specific progress value with a filled arc
 * - **Indeterminate**: Shows continuous animation without a specific value
 *
 * The component inherits from UiRange and provides additional features like:
 * - Four-color animation for indeterminate state
 * - Material Design 3 styling
 * - Accessibility support with proper ARIA attributes
 * - Customizable size and colors via CSS custom properties
 *
 * ## Accessibility
 *
 * For accessibility compliance, you must provide an accessible name for the progress indicator.
 * Use the `aria-label` attribute to describe what the progress represents:
 *
 * @example
 * ```html
 * <!-- Basic determinate progress -->
 * <ui-circular-progress value="50" max="100" aria-label="Upload progress"></ui-circular-progress>
 *
 * <!-- Indeterminate progress -->
 * <ui-circular-progress indeterminate aria-label="Loading content"></ui-circular-progress>
 *
 * <!-- Four-color indeterminate progress -->
 * <ui-circular-progress indeterminate fourcolor aria-label="Processing data"></ui-circular-progress>
 * ```
 *
 * @fires ratiochange - Inherited from UiRange. Dispatched when the ratio computation changes.
 */
export default class CircularProgress extends UiRange {
  /**
   * Gets the disabled state of the progress indicator.
   * @returns True if the component is disabled, false otherwise.
   */
  get disabled(): boolean {
    return isDisabled(this)
  }

  /**
   * Sets the disabled state of the progress indicator.
   * When disabled, the component may have reduced visual emphasis
   * and should not respond to user interactions.
   * @attribute
   */
  @property({ reflect: true, type: Boolean })
  set disabled(value: boolean) {
    const old = isDisabled(this)
    setDisabled(this, value)
    this.requestUpdate('disabled', old)
  }

  /**
   * Enables four-color animation for indeterminate progress indicators.
   *
   * When enabled, the indeterminate progress indicator cycles between four colors:
   * - Primary color (--ui-circular-progress-four-color-active-indicator-one-color)
   * - Primary container (--ui-circular-progress-four-color-active-indicator-two-color)
   * - Tertiary color (--ui-circular-progress-four-color-active-indicator-three-color)
   * - Tertiary container (--ui-circular-progress-four-color-active-indicator-four-color)
   *
   * This property only affects the appearance when `indeterminate` is true.
   *
   * @default false
   * @attribute fourcolor
   */
  @property({ type: Boolean, reflect: true }) accessor fourColor = false

  /**
   * Renders the circular progress indicator.
   *
   * Chooses between determinate and indeterminate rendering based on the
   * `indeterminate` property inherited from UiRange.
   *
   * @returns The template result for the progress indicator.
   */
  protected override render(): TemplateResult {
    if (this.indeterminate) {
      return this.renderIndeterminateContainer()
    }
    return this.renderDeterminateContainer()
  }

  /**
   * Renders the determinate progress indicator using SVG.
   *
   * Creates a circular progress bar that shows a specific progress value
   * using stroke-dashoffset to control the visible portion of the circle.
   * The progress is calculated based on the current value, min, and max properties.
   *
   * @returns SVG template with track and active track circles.
   */
  private renderDeterminateContainer() {
    const dashOffset = (1 - this.value / this.max) * 100
    return html`
      <svg viewBox="0 0 4800 4800">
        <circle class="track" pathLength="100"></circle>
        <circle class="active-track" pathLength="100" stroke-dashoffset=${dashOffset}></circle>
      </svg>
    `
  }

  /**
   * Renders the indeterminate progress indicator using CSS animations.
   *
   * Creates a spinning animation with two half-circles that expand and contract
   * to create a continuous loading animation. The animation can cycle through
   * multiple colors when the `fourColor` property is enabled.
   *
   * @returns HTML template with animated spinner elements.
   */
  private renderIndeterminateContainer() {
    return html` <div class="spinner">
      <div class="left">
        <div class="circle"></div>
      </div>
      <div class="right">
        <div class="circle"></div>
      </div>
    </div>`
  }
}
