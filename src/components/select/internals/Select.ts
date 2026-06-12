import { html, PropertyValues, TemplateResult } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import { setDisabled } from '../../../lib/disabled.js'
import { UiElement } from '../../UiElement.js'
import type UiOption from './Option.js'
import type { UiMenuElement } from '../../menu/ui-menu.js'
import { randomId } from '../../../lib/random.js'

import '../../text-field/ui-outlined-text-field.js'
import '../../menu/ui-menu.js'
import '../../icons/ui-icon.js'
import '../../focus-ring/ui-focus-ring.js'

export interface UiSelectChangeEvent {
  value: string | undefined
  item: UiOption | null
}

/**
 * Material Design 3 Select component that behaves like an outlined text field with dropdown.
 *
 * @fires change - Dispatched when the selection changes. The event is non-bubbling and non-cancelable.
 *                 The `event.detail` object contains the `value` and `item` properties.
 * @fires open - Dispatched when the dropdown opens
 * @fires close - Dispatched when the dropdown closes
 */
export default class UiSelect extends UiElement {
  static readonly formAssociated = true
  #internals = this.attachInternals()

  /**
   * The value has a private member so that we can set the value without triggering
   * the side effects.
   */
  #value: string | undefined

  /**
   * Type-ahead search string accumulated from user typing
   */
  #typeAheadString = ''

  /**
   * Timer for resetting the type-ahead search string
   */
  #typeAheadTimer: number | null = null

  /**
   * Timeout duration for type-ahead reset (in milliseconds)
   */
  static readonly TYPE_AHEAD_TIMEOUT = 1000

  /**
   * The currently selected value. Corresponds to the `value` attribute of the selected `ui-option`.
   * When set programmatically, it will update the selected option if a matching option exists.
   *
   * @attribute
   * @example
   * ```html
   * <ui-select value="apple">
   *   <ui-option value="apple">Apple</ui-option>
   *   <ui-option value="banana">Banana</ui-option>
   * </ui-select>
   * ```
   */
  get value(): string | undefined {
    return this.#value
  }

  @property({ type: String })
  set value(newValue: string | undefined) {
    const oldValue = this.#value
    if (newValue === oldValue) return
    this.#value = newValue
    this.requestUpdate()
  }

  /**
   * The name attribute for form submission. This value will be used as the key
   * when the form is submitted.
   *
   * @attribute
   * @example
   * ```html
   * <ui-select name="country" value="us">
   *   <ui-option value="us">United States</ui-option>
   * </ui-select>
   * ```
   */
  @property({ type: String }) accessor name: string | undefined

  /**
   * The label text displayed in the select field. Provides accessible labeling
   * and is shown as the floating label in the outlined text field.
   *
   * @attribute
   * @example
   * ```html
   * <ui-select label="Select a country">
   *   <ui-option value="us">United States</ui-option>
   * </ui-select>
   * ```
   */
  @property({ type: String }) accessor label: string | undefined

  /**
   * Whether the select is required for form validation. When true, the select
   * must have a value selected for the form to be valid.
   *
   * @attribute
   * @example
   * ```html
   * <ui-select required label="Required field">
   *   <ui-option value="option1">Option 1</ui-option>
   * </ui-select>
   * ```
   */
  @property({ type: Boolean }) accessor required = false

  /**
   * Whether the select is in an invalid state. This is typically set automatically
   * during validation, but can be set manually to indicate validation errors.
   *
   * @attribute
   * @example
   * ```html
   * <ui-select invalid invalidText="Please select a valid option">
   *   <ui-option value="option1">Option 1</ui-option>
   * </ui-select>
   * ```
   */
  @property({ type: Boolean }) accessor invalid: boolean | undefined

  /**
   * The error message to display when the select is invalid. This text is shown
   * below the select field when `invalid` is true.
   *
   * @attribute
   * @example
   * ```html
   * <ui-select invalid invalidText="This field is required">
   *   <ui-option value="option1">Option 1</ui-option>
   * </ui-select>
   * ```
   */
  @property({ type: String }) accessor invalidText: string | undefined

  /**
   * @attribute
   */
  @property({ type: String }) accessor supportingText: string | undefined

  /**
   * Whether the select is disabled. When disabled, the select cannot be interacted
   * with and will not receive focus or respond to user input.
   *
   * @default false
   * @attribute
   * @example
   * ```html
   * <ui-select disabled label="Disabled select">
   *   <ui-option value="option1">Option 1</ui-option>
   * </ui-select>
   * ```
   */
  @property({ type: Boolean, reflect: true }) accessor disabled = false

  /**
   * Whether the dropdown menu is currently open. This property reflects the
   * current state of the dropdown and can be set programmatically to open/close it.
   *
   * @default false
   * @example
   * ```javascript
   * // Open the dropdown programmatically
   * selectElement.open = true;
   *
   * // Close the dropdown
   * selectElement.open = false;
   * ```
   */
  @property({ type: Boolean, reflect: true }) accessor open = false

  @state() accessor selectedOption: UiOption | null = null

  @query('.menu') accessor menu!: UiMenuElement

  /**
   * Returns the currently selected option element. This provides access to the
   * full `ui-option` element, not just its value.
   *
   * @readonly
   * @example
   * ```javascript
   * const select = document.querySelector('ui-select');
   * const selectedItem = select.selectedItem;
   * if (selectedItem) {
   *   console.log('Selected option:', selectedItem.textContent);
   * }
   * ```
   */
  get selectedItem(): UiOption | null {
    return this.selectedOption
  }

  /**
   * Returns the text content that should be displayed in the select field.
   * This is the rendered value of the currently selected option.
   *
   * @readonly
   * @example
   * ```javascript
   * const select = document.querySelector('ui-select');
   * console.log('Display text:', select.renderValue);
   * ```
   */
  get renderValue(): string {
    const item = this.selectedOption
    return item ? item.renderValue : ''
  }

  /**
   * Returns the form element that contains this select, if any.
   * Part of the form-associated custom element API.
   *
   * @readonly
   */
  get form(): HTMLFormElement | null {
    return this.#internals.form
  }

  /**
   * Returns the validity state of the select element.
   * Part of the form-associated custom element API.
   *
   * @readonly
   */
  get validity(): ValidityState {
    return this.#internals.validity
  }

  /**
   * Returns the validation message for the select element.
   * Part of the form-associated custom element API.
   *
   * @readonly
   */
  get validationMessage(): string {
    return this.#internals.validationMessage
  }

  /**
   * Returns whether the select element will be validated when the form is submitted.
   * Part of the form-associated custom element API.
   *
   * @readonly
   */
  get willValidate(): boolean {
    return this.#internals.willValidate
  }

  /**
   * Checks the validity of the select element and returns true if valid.
   * Part of the form-associated custom element API.
   *
   * @returns {boolean} True if the element is valid, false otherwise
   * @example
   * ```javascript
   * const select = document.querySelector('ui-select');
   * if (!select.checkValidity()) {
   *   console.log('Select is invalid:', select.validationMessage);
   * }
   * ```
   */
  checkValidity(): boolean {
    return this.#internals.checkValidity()
  }

  constructor() {
    super()
    this.addEventListener('click', this.handleClick.bind(this))
    this.addEventListener('blur', this.handleBlur.bind(this))
    this.addEventListener('keydown', this.handleKeydown.bind(this))
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.setAttribute('role', 'combobox')
    this.setAttribute('aria-haspopup', 'listbox')
    this.setAttribute('aria-controls', 'menu')
    if (!this.disabled) {
      this.setAttribute('tabindex', '0')
    }
    if (!this.id) {
      this.id = randomId('select')
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    // Clean up the type-ahead timer
    if (this.#typeAheadTimer) {
      clearTimeout(this.#typeAheadTimer)
      this.#typeAheadTimer = null
    }
  }

  /**
   * Resets the select to its initial state. Called automatically when the parent
   * form is reset. Part of the form-associated custom element API.
   *
   * @example
   * ```javascript
   * const select = document.querySelector('ui-select');
   * select.formResetCallback(); // Clears the selection
   * ```
   */
  formResetCallback(): void {
    this.value = undefined
  }

  /**
   * Restores the select's state from saved form data. Called automatically when
   * the browser restores form state. Part of the form-associated custom element API.
   *
   * @param {string | null} state - The saved state to restore
   */
  formStateRestoreCallback(state: string | null): void {
    this.value = state ?? undefined
  }

  /**
   * Validates the select element and updates its validity state. This is called
   * automatically during property changes, but can be called manually to trigger validation.
   *
   * @example
   * ```javascript
   * const select = document.querySelector('ui-select');
   * select.validate();
   * if (select.invalid) {
   *   console.log('Validation failed:', select.invalidText);
   * }
   * ```
   */
  validate(): void {
    let message = ''
    if (this.required && !this.value) {
      message = 'Please select an item.'
      this.#internals.setValidity({ valueMissing: true }, message)
    } else {
      this.#internals.setValidity({})
    }
    this.invalid = !this.#internals.validity.valid
    this.invalidText = message
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties)
    if (changedProperties.has('disabled')) {
      setDisabled(this, this.disabled)
    }
    if (changedProperties.has('open')) {
      this.handleOpenChange()
    }
    if (changedProperties.has('value')) {
      this.setCurrentOption()
      this.#internals.setFormValue(this.value ?? null)
      this.validate()
    }
    if (changedProperties.has('label')) {
      if (this.label) {
        this.setAttribute('aria-label', this.label)
      } else {
        this.removeAttribute('aria-label')
      }
    }
  }

  protected override firstUpdated(cp: PropertyValues): void {
    super.firstUpdated(cp)
    this.updateComplete.then(() => {
      this.setCurrentOption()
      this.#internals.setFormValue(this.value ?? null)
      // We need to update here as event with `value` and `selectedOption`
      // already set, the `renderValue` might have incorrect value
      // due to the DOM update.
      this.requestUpdate()
    })
  }

  protected setCurrentOption(): void {
    const options = this.querySelectorAll<UiOption>('ui-option')
    if (this.value) {
      this.selectedOption = Array.from(options).find((option) => option.value === this.value) || null
    } else {
      const selected = Array.from(options).find((option) => option.selected)
      if (selected) {
        this.selectedOption = selected
        this.#value = selected.value
      } else {
        this.selectedOption = null
      }
    }
  }

  protected handleKeydown(e: KeyboardEvent): void {
    if (this.disabled || e.defaultPrevented) return

    // Handle type-ahead for printable characters
    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      this.handleTypeAhead(e.key.toLowerCase())
      return
    }

    if (this.open) {
      switch (e.key) {
        case 'Tab': {
          // If menu is open and Tab is pressed, close it and allow normal tab navigation
          if (this.open) {
            this.open = false
          }
          break
        }
        case 'Escape': {
          if (this.open) {
            e.preventDefault()
            this.open = false
            this.focus() // Return focus to the select element
          }
          break
        }
        case 'ArrowDown':
          e.preventDefault()
          this.focusNextMenuItem()
          return
        case 'ArrowUp':
          e.preventDefault()
          this.focusPreviousMenuItem()
          return
        case 'Home':
          e.preventDefault()
          this.focusFirstMenuItem()
          return
        case 'End':
          e.preventDefault()
          this.focusLastMenuItem()
          return
        case 'Enter':
        case ' ': {
          const currentItem = this.querySelector<UiOption>(':focus')
          if (currentItem && this.isOptionSelectable(currentItem)) {
            e.preventDefault()
            this.menu.notifySelect(currentItem)
          }
          return
        }
      }
    } else {
      switch (e.key) {
        case 'Enter':
        case ' ': {
          if (!this.open) {
            e.preventDefault()
            this.open = true
          }
          break
        }
        case 'ArrowDown':
        case 'ArrowUp': {
          if (!this.open) {
            e.preventDefault()
            this.open = true
          }
          // If menu is open, let the menu handle arrow keys
          break
        }
      }
    }
  }

  protected handleBlur(e: FocusEvent): void {
    if (this.disabled) return

    // Check if focus is moving to the menu or one of its children
    const relatedTarget = e.relatedTarget as HTMLElement

    if (relatedTarget && this.contains(relatedTarget)) {
      // Focus is moving to the menu, keep it open
      return
    }

    // Close the menu when focus leaves the component
    this.open = false
  }

  override handleClick(e: Event): void {
    if (this.disabled || e.defaultPrevented) return
    e.preventDefault()
    e.stopPropagation()
    if (this.open && e.target === this) {
      // If the select is already open and clicked again, close it
      this.open = false
      return
    }
    this.open = true
  }

  protected async handleOpenChange(): Promise<void> {
    const menu = this.menu
    if (!menu) {
      // The status can be set before the menu is rendered
      return
    }
    this.setAttribute('aria-expanded', String(this.open))
    if (this.open) {
      menu.showPopover()
      // Focus on the selected option or first selectable option when menu opens
      if (this.selectedOption && this.isOptionSelectable(this.selectedOption)) {
        this.selectedOption.focus()
        this.selectedOption.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'nearest' })
      } else {
        const firstSelectableOption = this.getFirstSelectableOption()
        if (firstSelectableOption) {
          firstSelectableOption.focus()
          firstSelectableOption.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'nearest' })
        }
      }
      this.dispatchEvent(new CustomEvent('open'))
    } else {
      menu.hidePopover()
      this.dispatchEvent(new CustomEvent('close'))
      // Return focus to the select element when menu closes
      this.focus()
    }
  }

  /**
   * Focus the next menu item in the dropdown, skipping disabled options
   */
  focusNextMenuItem(): void {
    const currentItem = this.querySelector<UiOption>(':focus')
    const nextItem = currentItem ? this.getNextSelectableOption(currentItem) : this.getFirstSelectableOption()
    if (nextItem) {
      nextItem.focus()
    }
  }

  /**
   * Focus the previous menu item in the dropdown, skipping disabled options
   */
  focusPreviousMenuItem(): void {
    const currentItem = this.querySelector<UiOption>(':focus')
    const previousItem = currentItem ? this.getPreviousSelectableOption(currentItem) : this.getLastSelectableOption()
    if (previousItem) {
      previousItem.focus()
    }
  }

  /**
   * Focus the first menu item in the dropdown, skipping disabled options
   */
  focusFirstMenuItem(): void {
    const firstItem = this.getFirstSelectableOption()
    if (firstItem) {
      firstItem.focus()
    }
  }

  /**
   * Focus the last menu item in the dropdown, skipping disabled options
   */
  focusLastMenuItem(): void {
    const lastItem = this.getLastSelectableOption()
    if (lastItem) {
      lastItem.focus()
    }
  }

  /**
   * Gets the first selectable (non-disabled) option
   */
  getFirstSelectableOption(): UiOption | null {
    const options = this.querySelectorAll<UiOption>('ui-option')
    for (const option of options) {
      if (this.isOptionSelectable(option)) {
        return option
      }
    }
    return null
  }

  /**
   * Gets the last selectable (non-disabled) option
   */
  getLastSelectableOption(): UiOption | null {
    const options = Array.from(this.querySelectorAll<UiOption>('ui-option')).reverse()
    for (const option of options) {
      if (this.isOptionSelectable(option)) {
        return option
      }
    }
    return null
  }

  /**
   * Gets the next selectable option after the current one, wrapping around if needed
   */
  protected getNextSelectableOption(currentOption: UiOption): UiOption | null {
    const options = Array.from(this.querySelectorAll<UiOption>('ui-option'))
    const currentIndex = options.indexOf(currentOption)

    if (currentIndex === -1) {
      return this.getFirstSelectableOption()
    }

    // Start from the next option and wrap around
    for (let i = 1; i < options.length; i++) {
      const nextIndex = (currentIndex + i) % options.length
      const option = options[nextIndex]
      if (this.isOptionSelectable(option)) {
        return option
      }
    }

    return currentOption // Return current if no other selectable option found
  }

  /**
   * Gets the previous selectable option before the current one, wrapping around if needed
   */
  protected getPreviousSelectableOption(currentOption: UiOption): UiOption | null {
    const options = Array.from(this.querySelectorAll<UiOption>('ui-option'))
    const currentIndex = options.indexOf(currentOption)

    if (currentIndex === -1) {
      return this.getLastSelectableOption()
    }

    // Start from the previous option and wrap around
    for (let i = 1; i < options.length; i++) {
      const prevIndex = (currentIndex - i + options.length) % options.length
      const option = options[prevIndex]
      if (this.isOptionSelectable(option)) {
        return option
      }
    }

    return currentOption // Return current if no other selectable option found
  }

  /**
   * Checks if an option is selectable (not disabled and not hidden)
   */
  protected isOptionSelectable(option: UiOption): boolean {
    if (option.disabled) {
      return false
    }
    if (option.hasAttribute('disabled')) {
      return false
    }
    if (option.hidden && option.hasAttribute('hidden')) {
      return false
    }
    return true
  }

  /**
   * Handles type-ahead functionality for keyboard navigation
   */
  protected handleTypeAhead(char: string): void {
    // Clear the existing timer
    if (this.#typeAheadTimer) {
      clearTimeout(this.#typeAheadTimer)
    }

    // Add the character to the search string
    this.#typeAheadString += char

    // Find the matching option
    const matchingOption = this.findOptionByTypeAhead(this.#typeAheadString)
    if (matchingOption) {
      if (this.open) {
        // If menu is open, focus the matching option
        matchingOption.focus()
      } else {
        // If menu is closed, select the matching option
        this.selectOption(matchingOption)
      }
    }

    // Set a timer to reset the search string
    this.#typeAheadTimer = window.setTimeout(() => {
      this.#typeAheadString = ''
      this.#typeAheadTimer = null
    }, UiSelect.TYPE_AHEAD_TIMEOUT)
  }

  /**
   * Finds an option that matches the type-ahead search string
   */
  protected findOptionByTypeAhead(searchString: string): UiOption | null {
    const options = this.querySelectorAll<UiOption>('ui-option')

    for (const option of options) {
      if (!this.isOptionSelectable(option)) {
        continue
      }

      // Get the option's text content for comparison
      const optionText = this.getOptionDisplayText(option).toLowerCase()

      if (optionText.startsWith(searchString)) {
        return option
      }
    }

    return null
  }

  /**
   * Gets the display text for an option (either textContent or renderValue)
   */
  protected getOptionDisplayText(option: UiOption): string {
    // Use renderValue if available, otherwise fall back to textContent
    return option.renderValue || option.textContent?.trim() || ''
  }

  /**
   * Selects an option and updates the component state
   */
  protected selectOption(option: UiOption): void {
    if (this.selectedOption && this.selectedOption !== option) {
      this.selectedOption.selected = false
    }

    option.selected = true
    this.selectedOption = option
    this.#value = option.value
    this.#internals.setFormValue(this.value ?? null)

    this.dispatchChangeEvent(option)
  }

  protected handleSelect(e: CustomEvent<{ item: UiOption }>): void {
    e.stopPropagation()
    const item = e.detail.item
    if (this.selectedOption && this.selectedOption !== item) {
      this.selectedOption.selected = false
    }
    item.selected = true
    this.selectedOption = item
    this.#value = item.value
    this.#internals.setFormValue(this.value ?? null)
    this.open = false

    // Dispatch change event
    this.dispatchChangeEvent(item)
    // Focus will be returned to select element by handleOpenChange when open=false
  }

  protected handleMenuClose(): void {
    this.open = false
    // Focus will be returned to select element by handleOpenChange when open=false
  }

  protected handleMenuToggle(e: ToggleEvent): void {
    if (e.newState === 'closed') {
      this.open = false
    }
  }

  protected dispatchChangeEvent(item: UiOption): void {
    const changeEvent = new CustomEvent<UiSelectChangeEvent>('change', {
      detail: { value: this.value, item },
      bubbles: false,
      composed: false,
    })
    this.dispatchEvent(changeEvent)
  }

  protected renderInput(): TemplateResult {
    const styles = {
      'anchor-name': `--${this.id}`,
    }
    return html`<ui-outlined-text-field
      .name=${this.name}
      .label=${this.label}
      .value=${this.renderValue}
      .disabled=${this.disabled}
      .required=${this.required}
      readonly
      tabindex="-1"
      .inert=${true}
      aria-hidden="true"
      .invalid=${this.invalid}
      .invalidText=${this.invalidText || ''}
      .supportingText=${this.supportingText || ''}
      class="input"
      style=${styleMap(styles)}
      part="input"
    >
      <ui-icon part="icon" slot="suffix">arrow_drop_down</ui-icon>
    </ui-outlined-text-field>`
  }

  protected renderMenu(): TemplateResult {
    const styles = {
      'position-anchor': `--${this.id}`,
    }
    return html`<ui-menu
      id="menu"
      class="menu"
      part="menu"
      style=${styleMap(styles)}
      .positionAnchor=${this.shadowRoot?.querySelector<HTMLElement>('.input') || undefined}
      popover="auto"
      selector="ui-option"
      @select="${this.handleSelect}"
      @close="${this.handleMenuClose}"
      @toggle="${this.handleMenuToggle}"
    >
      <slot @slotchange="${this.handleSlotChange}"></slot>
    </ui-menu>`
  }

  protected async handleSlotChange(): Promise<void> {
    // When options change, re-evaluate the current selection
    // only if we don't have an explicit value set
    if (!this.value) {
      this.setCurrentOption()
      this.requestUpdate()
    }
  }

  protected renderFocusRing(): TemplateResult {
    return html`<ui-focus-ring part="focus-ring" class="focus-ring" .control="${this as HTMLElement}"></ui-focus-ring>`
  }

  override render(): TemplateResult {
    const classes = {
      'ui-select': true,
      'open': this.open,
      'disabled': this.disabled,
    }
    return html`${this.renderFocusRing()}
      <div class=${classMap(classes)}>${this.renderInput()} ${this.renderMenu()}</div> `
  }
}
