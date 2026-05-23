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
