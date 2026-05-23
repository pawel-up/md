import { css } from 'lit'

export default css`
  :host {
    display: block;
    position: relative;
  }

  .menu-item {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 48px;
    padding: 0 16px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.2s ease;
  }

  .menu-item:hover {
    background-color: var(--md-sys-color-surface-variant);
  }

  .menu-item:focus {
    background-color: var(--md-sys-color-surface-variant);
  }

  .menu-item[disabled] {
    opacity: 0.38;
    cursor: not-allowed;
    pointer-events: none;
  }

  .menu-item-with-submenu {
    position: relative;
  }

  .menu-item-with-submenu:hover .menu-item-arrow {
    color: var(--md-sys-color-primary);
  }

  .menu-item-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: var(--md-sys-color-on-surface);
    font-size: 18px;
    font-weight: 500;
  }

  /* Focus Ring */
  md-focus-ring {
    --md-focus-ring-color: var(--md-sys-color-primary);
    --md-focus-ring-width: 2px;
    z-index: 2;
  }

  /* Ripple Effect */
  ui-ripple {
    --md-ripple-color: var(--md-sys-color-primary);
    --md-ripple-opacity: 0.12;
  }

  /* Selected state */
  :host(.select) .menu-item,
  :host([selected]) .menu-item {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }

  :host(.select) .menu-item:hover,
  :host([selected]) .menu-item:hover {
    background-color: var(--md-sys-color-secondary-container);
    opacity: 0.92;
  }

  /* Selection check icon */
  .selection-check {
    color: var(--md-sys-color-on-surface-variant);
    fill: var(--md-sys-color-on-surface-variant);
    width: 24px;
    height: 24px;
  }
`
