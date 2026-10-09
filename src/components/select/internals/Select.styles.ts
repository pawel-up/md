import { css } from 'lit'

export default css`
  :host {
    display: inline-block;
    position: relative;
    outline: none;
    --md-focus-ring-shape-end-end: var(--md-sys-shape-corner-extra-small);
    --md-focus-ring-shape-end-start: var(--md-sys-shape-corner-extra-small);
    --md-focus-ring-shape-start-end: var(--md-sys-shape-corner-extra-small);
    --md-focus-ring-shape-start-start: var(--md-sys-shape-corner-extra-small);
    /* Same as text input */
    min-width: 200px;
  }

  :host([density='0']) {
    --_density-offset: 0px;
    --md-density-offset: 0px;
    --md-option-density-height: 48px;
    --md-menu-item-density-height: 48px;
  }

  :host([density='-1']) {
    --_density-offset: -4px;
    --md-density-offset: -4px;
    --md-option-density-height: 44px;
    --md-menu-item-density-height: 44px;
  }

  :host([density='-2']) {
    --_density-offset: -8px;
    --md-density-offset: -8px;
    --md-option-density-height: 40px;
    --md-menu-item-density-height: 40px;
  }

  :host([density='-3']) {
    --_density-offset: -12px;
    --md-density-offset: -12px;
    --md-option-density-height: 36px;
    --md-menu-item-density-height: 36px;
  }

  .ui-select {
    display: flex;
    flex-direction: row;
    width: 100%;
    box-sizing: border-box;
  }

  .input {
    cursor: default;
    flex: 1;
    min-width: inherit;
  }
`
