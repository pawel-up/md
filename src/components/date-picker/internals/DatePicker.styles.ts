import { css } from 'lit'

export const calendarStyles = css`
  :host {
    display: block;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    border-radius: 12px;
    background: var(--md-sys-color-surface-container-high);
    border: 1px solid var(--md-sys-color-outline-variant);
    box-shadow: var(--md-sys-elevation-2);
    overflow: hidden;
  }

  .calendar {
    padding: 20px 12px 12px 12px;
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    gap: 8px;
  }

  .month-year {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: space-between;
  }

  .month-selector,
  .year-selector {
    display: flex;
    align-items: center;
  }

  .month-year-text {
    font-size: 16px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface);
    min-width: 120px;
  }

  /* Weekdays header */
  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 40px);
    margin-bottom: 16px;
  }

  .weekday {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    font-size: 12px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant);
    text-transform: uppercase;
  }

  /* Calendar grid */
  .days {
    display: grid;
    grid-template-columns: repeat(7, 40px);
    gap: 0;
  }

  .day-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 40px;
  }

  .day-cell.in-range.has-complete-range {
    background: var(--md-sys-color-secondary-container);
  }

  .day-cell.range-start.has-complete-range:not(.range-end) {
    background: linear-gradient(to right, transparent 50%, var(--md-sys-color-secondary-container) 50%);
  }

  .day-cell.range-end.has-complete-range:not(.range-start) {
    background: linear-gradient(to left, transparent 50%, var(--md-sys-color-secondary-container) 50%);
  }

  .day-cell.range-start.range-end.has-complete-range {
    background: transparent;
  }

  .day-button {
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    padding: 0;
  }

  .day-button.other-month {
    opacity: 0.38;
  }

  .nav-button,
  .month-button,
  .year-button,
  .other-month .day-button:not([color='filled']):not([disabled]) {
    color: var(--md-sys-color-on-surface-variant);
  }

  .month-button,
  .year-button {
    padding: 0;
  }

  .weekday:not([color='filled']),
  .day-button:not([color='filled']):not([disabled]) {
    color: var(--md-sys-color-on-surface);
  }

  .today .day-button:not([color='filled']) {
    color: var(--md-sys-color-primary);
  }

  .today .day-button {
    --md-button-outline-color: var(--md-sys-color-primary);
  }

  /* Dropdown views */
  .dropdown-view {
    min-height: 300px;
  }

  .close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: var(--md-sys-color-on-surface-variant);
    cursor: pointer;
    border-radius: 16px;
    transition: background-color 0.2s ease;
  }

  .close-button:hover {
    background: color-mix(in srgb, var(--md-sys-color-on-surface) 8%, transparent);
  }

  .close-button:focus {
    outline: none;
    background: color-mix(in srgb, var(--md-sys-color-on-surface) 12%, transparent);
  }

  /* Month dropdown */
  .month-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .year-option:not(.selected),
  .month-option:not(.selected) {
    color: var(--md-sys-color-on-surface-variant);
  }

  /* Year dropdown */
  .year-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    max-height: 240px;
    overflow-y: auto;
    padding: 4px;
  }

  .actions {
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
  }
`

export const inputStyles = css`
  :host {
    display: inline-block;
    width: 100%;
  }

  .input-container {
    position: relative;
  }

  .dropdown-container {
    position: absolute;
    position-anchor: --ui-date-picker-anchor;
    top: anchor(bottom);
    left: anchor(left);
    z-index: 1000;
    margin-top: 4px;
    min-width: anchor-size(width);
    width: max-content;
    max-width: calc(100vw - 32px);
  }

  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    background: transparent;
  }

  .calendar-icon {
    cursor: pointer;
  }
`

export const modalStyles = css`
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 24px 16px;
  }

  .modal-title {
    font-size: 24px;
    font-weight: 400;
    color: var(--md-sys-color-on-surface);
    margin: 0;
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    max-height: 60vh;
    overflow-y: auto;
  }

  .modal-content ui-date-picker-calendar {
    box-shadow: none;
  }

  .date-range-display {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: var(--md-sys-color-surface-container-highest);
    border-radius: 12px;
    width: 100%;
    max-width: 320px;
  }

  .date-display {
    flex: 1;
    text-align: center;
  }

  .date-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant);
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .date-value {
    font-size: 16px;
    font-weight: 400;
    color: var(--md-sys-color-on-surface);
  }

  .date-separator {
    color: var(--md-sys-color-on-surface-variant);
    font-size: 18px;
  }

  /* Input container and format help styles */
  .input-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 320px;
  }

  .format-help {
    padding: 12px 16px;
    background: var(--md-sys-color-surface-container-highest);
    border-radius: 8px;
    border: 1px solid var(--md-sys-color-outline-variant);
  }

  .help-title {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: var(--md-sys-color-on-surface);
    line-height: 1.4;
  }

  .help-examples {
    margin: 0;
    font-size: 13px;
    color: var(--md-sys-color-on-surface-variant);
    line-height: 1.4;
  }

  /* Accessibility utilities */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  fieldset {
    border: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Modal header actions and input mode styles */
  .header-actions {
    display: flex;
    gap: 8px;
  }

  .input-mode-placeholder {
    padding: 24px;
    text-align: center;
    color: var(--md-sys-color-on-surface-variant);
  }

  .input-mode-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 16px 24px;
    border-top: 1px solid var(--md-sys-color-outline-variant);
  }

  /* Calendar Action Buttons */
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--md-sys-color-outline-variant);
  }

  /* Pending selection state */
  .day.pending {
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
    border: 2px solid var(--md-sys-color-secondary);
  }

  .day.pending.selected {
    background: var(--md-sys-color-secondary);
    color: var(--md-sys-color-on-secondary);
  }

  .day.pending.range-start,
  .day.pending.range-end {
    background: var(--md-sys-color-secondary);
    color: var(--md-sys-color-on-secondary);
  }

  .day.pending.in-range {
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }

  /* Responsive */
  @media (max-width: 640px) {
    .modal-content {
      padding: 16px;
    }

    .calendar {
      width: 100%;
      max-width: 320px;
    }
  }
`
