import { css } from 'lit'

export default css`
  :host {
    display: inline-flex;
    flex-direction: column;
    vertical-align: top;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    cursor: text;

    min-width: 200px;
  }

  .surface {
    height: 56px;
    position: relative;
    display: flex;
    align-items: center;
    cursor: inherit;
  }

  .container {
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: inherit;
  }

  .content {
    height: inherit;
    display: flex;
    align-items: center;
    justify-content: start;
    box-sizing: border-box;
    position: relative;
    z-index: 2;
    flex: 1;
    cursor: inherit;
  }

  .body {
    flex: 1;
    box-sizing: border-box;
    position: relative;
    cursor: inherit;
  }

  .label {
    color: var(--md-sys-color-on-surface-variant);

    max-width: 100%;
    pointer-events: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    z-index: 3;

    font-family: var(--md-sys-typescale-body-large-font);
    font-weight: var(--md-sys-typescale-body-large-weight);
    font-size: var(--md-sys-typescale-body-large-size);
    letter-spacing: var(--md-sys-typescale-body-large-tracking);
    line-height: var(--md-sys-typescale-body-large-height);

    transform-origin: left center;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .input {
    caret-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-surface);
    height: 24px; /* ??? */
    flex: 1; /* ??? */
    white-space: nowrap;
    overflow: hidden;
    background: transparent;
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    width: 1px;
    cursor: inherit;

    font-family: var(--md-sys-typescale-body-large-font);
    font-weight: var(--md-sys-typescale-body-large-weight);
    font-size: var(--md-sys-typescale-body-large-size);
    letter-spacing: var(--md-sys-typescale-body-large-tracking);
    line-height: var(--md-sys-typescale-body-large-height);
  }

  .input:-webkit-autofill,
  .input:autofill {
    background-color: transparent !important;
  }

  .start,
  .body,
  .end {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: start;
  }

  .start {
    width: 16px;
    min-width: 16px;
  }

  .start.prefixed {
    width: 24px;
    min-width: 24px;
    margin-left: 12px;
    margin-right: 16px;
  }

  .end {
    width: 16px;
    min-width: 16px;
  }

  .end.suffixed {
    width: 24px;
    min-width: 24px;
    margin-right: 12px;
    padding-right: 12px;
    margin-left: 16px;
  }

  .end ::slotted(*),
  .start ::slotted(*) {
    cursor: default;
  }

  .supporting-text {
    padding-top: 4px;
    color: var(--md-sys-color-on-surface-variant);
    font-family: var(--md-sys-typescale-body-small-font);
    font-weight: var(--md-sys-typescale-body-small-weight);
    font-size: var(--md-sys-typescale-body-small-size);
    letter-spacing: var(--md-sys-typescale-body-small-tracking);
    line-height: var(--md-sys-typescale-body-small-height);
    display: flex;
    justify-content: space-between;
    padding: 0 16px;
  }

  .supporting-text-start {
    flex: 1;
    margin-right: 16px;
  }

  .supporting-text-end {
    margin-left: auto;
    flex-shrink: 0;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  :host([disabled]) .container {
    background-color: var(--md-sys-color-on-surface);
    opacity: 0.04;
  }

  :host([disabled]) .label,
  :host([disabled]) .input,
  :host([disabled]) .end ::slotted(*),
  :host([disabled]) .start ::slotted(*) {
    color: var(--md-sys-color-on-surface);
    opacity: 0.38;
  }

  :host([invalid]) .label,
  :host([invalid]:focus-within) .label,
  :host([invalid]) .supporting-text,
  :host([invalid]) .end ::slotted(*) {
    color: var(--md-sys-color-error);
  }

  :host([invalid]:hover) .label,
  :host([invalid]:hover) .end ::slotted(*) {
    color: var(--md-sys-color-on-error-container);
  }

  .labelHidden .label {
    display: none;
  }
`
