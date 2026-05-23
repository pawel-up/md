import { css } from 'lit'

export default css`
  .surface1,
  .surface2,
  .surface3,
  .surface4,
  .surface5 {
    color: var(--md-sys-color-on-surface);
  }

  .surface1 {
    background-color: var(--md-sys-color-primary-05a);
  }

  .surface2 {
    /* background-color: var(--md-sys-color-primary-08a); */
    background-color: var(--md-sys-color-primary-05a);
  }

  .surface3 {
    background-color: var(--md-sys-color-primary-11a);
  }

  .surface4 {
    background-color: var(--md-sys-color-primary-12a);
  }

  .surface5 {
    background-color: var(--md-sys-color-primary-13a);
  }

  /* .surface1 > *,
.surface2 > *,
.surface3 > *,
.surface4 > *,
.surface5 > * {
  position: relative;
  z-index: 1;
} */
`
