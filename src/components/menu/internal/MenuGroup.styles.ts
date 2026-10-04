import { css } from 'lit'

export default css`
  :host {
    display: block;
    background-color: var(--md-sys-color-surface-container);
    border-radius: var(--md-sys-shape-corner-medium);
    box-shadow: var(--md-sys-elevation-2);
    padding: 8px 0;
    overflow: hidden;
  }

  :host([density='0']) {
    --md-menu-item-density-height: 48px;
  }

  :host([density='-1']) {
    --md-menu-item-density-height: 44px;
  }

  :host([density='-2']) {
    --md-menu-item-density-height: 40px;
  }

  :host([density='-3']) {
    --md-menu-item-density-height: 36px;
  }

  :host([variant='vibrant']) {
    background-color: var(--md-sys-color-tertiary-container);
    color: var(--md-sys-color-on-tertiary-container);
  }

  .menu-group-container {
    display: flex;
    flex-direction: column;
  }

  ::slotted(ui-divider),
  .menu-divider {
    margin: 8px 0;
    display: block;
  }

  /* High Contrast Mode */
  @media (prefers-contrast: high) {
    :host {
      border: 1px solid var(--md-sys-color-outline);
    }
  }
`
