import { css } from 'lit'

export default css`
  :host {
    display: inline-flex;
    vertical-align: middle;
    box-sizing: content-box;
    writing-mode: horizontal-tb !important;
    text-rendering: auto;
    cursor: default;
    user-select: none;
    height: 40px;
    width: 40px;
    border-radius: var(--md-sys-shape-corner-full);
    --md-ripple-state-layer-shape: var(--md-sys-shape-corner-full);
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    position: relative;
    outline: none;

    --_content-color: inherit;
    --_content-opacity: 1;
    --_container-background-color: initial;
    --_container-opacity: 1;
    --_container-border: none;
    --_state-opacity: 0;
    --_state-background-color: initial;
  }

  .content ::slotted(*) {
    width: 24px !important;
    height: 24px !important;

    color: var(--_content-color);
    fill: var(--_content-color);
    opacity: var(--_content-opacity);
  }

  .surface {
    height: inherit;
    width: inherit;
    position: relative;
    border-radius: var(--md-sys-shape-corner-full);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .container,
  .state {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: var(--md-sys-shape-corner-full);
  }

  .container {
    z-index: 1;
    pointer-events: none;
    background-color: var(--_container-background-color);
    opacity: var(--_container-opacity);
    border: var(--_container-border);
  }

  .state {
    z-index: 2;
    pointer-events: none;
    opacity: var(--_state-opacity);
    background-color: var(--_state-background-color);
  }

  .content {
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--_content-color);
  }

  :host([disabled]) {
    pointer-events: none;
  }

  .ripple {
    border-radius: inherit;
    z-index: 3;
  }
`
