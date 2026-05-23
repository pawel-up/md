import { css } from 'lit'

export default css`
  :host {
    --_active-indicator-color: var(--md-sys-color-on-surface-variant);
    --_active-indicator-height: 1px;
    --_focus-active-indicator-color: var(--md-sys-color-primary, #6750a4);
    --_focus-active-indicator-height: 2px;
    border-radius: var(--md-sys-shape-corner-extra-small-top);
  }

  .surface {
    height: 56px;
    border-radius: inherit;
  }

  .container {
    border-radius: inherit;
    background-color: var(--md-sys-color-surface-variant);
  }

  .body {
    overflow: hidden;
  }

  .label {
    position: absolute;
    transform: translateY(-1.35rem) scale(0.8);
    top: 50%;
  }

  .labelResting .label {
    transform: translateY(-50%) scale(1);
  }

  :host(:focus-within) .label {
    color: var(--md-sys-color-primary);
  }

  .highlight {
    inset: auto 0px 0px;
    pointer-events: none;
    position: absolute;
    width: 100%;
    z-index: 4;
  }

  .highlight::before {
    content: '';
    border-bottom: 1px solid var(--md-sys-color-on-surface-variant);
    inset: auto 0px 0px;
    position: absolute;
  }

  .highlight::after {
    content: '';
    border-bottom-color: var(--md-sys-color-primary);
    border-bottom-width: 2px;
    border-bottom-style: solid;
    opacity: 0;
    transform: scaleX(0);
    transform-origin: center center;

    transition:
      opacity 150ms cubic-bezier(0.4, 0, 0.2, 1) 0s,
      transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 150ms;

    position: absolute;
    inset: auto 0px 0px;
  }

  :host(:focus-within) .highlight::after {
    opacity: 1;
    transform: scaleX(1);
  }

  :host([disabled]) .highlight::before {
    border-bottom-color: var(--md-sys-color-on-surface);
    opacity: 0.38;
  }

  :host([invalid]) .highlight::before {
    border-bottom-color: var(--md-sys-color-error);
  }

  :host([invalid]:hover) .highlight::before {
    border-bottom-color: var(--md-sys-color-on-error-container);
  }

  :host([invalid]) .highlight::after {
    border-bottom-color: var(--md-sys-color-error);
  }

  .labelHidden .body {
    padding-top: 0;
  }

  .container::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    background-color: var(--md-sys-color-on-surface-variant);
    transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  :host(:hover) .container::before {
    opacity: var(--md-sys-state-hover-state-layer-opacity);
  }

  .body {
    padding-top: 1em;
  }
`
