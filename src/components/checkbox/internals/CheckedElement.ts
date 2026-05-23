import { property } from 'lit/decorators.js'
import { UiElement } from '../../UiElement.js'
import { EndPressConfig } from '../../../controllers/ActionController.js'
import { isDisabled, setDisabled } from '../../../lib/disabled.js'
import { PropertyValues } from 'lit'

/**
 * A base class for UI elements that can be checked (as in a form: checkbox, switch, radio).
 *
 * @fires change - when the checked element changes it's checked state
 * @fires input - when the checked element changes it's checked state
 */
export default class CheckedElement extends UiElement {
  #_userInteracted: boolean

  static readonly formAssociated = true

  #_internals = this.attachInternals()

  get form(): HTMLFormElement | null {
    return this.#_internals && this.#_internals.form
  }

  get type(): string {
    return this.localName
  }

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
    this._updateFormValue()
  }

  /**
   * The name of the form control, submitted as a pair with the control's value as part of the form data.
   * @attribute
   */
  @property({ type: String }) accessor name: string | undefined

  /**
   * When a form is submitted, only checkboxes which are currently checked are submitted to the server,
   * and the reported value is the `value` of the value attribute.
   * If the `value` is not otherwise specified, it is the string `on` by default.
   * @attribute
   */
  @property({ type: String }) accessor value: string | undefined

  /**
   * A Boolean attribute indicating whether this checkbox is checked.
   *
   * A checkbox's value is only included in the submitted data
   * if the checkbox is currently `checked`. If it is, then the value
   * of the checkbox's `value` attribute is reported as the input's value.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor checked: boolean | undefined

  /**
   * In addition to the checked and unchecked states, there is a third state a checkbox can be in: indeterminate.
   * This is a state in which it's impossible to say whether the item is toggled on or off.
   *
   * If you submit a form with an indeterminate checkbox, the same thing happens as
   * if the checkbox were unchecked — no data is submitted to represent the checkbox.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor indeterminate: boolean | undefined

  /**
   * Set to true to mark the checked element as required.
   * @attribute
   */
  @property({ reflect: true, type: Boolean }) accessor required: boolean | undefined

  /**
   * While the element can be easily styled with the `:valid` and `:invalid` pseudo classes
   * it also exposes an attribute to style the element as invalid. This attribute changes
   * when the element validation is performed.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor invalid: boolean | undefined

  protected readonly _validationError: string = 'Please check this box if you want to proceed.'

  constructor() {
    super()
    // The default value for the `<input type="checkbox"/>
    this.value = 'on'
    this.checked = false
    this.indeterminate = false
    this.#_userInteracted = false
    this.actionController.cancelKeyboardEvents = true
    this.addEventListener('invalid', this._invalidHandler.bind(this))
    this.addEventListener('click', this.handleClick.bind(this))
    this.addEventListener('pointerdown', this.handlePointerDown.bind(this))
    this.addEventListener('pointerup', this.handlePointerUp.bind(this))
    this.addEventListener('pointercancel', this.handlePointerCancel.bind(this))
    this.addEventListener('pointerenter', this.handlePointerEnter.bind(this))
    this.addEventListener('pointerleave', this.handlePointerLeave.bind(this))
    this.addEventListener('contextmenu', this.handleContextMenu.bind(this))
    this.addEventListener('keydown', this.handleKeyDown.bind(this))
    this.addEventListener('keyup', this.handleKeyUp.bind(this))
    this.addEventListener('focus', this.handleFocus.bind(this))
    this.addEventListener('blur', this.handleBlur.bind(this))
  }

  override connectedCallback(): void {
    super.connectedCallback()
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'checkbox')
    }
    if (!this.hasAttribute('tabindex') && !this.disabled) {
      this.setAttribute('tabindex', '0')
    }
    this._setChecked(this.checked)
  }

  protected override updated(cp: PropertyValues<this>): void {
    if (cp.has('required')) {
      const value = cp.get('required')
      if (value) {
        // this.setAttribute('aria-required', 'true');
        this.#_internals.ariaRequired = 'true'
      } else {
        // this.removeAttribute('aria-required');
        this.#_internals.ariaRequired = null
      }
      this._updateFormValue()
    }
    if (cp.has('indeterminate') || cp.has('value')) {
      this._updateFormValue()
    }
    if (cp.has('checked')) {
      this._setChecked(this.checked)
    }
  }

  /**
   * When form-associated custom elements are supported in the browser it
   * is called when the form has been reset
   */
  formResetCallback(): void {
    this.checked = false
    this._postCheckedChange()
  }

  /**
   * When form-associated custom elements are supported in the browser it
   * is called when the form state has been restored
   *
   * @param formState Restored value
   */
  formStateRestoreCallback(formState?: string): void {
    if (this.value === formState) {
      this.checked = true
      this._postCheckedChange()
    }
  }

  override handleClick(e: MouseEvent): void {
    super.handleClick(e)
    this.toggle()
  }

  override endPress(config: EndPressConfig): void {
    super.endPress(config)
    const { cancelled, reason } = config
    if (cancelled) {
      return
    }
    if (reason === 'enter' || reason === 'space') {
      this.toggle()
    }
  }

  protected handleFocus(): void {
    //
  }

  protected handleBlur(): void {
    //
  }

  protected _setChecked(value = false): void {
    const { indeterminate } = this
    const attrValue = indeterminate ? 'mixed' : String(value)
    this.setAttribute('aria-checked', attrValue)
    this.#_internals.ariaChecked = attrValue
    this._updateFormValue()
  }

  protected _updateFormValue(): void {
    const { value = null, checked, indeterminate, disabled, required } = this
    if (!checked || indeterminate || disabled) {
      this.#_internals.setFormValue(null)
    } else {
      this.#_internals.setFormValue(value)
    }

    if (required && !checked) {
      this.#_internals.setValidity(
        {
          valueMissing: true,
        },
        this._validationError
      )
    } else if (this.#_internals.validity.valueMissing) {
      this.#_internals.setValidity({})
    }
  }

  override notifyChange(): void {
    // The <input type="checkbox"/> dispatches both events.
    this.dispatchEvent(new Event('input'))
    super.notifyChange()
  }

  protected _invalidHandler(): void {
    if (!this.#_userInteracted) {
      return
    }
    this.invalid = true
  }

  toggle(): void {
    if (this.disabled) {
      return
    }
    this.#_userInteracted = true
    this.invalid = false
    this.checked = !this.checked
    this._updateFormValue()
    this._postCheckedChange()
  }

  protected _postCheckedChange(): void {
    this.notifyChange()
    this.#_internals.checkValidity()
  }

  /**
   * Returns true if the element's value has no validity problems; false otherwise.
   * Fires an invalid event at the element in the latter case.
   */
  checkValidity(): boolean {
    this.#_userInteracted = true
    return this.#_internals.checkValidity()
  }

  /**
   * Returns `true` if internals's target element has no validity problems; otherwise, returns false,
   * fires an invalid event at the element, and (if the event isn't canceled) reports
   * the problem to the user.
   */
  reportValidity(): boolean {
    this.#_userInteracted = true
    return this.#_internals.reportValidity()
  }
}
