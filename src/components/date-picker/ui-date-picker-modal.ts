import { LitElement, html, TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { modalStyles } from './internals/DatePicker.styles.js'
import { DateRange, formatDate } from './internals/DatePickerUtils.js'
import type { DateRangeSelectEvent } from './internals/DatePickerCalendar.js'
import './internals/DatePickerCalendar.js'
import '../../components/dialog/ui-dialog.js'
import '../../components/button/ui-button.js'
import '../../components/icon-button/ui-icon-button.js'
import '../../components/icons/ui-icon.js'

export interface ModalDatePickerChangeEvent {
  range: DateRange
  formattedRange: {
    start: string | null
    end: string | null
  }
}

/**
 * A modal date picker for selecting date ranges.
 * Extends full-screen and is ideal for date range selection like flight bookings.
 *
 * ## Features
 * - Full-screen modal interface
 * - Date range selection with visual feedback
 * - Calendar and input mode toggle
 * - Min/max date constraints
 * - Disabled dates support
 * - Accessible design with proper ARIA attributes and semantic HTML
 * - Real-time date range validation
 *
 * ## Events
 *
 * ### `date-range-change`
 * Fired when a date range is selected or changed.
 *
 * **Detail:**
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
 * ### `close`
 * Fired when the modal is closed.
 *
 * **Detail:**
 * ```typescript
 * {
 *   confirmed: boolean,
 *   range: DateRange | null
 * }
 * ```
 *
 * ## Usage
 *
 * ### Basic usage
 * ```html
 * <ui-date-picker-modal
 *   .open=${true}
 *   .selectedRange=${{ start: new Date(), end: null }}
 *   @date-range-change=${this.handleRangeChange}
 *   @close=${this.handleClose}
 * ></ui-date-picker-modal>
 * ```
 *
 * ### Custom labels and constraints
 * ```html
 * <ui-date-picker-modal
 *   title="Select travel dates"
 *   startLabel="Check-in"
 *   endLabel="Check-out"
 *   .minDate=${new Date()}
 *   .maxDate=${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
 *   .disabledDates=${[new Date('2024-12-25')]}
 * ></ui-date-picker-modal>
 * ```
 *
 * ### With mode toggle disabled
 * ```html
 * <ui-date-picker-modal
 *   .showModeToggle=${false}
 * ></ui-date-picker-modal>
 * ```
 */
@customElement('ui-date-picker-modal')
export class UiDatePickerModal extends LitElement {
  static override styles = modalStyles

  /**
   * Whether the modal is open
   */
  @property({ type: Boolean }) accessor open = false

  /**
   * The modal title
   */
  @property({ type: String }) override accessor title = 'Select dates'

  /**
   * Label for the start date
   */
  @property({ type: String }) accessor startLabel = 'Start date'

  /**
   * Label for the end date
   */
  @property({ type: String }) accessor endLabel = 'End date'

  /**
   * The selected date range
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
   * Array of disabled dates
   */
  @property({ type: Array }) accessor disabledDates: Date[] | undefined = undefined

  /**
   * Locale for date formatting
   */
  @property({ type: String }) accessor locale: string | undefined = undefined

  /**
   * Whether to show edit/calendar toggle button
   */
  @property({ type: Boolean }) accessor showModeToggle = true

  @state() private accessor isInputMode = false

  constructor() {
    super()
    // Initialize boolean properties to false as per Lit best practices
    this.open = false
    this.showModeToggle = true
  }

  private handleRangeSelect(event: CustomEvent<DateRangeSelectEvent>): void {
    this.selectedRange = event.detail.range
    this.dispatchChangeEvent()
  }

  private handleCancel(): void {
    this.dispatchCloseEvent(false)
  }

  private handleConfirm(): void {
    this.dispatchCloseEvent(true)
  }

  private handleModeToggle(): void {
    this.isInputMode = !this.isInputMode
  }

  private dispatchChangeEvent(): void {
    if (!this.selectedRange) return

    const event: ModalDatePickerChangeEvent = {
      range: this.selectedRange,
      formattedRange: {
        start: this.selectedRange.start ? formatDate(this.selectedRange.start, this.locale) : null,
        end: this.selectedRange.end ? formatDate(this.selectedRange.end, this.locale) : null,
      },
    }

    this.dispatchEvent(
      new CustomEvent('date-range-change', {
        detail: event,
        bubbles: true,
        composed: true,
      })
    )
  }

  private dispatchCloseEvent(confirmed: boolean): void {
    this.dispatchEvent(
      new CustomEvent('close', {
        detail: {
          confirmed,
          range: confirmed ? this.selectedRange : null,
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
        <div class="header-actions">
          ${this.showModeToggle
            ? html`
                <ui-icon-button
                  @click=${this.handleModeToggle}
                  aria-label=${this.isInputMode ? 'Show calendar' : 'Show date input'}
                  title=${this.isInputMode ? 'Show calendar' : 'Show date input'}
                >
                  <ui-icon icon=${this.isInputMode ? 'calendarToday' : 'edit'}></ui-icon>
                </ui-icon-button>
              `
            : ''}
          <ui-icon-button @click=${this.handleCancel} aria-label="Close" title="Close">
            <ui-icon icon="close"></ui-icon>
          </ui-icon-button>
        </div>
      </header>
    `
  }

  private renderDateDisplay(): TemplateResult {
    const startDate = this.selectedRange?.start
    const endDate = this.selectedRange?.end

    return html`
      <section class="date-range-display" role="status" aria-live="polite" aria-label="Selected date range">
        <div class="date-display">
          <div class="date-label" id="start-label">${this.startLabel}</div>
          <div class="date-value" aria-labelledby="start-label" aria-describedby="start-description">
            ${startDate ? formatDate(startDate, this.locale) : 'Select date'}
          </div>
          <div id="start-description" class="visually-hidden">
            ${startDate ? `Start date selected: ${formatDate(startDate, this.locale)}` : 'No start date selected'}
          </div>
        </div>
        <div class="date-separator" aria-hidden="true">—</div>
        <div class="date-display">
          <div class="date-label" id="end-label">${this.endLabel}</div>
          <div class="date-value" aria-labelledby="end-label" aria-describedby="end-description">
            ${endDate ? formatDate(endDate, this.locale) : 'Select date'}
          </div>
          <div id="end-description" class="visually-hidden">
            ${endDate ? `End date selected: ${formatDate(endDate, this.locale)}` : 'No end date selected'}
          </div>
        </div>
      </section>
    `
  }

  private renderCalendar(): TemplateResult {
    const currentDate = this.selectedRange?.start || new Date()

    return html`
      <ui-date-picker-calendar
        .year=${currentDate.getFullYear()}
        .month=${currentDate.getMonth()}
        .rangeStart=${this.selectedRange?.start || null}
        .rangeEnd=${this.selectedRange?.end || null}
        .rangeSelection=${true}
        .minDate=${this.minDate}
        .maxDate=${this.maxDate}
        .disabledDates=${this.disabledDates}
        .locale=${this.locale}
        @date-range-select=${this.handleRangeSelect}
      ></ui-date-picker-calendar>
    `
  }

  private renderInputMode(): TemplateResult {
    return html`
      <section class="input-mode-placeholder" role="status" aria-live="polite">
        <ui-icon icon="edit" class="input-mode-icon" aria-hidden="true"></ui-icon>
        <h3>Manual date input mode</h3>
        <p>This feature can be enhanced with date input fields for direct text entry</p>
        <p><em>Use the calendar toggle button to return to calendar view</em></p>
      </section>
    `
  }

  private renderContent(): TemplateResult {
    return html`
      <main id="modal-content" class="modal-content">
        ${this.renderDateDisplay()} ${this.isInputMode ? this.renderInputMode() : this.renderCalendar()}
      </main>
    `
  }

  private renderActions(): TemplateResult {
    const hasValidRange = this.selectedRange?.start && this.selectedRange?.end

    return html`
      <footer class="modal-actions" role="group" aria-label="Date picker actions">
        <ui-button color="text" @click=${this.handleCancel} aria-describedby="cancel-description"> Cancel </ui-button>
        <ui-button
          color="filled"
          @click=${this.handleConfirm}
          .disabled=${!hasValidRange}
          aria-describedby="confirm-description"
        >
          Confirm
        </ui-button>
        <div id="cancel-description" class="visually-hidden">Close the date picker without saving changes</div>
        <div id="confirm-description" class="visually-hidden">
          ${hasValidRange
            ? 'Save the selected date range and close the picker'
            : 'Select both start and end dates to confirm the selection'}
        </div>
      </footer>
    `
  }

  override render(): TemplateResult {
    return html`
      <ui-dialog
        .open=${this.open}
        @close=${this.handleCancel}
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-content"
      >
        ${this.renderHeader()} ${this.renderContent()} ${this.renderActions()}
      </ui-dialog>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-date-picker-modal': UiDatePickerModal
  }

  interface HTMLElementEventMap {
    'date-range-change': CustomEvent<ModalDatePickerChangeEvent>
    'close': CustomEvent<{
      confirmed: boolean
      range: DateRange | null
    }>
  }
}
