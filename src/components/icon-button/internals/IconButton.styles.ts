import { css } from 'lit'

export default css`
  :host {
    all: unset;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    white-space: nowrap;

    --md-ripple-hover-state-layer-color: currentColor;
    --md-ripple-focus-state-layer-color: currentColor;
    --md-ripple-pressed-state-layer-color: currentColor;

    --_color: inherit;
    --_background-color: transparent;
    --_icon-size: var(--md-button-icon-size, 20px);
    --_container-height: inherit;
    --_leading-space: 0;
    --_trailing-space: 0;
    --_radius: 0;
    --_outline-width: 0;

    --_xs-radius: 16px;
    --_s-radius: 20px;
    --_m-radius: 28px;
    --_l-radius: 48px;
    --_xl-radius: 68px;

    background-color: var(--_background-color);
    color: var(--_color);
    fill: var(--_color);
    height: var(--_container-height);
    padding-inline-start: var(--_leading-space);
    padding-inline-end: var(--_trailing-space);
    border: var(--_outline-width) var(--md-sys-color-outline-variant) solid;
    border-end-end-radius: var(--ui-button-shape-end-end, var(--_radius));
    border-end-start-radius: var(--ui-button-shape-end-start, var(--_radius));
    border-start-end-radius: var(--ui-button-shape-start-end, var(--_radius));
    border-start-start-radius: var(--ui-button-shape-start-start, var(--_radius));

    /* Interaction styles */
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    outline: none;

    transition:
      background-color var(--md-sys-motion-duration-short2, 200ms)
        var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
      color var(--md-sys-motion-duration-short2, 200ms) var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
      border-color var(--md-sys-motion-duration-short2, 200ms)
        var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
      border-radius var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-standard);
  }

  ::slotted(*) {
    width: var(--_icon-size) !important;
    height: var(--_icon-size) !important;
    color: var(--_color);
    fill: var(--_color);
  }

  .ripple {
    border-radius: inherit;
    transition: border-radius var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-standard);
  }

  .focus-ring {
    --md-focus-ring-shape-end-end: var(--ui-button-shape-end-end, var(--_radius));
    --md-focus-ring-shape-end-start: var(--ui-button-shape-end-start, var(--_radius));
    --md-focus-ring-shape-start-end: var(--ui-button-shape-start-end, var(--_radius));
    --md-focus-ring-shape-start-start: var(--ui-button-shape-start-start, var(--_radius));
    transition: border-radius var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-standard);
  }

  .ripple.activated {
    z-index: 1;
  }

  /* Filled Button */
  :host([color='filled']) {
    --_background-color: var(--md-sys-color-primary);
    --_color: var(--md-sys-color-on-primary);
  }

  :host([color='filled'][toggle]) {
    --_background-color: var(--md-sys-color-surface-container);
    --_color: var(--md-sys-color-on-surface-variant);
  }

  :host([color='filled'][toggle][selected]) {
    --_background-color: var(--md-sys-color-primary);
    --_color: var(--md-sys-color-on-primary);
  }

  :host([color='filled'][disabled]) {
    --_background-color: color-mix(in srgb, var(--md-sys-color-on-surface) 10%, transparent);
    --_color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent);
  }

  /* Filled Tonal Button */
  :host([color='tonal']) {
    --_background-color: var(--md-sys-color-secondary-container);
    --_color: var(--md-sys-color-on-secondary-container);
  }

  :host([color='tonal'][toggle]) {
    --_background-color: var(--md-sys-color-secondary-container);
    --_color: var(--md-sys-color-on-secondary-container);
  }

  :host([color='tonal'][toggle][selected]) {
    --_background-color: var(--md-sys-color-secondary);
    --_color: var(--md-sys-color-on-secondary);
  }

  :host([color='tonal']:hover:not([disabled])) {
    --_shadow: var(--md-sys-elevation-1);
  }

  :host([color='tonal'][disabled]) {
    --_background-color: color-mix(in srgb, var(--md-sys-color-on-surface) 10%, transparent);
    --_color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent);
  }

  /* Outlined Button */
  :host([color='outlined']) {
    --_outline-width: 1px;
    --_color: var(--md-sys-color-on-surface-variant);
  }
  :host([color='outlined'][size='l']),
  :host([color='outlined'][size='xl']) {
    --_outline-width: 3px;
  }

  :host([color='outlined'][toggle][selected]) {
    --_background-color: var(--md-sys-color-inverse-surface);
    --_color: var(--md-sys-color-inverse-on-surface);
  }

  :host([color='outlined'][disabled]) {
    border-color: color-mix(in srgb, var(--md-sys-color-on-surface) 10%, transparent);
    --_color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent);
  }

  /* Standard Button */
  :host([color='standard']) {
    --_color: var(--md-sys-color-on-surface-variant);
  }

  :host([color='standard'][toggle][selected]) {
    --_color: var(--md-sys-color-primary);
  }

  :host([color='standard'][disabled]) {
    color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent);
  }

  /* Sizes */
  :host([size='xs']) {
    --_container-height: 32px;
    --_icon-size: 20px;
  }
  :host([size='s']) {
    --_container-height: 40px;
    --_icon-size: 24px;
  }
  :host([size='m']) {
    --_container-height: 56px;
    --_icon-size: 24px;
  }
  :host([size='l']) {
    --_container-height: 96px;
    --_icon-size: 32px;
  }
  :host([size='xl']) {
    --_container-height: 136px;
    --_icon-size: 40px;
  }
  :host([size='xs'][width='narrow']) {
    --_leading-space: 4px;
    --_trailing-space: 4px;
  }
  :host([size='xs'][width='default']) {
    --_leading-space: 6px;
    --_trailing-space: 6px;
  }
  :host([size='xs'][width='wide']) {
    --_leading-space: 10px;
    --_trailing-space: 10px;
  }
  :host([size='s'][width='narrow']) {
    --_leading-space: 4px;
    --_trailing-space: 4px;
  }
  :host([size='s'][width='default']) {
    --_leading-space: 8px;
    --_trailing-space: 8px;
  }
  :host([size='s'][width='wide']) {
    --_leading-space: 14px;
    --_trailing-space: 14px;
  }
  :host([size='m'][width='narrow']) {
    --_leading-space: 12px;
    --_trailing-space: 12px;
  }
  :host([size='m'][width='default']) {
    --_leading-space: 16px;
    --_trailing-space: 16px;
  }
  :host([size='m'][width='wide']) {
    --_leading-space: 24px;
    --_trailing-space: 24px;
  }
  :host([size='l'][width='narrow']) {
    --_leading-space: 16px;
    --_trailing-space: 16px;
  }
  :host([size='l'][width='default']) {
    --_leading-space: 32px;
    --_trailing-space: 32px;
  }
  :host([size='l'][width='wide']) {
    --_leading-space: 48px;
    --_trailing-space: 48px;
  }
  :host([size='xl'][width='narrow']) {
    --_leading-space: 32px;
    --_trailing-space: 32px;
  }
  :host([size='xl'][width='default']) {
    --_leading-space: 48px;
    --_trailing-space: 48px;
  }
  :host([size='xl'][width='wide']) {
    --_leading-space: 72px;
    --_trailing-space: 72px;
  }

  /* Shape setup */
  /* For the round shape, we can't use the "--md-sys-shape-corner-full" value as it has a value of 999px and it would make animations impossible so see. */
  :host([shape='round'][size='xs']) {
    --_radius: var(--_xs-radius);
  }
  :host([shape='round'][size='s']) {
    --_radius: var(--_s-radius);
  }
  :host([shape='square'][size='xs']),
  :host([shape='square'][size='s']) {
    --_radius: var(--md-sys-shape-corner-medium);
  }
  :host([shape='round'][size='m']) {
    --_radius: var(--_m-radius);
  }
  :host([shape='square'][size='m']) {
    --_radius: var(--md-sys-shape-corner-large);
  }
  :host([shape='round'][size='l']) {
    --_radius: var(--_l-radius);
  }
  :host([shape='round'][size='xl']) {
    --_radius: var(--_xl-radius);
  }
  :host([shape='square'][size='l']),
  :host([shape='square'][size='xl']) {
    --_radius: var(--md-sys-shape-corner-extra-large);
  }

  /* Pressed shapes */
  :host([size='xs'].pressed),
  :host([size='s'].pressed) {
    --_radius: var(--md-sys-shape-corner-small);
  }
  :host([size='m'].pressed) {
    --_radius: var(--md-sys-shape-corner-medium);
  }
  :host([size='l'].pressed),
  :host([size='xl'].pressed) {
    --_radius: var(--md-sys-shape-corner-large);
  }
`
