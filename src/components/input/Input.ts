import { html, LitElement, nothing, PropertyValues, TemplateResult } from 'lit'
import { property, queryAssignedElements, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { SupportedAutocapitalize, SupportedAutocomplete, SupportedInputTypes } from '../../types/input.js'
import { ARIAAutoComplete, ARIAExpanded, ARIARole } from '../../types/role.js'
import { UiElement } from '../UiElement.js'
import { isDisabled, setDisabled } from '../../lib/disabled.js'
import '../icon-button/ui-icon-button.js'
import '../icons/ui-icon.js'

const floatTypes = ['date', 'color', 'datetime-local', 'file', 'month', 'time', 'week']

/**
 * @slot prefix - A slot in which to render prefixes of the input
 * @slot suffix - A slot in which to render suffixes of the input
 */
export default abstract class Input extends UiElement {
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }
  #_userInteracted: boolean

  // static override shadowRootOptions: ShadowRootInit = {mode: 'open', delegatesFocus: true};

  static readonly formAssociated = true

  #_internals = this.attachInternals()

  get form(): HTMLFormElement | null {
    return this.#_internals && this.#_internals.form
  }

  /**
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor type: SupportedInputTypes

  get disabled(): boolean {
    return isDisabled(this)
  }

  /**
   * When set, the input is a disabled state.
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
  @property({ type: String }) accessor value = ''

  /**
   * Set to true to mark the input element as required.
   * @attribute
   */
  @property({ reflect: true, type: Boolean })
  accessor required: boolean | undefined

  /**
   * While the element can be easily styled with the `:valid` and `:invalid` pseudo classes
   * it also exposes an attribute to style the element as invalid. This attribute changes
   * when the element validation is performed.
   *
   * Calling `reportValidity()` will automatically update `invalid`.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor invalid: boolean | undefined

  /**
   * The error message that replaces supporting text when `error` is true. If
   * `errorText` is an empty string, then the supporting text will continue to
   * show.
   *
   * Calling `reportValidity()` will automatically update `errorText` to the
   * native `validationMessage`.
   * @attribute
   */
  @property({ type: String }) accessor invalidText = ''

  /**
   * The label to be rendered with the input.
   * @attribute
   */
  @property({ type: String }) accessor label: string | undefined

  /**
   * Whether or not the text field has a leading icon. Used for SSR.
   * @attribute
   */
  @property({ type: Boolean }) accessor hasPrefix = false

  /**
   * Whether or not the text field has a trailing icon. Used for SSR.
   * @attribute
   */
  @property({ type: Boolean }) accessor hasSuffix = false

  /**
   * Conveys additional information below the text field, such as how it should
   * be used.
   * @attribute
   */
  @property({ type: String }) accessor supportingText = ''

  /**
   * Override the input text CSS `direction`. Useful for RTL languages that use
   * LTR notation for fractions.
   * @attribute
   */
  @property({ type: String }) accessor textDirection = ''

  /**
   * When set the label of the input disappears after input rather than float over the input.
   * @attribute
   */
  @property({ type: Boolean }) accessor noFloating: boolean | undefined

  /**
   * Defines the greatest value in the range of permitted values.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max
   * @attribute
   */
  @property({ type: String }) accessor max: number | string = ''

  /**
   * The maximum number of characters a user can enter into the text field. Set
   * to -1 for none.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength
   * @attribute
   */
  @property({ type: Number }) accessor maxLength = -1

  /**
   * Defines the most negative value in the range of permitted values.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min
   * @attribute
   */
  @property({ type: String }) accessor min: number | string = ''

  /**
   * The minimum number of characters a user can enter into the text field. Set
   * to -1 for none.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength
   * @attribute
   */
  @property({ type: Number }) accessor minLength: number | undefined

  /**
   * A regular expression that the text field's value must match to pass
   * constraint validation.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern
   * @attribute
   */
  @property({ type: String }) accessor pattern = ''

  /**
   * @attribute
   */
  @property({ type: String }) accessor placeholder = ''

  /**
   * Indicates whether or not a user should be able to edit the text field's
   * value.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly
   *
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor readOnly = false

  /**
   * Bind the `<input>`'s `autocomplete` property.
   * @default off
   * @attribute
   */
  @property({ type: String }) accessor autocomplete: SupportedAutocomplete = 'off'

  /**
   * Binds this to the `<input>`'s `inputMode` property.
   * @attribute
   */
  @property({ type: String }) override accessor inputMode = ''

  /**
   * Binds this to the `<input>`'s `autocapitalize` property.
   *
   * Possible values are:
   *
   * - `off` or `none`: No auto-capitalization is applied (all letters default to lowercase)
   * - `on` or `sentences`: The first letter of each sentence defaults to a capital letter;
   *  all other letters default to lowercase
   * - `words`: The first letter of each word defaults to a capital letter; all other letters default to lowercase
   * - `characters`: All letters should default to uppercase
   *
   * @default off
   * @attr
   */
  override autocapitalize: SupportedAutocapitalize = 'off'

  /**
   * Binds this to the `<input>`'s `accept` property,
   * used with type=file.
   * @attribute
   */
  @property({ type: String }) accessor accept: string | undefined

  /**
   * Binds this to the`<input>`'s `multiple` property,
   * used with type=file.
   * @attribute
   */
  @property({ type: Boolean }) accessor multiple: boolean | undefined

  /**
   * Binds this to the `<input>`'s `size` property.
   * @attribute
   */
  @property({ type: Number }) accessor size: number | undefined

  protected pendingSetters = new Map<keyof HTMLInputElement, unknown>()

  private setNativeValue(key: keyof HTMLInputElement, value: unknown): void {
    const { input } = this
    if (input) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(input as any)[key] = value
    } else {
      this.pendingSetters.set(key, value)
    }
  }

  private getNativeValue(key: keyof HTMLInputElement): unknown {
    const { input } = this
    if (input) {
      return input[key]
    }
    return this.pendingSetters.get(key) || null
  }

  /**
   * Gets or sets the direction in which selection occurred.
   */
  get selectionDirection(): 'forward' | 'backward' | 'none' | null {
    return this.getNativeValue('selectionDirection') as 'forward' | 'backward' | 'none' | null
  }

  set selectionDirection(value: 'forward' | 'backward' | 'none' | null) {
    this.setNativeValue('selectionDirection', value)
  }

  /**
   * Gets or sets the end position or offset of a text selection.
   */
  get selectionEnd(): number | null {
    return this.getNativeValue('selectionEnd') as number | null
  }

  set selectionEnd(value: number | null) {
    this.setNativeValue('selectionEnd', value)
  }

  /**
   * Gets or sets the starting position or offset of a text selection.
   */
  get selectionStart(): number | null {
    return this.getNativeValue('selectionStart') as number | null
  }

  set selectionStart(value: number | null) {
    this.setNativeValue('selectionStart', value)
  }

  /**
   * Returns or sets the element's step attribute, which works with min and max
   * to limit the increments at which a numeric or date-time value can be set.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step
   * @attribute
   */
  @property({ type: Number }) accessor step = 1

  /**
   * Returns the native validation error message that would be displayed upon
   * calling `reportValidity()`.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/validationMessage
   */
  get validationMessage(): string {
    return (this.getNativeValue('validationMessage') as string | null) ?? ''
  }

  /**
   * Returns a ValidityState object that represents the validity states of the
   * text field.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/validity
   */
  get validity(): ValidityState {
    return (this.getNativeValue('validity') as ValidityState | null) ?? this.#_internals.validity
  }

  /**
   * The text field's value as a number.
   */
  get valueAsNumber(): number {
    return (this.getNativeValue('valueAsNumber') as number | null) ?? 0
  }

  set valueAsNumber(value: number) {
    this.setNativeValue('valueAsNumber', value)
  }

  /**
   * The text field's value as a Date.
   */
  get valueAsDate(): Date | null {
    return this.getNativeValue('valueAsDate') as Date | null
  }

  set valueAsDate(value: Date | null) {
    this.setNativeValue('valueAsDate', value)
  }

  /**
   * Returns whether an element will successfully validate based on forms
   * validation rules and constraints.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/willValidate
   */
  get willValidate(): boolean {
    return (this.getNativeValue('willValidate') as boolean | null) ?? false
  }

  /**
   * Returns true when the text field has been interacted with. Native
   * validation errors only display in response to user interactions.
   */
  @state() protected accessor dirty = false

  @state() protected accessor focused = false

  get input(): HTMLInputElement | null {
    return this.shadowRoot?.querySelector('.input') ?? null
  }

  @queryAssignedElements({ slot: 'prefix' }) private accessor prefixes!: Element[]

  @queryAssignedElements({ slot: 'suffix' }) private accessor suffixes!: Element[]

  /**
   * The validation message displayed from a native error via
   * `reportValidity()`.
   */
  @state() protected accessor nativeErrorText = ''

  /**
   * Whether or not a native error has been reported via `reportValidity()`.
   */
  @state() protected accessor nativeError = false

  private readonly counterId = 'counter'

  private readonly supportingTextId = 'support'

  private readonly labelId = 'support'

  @property({ type: String, attribute: 'data-aria-autocomplete', noAccessor: true })
  override accessor ariaAutoComplete: ARIAAutoComplete | null = null

  @property({ type: String, attribute: 'data-aria-controls', noAccessor: true })
  accessor ariaControls: string | null = null

  @property({ type: String, attribute: 'data-aria-activedescendant', noAccessor: true })
  accessor ariaActiveDescendant: string | null = null

  @property({ type: String, attribute: 'data-aria-expanded', noAccessor: true })
  override accessor ariaExpanded: ARIAExpanded | null = null

  /**
   * The `aria-label` of the text field's input.
   */
  @property({ type: String, attribute: 'data-aria-label', noAccessor: true })
  override accessor ariaLabel!: string

  /**
   * The `aria-labelledby` of the text field's input.
   *
   * Note: currently only usable in SSR light DOM.
   */
  @property({ type: String, attribute: 'data-aria-labelledby', noAccessor: true })
  accessor ariaLabelledBy!: string

  @property({ type: String, attribute: 'data-role', noAccessor: true })
  accessor dataRole: ARIARole | null = null

  /**
   * When set to true, the error text's `role="alert"` will be removed, then
   * re-added after an animation frame. This will re-announce an error message
   * to screen readers.
   */
  @state() protected accessor refreshErrorAlert = false

  /**
   * When set is shows password in the `password` input.
   * This is private so the password can be viewed only through user interaction.
   */
  #showPassword = false

  get files(): FileList | null {
    return this.getNativeValue('files') as FileList | null
  }

  /**
   * When set it adds a `<datalist>` element to the input.
   */
  @property({ type: Array }) accessor list: string[] | undefined

  constructor() {
    super()
    this.type = 'text'
    this.#_userInteracted = false
    this.actionController.cancelKeyboardEvents = false
    this.addEventListener('click', this.handleClick.bind(this))
    this.addEventListener('focus', this.handleFocus.bind(this))
    this.addEventListener('blur', this.handleBlur.bind(this))
  }

  override connectedCallback(): void {
    super.connectedCallback()
    if (!this.hasAttribute('tabindex') && !this.disabled) {
      this.setAttribute('tabindex', '0')
    }
    this.handleSlotChange()
  }

  /**
   * When form-associated custom elements are supported in the browser it
   * is called when the form has been reset
   */
  formResetCallback(): void {
    this.value = ''
  }

  /**
   * When form-associated custom elements are supported in the browser it
   * is called when the form state has been restored
   *
   * @param formState Restored value
   */
  formStateRestoreCallback(formState?: string): void {
    this.value = formState ?? ''
  }

  protected override willUpdate(cp: PropertyValues<this>): void {
    if (cp.has('required')) {
      this._updateFormValue()
    }
  }

  protected override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties)
    if (changedProperties.has('value')) {
      this._updateFormValue()
    }
    if (this.refreshErrorAlert) {
      // The past render cycle removed the role="alert" from the error message.
      // Re-add it after an animation frame to re-announce the error.
      requestAnimationFrame(() => {
        this.refreshErrorAlert = false
      })
    }
  }

  protected _updateFormValue(): void {
    const { value = '', disabled } = this
    if (!value || disabled) {
      this.#_internals.setFormValue(null)
    } else {
      this.#_internals.setFormValue(value)
    }
    this._updateValidationState()
  }

  protected _updateValidationState(): void {
    const { input } = this
    if (!input) {
      return
    }
    const { validationMessage, validity } = input
    if (!validity.valid) {
      this.#_internals.setValidity(
        {
          valueMissing: validity.valueMissing,
          badInput: validity.badInput,
          patternMismatch: validity.patternMismatch,
          rangeOverflow: validity.rangeOverflow,
          rangeUnderflow: validity.rangeUnderflow,
          stepMismatch: validity.stepMismatch,
          tooLong: validity.tooLong,
          tooShort: validity.tooShort,
          typeMismatch: validity.typeMismatch,
          customError: validity.customError,
        },
        validationMessage
      )
      return
    }

    this.#_internals.setValidity({})
  }

  protected invalidHandler(e: Event): void {
    this.retargetEvent(e)
    if (!this.#_userInteracted) {
      return
    }
    this.invalid = true
  }

  protected handleSlotChange(): void {
    this.hasPrefix = this.prefixes.length > 0
    this.hasSuffix = this.suffixes.length > 0
  }

  protected getInputValue(): string {
    if (this.type === 'color') {
      return this.value || '#000000'
    }
    if (this.type === 'number' && typeof this.value === 'number') {
      return String(this.value)
    }
    return this.value ?? ''
  }

  /**
   * Checks the text field's native validation and returns whether or not the
   * element is valid.
   *
   * If invalid, this method will dispatch the `invalid` event.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/checkValidity
   *
   * @return true if the text field is valid, or false if not.
   */
  checkValidity(): boolean {
    this.#_userInteracted = true
    const { valid } = this.checkValidityAndDispatch()
    this.invalid = !valid
    return valid
  }

  /**
   * Focuses the text field's input text.
   */
  override focus(): void {
    if (this.disabled || this.matches(':focus-within')) {
      return
    }
    this.input?.focus()
  }

  /**
   * Un-focuses the text field.
   */
  override blur(): void {
    this.input?.blur()
  }

  /**
   * Checks the text field's native validation and returns whether or not the
   * element is valid.
   *
   * If invalid, this method will dispatch the `invalid` event.
   *
   * This method will display or clear an error text message equal to the text
   * field's `validationMessage`, unless the invalid event is canceled.
   *
   * Use `setCustomValidity()` to customize the `validationMessage`.
   *
   * This method can also be used to re-announce error messages to screen
   * readers.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/reportValidity
   *
   * @return true if the text field is valid, or false if not.
   */
  reportValidity(): boolean {
    this.#_userInteracted = true
    const { valid, canceled } = this.checkValidityAndDispatch()
    this._updateValidationState()
    if (!canceled) {
      this.invalid = !valid
      const prevMessage = this.getErrorText()
      this.nativeError = !valid
      this.nativeErrorText = this.validationMessage

      const needsRefresh = this.shouldErrorAnnounce() && prevMessage === this.getErrorText()
      if (needsRefresh) {
        this.refreshErrorAlert = true
      }
    }

    return valid
  }

  protected shouldErrorAnnounce(): boolean {
    // Announce if there is an error and error text visible.
    // If refreshErrorAlert is true, do not announce. This will remove the
    // role="alert" attribute. Another render cycle will happen after an
    // animation frame to re-add the role.
    return this.getError() && !!this.getErrorText() && !this.refreshErrorAlert
  }

  protected getErrorText(): string {
    return this.invalidText || this.nativeErrorText
  }

  /**
   * Selects all the text in the text field.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select
   */
  select(): void {
    this.input?.select()
  }

  /**
   * Sets the text field's native validation error message. This is used to
   * customize `validationMessage`.
   *
   * When the error is not an empty string, the text field is considered invalid
   * and `validity.customError` will be true.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setCustomValidity
   *
   * @param error The error message to display.
   */
  setCustomValidity(error: string): void {
    this.input?.setCustomValidity(error)
  }

  /**
   * Replaces a range of text with a new string.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setRangeText
   */
  setRangeText(replacement: string): void

  setRangeText(replacement: string, start: number, end: number, selectionMode?: SelectionMode): void

  setRangeText(...args: unknown[]): void {
    const { input } = this
    if (!input) {
      return
    }
    // Calling setRangeText with 1 vs 3-4 arguments has different behavior.
    // Use spread syntax and type casting to ensure correct usage.
    input.setRangeText(...(args as Parameters<HTMLInputElement['setRangeText']>))
    this.value = input.value
  }

  /**
   * Sets the start and end positions of a selection in the text field.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange
   *
   * @param start The offset into the text field for the start of the selection.
   * @param end The offset into the text field for the end of the selection.
   * @param direction The direction in which the selection is performed.
   */
  setSelectionRange(start: number | null, end: number | null, direction?: 'forward' | 'backward' | 'none'): void {
    this.input?.setSelectionRange(start, end, direction)
  }

  /**
   * Decrements the value of a numeric type text field by `step` or `n` `step`
   * number of times.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/stepDown
   *
   * @param stepDecrement The number of steps to decrement, defaults to 1.
   */
  stepDown(stepDecrement?: number): void {
    const { input } = this
    if (!input) {
      return
    }
    input.stepDown(stepDecrement)
    this.value = input.value
  }

  /**
   * Increments the value of a numeric type text field by `step` or `n` `step`
   * number of times.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/stepUp
   *
   * @param stepIncrement The number of steps to increment, defaults to 1.
   */
  stepUp(stepIncrement?: number): void {
    const { input } = this
    if (!input) {
      return
    }
    input.stepUp(stepIncrement)
    this.value = input.value
  }

  /**
   * Reset the text field to its default value.
   */
  reset(): void {
    this.dirty = false
    this.value = ''
  }

  override handleClick(): void {
    this.focus()
  }

  protected handleFocus(): void {
    const { input } = this
    if (this.disabled || !input) {
      return
    }
    this.focused = true
  }

  protected handleBlur(): void {
    if (this.matches(':focus-within')) {
      // Changing focus to another child within the text field, like a button
      return
    }
    this.focused = false
  }

  private checkValidityAndDispatch(): { valid: boolean; canceled: boolean } {
    const valid = this.input?.checkValidity() ?? true
    let canceled = false
    if (!valid) {
      canceled = !this.dispatchEvent(new Event('invalid', { cancelable: true }))
    }
    return { valid, canceled }
  }

  /**
   * @returns `true` when the label is in resting state.
   */
  protected labelResting(): boolean {
    const { value } = this
    if (!!value || String(value) === '0') {
      return false
    }
    if (floatTypes.includes(this.type || '')) {
      return false
    }
    return !this.placeholder && !this.focused
  }

  /**
   * @returns `true` when the label should be hidden
   */
  protected labelHidden(): boolean {
    const { noFloating } = this
    return !this.labelResting() && !!noFloating
  }

  protected renderLabelText(): string {
    const labelText = this.label ?? ''
    const optionalAsterisk = this.required && labelText ? '*' : ''
    return labelText + optionalAsterisk
  }

  protected getSupportingText(): string {
    const errorText = this.getErrorText()
    return this.getError() && errorText ? errorText : this.supportingText
  }

  protected getError(): boolean {
    return this.invalid || this.nativeError
  }

  protected retargetEvent(event: Event): boolean {
    if (event.bubbles && (!this.shadowRoot || event.composed)) {
      event.stopPropagation()
    }

    const copy = Reflect.construct(event.constructor, [event.type, event])
    const dispatched = this.dispatchEvent(copy)
    if (!dispatched) {
      event.preventDefault()
    }

    return dispatched
  }

  protected handleInput(event: InputEvent): void {
    this.dirty = true
    this.value = (event.target as HTMLInputElement).value
    this.retargetEvent(event)
    this.reportValidity()
  }

  protected hasCounter(): boolean {
    return this.maxLength > -1
  }

  protected getCounterText(): string {
    const { length } = this.value || ''
    return `${length} / ${this.maxLength || 0}`
  }

  protected getAriaDescribedBy(): string {
    const hasSupport = !!this.getSupportingText()
    if (hasSupport) {
      return this.supportingTextId
    }
    const hasCounter = this.hasCounter()
    if (hasCounter) {
      return this.counterId
    }
    return ''
  }

  #handlePasswordToggle(): void {
    this.#showPassword = !this.#showPassword
    this.requestUpdate()
  }

  protected get effectiveType(): SupportedInputTypes {
    const { type } = this
    if (type !== 'password') {
      return type
    }
    const visible = this.#showPassword
    return visible ? 'text' : 'password'
  }

  protected override render(): TemplateResult {
    const { pressed = false } = this
    const labelResting = this.labelResting()
    const containerClasses = {
      surface: true,
      pressed,
      labelResting,
      labelActive: !labelResting,
      labelHidden: this.labelHidden(),
    }
    return html`
      <div class="${classMap(containerClasses)}">
        <div class="container"></div>
        <div class="content" part="content">
          ${this.renderPrefix()} ${this.renderBody()} ${this.renderPasswordControl()} ${this.renderSuffix()}
          ${this.renderHighlight()}
        </div>
      </div>
      ${this.renderSupportingText()} ${this.renderDataList()}
    `
  }

  protected renderPrefix(): TemplateResult {
    const classes = {
      start: true,
      prefixed: this.hasPrefix,
    }
    return html`<div class="${classMap(classes)}" part="prefix">
      <slot name="prefix" @slotchange=${this.handleSlotChange}></slot>
    </div>`
  }

  protected renderSuffix(): TemplateResult {
    const classes = {
      end: true,
      suffixed: this.hasSuffix,
    }
    return html`<div class="${classMap(classes)}" part="suffix">
      <slot name="suffix" @slotchange=${this.handleSlotChange}></slot>
    </div>`
  }

  protected renderBody(): TemplateResult {
    return html`<div class="body" part="body">${this.renderLabel()} ${this.renderInput()}</div>`
  }

  protected renderLabel(): TemplateResult {
    const label = this.renderLabelText()
    if (!label) {
      return html``
    }
    return html`<span class="label" id="${this.labelId}" title="${label}" part="label">${label}</span>`
  }

  protected renderHighlight(): TemplateResult {
    return html`<span class="highlight"></span>`
  }

  protected abstract renderInput(): TemplateResult

  protected renderSupportingText(): TemplateResult {
    return html` <span class="supporting-text" part="supporting-text"
      >${this.renderSupportingTextValue()} ${this.renderCounter()}</span
    >`
  }

  protected renderSupportingTextValue(): TemplateResult | typeof nothing {
    const text = this.getSupportingText()
    if (!text) {
      return nothing
    }
    const shouldAlert = this.shouldErrorAnnounce()
    return html`
      <span
        class="supporting-text-start"
        id="${this.supportingTextId}"
        role=${ifDefined(shouldAlert ? 'alert' : undefined)}
      >
        ${text}
      </span>
    `
  }

  protected renderCounter(): TemplateResult {
    if (!this.hasCounter()) {
      return html``
    }
    // TODO: add aria-label and announcements
    return html`<span id=${this.counterId} class="supporting-text-end" part="supporting-text-end"
      >${this.getCounterText()}</span
    >`
  }

  protected renderPasswordControl(): TemplateResult | typeof nothing {
    const { type } = this
    if (type !== 'password') {
      return nothing
    }
    const visible = this.#showPassword
    const icon = visible ? 'visibilityOff' : 'visibility'
    return html`
      <ui-icon-button
        aria-label="Toggle password visibility"
        @click="${this.#handlePasswordToggle}"
        title="Shows or hides the password"
        part="password-toggle"
      >
        <ui-icon icon="${icon}"></ui-icon>
      </ui-icon-button>
    `
  }

  protected renderDataList(): TemplateResult | typeof nothing {
    const { list } = this
    if (!Array.isArray(list) || !list.length) {
      return nothing
    }
    return html`<datalist id="input-list">${list.map((i) => html`<option value="${i}"></option>`)}</datalist>`
  }
}
