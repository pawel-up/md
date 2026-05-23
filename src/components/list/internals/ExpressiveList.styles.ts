import { css } from 'lit'

export default css`
  :host {
    display: flex;
    flex-direction: column;
    gap: 2px;
    background-color: var(--md-list-container-color, var(--md-sys-color-surface));
    padding: 8px 0;
    outline: none;
  }

  :host([role='menu']) ::slotted([role='menuitem']:not(lines='two'):not(lines='three')),
  :host([role='menu']) ::slotted([role='menuitemradio']:not(lines='two'):not(lines='three')),
  :host([role='menu']) ::slotted([role='menuitemcheckbox']:not(lines='two'):not(lines='three')) {
    height: 48px;
  }
`
