import { css } from 'lit'

/* Material Design 3 Expressive Button - CSS-Native Implementation */
export default css`
  :host {
    display: flex;
    flex-wrap: wrap;

    --_gap: 8px;
    --_xs-radius: 16px;
    --_s-radius: 20px;
    --_m-radius: 28px;
    --_l-radius: 48px;
    --_xl-radius: 68px;

    gap: var(--_gap);
  }

  :host([size='xs'][type='standard']) {
    --_gap: 18px;
  }
  :host([size='xs'][type='connected']) {
    --_gap: 2px;
  }

  :host([size='s'][type='standard']) {
    --_gap: 12px;
  }
  :host([size='s'][type='connected']) {
    --_gap: 2px;
  }

  :host([size='m'][type='standard']) {
    --_gap: 8px;
  }
  :host([size='m'][type='connected']) {
    --_gap: 2px;
  }

  :host([size='l'][type='standard']) {
    --_gap: 8px;
  }
  :host([size='l'][type='connected']) {
    --_gap: 2px;
  }

  :host([size='xl'][type='standard']) {
    --_gap: 8px;
  }
  :host([size='xl'][type='connected']) {
    --_gap: 2px;
  }

  :host([type='connected']) ::slotted(ui-button[size='xs']:first-child) {
    --ui-button-shape-start-start: var(--_xs-radius);
    --ui-button-shape-end-start: var(--_xs-radius);
  }

  :host([type='connected']) ::slotted(ui-button[size='s']:first-child) {
    --ui-button-shape-start-start: var(--_s-radius);
    --ui-button-shape-end-start: var(--_s-radius);
  }

  :host([type='connected']) ::slotted(ui-button[size='m']:first-child) {
    --ui-button-shape-start-start: var(--_m-radius);
    --ui-button-shape-end-start: var(--_m-radius);
  }

  :host([type='connected']) ::slotted(ui-button[size='l']:first-child) {
    --ui-button-shape-start-start: var(--_l-radius);
    --ui-button-shape-end-start: var(--_l-radius);
  }

  :host([type='connected']) ::slotted(ui-button[size='xl']:first-child) {
    --ui-button-shape-start-start: var(--_xl-radius);
    --ui-button-shape-end-start: var(--_xl-radius);
  }

  :host([type='connected']) ::slotted(ui-button[size='xs']:last-child) {
    --ui-button-shape-start-end: var(--_xs-radius);
    --ui-button-shape-end-end: var(--_xs-radius);
  }

  :host([type='connected']) ::slotted(ui-button[size='s']:last-child) {
    --ui-button-shape-start-end: var(--_s-radius);
    --ui-button-shape-end-end: var(--_s-radius);
  }

  :host([type='connected']) ::slotted(ui-button[size='m']:last-child) {
    --ui-button-shape-start-end: var(--_m-radius);
    --ui-button-shape-end-end: var(--_m-radius);
  }

  :host([type='connected']) ::slotted(ui-button[size='l']:last-child) {
    --ui-button-shape-start-end: var(--_l-radius);
    --ui-button-shape-end-end: var(--_l-radius);
  }

  :host([type='connected']) ::slotted(ui-button[size='xl']:last-child) {
    --ui-button-shape-start-end: var(--_xl-radius);
    --ui-button-shape-end-end: var(--_xl-radius);
  }
`
