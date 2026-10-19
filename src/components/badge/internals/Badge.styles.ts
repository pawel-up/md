import { css } from 'lit'

export default css`
  :host {
    display: inline-flex;
    vertical-align: middle;
    position: relative;
    box-sizing: border-box;

    --ui-badge-color: var(--md-badge-color, var(--md-sys-color-error, #b3261e));
    --ui-badge-label-color: var(--md-badge-label-color, var(--md-sys-color-on-error, #ffffff));
    --ui-badge-shape-small: var(--md-badge-shape-small, 3px);
    --ui-badge-shape-large: var(--md-badge-shape-large, var(--md-sys-shape-corner-small, 8px));
    --ui-badge-size-small: var(--md-badge-size-small, 6px);
    --ui-badge-size-large: var(--md-badge-size-large, 16px);
    --ui-badge-label-text-font: var(
      --md-badge-label-text-font,
      var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-brand, Roboto, sans-serif))
    );
    --ui-badge-label-text-size: var(--md-badge-label-text-size, var(--md-sys-typescale-label-small-size, 0.6875rem));
    --ui-badge-label-text-weight: var(--md-badge-label-text-weight, var(--md-sys-typescale-label-small-weight, 500));
    --ui-badge-label-text-line-height: var(
      --md-badge-label-text-line-height,
      var(--md-sys-typescale-label-small-height, 1rem)
    );
    --ui-badge-label-text-tracking: var(
      --md-badge-label-text-tracking,
      var(--md-sys-typescale-label-small-tracking, 0.5px)
    );
  }

  :host([hidden]) {
    display: none;
  }

  :host([attached]) {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
    transform: translate(
      calc(50% * var(--_dir-multiplier, 1) + var(--ui-badge-offset-x, 0px)),
      calc(-50% + var(--ui-badge-offset-y, 0px))
    );
    z-index: 1;
    pointer-events: none;
  }

  :host(:dir(rtl)),
  :host([dir='rtl']) {
    --_dir-multiplier: -1;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    background-color: var(--ui-badge-color);
    color: var(--ui-badge-label-color);
    text-align: center;
    user-select: none;
    line-height: 1;
  }

  /* Small badge: 6dp x 6dp, 3dp corner radius */
  .badge.small {
    width: var(--ui-badge-size-small);
    height: var(--ui-badge-size-small);
    border-radius: var(--ui-badge-shape-small);
    padding: 0;
    min-width: unset;
  }

  /* Large badge: 16dp height, min-width 16dp, 8dp corner radius */
  .badge.large {
    height: var(--ui-badge-size-large);
    min-width: var(--ui-badge-size-large);
    border-radius: var(--ui-badge-shape-large);
    padding: 0 4px;
    font-family: var(--ui-badge-label-text-font);
    font-size: var(--ui-badge-label-text-size);
    font-weight: var(--ui-badge-label-text-weight);
    line-height: var(--ui-badge-label-text-line-height);
    letter-spacing: var(--ui-badge-label-text-tracking);
  }

  .label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  }

  .label[hidden] {
    display: none !important;
  }
`
