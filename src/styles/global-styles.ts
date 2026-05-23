import { css } from 'lit'

/**
 * Global styles for all pages.
 *
 * Note, all colors used here should have a CSS variable assigned.
 */
export default css`
  html,
  body,
  #app {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
  }

  body {
    user-select: none;
    background-color: var(--md-sys-color-surface-container-low);
    /* overflow: hidden; */
  }

  [hidden] {
    display: none !important;
  }

  .text-selectable {
    user-select: text;
  }

  .general-error {
    margin: 40px 0;
    text-align: center;
    user-select: text;
  }

  .start-page-header-title {
    flex: 1;
  }

  .navigation-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .navigation-item a {
    display: flex;
    align-items: center;
    height: 48px;
    padding-left: 24px;
    text-decoration: none;
  }

  .title-area {
    display: flex;
    align-items: center;
  }

  .auth-required-screen,
  .app-loader,
  .full-page-alert {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: center;
    justify-content: center;
    position: absolute;
    inset: 0;
    background-color: var(--md-sys-color-surface);
  }

  .message,
  .sub-message,
  .auth-required-screen {
    color: var(--md-sys-color-on-surface);
  }

  .full-error {
    flex: 1;
    align-items: start;
    justify-content: center;
    display: flex;
    flex-direction: column;
    margin: 40px;
  }

  .full-error .description {
    max-width: 800px;
  }

  .error-dialog {
    background-color: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);
    min-width: 256px;
  }

  .error-dialog p {
    user-select: text;
  }

  .organization-selector {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    margin: 40px 0;
  }

  .organization-selector [name='org'] {
    min-width: 320px;
  }
`
