import { LitElement, html, TemplateResult, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { calendarStyles } from './DatePicker.styles.js'
import {
  CalendarMonth,
  CalendarDay,
  DateRange,
  generateCalendarMonth,
  addMonths,
  getMonthNames,
  isSameDay,
  formatDate,
  addDays,
} from './DatePickerUtils.js'
import '../../../components/icons/ui-icon.js'
import '../../../components/button/ui-button.js'
import '../../../components/icon-button/ui-icon-button.js'

/**
 * Event dispatched when a single date is selected in immediate mode
 * or confirmed in pending mode.
 */
export interface DateSelectEvent {
  date: Date
  formattedDate: string
}

/**
 * Event dispatched when a date range is completed in immediate mode.
 * Only fired when both start and end dates are selected.
 */
export interface DateRangeSelectEvent {
  range: DateRange
  formattedRange: {
    start: string | null
    end: string | null
  }
}

/**
 * Event dispatched when a date range selection is confirmed
 * via the OK button in pending mode.
 */
export interface DateRangeConfirmEvent {
  range: DateRange | null
  formattedRange: {
    start: string | null
    end: string | null
  }
}

/**
 * Event dispatched when user cancels a pending selection
 * via the Cancel button or Escape key.
 */
export interface DateCancelEvent {
  reason?: string
}

/**
 * A calendar grid component for date selection.
 * Supports single date selection and date range selection with full keyboard navigation.
 *
 * ## Features
 * - Single date and date range selection
 * - Keyboard navigation support (arrow keys, home, end, page up/down)
 * - Configurable date restrictions (min/max dates, disabled dates)
 * - Localization support for date formatting and month/day names
 * - Optional action buttons for pending selections
 * - Accessible design with proper ARIA attributes
 *
 * ## Events
 * - `date-select`: Fired when a single date is selected/confirmed
 * - `date-range-select`: Fired when a date range is completed (immediate mode)
 * - `date-range-confirm`: Fired when a date range is confirmed (pending mode)
 * - `date-cancel`: Fired when a pending selection is cancelled
 *
 * ## Usage
 *
 * ```html
 * <ui-date-picker-calendar></ui-date-picker-calendar>
 * ```
 *
 * ### Single date selection
 * ```html
 * <ui-date-picker-calendar
 *   .selectedDate=${new Date()}
 *   @date-select=${this.handleDateSelect}
 * ></ui-date-picker-calendar>
 * ```
 *
 * ### Date range selection
 * ```html
 * <ui-date-picker-calendar
 *   rangeSelection
 *   .rangeStart=${new Date()}
 *   .rangeEnd=${null}
 *   @date-range-select=${this.handleRangeSelect}
 * ></ui-date-picker-calendar>
 * ```
 *
 * ### With action buttons and restrictions
 * ```html
 * <ui-date-picker-calendar
 *   rangeSelection
 *   showActions
 *   .minDate=${new Date()}
 *   .maxDate=${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
 *   @date-range-confirm=${this.handleRangeConfirm}
 *   @date-cancel=${this.handleCancel}
 * ></ui-date-picker-calendar>
 * ```
 */
@customElement('ui-date-picker-calendar')
export class UiDatePickerCalendar extends LitElement {
  static override styles = calendarStyles

  /**
   * The currently displayed year
   */
  @property({ type: Number }) accessor year = new Date().getFullYear()

  /**
   * The currently displayed month (0-indexed, where 0 = January)
   */
  @property({ type: Number }) accessor month = new Date().getMonth()

  /**
   * The currently selected date for single selection mode.
   * Set to null for no selection.
   */
  @property({ type: Object }) accessor selectedDate: Date | null = null

  /**
   * The start date of the selected range for range selection mode.
   * Used in combination with rangeEnd to define a date range.
   */
  @property({ type: Object }) accessor rangeStart: Date | null = null

  /**
   * The end date of the selected range for range selection mode.
   * Used in combination with rangeStart to define a date range.
   */
  @property({ type: Object }) accessor rangeEnd: Date | null = null

  /**
   * Enable range selection mode. When true, users can select date ranges
   * instead of single dates. Affects event dispatching and UI behavior.
   */
  @property({ type: Boolean }) accessor rangeSelection = false

  /**
   * Minimum selectable date. Dates before this will be disabled.
   * Set to undefined for no minimum restriction.
   */
  @property({ type: Object }) accessor minDate: Date | undefined = undefined

  /**
   * Maximum selectable date. Dates after this will be disabled.
   * Set to undefined for no maximum restriction.
   */
  @property({ type: Object }) accessor maxDate: Date | undefined = undefined

  /**
   * Array of specific dates to disable. These dates will not be selectable
   * regardless of minDate and maxDate settings.
   */
  @property({ type: Array }) accessor disabledDates: Date[] | undefined = undefined

  /**
   * Locale for date formatting and month/day names (e.g., 'en-US', 'fr-FR').
   * Defaults to browser locale if not specified.
   */
  @property({ type: String }) accessor locale: string | undefined = undefined

  /**
   * Whether to show navigation controls (previous/next month and year buttons).
   * When false, users can only navigate using keyboard or programmatically.
   */
  @property({ type: Boolean }) accessor showNavigation = true

  /**
   * Whether to show action buttons (OK/Cancel). When true, selections are pending
   * until confirmed with the OK button. When false, selections are immediate.
   */
  @property({ type: Boolean }) accessor showActions = false

  /**
   * Text label for the OK/confirm button. Only visible when showActions is true.
   */
  @property({ type: String }) accessor okButtonText = 'OK'

  /**
   * Text label for the Cancel button. Only visible when showActions is true.
   */
  @property({ type: String }) accessor cancelButtonText = 'Cancel'

  @state() private accessor calendarData: CalendarMonth | undefined = undefined

  @state() private accessor monthNames: string[] = []

  @state() private accessor showMonthDropdown = false

  @state() private accessor showYearDropdown = false

  @state() private accessor pendingDate: Date | null = null

  @state() private accessor pendingRangeStart: Date | null = null

  @state() private accessor pendingRangeEnd: Date | null = null

  @state() private accessor focusedDate: Date | null = null

  override connectedCallback(): void {
    super.connectedCallback()
    this.updateCalendar()
    this.updateMonthNames()
    this.initializeFocusedDate()
  }

  override firstUpdated(): void {
    // Set initial focus to the calendar container
    this.updateFocus()
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
  }

  override willUpdate(changedProperties: Map<string | number | symbol, unknown>): void {
    if (
      changedProperties.has('year') ||
      changedProperties.has('month') ||
      changedProperties.has('selectedDate') ||
      changedProperties.has('rangeStart') ||
      changedProperties.has('rangeEnd') ||
      changedProperties.has('disabledDates') ||
      changedProperties.has('locale')
    ) {
      this.updateCalendar()
    }

    if (changedProperties.has('locale')) {
      this.updateMonthNames()
    }

    // Update focused date when month/year changes via navigation
    if (changedProperties.has('year') || changedProperties.has('month')) {
      this.updateFocusedDateForMonthChange()
    }
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.has('showYearDropdown') && this.showYearDropdown) {
      // Scroll selected year into view
      this.scrollSelectedYearIntoView()
    }

    if (changedProperties.has('focusedDate')) {
      this.updateFocus()
    }
  }

  private updateFocus(): void {
    if (!this.focusedDate) return

    // Find the button for the focused date and set focus
    const dateString = this.focusedDate.toISOString().split('T')[0]
    const focusedButton = this.shadowRoot?.querySelector(`[data-date="${dateString}"]`) as HTMLElement
    if (focusedButton && !focusedButton.hasAttribute('disabled')) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        focusedButton.focus()
      })
    }
  }

  private scrollSelectedYearIntoView(): void {
    // Wait for next frame to ensure DOM is updated
    requestAnimationFrame(() => {
      const selectedYearButton = this.shadowRoot?.querySelector('.year-option.selected') as HTMLElement
      if (selectedYearButton) {
        selectedYearButton.scrollIntoView({
          behavior: 'auto',
          block: 'center',
        })
      }
    })
  }

  private updateFocusedDateForMonthChange(): void {
    if (!this.focusedDate) {
      this.initializeFocusedDate()
      return
    }

    // Keep the same day of month if possible
    const targetDay = this.focusedDate.getDate()
    const newDate = new Date(this.year, this.month, targetDay)

    // Check if the target date exists in the new month and is not disabled
    if (newDate.getMonth() === this.month && !this.isDateDisabled(newDate)) {
      this.focusedDate = newDate
    } else {
      // Find the closest available date
      this.focusedDate = this.findFirstAvailableDate()
    }
  }

  private updateCalendar(): void {
    const selectedRange = this.rangeStart || this.rangeEnd ? { start: this.rangeStart, end: this.rangeEnd } : null
    this.calendarData = generateCalendarMonth(
      this.year,
      this.month,
      this.selectedDate,
      selectedRange,
      this.disabledDates,
      this.locale
    )
  }

  private updateMonthNames(): void {
    this.monthNames = getMonthNames(this.locale)
  }

  private navigateMonth(delta: number): void {
    const newDate = addMonths(new Date(this.year, this.month), delta)
    this.year = newDate.getFullYear()
    this.month = newDate.getMonth()
  }

  private handlePrevMonth(): void {
    this.navigateMonth(-1)
  }

  private handleNextMonth(): void {
    this.navigateMonth(1)
  }

  private handlePrevYear(): void {
    this.year = this.year - 1
  }

  private handleNextYear(): void {
    this.year = this.year + 1
  }

  private handleMonthClick(): void {
    this.showMonthDropdown = !this.showMonthDropdown
    this.showYearDropdown = false
  }

  private handleYearClick(): void {
    this.showYearDropdown = !this.showYearDropdown
    this.showMonthDropdown = false
  }

  private handleMonthSelect(selectedMonth: number): void {
    this.month = selectedMonth
    this.showMonthDropdown = false
  }

  private handleYearSelect(selectedYear: number): void {
    this.year = selectedYear
    this.showYearDropdown = false
  }

  private closeDropdowns(): void {
    this.showMonthDropdown = false
    this.showYearDropdown = false
  }

  private navigateDate(delta: number): void {
    if (!this.focusedDate) return

    const newDate = addDays(this.focusedDate, delta)

    // Check if new date is in current month or if we should navigate to next/previous month
    if (newDate.getMonth() !== this.month || newDate.getFullYear() !== this.year) {
      // Navigate to next/previous month
      if (delta > 0) {
        this.navigateMonth(1)
      } else {
        this.navigateMonth(-1)
      }
      // Set focused date to the target date in the new month
      this.focusedDate = newDate
      return
    }

    // Check if new date is disabled
    if (this.isDateDisabled(newDate)) {
      // Try to find next available date
      const availableDate = this.findNextAvailableDate(newDate, delta > 0)
      if (availableDate) {
        this.focusedDate = availableDate
      }
    } else {
      this.focusedDate = newDate
    }
  }

  private findNextAvailableDate(startDate: Date, forward: boolean): Date | null {
    const direction = forward ? 1 : -1
    for (let i = 1; i <= 31; i++) {
      const date = addDays(startDate, i * direction)
      if (date.getMonth() !== this.month) break // Out of current month
      if (!this.isDateDisabled(date)) {
        return date
      }
    }
    return null
  }

  private focusFirstDayOfMonth(): void {
    const firstDay = new Date(this.year, this.month, 1)
    if (!this.isDateDisabled(firstDay)) {
      this.focusedDate = firstDay
    } else {
      this.focusedDate = this.findFirstAvailableDate()
    }
  }

  private focusLastDayOfMonth(): void {
    const lastDay = new Date(this.year, this.month + 1, 0)
    if (!this.isDateDisabled(lastDay)) {
      this.focusedDate = lastDay
    } else {
      // Find last available date in month
      for (let i = lastDay.getDate(); i >= 1; i--) {
        const date = new Date(this.year, this.month, i)
        if (!this.isDateDisabled(date)) {
          this.focusedDate = date
          break
        }
      }
    }
  }

  private selectFocusedDate(): void {
    if (!this.focusedDate || this.isDateDisabled(this.focusedDate)) return

    if (this.rangeSelection) {
      this.handleRangeSelection(this.focusedDate)
    } else {
      this.handleSingleSelection(this.focusedDate)
    }
  }

  private handleDayClick(day: CalendarDay): void {
    if (day.isDisabled) return

    // Update focused date to clicked date
    this.focusedDate = day.date

    if (this.rangeSelection) {
      this.handleRangeSelection(day.date)
    } else {
      this.handleSingleSelection(day.date)
    }
  }

  private handleSingleSelection(date: Date): void {
    if (this.showActions) {
      // Use pending state when actions are enabled
      this.pendingDate = date
    } else {
      // Immediate selection when no actions
      this.selectedDate = date
      this.dispatchDateEvent(date)
    }
  }

  private handleRangeSelection(date: Date): void {
    const isImmediate = !this.showActions
    const { start, end } = this.getCurrentRange()

    // If we have a complete range, start a new one
    if (start && end) {
      this.setRangeValues(date, null, isImmediate)
      return
    }

    // If we have a start but no end, complete the range
    if (start && !end) {
      const sortedRange = start <= date ? { start, end: date } : { start: date, end: start }
      this.setRangeValues(sortedRange.start, sortedRange.end, isImmediate)

      if (isImmediate) {
        this.dispatchRangeEvent(sortedRange)
      }
      return
    }

    // Start new range
    this.setRangeValues(date, null, isImmediate)
  }

  /**
   * Helper to get the current range state (either immediate or pending)
   */
  private getCurrentRange(): { start: Date | null; end: Date | null } {
    const isImmediate = !this.showActions
    return {
      start: isImmediate ? this.rangeStart : this.pendingRangeStart,
      end: isImmediate ? this.rangeEnd : this.pendingRangeEnd,
    }
  }

  /**
   * Helper to check if we have a complete range in the current mode
   */
  private hasCompleteRange(): boolean {
    const { start, end } = this.getCurrentRange()
    return !!(start && end)
  }

  private setRangeValues(start: Date | null, end: Date | null, isImmediate: boolean): void {
    if (isImmediate) {
      this.rangeStart = start
      this.rangeEnd = end
    } else {
      this.pendingRangeStart = start
      this.pendingRangeEnd = end
    }
  }

  /**
   * Helper to dispatch date selection events
   */
  private dispatchDateEvent(date: Date): void {
    const event: DateSelectEvent = {
      date,
      formattedDate: formatDate(date, this.locale),
    }

    this.dispatchEvent(
      new CustomEvent('date-select', {
        detail: event,
        bubbles: true,
        composed: true,
      })
    )
  }

  /**
   * Helper to dispatch range selection events
   */
  private dispatchRangeEvent(range: { start: Date; end: Date }): void {
    const event: DateRangeSelectEvent = {
      range,
      formattedRange: {
        start: formatDate(range.start, this.locale),
        end: formatDate(range.end, this.locale),
      },
    }

    this.dispatchEvent(
      new CustomEvent('date-range-select', {
        detail: event,
        bubbles: true,
        composed: true,
      })
    )
  }

  /**
   * Helper to dispatch range confirmation events
   */
  private dispatchRangeConfirmEvent(range: DateRange | null): void {
    const event: DateRangeConfirmEvent = {
      range,
      formattedRange: {
        start: range?.start ? formatDate(range.start, this.locale) : null,
        end: range?.end ? formatDate(range.end, this.locale) : null,
      },
    }

    this.dispatchEvent(
      new CustomEvent('date-range-confirm', {
        detail: event,
        bubbles: true,
        composed: true,
      })
    )
  }

  /**
   * Helper to dispatch cancel events
   */
  private dispatchCancelEvent(reason = 'user_cancelled'): void {
    const event: DateCancelEvent = { reason }

    this.dispatchEvent(
      new CustomEvent('date-cancel', {
        detail: event,
        bubbles: true,
        composed: true,
      })
    )
  }

  private isDateDisabled(date: Date): boolean {
    if (this.minDate && date < this.minDate) return true
    if (this.maxDate && date > this.maxDate) return true
    if (this.disabledDates?.some((disabledDate) => isSameDay(date, disabledDate))) return true
    return false
  }

  private handleConfirm(): void {
    if (this.rangeSelection) {
      if (this.pendingRangeStart || this.pendingRangeEnd) {
        this.rangeStart = this.pendingRangeStart
        this.rangeEnd = this.pendingRangeEnd

        const range = this.rangeStart || this.rangeEnd ? { start: this.rangeStart, end: this.rangeEnd } : null

        // Reset pending state after confirmation
        this.pendingRangeStart = null
        this.pendingRangeEnd = null

        this.dispatchRangeConfirmEvent(range)
      }
    } else {
      if (this.pendingDate) {
        this.selectedDate = this.pendingDate

        // Reset pending state after confirmation
        this.pendingDate = null

        this.dispatchDateEvent(this.selectedDate)
      }
    }
  }

  private handleCancel(): void {
    // Reset pending state
    this.pendingDate = null
    this.pendingRangeStart = null
    this.pendingRangeEnd = null

    this.dispatchCancelEvent()
  }

  /**
   * Helper to render navigation buttons
   */
  private renderNavButton(
    direction: 'prev' | 'next',
    onClick: () => void,
    ariaLabel: string,
    icon: 'chevronLeft' | 'chevronRight'
  ): TemplateResult | typeof nothing {
    if (!this.showNavigation || this.showMonthDropdown || this.showYearDropdown) {
      return nothing
    }

    return html`<ui-icon-button
      class="nav-button"
      size="xs"
      @click=${onClick}
      aria-label=${ariaLabel}
      title=${ariaLabel}
    >
      <ui-icon icon=${icon}></ui-icon>
    </ui-icon-button>`
  }

  private renderNavigation(): TemplateResult {
    const monthName = this.monthNames[this.month] || ''

    return html`
      <div class="header">
        <div class="month-year">
          <div class="month-selector">
            ${this.renderNavButton('prev', this.handlePrevMonth, 'Previous month', 'chevronLeft')}
            <ui-button
              class="month-button"
              color="text"
              size="xs"
              @click=${this.handleMonthClick}
              aria-label="Select month"
              aria-expanded=${this.showMonthDropdown}
              trailingIcon
            >
              ${monthName}
              <ui-icon icon="arrowDropDown" slot="icon"></ui-icon>
            </ui-button>
            ${this.renderNavButton('next', this.handleNextMonth, 'Next month', 'chevronRight')}
          </div>
          <div class="year-selector">
            ${this.renderNavButton('prev', this.handlePrevYear, 'Previous year', 'chevronLeft')}
            <ui-button
              class="year-button"
              color="text"
              size="xs"
              @click=${this.handleYearClick}
              aria-label="Select year"
              aria-expanded=${this.showYearDropdown}
              trailingIcon
            >
              ${this.year}
              <ui-icon icon="arrowDropDown" slot="icon"></ui-icon>
            </ui-button>
            ${this.renderNavButton('next', this.handleNextYear, 'Next year', 'chevronRight')}
          </div>
        </div>
      </div>
    `
  }

  private renderWeekdays(): TemplateResult {
    if (!this.calendarData) return html``

    return html`
      <div class="weekdays" role="row">
        ${this.calendarData.weekdays.map((weekday) => html`<div class="weekday" role="columnheader">${weekday}</div>`)}
      </div>
    `
  }

  /**
   * Helper to determine day selection state for rendering
   */
  private getDaySelectionState(day: CalendarDay): {
    isSelected: boolean
    isRangeStart: boolean
    isRangeEnd: boolean
    isInRange: boolean
  } {
    if (this.showActions) {
      // Use pending state
      const isPendingSelected = this.pendingDate && isSameDay(day.date, this.pendingDate)
      const isPendingRangeStart = this.pendingRangeStart && isSameDay(day.date, this.pendingRangeStart)
      const isPendingRangeEnd = this.pendingRangeEnd && isSameDay(day.date, this.pendingRangeEnd)
      const isPendingInRange =
        this.pendingRangeStart &&
        this.pendingRangeEnd &&
        day.date >= this.pendingRangeStart &&
        day.date <= this.pendingRangeEnd &&
        !isPendingRangeStart &&
        !isPendingRangeEnd

      return {
        isSelected: !!isPendingSelected,
        isRangeStart: !!isPendingRangeStart,
        isRangeEnd: !!isPendingRangeEnd,
        isInRange: !!isPendingInRange,
      }
    } else {
      // Use immediate state
      return {
        isSelected: day.isSelected,
        isRangeStart: day.isRangeStart,
        isRangeEnd: day.isRangeEnd,
        isInRange: day.isInRange,
      }
    }
  }

  /**
   * Helper to determine button color for a day
   */
  private getDayButtonColor(
    day: CalendarDay,
    selectionState: ReturnType<typeof this.getDaySelectionState>
  ): 'elevated' | 'filled' | 'outlined' | 'text' | 'tonal' {
    if (selectionState.isRangeStart || selectionState.isRangeEnd || selectionState.isSelected) {
      return 'filled'
    }

    if (selectionState.isInRange) {
      return 'text'
    }

    if (day.isToday) {
      return 'outlined'
    }

    return 'text'
  }

  private renderDay(day: CalendarDay): TemplateResult {
    const selectionState = this.getDaySelectionState(day)
    const color = this.getDayButtonColor(day, selectionState)

    const classes = {
      'day-cell': true,
      'other-month': !day.isCurrentMonth,
      'today': day.isToday,
      'in-range': selectionState.isInRange,
      'range-start': selectionState.isRangeStart,
      'range-end': selectionState.isRangeEnd,
      'has-complete-range': this.hasCompleteRange(),
    }

    const isFocused = this.focusedDate && isSameDay(day.date, this.focusedDate)

    return html`
      <div class=${classMap(classes)} role="gridcell">
        <ui-button
          class="day-button"
          color=${color}
          size="s"
          data-date=${day.date.toISOString().split('T')[0]}
          tabindex=${isFocused && !(day.isDisabled || this.isDateDisabled(day.date)) ? '0' : '-1'}
          aria-label=${formatDate(day.date, this.locale)}
          aria-selected=${selectionState.isSelected || selectionState.isRangeStart || selectionState.isRangeEnd}
          @click=${() => this.handleDayClick(day)}
          ?disabled=${day.isDisabled || this.isDateDisabled(day.date)}
        >
          ${day.date.getDate()}
        </ui-button>
      </div>
    `
  }

  private renderDays(): TemplateResult {
    if (!this.calendarData) return html``

    return html`<div class="days">${this.calendarData.days.map((day) => this.renderDay(day))}</div>`
  }

  private renderActions(): TemplateResult | typeof nothing {
    if (!this.showActions) return nothing

    const hasSelection = this.rangeSelection ? this.pendingRangeStart : this.pendingDate

    return html`
      <div class="actions">
        <ui-button size="s" color="text" @click=${this.handleCancel}>${this.cancelButtonText}</ui-button>
        <ui-button size="s" color="text" @click=${this.handleConfirm} ?disabled=${!hasSelection}>
          ${this.okButtonText}
        </ui-button>
      </div>
    `
  }

  /**
   * Helper to render dropdown option buttons
   */
  private renderDropdownOption(
    value: string | number,
    label: string,
    isSelected: boolean,
    onClick: () => void,
    className = ''
  ): TemplateResult {
    return html`
      <ui-button
        class="dropdown-option ${className} ${isSelected ? 'selected' : ''}"
        color=${isSelected ? 'filled' : 'text'}
        size="s"
        @click=${onClick}
        aria-label=${label}
      >
        ${label}
      </ui-button>
    `
  }

  private renderMonthDropdown(): TemplateResult {
    return html`
      <div class="dropdown-view">
        <div class="month-list">
          ${this.monthNames.map((monthName, index) =>
            this.renderDropdownOption(index, monthName, index === this.month, () => this.handleMonthSelect(index))
          )}
        </div>
      </div>
    `
  }

  private renderYearDropdown(): TemplateResult {
    const currentYear = this.year
    const startYear = currentYear - 50
    const endYear = currentYear + 50
    const years: number[] = []

    for (let year = startYear; year <= endYear; year++) {
      years.push(year)
    }

    return html`
      <div class="dropdown-view">
        <div class="year-grid">
          ${years.map((year) =>
            this.renderDropdownOption(
              year,
              year.toString(),
              year === this.year,
              () => this.handleYearSelect(year),
              'year-option'
            )
          )}
        </div>
      </div>
    `
  }

  private findFirstAvailableDate(): Date {
    const firstDayOfMonth = new Date(this.year, this.month, 1)
    for (let i = 0; i < 31; i++) {
      const date = addDays(firstDayOfMonth, i)
      if (date.getMonth() !== this.month) break // Next month
      if (!this.isDateDisabled(date)) {
        return date
      }
    }
    return firstDayOfMonth // Fallback
  }

  private handleKeyDown(event: KeyboardEvent): void {
    // Prevent default behavior for navigation keys
    const navigationKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown', ' ']
    if (navigationKeys.includes(event.key)) {
      event.preventDefault()
    }

    switch (event.key) {
      case 'ArrowLeft':
        this.navigateDate(-1)
        break
      case 'ArrowRight':
        this.navigateDate(1)
        break
      case 'ArrowUp':
        this.navigateDate(-7)
        break
      case 'ArrowDown':
        this.navigateDate(7)
        break
      case 'Enter':
      case ' ':
        this.selectFocusedDate()
        break
      case 'Home':
        this.focusFirstDayOfMonth()
        break
      case 'End':
        this.focusLastDayOfMonth()
        break
      case 'PageUp':
        if (event.shiftKey) {
          this.handlePrevYear()
        } else {
          this.navigateMonth(-1)
        }
        break
      case 'PageDown':
        if (event.shiftKey) {
          this.handleNextYear()
        } else {
          this.navigateMonth(1)
        }
        break
      case 'Escape':
        this.closeDropdowns()
        break
    }
  }

  /**
   * Helper to check if a date is in the current month and not disabled
   */
  private isDateAvailable(date: Date): boolean {
    return date.getMonth() === this.month && date.getFullYear() === this.year && !this.isDateDisabled(date)
  }

  private initializeFocusedDate(): void {
    // Priority: selectedDate, rangeStart, today, first available date
    const candidates = [this.selectedDate, this.rangeStart, new Date()].filter(Boolean) as Date[]

    for (const candidate of candidates) {
      if (this.isDateAvailable(candidate)) {
        this.focusedDate = candidate
        return
      }
    }

    // Fallback to first available date in current month
    this.focusedDate = this.findFirstAvailableDate()
  }

  override render(): TemplateResult {
    // Show dropdown views instead of calendar when dropdowns are open
    if (this.showMonthDropdown) {
      return html`
        <div class="calendar" role="grid" aria-label="Month selection for ${this.year}">
          ${this.renderNavigation()} ${this.renderMonthDropdown()}
        </div>
      `
    }

    if (this.showYearDropdown) {
      return html`
        <div class="calendar" role="grid" aria-label="Year selection">
          ${this.renderNavigation()} ${this.renderYearDropdown()}
        </div>
      `
    }

    // Default calendar view
    return html`
      <div
        class="calendar"
        role="grid"
        aria-label="Calendar for ${this.monthNames[this.month]} ${this.year}"
        aria-roledescription="Calendar grid"
        tabindex="0"
        @keydown=${this.handleKeyDown}
      >
        ${this.renderNavigation()} ${this.renderWeekdays()} ${this.renderDays()} ${this.renderActions()}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-date-picker-calendar': UiDatePickerCalendar
  }

  interface HTMLElementEventMap {
    'date-select': CustomEvent<DateSelectEvent>
    'date-range-select': CustomEvent<DateRangeSelectEvent>
    'date-range-confirm': CustomEvent<DateRangeConfirmEvent>
    'date-cancel': CustomEvent<DateCancelEvent>
  }
}
