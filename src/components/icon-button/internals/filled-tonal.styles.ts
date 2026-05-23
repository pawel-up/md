import { css } from 'lit'

export default css`
  :host {
    --md-ripple-hover-state-layer-color: var(--md-sys-color-on-secondary-container);
    --md-ripple-focus-state-layer-color: var(--md-sys-color-on-secondary-container);
    --md-ripple-pressed-state-layer-color: var(--md-sys-color-on-secondary-container);

    --_container-background-color: var(--md-sys-color-secondary-container);
    --_surface-color: var(--md-sys-color-on-secondary-container);
    --_content-color: var(--md-sys-color-on-secondary-container);
  }

  :host([disabled]) {
    --_container-background-color: var(--md-sys-color-on-surface);
    --_container-opacity: 0.12;
    --_content-color: var(--md-sys-color-on-surface);
    --_content-opacity: 0.38;
  }

  :host([toggle]) {
    --_container-background-color: var(--md-sys-color-surface-variant);
    --_content-color: var(--md-sys-color-on-surface-variant);
  }

  :host([toggle][active]) {
    --_container-background-color: var(--md-sys-color-secondary-container);
    --_content-color: var(--md-sys-color-on-secondary-container);
  }
`
