import { html, PropertyValues, TemplateResult } from 'lit'
import { property } from 'lit/decorators.js'
import { ClassInfo, classMap } from 'lit/directives/class-map.js'
import { StyleInfo, styleMap } from 'lit/directives/style-map.js'
import { UiRange } from './Range.js'
import { isDisabled, setDisabled } from '../../../lib/disabled.js'
import { floatConverter } from '../../../lib/AttributeConverters.js'

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
    if (typeof sp === 'number') {
      const secondary = this.clampValue(sp)
      this.secondaryRatioInternal = this.computeRatio(secondary) * 100
    } else {
      this.secondaryRatioInternal = undefined
    }
  }

  override render(): TemplateResult {
    const { secondaryRatio = 0, indeterminate = false, ratio = 0, disabled = false } = this
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
    return html`
      <div class="${classMap(containerClasses)}">
        <div class="secondary" ?hidden="${secondaryRatio === 0}" style="${styleMap(secondaryStyle)}"></div>
        <div class="${classMap(primaryClasses)}" style="${styleMap(primaryStyle)}"></div>
      </div>
    `
  }
}
