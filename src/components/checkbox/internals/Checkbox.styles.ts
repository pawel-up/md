import { css } from 'lit'

export default css`
  :host {
    display: inline-block;
    vertical-align: middle;
    outline: none;
    -webkit-tap-highlight-color: transparent;

    position: relative;

    --md-ripple-hover-state-layer-color: var(--md-sys-color-on-surface);
    --md-ripple-focus-state-layer-color: var(--md-sys-color-on-surface);
    --md-ripple-pressed-state-layer-color: var(--md-sys-color-primary);

    --_container-border-color: var(--md-sys-color-on-surface);
    --_container-border-width: 2px;
    --_container-background-color: transparent;
    --_container-opacity: 1;

    --_check-mark-color: currentColor;

    --_checkbox-width: 18px;
    --_checkbox-height: 18px;
    --_state-width: 40px;
    --_state-height: 40px;
  }

  .surface {
    position: relative;
    min-width: var(--_state-width);
    height: var(--_state-height);
    display: flex;
    align-items: center;
  }

  .container {
    border-radius: 2px;
    border: var(--_container-border-width) var(--_container-border-color) solid;
    background-color: var(--_container-background-color);
    opacity: var(--_container-opacity);

    position: absolute;
    inset: 11px 0px 0px 11px;

    width: var(--_checkbox-width);
    height: var(--_checkbox-height);

    box-sizing: border-box;

    transition:
      cubic-bezier(0.2, 0, 0, 1) border-radius 0.23s,
      cubic-bezier(0.2, 0, 0, 1) border-color 0.23s,
      cubic-bezier(0.2, 0, 0, 1) background-color 0.13s;
  }

  .icon {
    width: var(--_checkbox-width);
    height: var(--_checkbox-height);
    position: absolute;
    inset: 11px 0 0 11px;
  }

  .icon > svg {
    width: var(--_checkbox-width) !important;
    height: var(--_checkbox-height) !important;
    fill: var(--_check-mark-color);
  }

  .state {
    position: absolute;
    inset: 0;
    width: var(--_state-width);
    height: var(--_state-height);
    border-radius: var(--md-sys-shape-corner-full);
  }

  .ripple {
    border-radius: var(--md-sys-shape-corner-full);
    z-index: 3;
  }

  :host([checked]) {
    --md-ripple-hover-state-layer-color: var(--md-sys-color-primary);
    --md-ripple-focus-state-layer-color: var(--md-sys-color-primary);
    --md-ripple-pressed-state-layer-color: var(--md-sys-color-on-surface);
  }

  :host([checked]),
  :host([indeterminate]) {
    --_container-border-width: 0px;
    --_container-background-color: var(--md-sys-color-primary);
    --_check-mark-color: var(--md-sys-color-on-primary);
  }

  :host([invalid]) {
    --md-ripple-hover-state-layer-color: var(--md-sys-color-error);
    --md-ripple-focus-state-layer-color: var(--md-sys-color-error);
    --md-ripple-pressed-state-layer-color: var(--md-sys-color-error);
    --_container-border-color: var(--md-sys-color-error);
  }

  :host([checked][invalid]),
  :host([indeterminate][invalid]) {
    --_check-mark-color: var(--md-sys-color-on-error);
    --_container-border-color: transparent;
    --_container-background-color: var(--md-sys-color-error);
  }

  :host([disabled]) {
    pointer-events: none;
    --_check-mark-color: var(--md-sys-color-surface);
    --_container-border-color: var(--md-sys-color-on-surface);
    --_container-border-width: 2px;
    --_container-opacity: 38%;
  }

  :host([checked][disabled]),
  :host([indeterminate][disabled]) {
    --_container-background-color: var(--md-sys-color-on-surface);
    --_container-border-width: 0;
    --_container-opacity: 38%;
  }
`
