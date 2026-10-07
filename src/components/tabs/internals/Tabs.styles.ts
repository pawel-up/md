import { css } from 'lit'

export default css`
  :host {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    background-color: var(--md-tabs-background-color, var(--md-sys-color-surface));
  }

  .tabs-container {
    display: flex;
    align-items: center;
    position: relative;
    align-self: stretch;
    box-sizing: border-box;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
  }

  .tabs {
    display: flex;
    align-items: center;
    overflow: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    flex: 1 1 0%;
    align-self: stretch;
  }

  .tabs::-webkit-scrollbar {
    display: none;
  }

  .tabs ::slotted(*) {
    flex: 1;
    white-space: nowrap;
  }

  .tabs-container.overflowing .tabs ::slotted(*) {
    flex: 0 0 auto;
  }

  .scroll-button {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    height: 100%;
    width: 52px;
    pointer-events: none;
  }

  .scroll-button.left {
    left: 0;
    background: linear-gradient(
      to right,
      var(--md-tabs-background-color, var(--md-sys-color-surface)) 60%,
      transparent
    );
    justify-content: flex-start;
  }

  .scroll-button.right {
    right: 0;
    background: linear-gradient(to left, var(--md-tabs-background-color, var(--md-sys-color-surface)) 60%, transparent);
    justify-content: flex-end;
  }

  .scroll-button ui-icon-button {
    pointer-events: auto;
    --md-icon-button-icon-color: var(--md-sys-color-on-surface-variant);
  }

  .indicator {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    overflow: hidden;
    display: none;
  }

  .indicator.indicated {
    display: block;
  }

  .indicator.primary {
    height: var(--md-primary-tab-active-indicator-height, 3px);
  }

  .indicator.secondary {
    height: var(--md-secondary-tab-active-indicator-height, 2px);
  }

  .pointer {
    height: inherit;
    display: inline-block;
    left: 0;
    width: 40px;
    background-color: var(--md-sys-color-primary);
    position: absolute;
  }

  .indicator.primary .pointer {
    border-radius: var(--md-primary-tab-active-indicator-shape, 3px 3px 0 0);
  }

  .indicator.secondary .pointer {
    border-radius: var(--md-secondary-tab-active-indicator-shape, 0);
  }
`
