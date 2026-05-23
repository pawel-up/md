import { css } from 'lit'

export default css`
  :host {
    display: inline-block;
    vertical-align: top;
  }

  .container {
    position: relative;
  }

  .content {
    position: fixed;
    z-index: 5;

    transform: scaleY(0);
    transition: transform 250ms cubic-bezier(0.2, 0, 0, 1) 0s;
    transform-origin: top center;
    width: fit-content;

    box-shadow: var(--md-sys-elevation-1);
    border-radius: var(--md-sys-shape-corner-medium);
  }

  :host([verticalAlign='bottom']) .content {
    transform-origin: bottom center;
  }

  .trigger {
    z-index: 0;
    position: relative;
  }

  .content ::slotted(*) {
    min-width: 160px;
    /* box-shadow: var(--md-sys-elevation-2);
  border-radius: var(--md-sys-shape-corner-medium); */
    padding: 10px 0px;
  }

  :host([open]) .content {
    transform: scaleY(1);
  }
`
