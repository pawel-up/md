import { css } from 'lit'

/* Material Design 3 Expressive Button - CSS-Native Implementation */
export default css`
  :host {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;

    --_group-gap: 12px;
    --_group-pill-radius: 20px;
    --_group-outer-radius: var(--_group-pill-radius);
    --_group-inner-radius: 8px;

    gap: var(--_group-gap);
  }

  :host([size='xs']) {
    --_group-pill-radius: 16px;
    --_group-inner-radius: 4px;
    --_group-gap: 18px;
  }

  :host([size='s']) {
    --_group-pill-radius: 20px;
    --_group-inner-radius: 8px;
    --_group-gap: 12px;
  }

  :host([size='m']) {
    --_group-pill-radius: 28px;
    --_group-inner-radius: 8px;
    --_group-gap: 8px;
  }

  :host([size='l']) {
    --_group-pill-radius: 48px;
    --_group-inner-radius: 16px;
    --_group-gap: 8px;
  }

  :host([size='xl']) {
    --_group-pill-radius: 68px;
    --_group-inner-radius: 20px;
    --_group-gap: 8px;
  }

  :host([shape='square']) {
    --_group-outer-radius: var(--_group-inner-radius);
  }

  :host([type='connected']) {
    --_group-gap: 2px;
  }

  /* Connected button group inner buttons: all corners have inner radius */
  :host([type='connected']) ::slotted(ui-button) {
    --ui-button-shape-start-start: var(--_group-inner-radius);
    --ui-button-shape-start-end: var(--_group-inner-radius);
    --ui-button-shape-end-start: var(--_group-inner-radius);
    --ui-button-shape-end-end: var(--_group-inner-radius);
  }

  /* Most-left button has outer radius on its start (left) side */
  :host([type='connected']) ::slotted(ui-button:first-child),
  :host([type='connected']) ::slotted(ui-button:first-of-type) {
    --ui-button-shape-start-start: var(--_group-outer-radius);
    --ui-button-shape-end-start: var(--_group-outer-radius);
  }

  /* Most-right button has outer radius on its end (right) side */
  :host([type='connected']) ::slotted(ui-button:last-child),
  :host([type='connected']) ::slotted(ui-button:last-of-type) {
    --ui-button-shape-start-end: var(--_group-outer-radius);
    --ui-button-shape-end-end: var(--_group-outer-radius);
  }

  /* Single button has outer radius on all corners */
  :host([type='connected']) ::slotted(ui-button:only-child),
  :host([type='connected']) ::slotted(ui-button:only-of-type) {
    --ui-button-shape-start-start: var(--_group-outer-radius);
    --ui-button-shape-start-end: var(--_group-outer-radius);
    --ui-button-shape-end-start: var(--_group-outer-radius);
    --ui-button-shape-end-end: var(--_group-outer-radius);
  }

  /* Selected buttons have outer (round) radius on ALL 4 corners */
  :host([type='connected']) ::slotted(ui-button[selected]) {
    --ui-button-shape-start-start: var(--_group-pill-radius);
    --ui-button-shape-start-end: var(--_group-pill-radius);
    --ui-button-shape-end-start: var(--_group-pill-radius);
    --ui-button-shape-end-end: var(--_group-pill-radius);
  }
`
