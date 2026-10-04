import { css } from 'lit'

export default css`
  :host {
    display: block;
    position: relative;
    --_item-shape: var(--md-menu-item-shape, var(--md-sys-shape-corner-extra-small, 4px));
    --_item-margin-inline: var(--md-menu-item-margin-inline, 6px);
    --md-focus-ring-shape: var(--_item-shape);
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

  .surface.menu-item {
    position: relative;
    display: flex;
    align-items: center;
    height: var(--md-menu-item-density-height, var(--md-menu-item-height, 48px));
    min-height: var(--md-menu-item-density-height, var(--md-menu-item-height, 48px));
    margin: 0 var(--_item-margin-inline);
    padding: 0 12px;
    border-radius: var(--_item-shape);
    cursor: pointer;
    outline: none;
    box-sizing: border-box;
    transition:
      background-color 0.15s ease,
      color 0.15s ease,
      border-radius 0.15s ease;
  }

  :host([disabled]) .menu-item,
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
  ui-focus-ring {
    --md-focus-ring-color: var(--md-sys-color-primary);
    --md-focus-ring-width: 2px;
    --md-focus-ring-shape: var(--_item-shape);
    margin: 0 var(--_item-margin-inline);
    z-index: 2;
  }

  /* Ripple Effect */
  ui-ripple {
    position: absolute;
    inset: 0;
    margin: 0 var(--_item-margin-inline);
    border-radius: var(--_item-shape);
    --md-ripple-state-layer-shape: var(--_item-shape);
    --md-ripple-hover-state-layer-color: currentColor;
    --md-ripple-focus-state-layer-color: currentColor;
    --md-ripple-pressed-state-layer-color: currentColor;
    z-index: 1;
  }

  /* Selected state */
  :host(.select),
  :host([selected]) {
    --_item-shape: var(--md-menu-item-selected-shape, var(--md-sys-shape-corner-medium, 12px));
  }

  :host(.select) .menu-item,
  :host([selected]) .menu-item {
    background-color: var(--md-menu-item-selected-bg, var(--md-sys-color-secondary-container));
    color: var(--md-menu-item-selected-color, var(--md-sys-color-on-secondary-container));
  }

  /* Vibrant selected state */
  :host([variant='vibrant'].select) .menu-item,
  :host([variant='vibrant'][selected]) .menu-item {
    background-color: var(--md-sys-color-tertiary);
    color: var(--md-sys-color-on-tertiary);
  }

  /* Selection check icon */
  .selection-check {
    color: var(--md-sys-color-on-secondary-container);
    fill: var(--md-sys-color-on-secondary-container);
    width: 24px;
    height: 24px;
  }

  :host([variant='vibrant'].select) .selection-check,
  :host([variant='vibrant'][selected]) .selection-check {
    color: var(--md-sys-color-on-tertiary);
    fill: var(--md-sys-color-on-tertiary);
  }
`
