import { css } from 'lit'

export default css`
  :host {
    --snackbar-x: 40px;
    --snackbar-y: 40px;

    position: fixed;

    bottom: var(--snackbar-y);
    left: var(--snackbar-x);

    display: flex;
    align-items: center;

    background-color: var(--md-sys-color-inverse-surface);
    color: var(--md-sys-color-inverse-on-surface);

    box-shadow: var(--md-sys-elevation-3-light);
    border-radius: var(--md-sys-shape-corner-extra-small);

    transform: translateY(calc(var(--snackbar-y) + 100%));
    transition: transform 250ms cubic-bezier(0.2, 0, 0, 1) 0s;

    height: 48px;
    min-width: 260px;

    user-select: none;
  }

  :host([open]) {
    transform: translateY(0);
  }

  .body {
    flex: 1;
    padding-left: 16px;
    padding-right: 16px;

    font-family: var(--md-sys-typescale-body-medium-font);
    font-weight: var(--md-sys-typescale-body-medium-weight);
    font-size: var(--md-sys-typescale-body-medium-size);
    letter-spacing: var(--md-sys-typescale-body-medium-tracking);
    line-height: var(--md-sys-typescale-body-medium-height);
  }

  .body.withAction,
  .body.withClose {
    padding-right: 0;
  }

  .action {
    color: var(--md-sys-color-inverse-primary);
    font-family: var(--md-sys-typescale-label-large-font);
    font-size: var(--md-sys-typescale-label-large-size);
    letter-spacing: var(--md-sys-typescale-label-large-tracking);
    line-height: var(--md-sys-typescale-label-large-height);
  }

  ui-icon {
    fill: var(--md-sys-color-inverse-on-surface);
  }
`
