<script setup lang="ts">
import { ref, computed } from 'vue'
import '../../src/components/date-picker/index.js'
import '../../src/components/button/ui-button.js'

const selectedDate = ref<Date | null>(null)
const selectedRange = ref<{ start: Date | null; end: Date | null }>({ start: null, end: null })
const modalOpen = ref(false)
const modalInputOpen = ref(false)
const modalInputRangeOpen = ref(false)
const formValues = ref<string | undefined>()

const today = computed(() => new Date())
const oneMonthFromNow = computed(() => {
  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  return date
})
const oneYearFromNow = computed(() => {
  const date = new Date()
  date.setFullYear(date.getFullYear() + 1)
  return date
})

const handleDateChange = (e: CustomEvent) => {
  selectedDate.value = e.detail.value
}

const handleRangeChange = (e: CustomEvent) => {
  selectedRange.value = e.detail.range || { start: null, end: null }
}

const handleDateConfirm = (e: CustomEvent) => {
  selectedDate.value = e.detail.date
}

const handleRangeConfirm = (e: CustomEvent) => {
  selectedRange.value = e.detail.range || { start: null, end: null }
}

const handleDateCancel = (e: CustomEvent) => {
  console.log('Date selection cancelled:', e.detail.reason)
}

const openModal = () => {
  modalOpen.value = true
}

const openModalInput = () => {
  modalInputOpen.value = true
}

const openModalInputRange = () => {
  modalInputRangeOpen.value = true
}

const handleModalClose = (e: CustomEvent) => {
  modalOpen.value = false
  if (e.detail.confirmed && e.detail.range) {
    selectedRange.value = e.detail.range
  }
}

const handleModalInputClose = (e: CustomEvent) => {
  modalInputOpen.value = false
  if (e.detail.confirmed && e.detail.date) {
    selectedDate.value = e.detail.date
  }
}

const handleModalInputRangeClose = (e: CustomEvent) => {
  modalInputRangeOpen.value = false
  if (e.detail.confirmed && e.detail.range) {
    selectedRange.value = e.detail.range
  }
}

const formatDateRange = (start: Date | null, end: Date | null, defaultMessage = 'No range selected') => {
  if (!start || !end) return defaultMessage
  return `${start.toDateString()} - ${end.toDateString()}`
}

const formatSingleDate = (date: Date | null, defaultMessage = 'No date selected') => {
  return date ? date.toDateString() : defaultMessage
}

const handleFormSubmit = (e: Event) => {
  e.preventDefault()
  const form = e.target as HTMLFormElement
  const formData = new FormData(form)
  const values = Array.from(formData.entries())
  formValues.value = new URLSearchParams(values as string[][]).toString()
}
</script>

<style>
  .variant-grid {
    display: grid;
    gap: 24px;
    grid-template-columns: 80px 1fr 1fr 1fr; 
    grid-template-rows: auto auto; 
    justify-items: start; 
    align-items: center; 
    padding: 40px;
    border-radius: 20px;
    border: 1px var(--md-sys-color-outline) solid;
  }

  .modal-demo-grid {
    display: grid;
    gap: 24px;
    grid-template-columns: 1fr 1fr;
    padding: 40px;
    border-radius: 20px;
    border: 1px var(--md-sys-color-outline) solid;
  }

  .modal-demo-item {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .demo-output {
    padding: 12px;
    background: var(--md-sys-color-surface-container);
    border-radius: 8px;
    font-family: monospace;
    font-size: 12px;
    color: var(--md-sys-color-on-surface);
    white-space: pre-wrap;
    min-height: 40px;
  }

  .form-row {
    margin-bottom: 16px;
  }

  fieldset {
    border: 1px var(--md-sys-color-outline) solid;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 16px;
  }
</style>

<template>
  <nav>
    <a href="../" class="back-link">← Back to Components</a>
  </nav>

  <section class="demo-section">
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
        :value="selectedDate"
        @change="handleDateChange"
        aria-describedby="basic-input-help"
      ></ui-date-picker-input>
      <ui-date-picker-input
        label="With constraints"
        placeholder="Select date"
        name="constrained-date-picker"
        :minDate="today"
        :maxDate="oneMonthFromNow"
        :value="selectedDate"
        @change="handleDateChange"
        aria-describedby="constrained-input-help"
      ></ui-date-picker-input>
      <ui-date-picker-input
        label="Disabled input"
        placeholder="Select date"
        disabled="true"
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
  </section>

  <section class="demo-section xl">
    <h2 class="display-large">Date Picker Calendar</h2>
    <div class="variant-grid" role="group" aria-labelledby="calendar-variants-heading">
      <span>&nbsp;</span>
      <span class="legend-marker">1</span>
      <span class="legend-marker">2</span>
      <span class="legend-marker">3</span>

      <span class="legend-marker">B</span>
      <ui-date-picker-calendar
        showActions="true"
        :selectedDate="selectedDate"
        @date-select="handleDateConfirm"
        @date-cancel="handleDateCancel"
        aria-describedby="basic-calendar-help"
      ></ui-date-picker-calendar>
      <ui-date-picker-calendar
        showActions="true"
        rangeSelection="true"
        :rangeStart="selectedRange.start"
        :rangeEnd="selectedRange.end"
        @date-range-confirm="handleRangeConfirm"
        @date-cancel="handleDateCancel"
        aria-describedby="range-calendar-help"
      ></ui-date-picker-calendar>
      <ui-date-picker-calendar
        showActions="true"
        :minDate="today"
        :maxDate="oneMonthFromNow"
        :selectedDate="selectedDate"
        @date-select="handleDateConfirm"
        @date-cancel="handleDateCancel"
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
  </section>

  <section class="demo-section">
    <h2 class="display-large">Modal Date Pickers</h2>
    <div class="modal-demo-grid">
      <article class="modal-demo-item">
        <h3 class="headline-small">Range Selection Modal</h3>
        <p class="body-medium">Full-screen modal for selecting date ranges</p>
        <ui-button @click="openModal" color="filled" aria-describedby="range-modal-output">
          Open Date Range Picker
        </ui-button>
        <div id="range-modal-output" class="demo-output" role="status" aria-live="polite">
          Selected range: {{ formatDateRange(selectedRange.start, selectedRange.end) }}
        </div>
      </article>

      <article class="modal-demo-item">
        <h3 class="headline-small">Single Date Input Modal</h3>
        <p class="body-medium">Modal with single date input field</p>
        <ui-button @click="openModalInput" color="filled" aria-describedby="input-modal-output">
          Open Single Date Input
        </ui-button>
        <div id="input-modal-output" class="demo-output" role="status" aria-live="polite">
          Selected date: {{ formatSingleDate(selectedDate, 'No date entered') }}
        </div>
      </article>

      <article class="modal-demo-item">
        <h3 class="headline-small">Range Input Modal</h3>
        <p class="body-medium">Modal with date range input fields</p>
        <ui-button @click="openModalInputRange" color="filled" aria-describedby="input-range-modal-output">
          Open Range Date Input
        </ui-button>
        <div id="input-range-modal-output" class="demo-output" role="status" aria-live="polite">
          Selected range:
          {{ formatDateRange(selectedRange.start, selectedRange.end, 'No range entered') }}
        </div>
      </article>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="display-large">Form Integration</h2>
    <div class="frame">
      <form @submit="handleFormSubmit" novalidate>
        <fieldset>
          <legend class="visually-hidden">Event scheduling form</legend>
          <div class="form-row">
            <ui-date-picker-input
              required="true"
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
              :minDate="today"
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
  </section>

  <!-- Modal Components -->
  <ui-date-picker-modal
    :open="modalOpen"
    title="Select travel dates"
    startLabel="Check-in"
    endLabel="Check-out"
    @close="handleModalClose"
  ></ui-date-picker-modal>

  <ui-date-picker-modal-input
    :open="modalInputOpen"
    title="Enter date"
    :rangeMode="false"
    startLabel="Date"
    @modal-input-close="handleModalInputClose"
  ></ui-date-picker-modal-input>

  <ui-date-picker-modal-input
    :open="modalInputRangeOpen"
    title="Enter date range"
    :rangeMode="true"
    startLabel="Start date"
    endLabel="End date"
    @modal-input-close="handleModalInputRangeClose"
  ></ui-date-picker-modal-input>

  <section class="demo-section" v-if="formValues">
    <h3 class="headline-medium">Form Output</h3>
    <output role="status" aria-live="polite" aria-label="Form submission result">
      <code><pre>{{ formValues }}</pre></code>
    </output>
  </section>
</template>
