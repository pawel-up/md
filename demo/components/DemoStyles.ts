import { css } from 'lit'

export default css`
  :root {
    --dot-size: 1px;
    --dot-space: 7px;
  }

  html,
  body {
    margin: 0;
    font-family: 'Roboto', 'Noto', sans-serif;
    background-color: var(--md-sys-color-surface);
    color: var(--md-sys-color-on-surface);
    background-image: radial-gradient(var(--md-sys-color-inverse-on-surface) 1px, transparent 0);
    background-size: var(--dot-space) var(--dot-space);
  }

  .demo {
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }

  header {
    padding: 12px 24px;
    background-color: var(--md-sys-color-surface-variant);
    color: var(--md-sys-color-on-surface-variant);
    display: flex;
    align-items: center;

    max-width: 900px;
    margin: 20px auto;
    padding: 0 24px;
    border-radius: 40px;

    font-family: var(--md-sys-typescale-title-large-font);
    font-weight: var(--md-sys-typescale-title-large-weight);
    font-size: var(--md-sys-typescale-title-large-size);
    letter-spacing: var(--md-sys-typescale-title-large-tracking);
    line-height: var(--md-sys-typescale-title-large-height);
  }

  #app {
    height: 100%;
  }

  main {
    max-width: 900px;
    margin: 40px auto;
    border-radius: 40px;
    padding: 24px;

    /* background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container); */
  }

  .demo-section {
    margin: 60px 0;
  }
`
