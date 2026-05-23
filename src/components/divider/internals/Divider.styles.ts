import { css } from 'lit'

export default css`
  :host {
    display: block;
    margin-top: 8px;
    margin-bottom: 8px;
    width: 100%;

    --ui-divider-padding: 16px;
    --ui-divider-vertical-separation: 8px;
  }

  .container {
    height: 1px;
    width: 100%;
    box-sizing: border-box;
  }

  .container::before {
    content: '';
    height: inherit;
    background-color: var(--md-sys-color-outline-variant);
    display: block;
  }

  :host([type='inset']) .container {
    padding-left: var(--ui-divider-padding);
  }

  :host([type='middle']) .container {
    padding-left: var(--ui-divider-padding);
    padding-right: var(--ui-divider-padding);
  }

  :host([vertical]) {
    margin: 0;
    height: auto;
  }

  :host([vertical]) .container {
    width: 1px;
    height: 100%;
    margin: 0 var(--ui-divider-vertical-separation);
  }

  :host([vertical][type='middle']) .container {
    padding: var(--ui-divider-padding) 0 var(--ui-divider-padding) 0;
  }
`
