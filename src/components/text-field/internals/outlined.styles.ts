import { css } from 'lit'

export default css`
  :host {
    --_border-color: var(--md-sys-color-outline);
    --_outline-color: var(--md-sys-color-primary);
    --_outline-width: 0px;
  }

  .highlight {
    display: none;
  }

  .surface {
    border-radius: var(--md-sys-shape-corner-extra-small);
  }

  .container {
    border: 1px var(--_border-color) solid;
    outline: var(--_outline-width) solid var(--_outline-color);
    outline-offset: calc(-1 * var(--_outline-width));
    transition:
      border-color 150ms cubic-bezier(0.4, 0, 0.2, 1),
      outline-width 150ms cubic-bezier(0.4, 0, 0.2, 1),
      outline-offset 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  :host(:hover:not(:focus-within):not([invalid])) {
    --_border-color: var(--md-sys-color-on-surface);
  }

  :host(:focus-within:not([invalid])) {
    --_border-color: var(--md-sys-color-primary);
  }

  :host(:focus-within) {
    --_outline-width: 3px;
  }

  :host([invalid]) {
    --_border-color: var(--md-sys-color-error);
    --_outline-color: var(--md-sys-color-error);
  }

  :host([invalid]:hover) {
    --_outline-color: var(--md-sys-color-on-error-container);
    --_border-color: var(--md-sys-color-on-error-container);
  }

  .label {
    padding: 0 4px;
  }

  .labelActive .label {
    transform: translateY(calc(-100% - 2px)) scale(0.75);
    position: absolute;
    background-color: var(--md-outlined-text-field-label-active-background-color, var(--md-sys-color-surface));
  }

  :host(:focus-within) .label {
    color: var(--md-outlined-text-field-label-active-color, var(--md-sys-color-primary));
  }
`
