import { css } from 'lit'

export default css`
  :host {
    background-color: var(--md-list-container-color, var(--md-sys-color-surface));
    padding: 8px 0;
    outline: none;
  }

  :host([density='0']) {
    --_density-offset: 0px;
    --md-density-offset: 0px;
    --md-list-item-density-height: 56px;
  }

  :host([density='-1']) {
    --_density-offset: -4px;
    --md-density-offset: -4px;
    --md-list-item-density-height: 52px;
  }

  :host([density='-2']) {
    --_density-offset: -8px;
    --md-density-offset: -8px;
    --md-list-item-density-height: 48px;
  }

  :host([density='-3']) {
    --_density-offset: -12px;
    --md-density-offset: -12px;
    --md-list-item-density-height: 44px;
  }

  :host([role='menu']) ::slotted([role='menuitem']:not(lines='two'):not(lines='three')),
  :host([role='menu']) ::slotted([role='menuitemradio']:not(lines='two'):not(lines='three')),
  :host([role='menu']) ::slotted([role='menuitemcheckbox']:not(lines='two'):not(lines='three')) {
    height: 48px;
  }
`
