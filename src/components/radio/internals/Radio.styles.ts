import { css } from 'lit'

export default css`
  :host {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    min-width: 48px;
    height: 48px;
    cursor: pointer;
    position: relative;
    -webkit-tap-highlight-color: transparent;
    outline: none;
    --md-ripple-hover-state-layer-color: var(--md-sys-color-on-surface);
    --md-ripple-focus-state-layer-color: var(--md-sys-color-on-surface);
    --md-ripple-pressed-state-layer-color: var(--md-sys-color-primary);
  }

  :host([disabled]) {
    pointer-events: none;
  }

  .surface {
    min-width: inherit;
    height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .state {
    position: absolute;
    inset: 0;
    width: 40px;
    height: 40px;
    border-radius: var(--md-sys-shape-corner-full);
    top: 4px;
    left: 4px;
  }

  .content {
    display: inline-flex;
    position: relative;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }

  .outer {
    position: absolute;
    inset-block-start: 0px;
    inset-inline-start: 0px;
    box-sizing: border-box;
    block-size: 100%;
    inline-size: 100%;
    border-width: 2px;
    border-style: solid;
    border-radius: 50%;
    transition: border-color 120ms cubic-bezier(0.4, 0, 0.6, 1);
    border-color: var(--md-sys-color-on-surface);
  }

  .inner {
    position: absolute;
    box-sizing: border-box;
    block-size: 50%;
    inline-size: 50%;
    transform: scale(0);
    border-radius: 50%;
    transition:
      transform 120ms cubic-bezier(0.4, 0, 0.6, 1) 0s,
      border-color 120ms cubic-bezier(0.4, 0, 0.6, 1) 0s;
  }

  .ripple {
    border-radius: var(--md-sys-shape-corner-full);
    z-index: 3;
  }

  :host([invalid]) label {
    color: var(--md-sys-color-error);
  }

  :host([checked]) .outer {
    transition: border-color 120ms cubic-bezier(0, 0, 0.2, 1) 0s;
    border-color: var(--md-sys-color-primary);
  }

  :host([checked]) .inner {
    transform: scale(1);
    transition:
      transform 120ms cubic-bezier(0, 0, 0.2, 1) 0s,
      border-color 120ms cubic-bezier(0, 0, 0.2, 1) 0s;
    background-color: var(--md-sys-color-primary);
  }

  /* Hover state */

  /* :host(:hover) .state {
  background-color: var(--md-sys-color-on-surface);
  opacity: var(--md-sys-state-hover-state-layer-opacity);
} */

  /* :host([checked]:hover) .state {
  background-color: var(--md-sys-color-primary);
  opacity: var(--md-sys-state-hover-state-layer-opacity);
} */

  /* Focused state */

  /* :host(:focus) .state {
  background-color: var(--md-sys-color-on-surface);
  opacity: var(--md-sys-state-focus-state-layer-opacity);
}

:host([checked]:focus) .state {
  background-color: var(--md-sys-color-primary);
  opacity: var(--md-sys-state-focus-state-layer-opacity);
} */

  /* Pressed state */
  /* :host(:active) .state,
:host .pressed .state {
  background-color: var(--md-sys-color-primary);
  opacity: var(--md-sys-state-pressed-state-layer-opacity);
}

:host([checked]:active) .state,
:host([checked]) .pressed .state {
  background-color: var(--md-sys-color-on-surface);
  opacity: var(--md-sys-state-pressed-state-layer-opacity);
} */

  :host([disabled]) .outer {
    border-color: var(--md-sys-color-on-surface);
    opacity: 0.38;
  }

  :host([disabled]) .inner {
    background-color: var(--md-sys-color-on-surface);
    opacity: 0.38;
  }

  /* :host([disabled]) .state {
  opacity: 0;
} */
`
