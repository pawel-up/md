import { css } from 'lit'

export default css`
  :host {
    --_container-border: 1px var(--md-sys-color-outline) solid;

    --md-ripple-hover-state-layer-color: var(--md-sys-color-on-surface-variant);
    --md-ripple-focus-state-layer-color: var(--md-sys-color-on-surface-variant);
    --md-ripple-pressed-state-layer-color: var(--md-sys-color-on-surface-variant);

    --_container-background-color: transparent;
    --_surface-color: var(--md-sys-color-on-surface-variant);
    --_content-color: var(--md-sys-color-on-surface-variant);
  }

  :host([disabled]) {
    --_container-background-color: var(--md-sys-color-on-surface);
    --_container-opacity: 0.12;
    --_content-color: var(--md-sys-color-on-surface);
    --_content-opacity: 0.38;
  }

  :host([toggle][active]) {
    --_container-background-color: var(--md-sys-color-inverse-surface);
    --_content-color: var(--md-sys-color-inverse-on-surface);

    --md-ripple-hover-state-layer-color: var(--md-sys-color-inverse-on-surface);
    --md-ripple-focus-state-layer-color: var(--md-sys-color-inverse-on-surface);
    --md-ripple-pressed-state-layer-color: var(--md-sys-color-inverse-on-surface);
  }
`
