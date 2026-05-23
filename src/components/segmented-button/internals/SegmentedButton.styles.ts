import { css } from 'lit'

export default css`
  :host {
    display: inline-block;
    vertical-align: middle;
    box-sizing: content-box;
    writing-mode: horizontal-tb !important;
    text-rendering: auto;
    cursor: default;
    user-select: none;
    height: 40px;
    width: 100%;
    min-width: 48px;
    -webkit-tap-highlight-color: transparent;

    font-family: var(--md-sys-typescale-label-large-font);
    font-size: var(--md-sys-typescale-label-large-size);
    letter-spacing: var(--md-sys-typescale-label-large-tracking);
    line-height: var(--md-sys-typescale-label-large-height);

    border: 1px var(--md-sys-color-outline) solid;
    color: var(--md-sys-color-on-surface);
    box-sizing: border-box;
  }

  .surface {
    width: inherit;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: inherit;
  }

  .surface.selected {
    background-color: var(--md-sys-color-secondary-container);
  }

  .content {
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 0px 20px 0px 24px;
    white-space: nowrap;

    width: inherit;
    height: inherit;
  }

  .ripple {
    z-index: 3;
    border-radius: inherit;
  }

  .leading {
    position: relative;
    width: 0;
    height: 18px;
    transition: width 230ms var(--md-sys-animation-easing-standard);
  }

  .leading.visible {
    width: 18px;
    margin-right: 8px;
  }

  .check-mark,
  .leading-icon {
    position: absolute;
    overflow: hidden;
    display: block;
    width: 0px;
    height: inherit;

    fill: var(--md-sys-color-on-surface);
  }

  .check-mark {
    transition: width 230ms var(--md-sys-animation-easing-standard);
  }

  .check-mark.checked {
    width: 18px;
  }

  .leading-icon.with-icon {
    margin-right: 12px;
    width: 18px;
    display: flex;
    align-items: center;
  }

  .leading-icon.with-icon.hidden {
    display: none;
  }
`
