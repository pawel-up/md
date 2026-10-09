import { css } from 'lit'

export default css`
  .menu-item-with-submenu {
    position: relative;
  }

  .menu-item-with-submenu:hover .menu-item-arrow {
    color: var(--md-sys-color-primary);
  }

  .menu-item-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: var(--md-sys-color-on-surface);
    font-size: 18px;
    font-weight: 500;
  }
`
