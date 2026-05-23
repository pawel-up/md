// Export main components
export { UiDatePickerCalendar } from './internals/DatePickerCalendar.js'
export { UiDatePickerInput } from './ui-date-picker-input.js'
export { UiDatePickerModal } from './ui-date-picker-modal.js'
export { UiDatePickerModalInput } from './ui-date-picker-modal-input.js'

// Export utilities and types
export * from './internals/DatePickerUtils.js'
export type { DateSelectEvent, DateRangeSelectEvent } from './internals/DatePickerCalendar.js'
export type { ModalDatePickerChangeEvent } from './ui-date-picker-modal.js'
export type { ModalInputDatePickerChangeEvent } from './ui-date-picker-modal-input.js'

// Import components for registration
import './ui-date-picker-input.js'
import './ui-date-picker-modal.js'
import './ui-date-picker-modal-input.js'
import './internals/DatePickerCalendar.js'
