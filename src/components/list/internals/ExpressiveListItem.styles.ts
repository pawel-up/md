import { css } from 'lit'

export default css`
  :host {
    border-radius: 28px;
    --md-focus-ring-shape-end-end: 28px;
    --md-focus-ring-shape-end-start: 28px;
    --md-focus-ring-shape-start-end: 28px;
    --md-focus-ring-shape-start-start: 28px;
  }

  .surface {
    border-radius: 28px;
    padding: 10px 16px;
  }

  .ripple {
    border-radius: 28px;
  }

  :host([parent]) {
    transition:
      max-height 0.3s ease-in-out,
      opacity 0.3s ease-in-out,
      margin 0.3s ease-in-out,
      padding 0.3s ease-in-out;
    max-height: 120px;
    overflow: hidden;
  }

  :host([collapsed]) {
    max-height: 0;
    opacity: 0;
    margin-top: -2px;
    margin-bottom: 0;
    padding-top: 0;
    padding-bottom: 0;
    border-width: 0;
    pointer-events: none;
  }

  :host([group]) {
    cursor: pointer;
  }

  :host([group]:not([open])) ::slotted(ui-icon-button),
  :host([group]:not([open])) ::slotted(ui-icon) {
    transform: rotate(180deg);
  }

  :host([group]) ::slotted(ui-icon-button),
  :host([group]) ::slotted(ui-icon) {
    transition: transform 0.3s ease-in-out;
  }

  /* Connected Group Visuals */

  :host([group][open]) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    --md-focus-ring-shape-end-start: 0px;
    --md-focus-ring-shape-end-end: 0px;
    z-index: 1;
  }
  :host([group][open]) .surface,
  :host([group][open]) .ripple {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  :host([group][open]) .surface {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }

  :host([parent]:not([collapsed])) {
    border-radius: 0;
    --md-focus-ring-shape-start-start: 0px;
    --md-focus-ring-shape-start-end: 0px;
    --md-focus-ring-shape-end-start: 0px;
    --md-focus-ring-shape-end-end: 0px;
    z-index: 1;
  }
  :host([parent]:not([collapsed])) .surface,
  :host([parent]:not([collapsed])) .ripple {
    border-radius: 0;
  }
  :host([parent]:not([collapsed])) .surface {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }

  :host([parent][last-in-group]:not([collapsed])) {
    border-bottom-left-radius: 28px;
    border-bottom-right-radius: 28px;
    --md-focus-ring-shape-end-start: 28px;
    --md-focus-ring-shape-end-end: 28px;
  }
  :host([parent][last-in-group]:not([collapsed])) .surface,
  :host([parent][last-in-group]:not([collapsed])) .ripple {
    border-bottom-left-radius: 28px;
    border-bottom-right-radius: 28px;
  }
`
