import { css } from 'lit'

export default css`
  :host {
    display: block;
    transition-duration: var(--ui-collapse-transition-duration, 300ms);
    transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
    transition-property: max-height, max-width;
    overflow: visible;
  }

  :host([collapse-closed]) {
    display: none;
  }

  :host(:not([collapse-opened])) {
    overflow: hidden;
  }
`
