import { LitElement, html, TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { modalStyles } from './internals/DatePicker.styles.js'
import { DateRange, formatDate, parseDate } from './internals/DatePickerUtils.js'
import '../../components/dialog/ui-dialog.js'
import '../../components/button/ui-button.js'
import '../../components/icon-button/ui-icon-button.js'
import '../../components/text-field/ui-outlined-text-field.js'
import '../../components/icons/ui-icon.js'

export interface ModalInputDatePickerChangeEvent {
  range: DateRange
  formattedRange: {
    start: string | null
    end: string | null
  }
}

/**
 * A modal date input picker for manual date entry using keyboard.
 * Ideal for compact layouts and precise date entry. Supports both single
 * date selection and date range selection modes.
 *
 * ## Features
 * - Manual date entry with keyboard input
 * - Single date and date range modes
 * - Input validation with error messages
 * - Min/max date constraints
 * - Multiple date format support (MM/DD/YYYY, MM-DD-YYYY, YYYY-MM-DD)
 * - Accessible design with proper ARIA labels and semantic HTML
 * - Real-time validation feedback
 *
 * ## Events
 *
 * ### `date-input-change`
 * Fired when a valid date is entered in the input fields.
 *
 * **Detail for range mode:**
 * ```typescript
 * {
 *   range: DateRange,
 *   formattedRange: {
 *     start: string | null,
 *     end: string | null
 *   }
 * }
 * ```
 *
 * **Detail for single date mode:**
 * ```typescript
 * {
 *   date: Date,
 *   formattedDate: string
 * }
 * ```
 *
 * ### `modal-input-close`
 * Fired when the modal is closed, either by confirmation or cancellation.
 *
 * **Detail:**
 * ```typescript
 * {
 *   confirmed: boolean,
 *   date?: Date | null,     // Available in single date mode
 *   range?: DateRange | null // Available in range mode
 * }
 * ```
 *
 * ## Usage
 *
 * ### Range mode (default)
 * ```html
 * <ui-date-picker-modal-input
 *   .open=${true}
 *   .selectedRange=${{ start: new Date(), end: null }}
 *   @date-input-change=${this.handleRangeChange}
 *   @modal-input-close=${this.handleClose}
 * ></ui-date-picker-modal-input>
 * ```
 *
 * ### Single date mode
 * ```html
 * <ui-date-picker-modal-input
 *   .rangeMode=${false}
 *   .selectedDate=${new Date()}
 *   @date-input-change=${this.handleDateChange}
 *   @modal-input-close=${this.handleClose}
 * ></ui-date-picker-modal-input>
 * ```
 *
 * ### With constraints
 * ```html
 * <ui-date-picker-modal-input
 *   .minDate=${new Date('2024-01-01')}
 *   .maxDate=${new Date('2024-12-31')}
 *   .locale=${'en-US'}
 * ></ui-date-picker-modal-input>
 * ```
 */
@customElement('ui-date-picker-modal-input')
export class UiDatePickerModalInput extends LitElement {
  static override styles = modalStyles

  /**
   * Whether the modal is open
   */
  @property({ type: Boolean }) accessor open = false

  /**
   * The modal title
   */
  @property({ type: String }) override accessor title = 'Enter dates'

  /**
   * Whether to use range mode (two date inputs) or single date mode
   */
  @property({ type: Boolean }) accessor rangeMode = false

  /**
   * Label for the start date (or single date)
   */
  @property({ type: String }) accessor startLabel = 'Start date'

  /**
   * Label for the end date (only used in range mode)
   */
  @property({ type: String }) accessor endLabel = 'End date'

  /**
   * Placeholder for date inputs
   */
  @property({ type: String }) accessor placeholder = 'MM/DD/YYYY'

  /**
   * The selected date (single mode)
   */
  @property({ type: Object }) accessor selectedDate: Date | null = null

  /**
   * The selected date range (range mode)
   */
  @property({ type: Object }) accessor selectedRange: DateRange | null = null

  /**
   * Minimum selectable date
   */
  @property({ type: Object }) accessor minDate: Date | undefined = undefined

  /**
   * Maximum selectable date
   */
  @property({ type: Object }) accessor maxDate: Date | undefined = undefined

  /**
   * Locale for date formatting
   */
  @property({ type: String }) accessor locale: string | undefined = undefined

  @state() private accessor startInput = ''

  @state() private accessor endInput = ''

  @state() private accessor startError = ''

  @state() private accessor endError = ''

  constructor() {
    super()
    // Initialize boolean properties to false first, then set intended defaults
    this.open = false
    this.rangeMode = true // Default to range mode as documented
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.updateInputValues()
  }

  override willUpdate(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.has('selectedDate') || changedProperties.has('selectedRange')) {
      this.updateInputValues()
    }
  }

  private updateInputValues(): void {
    if (this.rangeMode && this.selectedRange) {
      this.startInput = this.selectedRange.start ? formatDate(this.selectedRange.start, this.locale) : ''
      this.endInput = this.selectedRange.end ? formatDate(this.selectedRange.end, this.locale) : ''
    } else if (!this.rangeMode && this.selectedDate) {
      this.startInput = formatDate(this.selectedDate, this.locale)
    }
  }

  private validateDate(dateString: string, isEndDate = false): Date | null {
    if (!dateString.trim()) return null

    const parsedDate = parseDate(dateString)
    if (!parsedDate) return null

    // Check min/max constraints
    if (this.minDate && parsedDate < this.minDate) return null
    if (this.maxDate && parsedDate > this.maxDate) return null

    // For range mode, validate end date is after start date
    if (this.rangeMode && isEndDate) {
      const startDate = parseDate(this.startInput)
      if (startDate && parsedDate < startDate) return null
    }

    return parsedDate
  }

  private handleStartInput(event: Event): void {
    const target = event.target as HTMLInputElement
    this.startInput = target.value
    this.startError = ''

    if (this.startInput.trim()) {
      const date = this.validateDate(this.startInput)
      if (!date) {
        this.startError = 'Invalid date format or out of range'
        return
      }

      if (this.rangeMode) {
        const currentRange = this.selectedRange || { start: null, end: null }
        this.selectedRange = { ...currentRange, start: date }
      } else {
        this.selectedDate = date
      }

      this.dispatchChangeEvent()
    }
  }

  private handleEndInput(event: Event): void {
    const target = event.target as HTMLInputElement
    this.endInput = target.value
    this.endError = ''

    if (this.endInput.trim()) {
      const date = this.validateDate(this.endInput, true)
      if (!date) {
        this.endError = 'Invalid date format, out of range, or before start date'
        return
      }

      const currentRange = this.selectedRange || { start: null, end: null }
      this.selectedRange = { ...currentRange, end: date }
      this.dispatchChangeEvent()
    }
  }

  private handleCancel(): void {
    this.dispatchCloseEvent(false)
  }

  private handleConfirm(): void {
    // Validate all inputs before confirming
    let hasErrors = false

    if (this.rangeMode) {
      if (!this.startInput.trim()) {
        this.startError = 'Start date is required'
        hasErrors = true
      } else if (!this.validateDate(this.startInput)) {
        this.startError = 'Invalid start date'
        hasErrors = true
      }

      if (!this.endInput.trim()) {
        this.endError = 'End date is required'
        hasErrors = true
      } else if (!this.validateDate(this.endInput, true)) {
        this.endError = 'Invalid end date'
        hasErrors = true
      }
    } else {
      if (!this.startInput.trim()) {
        this.startError = 'Date is required'
        hasErrors = true
      } else if (!this.validateDate(this.startInput)) {
        this.startError = 'Invalid date'
        hasErrors = true
      }
    }

    if (!hasErrors) {
      this.dispatchCloseEvent(true)
    }
  }

  private dispatchChangeEvent(): void {
    if (this.rangeMode && this.selectedRange) {
      const event: ModalInputDatePickerChangeEvent = {
        range: this.selectedRange,
        formattedRange: {
          start: this.selectedRange.start ? formatDate(this.selectedRange.start, this.locale) : null,
          end: this.selectedRange.end ? formatDate(this.selectedRange.end, this.locale) : null,
        },
      }

      this.dispatchEvent(
        new CustomEvent('date-input-change', {
          detail: event,
          bubbles: true,
          composed: true,
        })
      )
    } else if (!this.rangeMode && this.selectedDate) {
      this.dispatchEvent(
        new CustomEvent('date-input-change', {
          detail: {
            date: this.selectedDate,
            formattedDate: formatDate(this.selectedDate, this.locale),
          },
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  private dispatchCloseEvent(confirmed: boolean): void {
    this.dispatchEvent(
      new CustomEvent('modal-input-close', {
        detail: {
          confirmed,
          date: confirmed && !this.rangeMode ? this.selectedDate : null,
          range: confirmed && this.rangeMode ? this.selectedRange : null,
        },
        bubbles: true,
        composed: true,
      })
    )
  }

  private renderHeader(): TemplateResult {
    return html`
      <header class="modal-header">
        <h2 id="modal-title" class="modal-title">${this.title}</h2>
        <ui-icon-button @click=${this.handleCancel} aria-label="Close" title="Close">
          <ui-icon icon="close"></ui-icon>
        </ui-icon-button>
      </header>
    `
  }

  private renderInputs(): TemplateResult {
    return html`
      <main class="modal-content">
        <div class="input-container" role="form" aria-labelledby="modal-title">
          <fieldset>
            <legend class="visually-hidden">${this.rangeMode ? 'Enter date range' : 'Enter date'}</legend>

            <ui-outlined-text-field
              .label=${this.rangeMode ? this.startLabel : 'Date'}
              .placeholder=${this.placeholder}
              .value=${this.startInput}
              .invalidText=${this.startError}
              ?invalid=${!!this.startError}
              @input=${this.handleStartInput}
              required
              aria-describedby="format-help"
            >
              <ui-icon slot="suffix" icon="calendarToday"></ui-icon>
            </ui-outlined-text-field>

            ${this.rangeMode
              ? html`
                  <ui-outlined-text-field
                    .label=${this.endLabel}
                    .placeholder=${this.placeholder}
                    .value=${this.endInput}
                    .invalidText=${this.endError}
                    ?invalid=${!!this.endError}
                    @input=${this.handleEndInput}
                    required
                    aria-describedby="format-help"
                  >
                    <ui-icon slot="suffix" icon="calendarToday"></ui-icon>
                  </ui-outlined-text-field>
                `
              : ''}
          </fieldset>

          <aside id="format-help" class="format-help" role="note" aria-label="Date format information">
            <p class="help-title">
              <strong>Supported formats:</strong><br />
              MM/DD/YYYY, MM-DD-YYYY, YYYY-MM-DD
            </p>
            <p class="help-examples"><strong>Examples:</strong> 12/25/2024, 12-25-2024, 2024-12-25</p>
          </aside>
        </div>
      </main>
    `
  }

  private renderActions(): TemplateResult {
    const hasValidInput = this.rangeMode
      ? this.startInput.trim() && this.endInput.trim() && !this.startError && !this.endError
      : this.startInput.trim() && !this.startError

    return html`
      <footer class="modal-actions">
        <ui-button color="text" @click=${this.handleCancel}>Cancel</ui-button>
        <ui-button color="filled" @click=${this.handleConfirm} .disabled=${!hasValidInput}> Confirm </ui-button>
      </footer>
    `
  }

  override render(): TemplateResult {
    return html`
      <ui-dialog .open=${this.open} @close=${this.handleCancel}>
        ${this.renderHeader()} ${this.renderInputs()} ${this.renderActions()}
      </ui-dialog>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-date-picker-modal-input': UiDatePickerModalInput
  }

  interface HTMLElementEventMap {
    'date-input-change': CustomEvent<
      | ModalInputDatePickerChangeEvent
      | {
          date: Date
          formattedDate: string
        }
    >
    'modal-input-close': CustomEvent<{
      confirmed: boolean
      date?: Date | null
      range?: DateRange | null
    }>
  }
}
