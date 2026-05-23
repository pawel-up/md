import { css } from 'lit'

export default css`
  :host {
    display: block;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    position: relative;
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

  .tabs ::slotted(*) {
    flex: 1;
    white-space: nowrap;
  }

  .indicator {
    position: absolute;
    bottom: 1px;
    left: 0px;
    right: 0px;
    overflow: hidden;
    display: none;
  }

  .indicator.indicated {
    display: block;
  }

  .indicator.primary {
    height: 3px;
  }

  .indicator.secondary {
    height: 2px;
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
    border-radius: 3px 3px 0 0;
  }

  .divider {
    align-self: stretch;
    margin: 0;
  }
`
