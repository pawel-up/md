import { css } from 'lit'

export default css`
  :host {
    position-area: span-bottom right;
    position-try:
      --submenu-fallback-left,
      --submenu-fallback-top-right,
      --submenu-fallback-top-left,
      --submenu-fallback-bottom-left,
      flip-block flip-inline;
  }

  @position-try --submenu-fallback-left {
    position-area: span-bottom left;
  }

  @position-try --submenu-fallback-top-right {
    position-area: span-top right;
  }

  @position-try --submenu-fallback-top-left {
    position-area: span-top left;
  }

  @position-try --submenu-fallback-bottom-left {
    position-area: span-bottom left;
  }
`
