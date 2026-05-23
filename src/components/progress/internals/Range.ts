import { PropertyValues } from 'lit'
import { property } from 'lit/decorators.js'
import { floatConverter } from '../../../lib/AttributeConverters.js'
import { UiElement } from '../../UiElement.js'

/**
 * @fires ratiochange - When `ratio` computation is ready.
 */
export abstract class UiRange extends UiElement {
  protected ratioInternal = 0

  protected debounceInternal?: number

  protected oldValue?: number

  /**
   * @returns the ratio of the value.
   */
  get ratio(): number {
    return this.ratioInternal
  }

  /**
   * The number that represents the current value.
   * @attribute
   */
  @property({ type: Number, converter: floatConverter }) accessor value = 0

  /**
   * The number that indicates the minimum value of the range.
   * @attribute
   */
  @property({ type: Number, converter: floatConverter }) accessor min = 0

  /**
   * The number that indicates the maximum value of the range.
   * @attribute
   */
  @property({ type: Number, converter: floatConverter }) accessor max = 100

  /**
   * Specifies the value granularity of the range's value.
   * @attribute
   */
  @property({ type: Number, converter: floatConverter }) accessor step = 1

  /**
   * Use an indeterminate progress indicator.
   * @attribute
   */
  @property({ reflect: true, type: Boolean }) accessor indeterminate: boolean | undefined

  override connectedCallback(): void {
    super.connectedCallback()
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'progressbar')
    }
  }

  protected override willUpdate(cp: PropertyValues<this>): void {
    if (cp.has('value') || cp.has('min') || cp.has('max') || cp.has('step') || cp.has('indeterminate')) {
      this.rangeChanged()
    }

    if (cp.has('min')) {
      this.setAttribute('aria-valuemin', String(this.min))
    }
    if (cp.has('max')) {
      this.setAttribute('aria-valuemax', String(this.max))
    }
    if (cp.has('indeterminate') || cp.has('value')) {
      if (this.indeterminate) {
        this.removeAttribute('aria-valuenow')
      } else {
        this.setAttribute('aria-valuenow', String(this.value))
      }
    }
    super.willUpdate(cp)
  }

  protected rangeChanged(): void {
    this.validateValue()
    const ratio = this.computeRatio(this.value) * 100
    if (this.ratioInternal !== ratio) {
      this.ratioInternal = ratio
      this.dispatchEvent(new Event('ratiochange'))
    }
  }

  /**
   * Makes sure the value is in the right format.
   * @returns True when the value has changed.
   */
  protected validateValue(): boolean {
    const v = this.clampValue(this.value)
    this.oldValue = Number.isNaN(v) ? this.oldValue : v
    this.value = this.oldValue || 0
    return this.value !== v
  }

  protected clampValue(value: number): number {
    return Math.min(this.max, Math.max(this.min, this.computeStep(value)))
  }

  protected computeStep(step: number): number {
    const value = step
    if (!this.step) {
      return value
    }
    const numSteps = Math.round((value - this.min) / this.step)
    if (this.step < 1) {
      /**
       * For small values of this.step, if we calculate the step using
       * `Math.round(value / step) * step` we may hit a precision point issue
       * eg. 0.1 * 0.2 =  0.020000000000000004
       * http://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html
       *
       * as a work around we can divide by the reciprocal of `step`
       */
      return numSteps / (1 / this.step) + this.min
    }
    return numSteps * this.step + this.min
  }

  protected computeRatio(value: number): number {
    const denominator = this.max - this.min
    if (denominator === 0) {
      return 0
    }
    return (this.clampValue(value) - this.min) / (this.max - this.min)
  }
}
