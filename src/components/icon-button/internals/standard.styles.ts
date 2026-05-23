import { css } from 'lit'

export default css`
  :host {
    --md-ripple-hover-state-layer-color: var(--md-sys-color-on-surface-variant);
    --md-ripple-focus-state-layer-color: var(--md-sys-color-on-surface-variant);
    --md-ripple-pressed-state-layer-color: var(--md-sys-color-on-surface-variant);
    --_container-background-color: transparent;
    --_content-color: var(--md-sys-color-on-surface-variant);
  }

  :host([toggle][active]) {
    --md-ripple-hover-state-layer-color: var(--md-sys-color-primary);
    --md-ripple-focus-state-layer-color: var(--md-sys-color-primary);
    --md-ripple-pressed-state-layer-color: var(--md-sys-color-primary);
    --_content-color: var(--md-sys-color-primary);
  }
`
