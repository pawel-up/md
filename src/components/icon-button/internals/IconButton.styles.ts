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

    /* Base radii for round shape across sizes (half of button height) */
    --_xs-radius: 16px;
    --_s-radius: 20px;
    --_m-radius: 28px;
    --_l-radius: 48px;
    --_xl-radius: 68px;

    /* Default values matching size='s', color='standard', shape='round', width='default' */
    --_color: var(--md-sys-color-on-surface-variant);
    --_background-color: transparent;
    --_icon-size: var(--md-button-icon-size, 24px);
    --_container-height: 40px;
    --_leading-space: 8px;
    --_trailing-space: 8px;
    --_radius: var(--_s-radius);
    --_outline-width: 0;
    --_shadow: var(--md-sys-elevation-0);

    width: calc(var(--_icon-size) + var(--_leading-space) + var(--_trailing-space));
    min-width: calc(var(--_icon-size) + var(--_leading-space) + var(--_trailing-space));
    height: var(--_container-height);
    min-height: var(--_container-height);
    padding-inline-start: var(--_leading-space);
    padding-inline-end: var(--_trailing-space);
    background-color: var(--_background-color);
    color: var(--_color);
    fill: var(--_color);
    box-shadow: var(--_shadow);
    border: var(--_outline-width) var(--md-sys-color-outline-variant) solid;
    border-end-end-radius: var(--ui-icon-button-shape-end-end, var(--ui-button-shape-end-end, var(--_radius)));
    border-end-start-radius: var(--ui-icon-button-shape-end-start, var(--ui-button-shape-end-start, var(--_radius)));
    border-start-end-radius: var(--ui-icon-button-shape-start-end, var(--ui-button-shape-start-end, var(--_radius)));
    border-start-start-radius: var(
      --ui-icon-button-shape-start-start,
      var(--ui-button-shape-start-start, var(--_radius))
    );

    /* Default icon buttons use filled icons in M3 */
    font-variation-settings: 'FILL' 1;

    /* Interaction styles */
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    outline: none;

    transition:
      background-color var(--md-sys-motion-duration-short2, 200ms)
        var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
      color var(--md-sys-motion-duration-short2, 200ms) var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
      box-shadow var(--md-sys-motion-duration-short2, 200ms)
        var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
      border-color var(--md-sys-motion-duration-short2, 200ms)
        var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
      border-radius var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-standard);
  }

  /* Toggle button icon filled/outline variations */
  :host([toggle]:not([selected])) {
    font-variation-settings: 'FILL' 0;
  }

  :host([toggle][selected]) {
    font-variation-settings: 'FILL' 1;
  }

  ::slotted(*) {
    width: var(--_icon-size) !important;
    height: var(--_icon-size) !important;
    color: var(--_color);
    fill: var(--_color);
  }

  slot[hidden] {
    display: none !important;
  }

  .ripple {
    border-radius: inherit;
    transition: border-radius var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-standard);
  }

  .ripple.activated {
    z-index: 1;
  }

  .focus-ring {
    --md-focus-ring-shape-end-end: var(--ui-icon-button-shape-end-end, var(--ui-button-shape-end-end, var(--_radius)));
    --md-focus-ring-shape-end-start: var(
      --ui-icon-button-shape-end-start,
      var(--ui-button-shape-end-start, var(--_radius))
    );
    --md-focus-ring-shape-start-end: var(
      --ui-icon-button-shape-start-end,
      var(--ui-button-shape-start-end, var(--_radius))
    );
    --md-focus-ring-shape-start-start: var(
      --ui-icon-button-shape-start-start,
      var(--ui-button-shape-start-start, var(--_radius))
    );
    transition: border-radius var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-standard);
  }

  /* Disabled state */
  :host([disabled]) {
    cursor: not-allowed;
    pointer-events: none;
    box-shadow: none;
  }

  /* Elevated Button */
  :host([color='elevated']) {
    --_background-color: var(--md-sys-color-surface-container-low);
    --_color: var(--md-sys-color-primary);
    --_shadow: var(--md-sys-elevation-1);
  }

  :host([color='elevated'][toggle][selected]) {
    --_background-color: var(--md-sys-color-primary);
    --_color: var(--md-sys-color-on-primary);
    --_shadow: var(--md-sys-elevation-1);
  }

  :host([color='elevated']:hover:not([disabled])) {
    --_shadow: var(--md-sys-elevation-2);
  }

  :host([color='elevated'][disabled]) {
    --_background-color: color-mix(in srgb, var(--md-sys-color-on-surface) 10%, transparent);
    --_color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent);
    --_shadow: var(--md-sys-elevation-0);
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

  :host([color='filled']:hover:not([disabled])) {
    --_shadow: var(--md-sys-elevation-1);
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

  :host([color='outlined'][size='l']) {
    --_outline-width: 2px;
  }

  :host([color='outlined'][size='xl']) {
    --_outline-width: 3px;
  }

  :host([color='outlined'][toggle][selected]) {
    --_background-color: var(--md-sys-color-inverse-surface);
    --_color: var(--md-sys-color-inverse-on-surface);
    --_outline-width: 0;
  }

  :host([color='outlined'][disabled]) {
    border-color: color-mix(in srgb, var(--md-sys-color-on-surface) 10%, transparent);
    --_color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent);
  }

  :host([color='outlined'][disabled][toggle][selected]) {
    --_background-color: color-mix(in srgb, var(--md-sys-color-on-surface) 10%, transparent);
    --_outline-width: 0;
  }

  /* Standard Button (Default) */
  :host([color='standard']),
  :host(:not([color])) {
    --_background-color: transparent;
    --_color: var(--md-sys-color-on-surface-variant);
    --_shadow: var(--md-sys-elevation-0);
  }

  :host([color='standard'][toggle][selected]),
  :host(:not([color])[toggle][selected]) {
    --_color: var(--md-sys-color-primary);
  }

  :host([color='standard'][disabled]),
  :host(:not([color])[disabled]) {
    --_color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent);
  }

  /* Sizes */
  :host([size='xs']) {
    --_container-height: 32px;
    --_icon-size: 20px;
  }
  :host([size='s']),
  :host(:not([size])) {
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

  /* Widths */
  :host([size='xs'][width='narrow']) {
    --_leading-space: 4px;
    --_trailing-space: 4px;
  }
  :host([size='xs'][width='default']),
  :host([size='xs']:not([width])) {
    --_leading-space: 6px;
    --_trailing-space: 6px;
  }
  :host([size='xs'][width='wide']) {
    --_leading-space: 10px;
    --_trailing-space: 10px;
  }

  :host([size='s'][width='narrow']),
  :host(:not([size])[width='narrow']) {
    --_leading-space: 4px;
    --_trailing-space: 4px;
  }
  :host([size='s'][width='default']),
  :host([size='s']:not([width])),
  :host(:not([size])[width='default']),
  :host(:not([size]):not([width])) {
    --_leading-space: 8px;
    --_trailing-space: 8px;
  }
  :host([size='s'][width='wide']),
  :host(:not([size])[width='wide']) {
    --_leading-space: 14px;
    --_trailing-space: 14px;
  }

  :host([size='m'][width='narrow']) {
    --_leading-space: 12px;
    --_trailing-space: 12px;
  }
  :host([size='m'][width='default']),
  :host([size='m']:not([width])) {
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
  :host([size='l'][width='default']),
  :host([size='l']:not([width])) {
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
  :host([size='xl'][width='default']),
  :host([size='xl']:not([width])) {
    --_leading-space: 48px;
    --_trailing-space: 48px;
  }
  :host([size='xl'][width='wide']) {
    --_leading-space: 72px;
    --_trailing-space: 72px;
  }

  /* Shape setup */
  /* For the round shape, we can't use the "--md-sys-shape-corner-full" value as it has a value of 999px and it would make animations impossible to see. */
  :host([shape='round'][size='xs']) {
    --_radius: var(--_xs-radius);
  }
  :host([shape='round'][size='s']),
  :host([shape='round']:not([size])),
  :host(:not([shape]):not([size])),
  :host(:not([shape])[size='s']) {
    --_radius: var(--_s-radius);
  }
  :host([shape='round'][size='m']),
  :host(:not([shape])[size='m']) {
    --_radius: var(--_m-radius);
  }
  :host([shape='round'][size='l']),
  :host(:not([shape])[size='l']) {
    --_radius: var(--_l-radius);
  }
  :host([shape='round'][size='xl']),
  :host(:not([shape])[size='xl']) {
    --_radius: var(--_xl-radius);
  }

  :host([shape='square'][size='xs']) {
    --_radius: var(--md-sys-shape-corner-medium);
  }
  :host([shape='square'][size='s']),
  :host([shape='square']:not([size])) {
    --_radius: var(--md-sys-shape-corner-medium);
  }
  :host([shape='square'][size='m']) {
    --_radius: var(--md-sys-shape-corner-large);
  }
  :host([shape='square'][size='l']),
  :host([shape='square'][size='xl']) {
    --_radius: var(--md-sys-shape-corner-extra-large);
  }

  /* Toggle Selected Shapes: morph to opposite shape */
  /* If square when unselected, morph to round when selected */
  :host([toggle][selected][shape='square'][size='xs']) {
    --_radius: var(--_xs-radius);
  }
  :host([toggle][selected][shape='square'][size='s']),
  :host([toggle][selected][shape='square']:not([size])) {
    --_radius: var(--_s-radius);
  }
  :host([toggle][selected][shape='square'][size='m']) {
    --_radius: var(--_m-radius);
  }
  :host([toggle][selected][shape='square'][size='l']) {
    --_radius: var(--_l-radius);
  }
  :host([toggle][selected][shape='square'][size='xl']) {
    --_radius: var(--_xl-radius);
  }

  /* If round when unselected (default), morph to square when selected */
  :host([toggle][selected]:not([shape='square'])[size='xs']) {
    --_radius: var(--md-sys-shape-corner-medium);
  }
  :host([toggle][selected]:not([shape='square']):not([size])),
  :host([toggle][selected]:not([shape='square'])[size='s']) {
    --_radius: var(--md-sys-shape-corner-medium);
  }
  :host([toggle][selected]:not([shape='square'])[size='m']) {
    --_radius: var(--md-sys-shape-corner-large);
  }
  :host([toggle][selected]:not([shape='square'])[size='l']),
  :host([toggle][selected]:not([shape='square'])[size='xl']) {
    --_radius: var(--md-sys-shape-corner-extra-large);
  }

  /* Pressed Shapes: applied to all shapes when pressed */
  :host([size='xs'].pressed),
  :host([size='s'].pressed),
  :host(:not([size]).pressed) {
    --_radius: var(--md-sys-shape-corner-small) !important;
  }
  :host([size='m'].pressed) {
    --_radius: var(--md-sys-shape-corner-medium) !important;
  }
  :host([size='l'].pressed),
  :host([size='xl'].pressed) {
    --_radius: var(--md-sys-shape-corner-large) !important;
  }

  /* Preference-based animations */
  @media (prefers-reduced-motion: reduce) {
    :host {
      transition-duration: 0.01ms;
      animation-duration: 0.01ms;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    :host {
      border-width: 2px;
    }

    :host([color='standard']),
    :host(:not([color])),
    :host([color='outlined']) {
      border-width: 2px;
      border-style: solid;
    }
  }
`
