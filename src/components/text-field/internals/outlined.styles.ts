import { css } from 'lit'

export default css`
  :host {
    --_border-color: var(--md-sys-color-outline);
    --_border-width: 1px;
  }

  .highlight {
    display: none;
  }

  .surface {
    border-radius: var(--md-sys-shape-corner-extra-small);
  }

  .container {
    border: none;
    outline: none;
  }

  :host(:hover:not(:focus-within):not([invalid])) {
    --_border-color: var(--md-sys-color-on-surface);
  }

  :host(:focus-within:not([invalid])) {
    --_border-color: var(--md-sys-color-primary);
  }

  :host(:focus-within) {
    --_border-width: 3px;
  }

  :host([invalid]) {
    --_border-color: var(--md-sys-color-error);
  }

  :host([invalid]:hover) {
    --_border-color: var(--md-sys-color-on-error-container);
  }

  :host([invalid]:focus-within) {
    --_border-width: 3px;
  }

  .label {
    display: none;
  }

  /* Outline layout and styles */
  .outline {
    position: absolute;
    inset: 0;
    display: flex;
    pointer-events: none;
    border-radius: inherit;
    z-index: 1;
  }

  .outline-start,
  .outline-notch,
  .outline-end {
    border-color: var(--_border-color);
    border-style: solid;
    box-sizing: border-box;
    height: 100%;
    transition:
      border-color 150ms cubic-bezier(0.4, 0, 0.2, 1),
      border-width 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .outline-start {
    border-width: var(--_border-width) 0 var(--_border-width) var(--_border-width);
    border-radius: var(--md-sys-shape-corner-extra-small) 0 0 var(--md-sys-shape-corner-extra-small);
    width: 12px;
  }

  .outline-notch {
    border-width: var(--_border-width) 0;
    max-width: calc(100% - 24px);
    position: relative;
    display: flex;
    align-items: center;
  }

  .hasLabel .outline-notch {
    padding: 0 4px;
  }

  .hasLabel.labelActive .outline-notch {
    border-top-color: transparent;
  }

  .labelResting.hasSuffix .outline-notch {
    max-width: calc(100% - 60px); /* 12px notch padding + 48px suffix area */
  }

  .outline-end {
    border-width: var(--_border-width) var(--_border-width) var(--_border-width) 0;
    border-radius: 0 var(--md-sys-shape-corner-extra-small) var(--md-sys-shape-corner-extra-small) 0;
    flex-grow: 1;
  }

  .outline-label {
    position: relative;
    transform: translateY(0);
    font-size: var(--md-sys-typescale-body-large-size);
    transform-origin: left center;
    transition:
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      font-size 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .labelResting.hasPrefix .outline-label {
    transform: translateX(36px);
  }

  .labelActive .outline-label {
    font-size: 12px; /* 0.75rem / scale(0.75) */
    transform: translateY(-28px);
  }

  :host(:focus-within) .outline-label {
    color: var(--md-outlined-text-field-label-active-color, var(--md-sys-color-primary));
  }

  .labelHidden.hasLabel .outline-notch {
    padding: 0;
  }

  .labelHidden.hasLabel.labelActive .outline-notch {
    border-top-color: var(--_border-color);
  }
`
