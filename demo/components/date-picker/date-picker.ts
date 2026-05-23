import { html, TemplateResult } from 'lit'
import { reactive } from '../../../src/decorators/index.js'
import { DemoPage } from '../../../src/demo/DemoPage.js'

import '../../../src/components/date-picker/index.js'
import '../../../src/components/button/ui-button.js'

class DatePickerDemoPage extends DemoPage {
  override accessor componentName = 'Date Picker'

  @reactive() accessor selectedDate: Date | null = null
  @reactive() accessor selectedRange: { start: Date | null; end: Date | null } = { start: null, end: null }
  @reactive() accessor modalOpen = false
  @reactive() accessor modalInputOpen = false
  @reactive() accessor modalInputRangeOpen = false
  @reactive() accessor formValues: string | undefined

  private get today(): Date {
    return new Date()
  }

  private get oneMonthFromNow(): Date {
    const date = new Date()
    date.setMonth(date.getMonth() + 1)
    return date
  }

  private get oneYearFromNow(): Date {
    const date = new Date()
    date.setFullYear(date.getFullYear() + 1)
    return date
  }

  handleDateChange(e: CustomEvent): void {
    this.selectedDate = e.detail.value
  }

  handleRangeChange(e: CustomEvent): void {
    this.selectedRange = e.detail.range || { start: null, end: null }
  }

  handleDateConfirm(e: CustomEvent): void {
    this.selectedDate = e.detail.date
  }

  handleRangeConfirm(e: CustomEvent): void {
    this.selectedRange = e.detail.range || { start: null, end: null }
  }

  handleDateCancel(e: CustomEvent): void {
    console.log('Date selection cancelled:', e.detail.reason)
  }

  openModal(): void {
    this.modalOpen = true
  }

  openModalInput(): void {
    this.modalInputOpen = true
  }

  openModalInputRange(): void {
    this.modalInputRangeOpen = true
  }

  handleModalClose(e: CustomEvent): void {
    this.modalOpen = false
    if (e.detail.confirmed && e.detail.range) {
      this.selectedRange = e.detail.range
    }
  }

  handleModalInputClose(e: CustomEvent): void {
    this.modalInputOpen = false
    if (e.detail.confirmed && e.detail.date) {
      this.selectedDate = e.detail.date
    }
  }

  handleModalInputRangeClose(e: CustomEvent): void {
    this.modalInputRangeOpen = false
    if (e.detail.confirmed && e.detail.range) {
      this.selectedRange = e.detail.range
    }
  }

  private formatDateRange(start: Date | null, end: Date | null, defaultMessage = 'No range selected'): string {
    if (!start || !end) return defaultMessage
    return `${start.toDateString()} - ${end.toDateString()}`
  }

  private formatSingleDate(date: Date | null, defaultMessage = 'No date selected'): string {
    return date ? date.toDateString() : defaultMessage
  }

  handleFormSubmit(e: SubmitEvent): void {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const values = Array.from(formData.entries())
    this.formValues = new URLSearchParams(values as string[][]).toString()
  }

  contentTemplate(): TemplateResult {
    return html`
      <nav>
        <a href="../" class="back-link">← Back to Components</a>
      </nav>
      ${this.renderInputs()} ${this.renderCalendars()} ${this.renderModalDatePickers()} ${this.renderFormIntegration()}
      ${this.renderModalComponents()}
      ${this.formValues
        ? html`
            <section class="demo-section">
              <h3 class="headline-medium">Form Output</h3>
              <output role="status" aria-live="polite" aria-label="Form submission result">
                <code><pre>${this.formValues}</pre></code>
              </output>
            </section>
          `
        : ''}
    `
  }

  renderInputs(): TemplateResult {
    return html`<section class="demo-section">
      <h2 class="display-large">Date Picker Input</h2>
      <div class="variant-grid" role="group" aria-labelledby="input-variants-heading">
        <span>&nbsp;</span>
        <span class="legend-marker">1</span>
        <span class="legend-marker">2</span>
        <span class="legend-marker">3</span>

        <span class="legend-marker">A</span>
        <ui-date-picker-input
          label="Basic input"
          placeholder="Select date"
          name="basic-date-picker"
          .value="${this.selectedDate}"
          @change="${this.handleDateChange}"
          aria-describedby="basic-input-help"
        ></ui-date-picker-input>
        <ui-date-picker-input
          label="With constraints"
          placeholder="Select date"
          name="constrained-date-picker"
          .minDate="${this.today}"
          .maxDate="${this.oneMonthFromNow}"
          .value="${this.selectedDate}"
          @change="${this.handleDateChange}"
          aria-describedby="constrained-input-help"
        ></ui-date-picker-input>
        <ui-date-picker-input
          label="Disabled input"
          placeholder="Select date"
          disabled
          name="disabled-date-picker"
          aria-describedby="disabled-input-help"
        ></ui-date-picker-input>
      </div>
      <div id="input-variants-heading" class="visually-hidden">Date input variants demonstration</div>
      <div id="basic-input-help" class="visually-hidden">Basic date picker with no restrictions</div>
      <div id="constrained-input-help" class="visually-hidden">
        Date picker with date constraints applied (today to one month from now)
      </div>
      <div id="disabled-input-help" class="visually-hidden">Disabled date picker for demonstration</div>
      <p class="body-medium">A. Input variants</p>
      <ol class="decimal body-medium">
        <li>Basic input</li>
        <li>With date constraints</li>
        <li>Disabled state</li>
      </ol>
    </section>`
  }

  renderCalendars(): TemplateResult {
    return html`<section class="demo-section xl">
      <h2 class="display-large">Date Picker Calendar</h2>
      <div class="variant-grid" role="group" aria-labelledby="calendar-variants-heading">
        <span>&nbsp;</span>
        <span class="legend-marker">1</span>
        <span class="legend-marker">2</span>
        <span class="legend-marker">3</span>

        <span class="legend-marker">B</span>
        <ui-date-picker-calendar
          showActions
          .selectedDate="${this.selectedDate}"
          @date-select="${this.handleDateConfirm}"
          @date-cancel="${this.handleDateCancel}"
          aria-describedby="basic-calendar-help"
        ></ui-date-picker-calendar>
        <ui-date-picker-calendar
          showActions
          rangeSelection
          .rangeStart="${this.selectedRange.start}"
          .rangeEnd="${this.selectedRange.end}"
          @date-range-confirm="${this.handleRangeConfirm}"
          @date-cancel="${this.handleDateCancel}"
          aria-describedby="range-calendar-help"
        ></ui-date-picker-calendar>
        <ui-date-picker-calendar
          showActions
          .minDate="${this.today}"
          .maxDate="${this.oneMonthFromNow}"
          .selectedDate="${this.selectedDate}"
          @date-select="${this.handleDateConfirm}"
          @date-cancel="${this.handleDateCancel}"
          aria-describedby="constrained-calendar-help"
        ></ui-date-picker-calendar>
      </div>
      <div id="calendar-variants-heading" class="visually-hidden">Calendar variants demonstration</div>
      <div id="basic-calendar-help" class="visually-hidden">Basic calendar for single date selection</div>
      <div id="range-calendar-help" class="visually-hidden">Calendar configured for date range selection</div>
      <div id="constrained-calendar-help" class="visually-hidden">
        Calendar with date constraints limiting selectable dates
      </div>
      <p class="body-medium">B. Calendar variants</p>
      <ol class="decimal body-medium">
        <li>Single date selection</li>
        <li>Range selection</li>
        <li>With date constraints</li>
      </ol>
    </section>`
  }

  renderModalDatePickers(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="display-large">Modal Date Pickers</h2>
        <div class="modal-demo-grid">
          <article class="modal-demo-item">
            <h3 class="headline-small">Range Selection Modal</h3>
            <p class="body-medium">Full-screen modal for selecting date ranges</p>
            <ui-button @click="${this.openModal}" color="filled" aria-describedby="range-modal-output">
              Open Date Range Picker
            </ui-button>
            <div id="range-modal-output" class="demo-output" role="status" aria-live="polite">
              Selected range: ${this.formatDateRange(this.selectedRange.start, this.selectedRange.end)}
            </div>
          </article>

          <article class="modal-demo-item">
            <h3 class="headline-small">Single Date Input Modal</h3>
            <p class="body-medium">Modal with single date input field</p>
            <ui-button @click="${this.openModalInput}" color="filled" aria-describedby="input-modal-output">
              Open Single Date Input
            </ui-button>
            <div id="input-modal-output" class="demo-output" role="status" aria-live="polite">
              Selected date: ${this.formatSingleDate(this.selectedDate, 'No date entered')}
            </div>
          </article>

          <article class="modal-demo-item">
            <h3 class="headline-small">Range Input Modal</h3>
            <p class="body-medium">Modal with date range input fields</p>
            <ui-button @click="${this.openModalInputRange}" color="filled" aria-describedby="input-range-modal-output">
              Open Range Date Input
            </ui-button>
            <div id="input-range-modal-output" class="demo-output" role="status" aria-live="polite">
              Selected range:
              ${this.formatDateRange(this.selectedRange.start, this.selectedRange.end, 'No range entered')}
            </div>
          </article>
        </div>
      </section>
    `
  }

  renderFormIntegration(): TemplateResult {
    return html`<section class="demo-section">
      <h2 class="display-large">Form Integration</h2>
      <div class="frame">
        <form @submit="${this.handleFormSubmit}" novalidate>
          <fieldset>
            <legend class="visually-hidden">Event scheduling form</legend>
            <div class="form-row">
              <ui-date-picker-input
                required
                label="Event date"
                placeholder="Select event date"
                name="event-date"
                aria-describedby="event-date-help"
              ></ui-date-picker-input>
              <div id="event-date-help" class="form-help">Choose the date when the event will take place</div>
            </div>
            <div class="form-row">
              <ui-date-picker-input
                label="Deadline (optional)"
                placeholder="Select deadline"
                name="deadline"
                .minDate="${this.today}"
                aria-describedby="deadline-help"
              ></ui-date-picker-input>
              <div id="deadline-help" class="form-help">Optional deadline for event preparation</div>
            </div>
          </fieldset>
          <div class="form-actions" role="group" aria-label="Form actions">
            <ui-button type="submit" color="filled">Submit Form</ui-button>
            <ui-button type="reset" color="outlined">Reset</ui-button>
          </div>
        </form>
      </div>
    </section>`
  }

  renderModalComponents(): TemplateResult {
    return html`<!-- Modal Components -->
      <ui-date-picker-modal
        ?open="${this.modalOpen}"
        title="Select travel dates"
        startLabel="Check-in"
        endLabel="Check-out"
        @close="${this.handleModalClose}"
      ></ui-date-picker-modal>

      <ui-date-picker-modal-input
        ?open="${this.modalInputOpen}"
        title="Enter date"
        .rangeMode="${false}"
        startLabel="Date"
        @modal-input-close="${this.handleModalInputClose}"
      ></ui-date-picker-modal-input>

      <ui-date-picker-modal-input
        ?open="${this.modalInputRangeOpen}"
        title="Enter date range"
        .rangeMode="${true}"
        startLabel="Start date"
        endLabel="End date"
        @modal-input-close="${this.handleModalInputRangeClose}"
      ></ui-date-picker-modal-input>`
  }
}

const instance = new DatePickerDemoPage()
instance.render()
