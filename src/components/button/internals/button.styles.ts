import { css } from 'lit'

/* Material Design 3 Expressive Button - CSS-Native Implementation */
export default css`
  :host {
    all: unset;

    /* Layout and positioning */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    white-space: nowrap;

    /* Default sizing */
    min-height: 40px;
    min-width: 64px;
    padding-inline: 16px;
    gap: 8px;

    /* Typography from Material 3 tokens */
    font-family: var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, system-ui));
    font-size: var(--md-sys-typescale-label-large-size, 0.875rem);
    font-weight: var(--md-sys-typescale-label-large-weight, 500);
    line-height: var(--md-sys-typescale-label-large-height, 1.25);
    letter-spacing: var(--md-sys-typescale-label-large-tracking, 0.01em);

    --md-ripple-hover-state-layer-color: currentColor;
    --md-ripple-focus-state-layer-color: currentColor;
    --md-ripple-pressed-state-layer-color: currentColor;

    /* CSS custom property for pill radius - half of the button height */
    --_pill-radius: 20px;
    /* Default icon size */
    --_icon-size: var(--md-button-icon-size, 20px);
    --_background-color: transparent;
    --_color: inherit;
    --_shadow: var(--md-sys-elevation-0);

    border-end-end-radius: var(--ui-button-shape-end-end, var(--_pill-radius));
    border-end-start-radius: var(--ui-button-shape-end-start, var(--_pill-radius));
    border-start-end-radius: var(--ui-button-shape-start-end, var(--_pill-radius));
    border-start-start-radius: var(--ui-button-shape-start-start, var(--_pill-radius));
    background-color: var(--_background-color);
    color: var(--_color);
    box-shadow: var(--_shadow);

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

  /* Icon styling */
  ::slotted([slot='icon']) {
    flex-shrink: 0;
    width: var(--_icon-size);
    height: var(--_icon-size);
    font-size: var(--_icon-size);
  }

  /* Modern CSS: Container queries for responsive sizing */
  @container (min-width: 320px) {
    :host {
      min-width: 80px;
    }
  }

  .ripple {
    border-radius: inherit;
    transition: border-radius var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-standard);
  }

  .ripple.activated {
    z-index: 1;
  }

  .focus-ring {
    --md-focus-ring-shape-end-end: var(--ui-button-shape-end-end, var(--_pill-radius));
    --md-focus-ring-shape-end-start: var(--ui-button-shape-end-start, var(--_pill-radius));
    --md-focus-ring-shape-start-end: var(--ui-button-shape-start-end, var(--_pill-radius));
    --md-focus-ring-shape-start-start: var(--ui-button-shape-start-start, var(--_pill-radius));
    transition: border-radius var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-standard);
  }

  /* Disabled state */
  :host([disabled]) {
    background-color: color-mix(in srgb, var(--md-sys-color-on-surface) 12%, transparent);
    color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent);
    box-shadow: none;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Size Variations */
  :host([size='xs']) {
    min-height: 32px;
    padding-inline: 12px;
    font-size: var(--md-sys-typescale-label-medium-size, 0.75rem);
    gap: 6px;
    --_icon-size: 20px;
  }

  :host([size='s']) {
    min-height: 40px;
    padding-inline: 16px;
    --_icon-size: 20px;
  }

  :host([size='m']) {
    min-height: 56px;
    padding-inline: 24px;
    font-size: var(--md-sys-typescale-label-large-size, 1rem);
    gap: 10px;
    --_icon-size: 24px;
  }

  :host([size='l']) {
    min-height: 96px;
    padding-inline: 48px;
    font-size: var(--md-sys-typescale-title-medium-size, 1.125rem);
    gap: 12px;
    --_icon-size: 32px;
  }

  :host([size='xl']) {
    min-height: 136px;
    padding-inline: 64px;
    font-size: var(--md-sys-typescale-title-large-size, 1.375rem);
    gap: 16px;
    --_icon-size: 40px;
  }

  /* Pressed state is the same to all combinations of shape and size */
  :host([size='xs'].pressed),
  :host([size='s'].pressed) {
    --_pill-radius: 8px !important;
  }
  :host([size='m'].pressed) {
    --_pill-radius: 12px !important;
  }
  :host([size='xl'].pressed),
  :host([size='l'].pressed) {
    --_pill-radius: 16px !important;
  }

  /* Shape setup */
  /* For the round shape, we can't use the "--md-sys-shape-corner-full" value as it has a value of 999px and it would make animations impossible so see. */
  :host([toggle][selected][shape='square'][size='xs']),
  :host([shape='round'][size='xs']) {
    --_pill-radius: 16px; /* Half of 32px height */
  }
  :host([toggle][selected][shape='square'][size='s']),
  :host([shape='round'][size='s']) {
    --_pill-radius: 20px; /* Half of 40px height */
  }
  :host([toggle][selected][shape='square'][size='m']),
  :host([shape='round'][size='m']) {
    --_pill-radius: 28px; /* Half of 56px height */
  }
  :host([toggle][selected][shape='square'][size='l']),
  :host([shape='round'][size='l']) {
    --_pill-radius: 48px; /* Half of 96px height */
  }
  :host([toggle][selected][shape='square'][size='xl']),
  :host([shape='round'][size='xl']) {
    --_pill-radius: 68px; /* Half of 136px height */
  }

  :host([shape='square'][size='xs']),
  :host([shape='square'][size='s']) {
    --_pill-radius: var(--md-sys-shape-corner-medium);
  }

  :host([shape='square'][size='m']) {
    --_pill-radius: var(--md-sys-shape-corner-large);
  }

  :host([shape='square'][size='l']),
  :host([shape='square'][size='xl']) {
    --_pill-radius: var(--md-sys-shape-corner-extra-large);
  }

  /* Button Color Variants - Material 3 Expressive */

  /* Elevated Button */
  :host([color='elevated']) {
    --_background-color: var(--md-sys-color-surface-container-low);
    --_color: var(--md-sys-color-primary);
    --_shadow: var(--md-sys-elevation-1);
  }

  :host([color='elevated'][toggle][selected]) {
    --_background-color: var(--md-sys-color-primary);
    --_color: var(--md-sys-color-on-primary);
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
    border: 1px var(--md-button-outline-color, var(--md-sys-color-outline-variant)) solid;
    --_color: var(--md-sys-color-on-surface-variant);
  }

  :host([color='outlined'][toggle][selected]) {
    --_background-color: var(--md-sys-color-inverse-surface);
    --_color: var(--md-sys-color-inverse-on-surface);
  }

  :host([color='outlined'][disabled]) {
    border-color: color-mix(in srgb, var(--md-sys-color-on-surface) 10%, transparent);
    --_color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent);
  }

  /* Text Button */
  :host([color='text']) {
    --_color: var(--md-sys-color-primary);
  }

  :host([color='text'][disabled]) {
    color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent);
  }

  :host([toggle][selected][shape='round']) {
    --_pill-radius: var(--md-sys-shape-corner-medium);
  }

  /* Destructive Button styles */
  :host([color='elevated'][destructive]:not([disabled])) {
    --_color: var(--md-sys-color-error);
  }

  :host([color='filled'][destructive]:not([disabled])) {
    --_background-color: var(--md-sys-color-error);
    --_color: var(--md-sys-color-on-error);
  }

  :host([color='tonal'][destructive]:not([disabled])) {
    --_background-color: var(--md-sys-color-error-container);
    --_color: var(--md-sys-color-on-error-container);
  }

  :host([color='outlined'][destructive]:not([disabled])) {
    border-color: var(--md-sys-color-error);
    --_color: var(--md-sys-color-error);
  }

  :host([color='text'][destructive]:not([disabled])) {
    --_color: var(--md-sys-color-error);
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

    :host([color='text']),
    :host([color='outlined']) {
      border-width: 2px;
      border-style: solid;
    }
  }
`
