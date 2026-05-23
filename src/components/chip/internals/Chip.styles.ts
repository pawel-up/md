import { css } from 'lit'

export default css`
  :host {
    display: inline-block;
    vertical-align: middle;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    position: relative;
    user-select: none;

    font-family: var(--md-sys-typescale-label-large-font);
    font-size: var(--md-sys-typescale-label-large-size);
    letter-spacing: var(--md-sys-typescale-label-large-tracking);
    line-height: var(--md-sys-typescale-label-large-height);

    white-space: normal;

    --md-ripple-hover-state-layer-color: var(--md-sys-color-on-surface);
    --md-ripple-focus-state-layer-color: var(--md-sys-color-on-surface);
    --md-ripple-pressed-state-layer-color: var(--md-sys-color-primary);

    --_leading-icon-color: currentColor;
    --_trailing-icon-color: currentColor;
    --_background-color: transparent;
    --_color: inherit;
    --_shadow: var(--md-sys-elevation-0);
    --_outline-color: transparent;
    --_outline-size: 0;
    --_inline-padding-start: 16px;
    --_inline-padding-end: 16px;
    --_avatar-size: 24px;
    --_avatar-shape: 24px;
    --_icon-size: 18px;

    height: 32px;
    box-sizing: border-box;
    border-radius: var(--md-sys-shape-corner-small);
    box-shadow: var(--_shadow);
    border: var(--_outline-size) solid var(--_outline-color);
  }

  .ripple {
    border-radius: inherit;
    transition: border-radius var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-standard);
  }

  .ripple.activated {
    z-index: 1;
  }

  :host([disabled]) {
    --_background-color: color-mix(in srgb, var(--md-sys-color-on-surface) 12%, transparent);
    --_color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent);
    --_leading-icon-color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent);
    --_trailing-icon-color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent);
    --_outline-color: color-mix(in srgb, var(--md-sys-color-on-surface) 12%, transparent);
    box-shadow: none;
    cursor: not-allowed;
    pointer-events: none;
  }

  .surface {
    height: inherit;
    display: flex;
    align-items: center;
    justify-content: start;
    box-sizing: border-box;
    padding: 0 var(--_inline-padding-end) 0 var(--_inline-padding-start);
    border-radius: inherit;
    background-color: var(--_background-color);
    color: var(--_color);
    gap: 0;
  }

  .leading-icon {
    height: var(--_icon-size);
    width: 0px;
    overflow: hidden;
    transition: width 230ms var(--md-sys-animation-easing-standard);
    color: var(--_leading-icon-color);
    fill: currentColor;
  }

  .leading-icon::slotted(*) {
    width: var(--_icon-size);
    height: var(--_icon-size);
    margin-right: 8px;
  }

  slot[name='avatar']::slotted(*) {
    width: var(--_avatar-size);
    height: var(--_avatar-size);
    border-radius: var(--_avatar-shape);
    flex-shrink: 0;
    flex-grow: 0;
    margin-right: 8px;
  }

  .check-mark.checked {
    width: 18px;
    margin-right: 8px;
  }

  .trailing-icon {
    margin-left: 8px;
    width: 18px;
    height: 18px;
    color: var(--_trailing-icon-color);
    fill: currentColor;
  }

  :host([elevated]) {
    --_shadow: var(--md-sys-elevation-1);
    border: none;
    --_background-color: var(--md-sys-color-surface-container-low);
  }

  :host([elevated]:hover:not([disabled])) {
    --_shadow: var(--md-sys-elevation-2);
  }

  .surface.has-trailing-icon {
    --_inline-padding-end: 8px;
  }

  :host([type='assist']:not([disabled])) {
    --_outline-color: var(--md-sys-color-outline-variant);
    --_outline-size: 1px;
    --_color: var(--md-sys-color-on-surface);
    --_leading-icon-color: var(--md-sys-color-primary);
  }

  :host .has-icon {
    --_inline-padding-start: 8px;
  }

  :host .has-avatar {
    --_inline-padding-start: 4px;
  }

  :host([checked]) {
    --_inline-padding-start: 8px;
    --_background-color: var(--md-sys-color-secondary-container);
  }

  :host([type='filter']:not([disabled])) {
    --_leading-icon-color: var(--md-sys-color-primary);
    --_trailing-icon-color: var(--md-sys-on-surface-variant);
    --_outline-color: var(--md-sys-color-outline-variant);
    --_outline-size: 1px;
    --_color: var(--md-sys-color-on-surface-variant);
  }

  :host([type='filter'][checked]) {
    --_outline-size: 1px;
  }

  :host([type='filter'][checked]:not([disabled])) {
    --_leading-icon-color: var(--md-sys-color-on-secondary-container);
    --_trailing-icon-color: var(--md-sys-on-secondary-container);
    --_outline-color: var(--md-sys-color-secondary-container);
    --_color: var(--md-sys-color-on-secondary-container);
  }

  :host([type='input']:not([disabled])) {
    --_outline-color: var(--md-sys-color-outline-variant);
    --_outline-size: 1px;
    --_leading-icon-color: var(--md-sys-color-primary);
    --_trailing-icon-color: var(--md-sys-color-on-surface-variant);
    --_color: var(--md-sys-color-on-surface-variant);
  }

  :host([type='input'][checked]) {
    --_outline-size: 0px;
  }

  :host([type='suggestion']) {
    --_outline-size: 1px;
    --_outline-color: var(--md-sys-color-outline-variant);
    --_color: var(--md-sys-color-on-surface-variant);
  }

  :host([type='suggestion']:not([disabled])) {
    --_leading-icon-color: var(--md-sys-color-primary);
  }
`
