import { css } from 'lit'

export default css`
  :host {
    display: inline-flex;
    vertical-align: middle;
    align-items: center;
    justify-content: center;

    position: relative;
    box-sizing: content-box;
    padding: 0 16px;

    outline: none;
    text-rendering: auto;
    cursor: default;
    user-select: none;
    width: auto;
    -webkit-tap-highlight-color: transparent;

    font-family: var(--md-sys-typescale-title-small-font);
    font-weight: var(--md-sys-typescale-title-small-weight);
    font-size: var(--md-sys-typescale-title-small-size);
    letter-spacing: var(--md-sys-typescale-title-small-tracking);
    line-height: var(--md-sys-typescale-title-small-height);

    --md-ripple-hover-state-layer-color: currentColor;
    --md-ripple-focus-state-layer-color: currentColor;
    --md-ripple-pressed-state-layer-color: currentColor;

    --_color: var(--md-sys-color-on-surface-variant);
    --_container-height: 48px;
    --_active-indicator-color: var(--md-sys-color-primary);
    --_active-indicator-shape: var(--md-primary-tab-active-indicator-shape, 3px 3px 0px 0px);
    --_active-indicator-height: 2px;
    --_active-indicator-opacity: 0;
    --_with-icon-and-label-text-container-height: var(--md-primary-tab-with-icon-and-label-text-container-height, 64px);
    --_icon-size: var(--md-secondary-tab-icon-size, 24px);

    background-color: var(--md-tab-background-color, var(--md-sys-color-surface));
    color: var(--_color);
    border-radius: var(--md-tab-container-shape, 0px);
    --md-ripple-state-layer-shape: var(--md-tab-container-shape, 0px);
  }

  :host([hidden]) {
    display: none;
  }

  .ripple.activated {
    z-index: 1;
  }

  .focus-ring {
    border-radius: var(--md-sys-shape-corner-small);
    transition: bottom var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
  }

  :host([selected]) .focus-ring {
    bottom: calc(var(--_active-indicator-height) + 1px);
  }

  .tab-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    gap: 8px;
    height: var(--_container-height);
  }

  .icon ::slotted(*) {
    color: var(--md-sys-color-on-surface-variant);
    fill: var(--md-sys-color-on-surface-variant);
    width: 24px;
    height: 24px;
  }

  :host([selected]) .icon ::slotted(*) {
    color: var(--md-sys-color-primary);
    fill: var(--md-sys-color-primary);
  }

  :host([selected]) {
    --_active-indicator-opacity: 1;
  }

  :host([priority='primary']) {
    --_color: var(--md-primary-tab-label-text-color, var(--md-sys-color-on-surface-variant));
  }

  :host([priority='secondary']) {
    --_color: var(--md-secondary-tab-label-text-color, var(--md-sys-color-on-surface-variant));
  }

  :host([selected][priority='primary']) {
    --_color: var(--md-primary-tab-active-label-text-color, var(--md-sys-color-primary));
  }

  :host([selected][priority='secondary']) {
    --_color: var(--md-secondary-tab-active-label-text-color, var(--md-sys-color-on-surface));
  }

  .surface {
    position: relative;
  }

  .indicator {
    position: absolute;
    box-sizing: border-box;
    transform-origin: bottom left;
    background: var(--_active-indicator-color);
    border-radius: var(--_active-indicator-shape);
    height: var(--_active-indicator-height);
    inset: auto 0 0 0;
    opacity: var(--_active-indicator-opacity);
  }

  :host([priority='primary']) {
    --_active-indicator-height: 3px;
    --_active-indicator-shape: 3px 3px 0px 0px;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  :host([disabled]) {
    --_color: var(--md-sys-color-on-surface);
    opacity: 0.38;
  }

  .stacked .tab-content {
    flex-direction: column;
    gap: 2px;
  }

  .stacked.has-icon.has-label .tab-content {
    height: var(--_with-icon-and-label-text-container-height);
  }
`
