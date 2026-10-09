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
    --_density-offset: 0px;
    --md-density-offset: 0px;
    --md-menu-item-density-height: 48px;
  }

  :host([density='-1']) {
    --_density-offset: -4px;
    --md-density-offset: -4px;
    --md-menu-item-density-height: 44px;
  }

  :host([density='-2']) {
    --_density-offset: -8px;
    --md-density-offset: -8px;
    --md-menu-item-density-height: 40px;
  }

  :host([density='-3']) {
    --_density-offset: -12px;
    --md-density-offset: -12px;
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
