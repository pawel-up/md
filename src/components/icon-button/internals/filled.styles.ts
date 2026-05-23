import { css } from 'lit'

export default css`
  :host {
    --md-ripple-hover-state-layer-color: var(--md-sys-color-on-primary);
    --md-ripple-focus-state-layer-color: var(--md-sys-color-on-primary);
    --md-ripple-pressed-state-layer-color: var(--md-sys-color-on-primary);

    --_container-background-color: var(--md-sys-color-primary);
    --_surface-color: var(--md-sys-color-on-primary);
    --_content-color: var(--md-sys-color-on-primary);
  }

  :host([disabled]) {
    --_container-background-color: var(--md-sys-color-on-surface);
    --_container-opacity: 0.12;
    --_content-color: var(--md-sys-color-on-surface);
    --_content-opacity: 0.38;
  }

  :host([toggle]) {
    --_content-color: var(--md-sys-color-primary);
    --_container-background-color: var(--md-sys-color-surface-variant);
  }

  :host([toggle][active]) {
    --_container-background-color: var(--md-sys-color-primary);
    --_content-color: var(--md-sys-color-on-primary);
  }

  :host([toggle]:not([active])) {
    --_state-background-color: var(--md-sys-color-primary);
    --_state-opacity: var(--md-sys-state-hover-state-layer-opacity);
    --_content-color: var(--md-sys-color-primary);
  }
`
