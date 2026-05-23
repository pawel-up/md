import { LitElement, html, TemplateResult } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'
import { inputStyles } from './internals/DatePicker.styles.js'
import { formatDate, parseDate } from './internals/DatePickerUtils.js'
import type { DateSelectEvent } from './internals/DatePickerCalendar.js'
import './internals/DatePickerCalendar.js'
import '../../components/text-field/ui-outlined-text-field.js'
import '../../components/icons/ui-icon.js'

/**
 * A docked date picker that opens from a text field input.
 * Ideal for forms and date selection in medium to large layouts.
 *
 * ## Features
 * - Text field input with calendar dropdown
 * - Keyboard navigation support (Arrow Down, Enter, Escape)
 * - Custom date formatting
 * - Input validation and error handling
 * - Min/max date constraints
 * - Disabled dates support
 * - Accessible design with proper ARIA attributes
 * - CSS Anchor Positioning API for dropdown placement
 *
 * ## Events
 *
 * ### `change`
 * Fired when the selected date changes.
 *
 * **Detail:**
 * ```typescript
 * {
 *   value: Date | null,
 *   formattedValue: string
 * }
 * ```
 *
 * ## Usage
 *
 * ### Basic usage
 * ```html
 * <ui-date-picker-input
 *   label="Select date"
 *   name="birthDate"
 *   placeholder="MM/DD/YYYY"
 *   .value=${new Date()}
 *   @change=${this.handleDateChange}
 * ></ui-date-picker-input>
 * ```
 *
 * ### With validation
 * ```html
 * <ui-date-picker-input
 *   label="Birth date"
 *   name="birthDate"
 *   required
 *   .error=${this.hasError}
 *   .errorMessage=${"Please select a valid date"}
 *   .minDate=${new Date('1900-01-01')}
 *   .maxDate=${new Date()}
 * ></ui-date-picker-input>
 * ```
 *
 * ### Custom date format
 * ```html
 * <ui-date-picker-input
 *   label="Birth date"
 *   .dateFormat=${date => date.toLocaleDateString('en-GB')}
 * ></ui-date-picker-input>
 * ```
 *
 * ### With disabled dates
 * ```html
 * <ui-date-picker-input
 *   label="Appointment date"
 *   .disabledDates=${[new Date('2024-12-25'), new Date('2024-01-01')]}
 * ></ui-date-picker-input>
 * ```
 */
@customElement('ui-date-picker-input')
export class UiDatePickerInput extends LitElement {
  static override styles = inputStyles
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  }

  /**
   * The label for the input field
   */
  @property({ type: String }) accessor label = ''

  /**
   * The name attribute for the input field (for form handling)
   */
  @property({ type: String }) accessor name = ''

  /**
   * Placeholder text for the input
   */
  @property({ type: String }) accessor placeholder = 'MM/DD/YYYY'

  /**
   * The currently selected date
   */
  @property({ type: Object }) accessor value: Date | null = null

  /**
   * Whether the date picker is disabled
   */
  @property({ type: Boolean }) accessor disabled = false

  /**
   * Whether the input is required
   */
  @property({ type: Boolean }) accessor required = false

  /**
   * Error message to display
   */
  @property({ type: String }) accessor errorMessage = ''

  /**
   * Whether the input has an error state
   */
  @property({ type: Boolean }) accessor error = false

  /**
   * Minimum selectable date
   */
  @property({ type: Object }) accessor minDate: Date | undefined = undefined

  /**
   * Maximum selectable date
   */
  @property({ type: Object }) accessor maxDate: Date | undefined = undefined

  /**
   * Array of disabled dates
   */
  @property({ type: Array }) accessor disabledDates: Date[] | undefined = undefined

  /**
   * Locale for date formatting
   */
  @property({ type: String }) accessor locale: string | undefined = undefined

  /**
   * Custom date format function
   */
  @property({ type: Object }) accessor dateFormat: ((date: Date) => string) | undefined = undefined

  @state() private accessor isOpen = false

  @state() private accessor inputValue = ''

  @query('ui-outlined-text-field') private accessor textField!: HTMLElement

  constructor() {
    super()
    // Initialize boolean properties to false as per Lit best practices
    this.disabled = false
    this.required = false
    this.error = false
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.updateInputValue()
    document.addEventListener('click', this.handleDocumentClick.bind(this))
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    document.removeEventListener('click', this.handleDocumentClick.bind(this))
  }

  override willUpdate(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.has('value')) {
      this.updateInputValue()
    }
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.has('isOpen') && this.isOpen) {
      // Set anchor name on text field for CSS Anchor Positioning API
      if (this.textField) {
        // Using setProperty since anchorName is not in TypeScript types yet
        this.textField.style.setProperty('anchor-name', '--ui-date-picker-anchor')
      }
    }
  }

  private updateInputValue(): void {
    if (this.value) {
      this.inputValue = this.dateFormat ? this.dateFormat(this.value) : formatDate(this.value, this.locale)
    } else {
      this.inputValue = ''
    }
  }

  private handleDocumentClick(event: Event): void {
    if (!this.contains(event.target as Node)) {
      this.isOpen = false
    }
  }

  private handleInputClick(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen
    }
  }

  private handleInputChange(event: Event): void {
    const target = event.target as HTMLInputElement
    this.inputValue = target.value

    const parsedDate = parseDate(this.inputValue)
    if (parsedDate) {
      this.value = parsedDate
      this.dispatchChangeEvent()
    }
  }

  private handleCalendarDateSelect(event: CustomEvent<DateSelectEvent>): void {
    this.value = event.detail.date
    this.isOpen = false
    this.dispatchChangeEvent()
  }

  private handleCalendarDateCancel(): void {
    this.isOpen = false
  }

  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        this.isOpen = false
        break
      case 'ArrowDown':
        if (!this.isOpen) {
          event.preventDefault()
          this.isOpen = true
        }
        break
      case 'Enter':
        if (this.isOpen) {
          event.preventDefault()
          this.isOpen = false
        }
        break
    }
  }

  private dispatchChangeEvent(): void {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: this.value,
          formattedValue: this.inputValue,
        },
        bubbles: true,
        composed: true,
      })
    )
  }

  private renderCalendarIcon(): TemplateResult {
    return html`
      <ui-icon slot="suffix" icon="calendarToday" @click=${this.handleInputClick} class="calendar-icon"></ui-icon>
    `
  }

  private renderDropdown(): TemplateResult | null {
    if (!this.isOpen) return null

    const currentDate = this.value || new Date()

    return html`
      <div class="dropdown-container">
        <ui-date-picker-calendar
          .year=${currentDate.getFullYear()}
          .month=${currentDate.getMonth()}
          .selectedDate=${this.value}
          .minDate=${this.minDate}
          .maxDate=${this.maxDate}
          .disabledDates=${this.disabledDates}
          .locale=${this.locale}
          showActions
          @date-select=${this.handleCalendarDateSelect}
          @date-cancel=${this.handleCalendarDateCancel}
        ></ui-date-picker-calendar>
      </div>
    `
  }

  override render(): TemplateResult {
    return html`
      <div class="input-container">
        ${this.isOpen ? html`<div class="backdrop" @click=${() => (this.isOpen = false)}></div>` : ''}
        <ui-outlined-text-field
          .label=${this.label}
          .name=${this.name}
          .placeholder=${this.placeholder}
          .value=${this.inputValue}
          .disabled=${this.disabled}
          .required=${this.required}
          ?invalid=${this.error}
          .invalidText=${this.errorMessage}
          readonly
          @click=${this.handleInputClick}
          @input=${this.handleInputChange}
          @keydown=${this.handleKeyDown}
        >
          ${this.renderCalendarIcon()}
        </ui-outlined-text-field>
        ${this.renderDropdown()}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-date-picker-input': UiDatePickerInput
  }

  interface HTMLElementEventMap {
    change: CustomEvent<{
      value: Date | null
      formattedValue: string
    }>
  }
}
