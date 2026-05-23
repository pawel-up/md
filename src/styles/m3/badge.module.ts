import { css } from 'lit'

export default css`
  .badge {
    background-color: var(--md-sys-color-error);
    color: var(--md-sys-color-on-error);
    display: inline-flex;
    vertical-align: top;
    align-items: center;
    justify-content: center;
  }

  .badge.small {
    border-radius: var(--md-sys-shape-corner-full);
    width: 6px;
    height: 6px;
  }

  /* .badge.large-container {
  border-radius: var(--md-sys-shape-corner-full);
  min-width: 16px;
  height: 16px;
} */

  .badge.large-container,
  .badge.large-label {
    border-radius: var(--md-sys-shape-corner-full);
    min-width: 16px;
    height: 16px;
    font-family: var(--md-sys-typescale-label-small-font);
    font-weight: var(--md-sys-typescale-label-small-weight);
    font-size: var(--md-sys-typescale-label-small-size);
    letter-spacing: var(--md-sys-typescale-label-small-tracking);
    line-height: var(--md-sys-typescale-label-small-height);
  }
`
