import { html, TemplateResult } from 'lit'
import { queryAsync, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { classMap } from 'lit/directives/class-map.js'
import { RadioSelectionController } from '../../../controllers/RadioSelectionController.js'
import CheckedElement from '../../checkbox/internals/CheckedElement.js'
import { ripple } from '../../effects/rippleDirective.js'
import UiRipple from '../../ripple/internals/ripple.js'
import { EndPressConfig } from '../../../controllers/ActionController.js'
import '../../ripple/ui-ripple.js'
import '../../focus-ring/ui-focus-ring.js'

/**
 * A form-associated radio button.
 *
 * ```html
 * <label>
 *  <api-radio name="fruit" value="apple"></api-radio>
 *  Apple
 * </label>
 * <label>
 *  <api-radio name="fruit" value="banana"></api-radio>
 *  Banana
 * </label>
 * <label>
 *  <api-radio name="fruit" value="mango"></api-radio>
 *  Mango
 * </label>
 * ```
 *
 * The radio supports keyboard navigation as the `<input type="radio"/>` does.
 * Radio buttons are grouped by name. This means if another button with the same name
 * is selected, all other with the same name are deselected. It is possible to use
 * two radio inputs with the same name in different forms in the same document.
 * The grouping only affects inputs inside the form.
 */
export default class RadioElement extends CheckedElement {
  protected selection = new RadioSelectionController(this)

  protected override readonly _validationError = 'Please select one of these options.'

  @queryAsync('ui-ripple') protected accessor ripple!: Promise<UiRipple | null>

  @state() protected accessor showRipple = false

  protected readonly getRipple = (): Promise<UiRipple | null> => {
    this.showRipple = true
    return this.ripple
  }

  override endPress(config: EndPressConfig): void {
    const downConfig: EndPressConfig = { ...config }
    if (this.checked) {
      // prohibits toggling of the radio button.
      downConfig.cancelled = true
    }
    super.endPress(downConfig)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.selection.clearRequired()
    this.selection.clearTabindex()
  }

  override handleClick(e: MouseEvent): void {
    super.handleClick(e)
    this.selection.handleSelection()
    this.focus()
  }

  protected override _setChecked(value = false): void {
    if (value) {
      this.selection.handleSelection()
    }
    this._updateFormValue()
    this.setAttribute('aria-checked', String(value))
  }

  override async handleKeyDown(e: KeyboardEvent): Promise<void> {
    super.handleKeyDown(e)
    this.selection.handleKeyDown(e)
    if (['Space'].includes(e.code)) {
      const _ripple = await this.getRipple()
      _ripple?.beginPress()
    }
  }

  override async handleKeyUp(e: KeyboardEvent): Promise<void> {
    super.handleKeyUp(e)
    if (['Space'].includes(e.code)) {
      const _ripple = await this.getRipple()
      _ripple?.endPress()
    }
  }

  protected override async handleFocus(): Promise<void> {
    const _ripple = await this.getRipple()
    _ripple?.beginFocus()
  }

  protected override async handleBlur(): Promise<void> {
    const _ripple = await this.getRipple()
    _ripple?.endFocus()
  }

  protected override render(): TemplateResult {
    const { pressed = false } = this
    const surfaceClasses = classMap({
      surface: true,
      pressed,
    })
    return html`
      <ui-focus-ring part="focus-ring" .control="${this as HTMLElement}"></ui-focus-ring>
      <div class="${surfaceClasses}" ${ripple(this.getRipple)}>
        <div class="container"></div>
        <div class="state"></div>
        ${when(this.showRipple, this.renderRipple)}
        <div class="content">
          <div class="outer"></div>
          <div class="inner"></div>
        </div>
      </div>
    `
  }

  protected renderRipple = (): TemplateResult => {
    const { disabled } = this
    return html`<ui-ripple class="ripple" ?disabled="${disabled}"></ui-ripple>`
  }
}
