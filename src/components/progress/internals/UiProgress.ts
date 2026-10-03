import { html, nothing, PropertyValues, TemplateResult } from 'lit'
import { property } from 'lit/decorators.js'
import { ClassInfo, classMap } from 'lit/directives/class-map.js'
import { StyleInfo, styleMap } from 'lit/directives/style-map.js'
import { UiRange } from './Range.js'
import { isDisabled, setDisabled } from '../../../lib/disabled.js'
import { floatConverter } from '../../../lib/AttributeConverters.js'

/**
 * Builds a continuous horizontal waveform path.
 *
 * @param wavelength Wavelength in px (default 40).
 * @param amplitude Peak amplitude from center in px (default 3).
 * @param centerY Center Y coordinate.
 * @param count Number of wave cycles to generate.
 * @returns SVG path `d` string.
 */
function buildLinearWavePath(wavelength: number, amplitude: number, centerY: number, count: number): string {
  let d = `M -${wavelength} ${centerY} Q -${wavelength * 0.75} ${centerY - amplitude}, -${wavelength * 0.5} ${centerY} T 0 ${centerY}`
  for (let i = 0; i < count; i++) {
    const x = (i + 1) * wavelength
    d += ` T ${x - wavelength * 0.5} ${centerY} T ${x} ${centerY}`
  }
  return d
}

const LINEAR_WAVE_PATH_5 = buildLinearWavePath(40, 3, 5, 140)
const LINEAR_WAVE_PATH_7 = buildLinearWavePath(40, 3, 7, 140)

export default class UiProgress extends UiRange {
  protected secondaryRatioInternal?: number

  get disabled(): boolean {
    return isDisabled(this)
  }

  /**
   * When set, the button is a disabled state.
   * @attribute
   */
  @property({ reflect: true, type: Boolean })
  set disabled(value: boolean) {
    const old = isDisabled(this)
    setDisabled(this, value)
    this.requestUpdate('disabled', old)
  }

  /**
   * The number that represents the current secondary progress.
   * @attr
   */
  @property({ type: Number, converter: floatConverter }) accessor secondaryProgress: number | undefined

  /**
   * @returns The ratio of the secondary progress.
   */
  get secondaryRatio(): number {
    return this.secondaryRatioInternal || 0
  }

  protected override willUpdate(cp: PropertyValues<this>): void {
    super.willUpdate(cp)
    if (cp.has('secondaryProgress')) {
      this.rangeChanged()
    }
  }

  protected override rangeChanged(): void {
    super.rangeChanged()
    const { secondaryProgress: sp } = this
    const num = typeof sp === 'string' ? parseFloat(sp) : sp
    if (typeof num === 'number' && !Number.isNaN(num)) {
      const secondary = this.clampValue(num)
      this.secondaryRatioInternal = this.computeRatio(secondary) * 100
    } else {
      this.secondaryRatioInternal = undefined
    }
  }

  /**
   * Whether to render the expressive wavy progress indicator.
   * Based on the Material Design 3 Expressive specification.
   *
   * @example
   * ```html
   * <ui-progress wavy value="50" max="100" aria-label="Loading"></ui-progress>
   * ```
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor wavy = false

  /**
   * Whether to render the 8dp thicker variant (instead of 4dp).
   *
   * @example
   * ```html
   * <ui-progress wavy thick value="50" max="100" aria-label="Loading"></ui-progress>
   * ```
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor thick = false

  /**
   * Whether to hide the 4dp stop indicator at the end of the track.
   * By default, the stop indicator is shown for determinate progress
   * to meet Material Design accessibility contrast standards.
   *
   * @example
   * ```html
   * <ui-progress hide-stop-indicator value="50" max="100"></ui-progress>
   * ```
   * @attribute hide-stop-indicator
   */
  @property({ type: Boolean, attribute: 'hide-stop-indicator', reflect: true }) accessor hideStopIndicator = false

  override render(): TemplateResult {
    if (this.wavy) {
      return this.renderWavy()
    }
    return this.renderLinear()
  }

  /**
   * Renders the classic linear progress indicator.
   * @returns TemplateResult for linear progress.
   */
  protected renderLinear(): TemplateResult {
    const { secondaryRatio = 0, indeterminate = false, ratio = 0, disabled = false, hideStopIndicator = false } = this
    const primaryClasses = {
      primary: true,
      indeterminate: !disabled && indeterminate,
      linear: !indeterminate,
    }
    const primaryStyle: StyleInfo = {}
    if (!indeterminate) {
      primaryStyle.transform = `scaleX(${ratio / 100})`
    }
    const secondaryStyle = {
      transform: `scaleX(${secondaryRatio / 100})`,
    }
    const containerClasses: ClassInfo = {
      container: true,
      disabled,
    }
    const showStopDot = !indeterminate && !hideStopIndicator && ratio < 100

    return html`
      <div class=${classMap(containerClasses)}>
        <div class="secondary" ?hidden="${secondaryRatio === 0}" style=${styleMap(secondaryStyle)}></div>
        <div class=${classMap(primaryClasses)} style=${styleMap(primaryStyle)}></div>
        ${showStopDot ? html`<div class="stop-dot"></div>` : nothing}
      </div>
    `
  }

  /**
   * Renders the Material Design 3 Expressive wavy progress indicator.
   * @returns TemplateResult for wavy progress.
   */
  protected renderWavy(): TemplateResult {
    const { indeterminate = false, thick = false, disabled = false, ratio = 0, hideStopIndicator = false } = this
    const height = thick ? 14 : 10
    const centerY = thick ? 7 : 5
    const strokeWidth = thick ? 8 : 4
    const wavePath = this.getLinearWavePath(centerY)

    const containerClasses: ClassInfo = {
      'wavy-container': true,
      thick,
      disabled,
    }
    const trackLineStyle: StyleInfo = {
      height: `${strokeWidth}px`,
    }
    const svgStyle: StyleInfo = {
      height: `${height}px`,
    }
    const pathStyle: StyleInfo = {
      'stroke-width': `${strokeWidth}px`,
    }

    if (indeterminate) {
      return html`
        <div class=${classMap(containerClasses)}>
          <div class="wavy-track full-track">
            <div class="track-line" style=${styleMap(trackLineStyle)}></div>
          </div>
          <div class="wavy-active indeterminate">
            <svg class="wavy-svg" style=${styleMap(svgStyle)} preserveAspectRatio="none">
              <path class="wavy-path" d="${wavePath}" style=${styleMap(pathStyle)}></path>
            </svg>
          </div>
          <div class="wavy-active indeterminate secondary-wave">
            <svg class="wavy-svg" style=${styleMap(svgStyle)} preserveAspectRatio="none">
              <path class="wavy-path" d="${wavePath}" style=${styleMap(pathStyle)}></path>
            </svg>
          </div>
        </div>
      `
    }

    const isComplete = ratio >= 100

    if (isComplete) {
      const completeActiveStyle: StyleInfo = {
        width: '100%',
      }
      return html`
        <div class=${classMap(containerClasses)}>
          <div class="wavy-active complete" style=${styleMap(completeActiveStyle)}>
            <div class="complete-line" style=${styleMap(trackLineStyle)}></div>
          </div>
        </div>
      `
    }

    const activeStyle: StyleInfo = {
      width: `${ratio}%`,
    }
    const trackStyle: StyleInfo = {
      left: `calc(${ratio}% + 4px)`,
    }

    return html`
      <div class=${classMap(containerClasses)}>
        <div class="wavy-active" style=${styleMap(activeStyle)}>
          <svg class="wavy-svg" style=${styleMap(svgStyle)} preserveAspectRatio="none">
            <path class="wavy-path" d="${wavePath}" style=${styleMap(pathStyle)}></path>
          </svg>
        </div>
        <div class="wavy-track" style=${styleMap(trackStyle)}>
          <div class="track-line" style=${styleMap(trackLineStyle)}></div>
          ${!hideStopIndicator ? html`<div class="stop-dot"></div>` : nothing}
        </div>
      </div>
    `
  }

  /**
   * Gets the cached linear wave path for the given center line.
   * @param centerY Center vertical coordinate in px.
   * @returns SVG path data string.
   */
  protected getLinearWavePath(centerY: number): string {
    return centerY === 7 ? LINEAR_WAVE_PATH_7 : LINEAR_WAVE_PATH_5
  }
}
