import { css } from 'lit'

export default css`
  :host {
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    grid-auto-rows: auto;
    height: 40px;
  }

  ::slotted(:first-child) {
    border-end-start-radius: 20px;
    border-start-start-radius: 20px;
  }

  ::slotted(:last-child) {
    border-start-end-radius: 20px;
    border-end-end-radius: 20px;
  }

  ::slotted(:not(:last-child)) {
    border-right: none;
  }
`
