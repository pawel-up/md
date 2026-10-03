import { property } from 'lit/decorators.js'
import { isDisabled, setDisabled } from '../../../lib/disabled.js'
import { UiRange } from './Range.js'
import { type TemplateResult, html } from 'lit'

/**
 * Builds a closed sinusoidal circular wave path.
 *
 * @param lobes Number of wave lobes.
 * @param baseRadius Base radius in px.
 * @param amplitude Peak wave amplitude in px.
 * @param cx Center X coordinate.
 * @param cy Center Y coordinate.
 * @returns SVG path `d` string.
 */
function buildCircularWavyPath(lobes: number, baseRadius: number, amplitude: number, cx: number, cy: number): string {
  const steps = lobes * 4
  const dTheta = (2 * Math.PI) / steps

  const pos = (theta: number): [number, number] => {
    const r = baseRadius + amplitude * Math.sin(lobes * theta)
    return [cx + r * Math.cos(theta), cy + r * Math.sin(theta)]
  }

  const deriv = (theta: number): [number, number] => {
    const r = baseRadius + amplitude * Math.sin(lobes * theta)
    const dr = amplitude * lobes * Math.cos(lobes * theta)
    const dx = dr * Math.cos(theta) - r * Math.sin(theta)
    const dy = dr * Math.sin(theta) + r * Math.cos(theta)
    return [dx, dy]
  }

  const startTheta = 0
  const [sx, sy] = pos(startTheta)
  let d = `M ${sx.toFixed(2)} ${sy.toFixed(2)}`

  for (let i = 0; i < steps; i++) {
    const t0 = startTheta + i * dTheta
    const t1 = t0 + dTheta
    const [x0, y0] = pos(t0)
    const [x1, y1] = pos(t1)
    const [dx0, dy0] = deriv(t0)
    const [dx1, dy1] = deriv(t1)

    const cp1x = x0 + (dTheta / 3) * dx0
    const cp1y = y0 + (dTheta / 3) * dy0
    const cp2x = x1 - (dTheta / 3) * dx1
    const cp2y = y1 - (dTheta / 3) * dy1

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${x1.toFixed(2)} ${y1.toFixed(2)}`
  }
  d += ' Z'
  return d
}

const CIRCULAR_WAVE_PATH_48 = buildCircularWavyPath(15, 20.4, 1.6, 24, 24)
const CIRCULAR_WAVE_PATH_52 = buildCircularWavyPath(15, 20.4, 1.6, 26, 26)

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
   * Whether to render the expressive wavy progress indicator.
   * Based on the Material Design 3 Expressive specification.
   *
   * @example
   * ```html
   * <ui-circular-progress wavy value="50" max="100" aria-label="Loading"></ui-circular-progress>
   * ```
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor wavy = false

  /**
   * Whether to render the 8dp thicker variant (instead of 4dp).
   *
   * @example
   * ```html
   * <ui-circular-progress wavy thick value="50" max="100" aria-label="Loading"></ui-circular-progress>
   * ```
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor thick = false

  /**
   * Renders the circular progress indicator.
   *
   * Chooses between determinate and indeterminate rendering based on the
   * `indeterminate` property inherited from UiRange.
   *
   * @returns The template result for the progress indicator.
   */
  protected override render(): TemplateResult {
    if (this.wavy) {
      return this.renderWavy()
    }
    if (this.indeterminate) {
      return this.renderIndeterminateContainer()
    }
    return this.renderDeterminateContainer()
  }

  /**
   * Renders the Material Design 3 Expressive wavy circular progress indicator.
   * @returns TemplateResult for wavy circular progress.
   */
  protected renderWavy(): TemplateResult {
    const { indeterminate = false, thick = false } = this
    const size = thick ? 52 : 48
    const center = thick ? 26 : 24
    const strokeWidth = thick ? 8 : 4
    const wavyPath = this.getCircularWavePath(thick)

    if (indeterminate) {
      return html`
        <svg class="wavy-circular indeterminate" viewBox="0 0 ${size} ${size}">
          <circle class="track" cx="${center}" cy="${center}" r="20.4" stroke-width="${strokeWidth}"></circle>
          <path class="active-track wavy" d="${wavyPath}" stroke-width="${strokeWidth}" pathLength="100"></path>
        </svg>
      `
    }

    const { ratio = 0 } = this
    const isComplete = ratio >= 100

    if (isComplete) {
      return html`
        <svg class="wavy-circular" viewBox="0 0 ${size} ${size}">
          <circle
            class="active-track complete"
            cx="${center}"
            cy="${center}"
            r="20.4"
            stroke-width="${strokeWidth}"
          ></circle>
        </svg>
      `
    }

    const dashOffset = (1 - ratio / 100) * 100
    const gapPercent = 3.12
    const trackDash = Math.max(0, 100 - ratio - gapPercent)
    const trackOffset = -(ratio + gapPercent)

    return html`
      <svg class="wavy-circular" viewBox="0 0 ${size} ${size}">
        <circle
          class="track"
          cx="${center}"
          cy="${center}"
          r="20.4"
          stroke-width="${strokeWidth}"
          pathLength="100"
          stroke-dasharray="${trackDash} 100"
          stroke-dashoffset="${trackOffset}"
          ?hidden="${ratio >= 98}"
        ></circle>
        <path
          class="active-track wavy"
          d="${wavyPath}"
          stroke-width="${strokeWidth}"
          pathLength="100"
          stroke-dasharray="100"
          stroke-dashoffset="${dashOffset}"
        ></path>
      </svg>
    `
  }

  /**
   * Gets the cached circular wave path.
   * @param thick Whether thick (52dp) or standard (48dp) variant is requested.
   * @returns SVG path data string.
   */
  protected getCircularWavePath(thick: boolean): string {
    return thick ? CIRCULAR_WAVE_PATH_52 : CIRCULAR_WAVE_PATH_48
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
