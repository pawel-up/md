import { css } from 'lit'

export default css`
  :host {
    display: none;
    position-area: bottom span-right;
    position-try: --menu-fallback-bottom-left, --menu-fallback-top-right, --menu-fallback-top-left, flip-block;
    position: fixed;
    margin: 0;
    padding: 0;
    border: none;
    /* in most cases the max-height won't matter as this assumes the whole screen to be available, which is rarely the truth. */
    max-height: 90vh;
    min-width: 200px;
    overflow: auto;
  }

  @position-try --menu-fallback-bottom-left {
    position-area: bottom span-left;
  }

  @position-try --menu-fallback-top-right {
    position-area: top span-right;
  }

  @position-try --menu-fallback-top-left {
    position-area: top span-left;
  }

  /* Special class set on the element to render the menu to take measurements */
  :host(.measurements) {
    display: block;
  }

  :host([density='0']) {
    --md-menu-item-density-height: 48px;
  }

  :host([density='-1']) {
    --md-menu-item-density-height: 44px;
  }

  :host([density='-2']) {
    --md-menu-item-density-height: 40px;
  }

  :host([density='-3']) {
    --md-menu-item-density-height: 36px;
  }

  :host([variant='vibrant']) {
    --md-sys-color-surface-container: var(--md-sys-color-tertiary-container);
    --md-menu-item-selected-bg: var(--md-sys-color-tertiary);
    --md-menu-item-selected-color: var(--md-sys-color-on-tertiary);
  }

  :host(:popover-open) {
    display: block;
    background-color: var(--md-sys-color-surface-container);
    animation: menu-scale-in 0.15s cubic-bezier(0, 0, 0.2, 1) forwards;
    box-shadow: var(--md-sys-elevation-2);
    border-radius: var(--md-sys-shape-corner-medium);
  }

  :host([variant='vibrant']:popover-open) {
    background-color: var(--md-sys-color-tertiary-container);
    color: var(--md-sys-color-on-tertiary-container);
  }

  /* When menu has grouped children, the outer popover is transparent and groups form separate cards */
  :host([has-groups]) {
    overflow: visible;
  }

  :host([has-groups]:popover-open) {
    overflow: visible;
    background-color: transparent;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
  }

  :host([has-groups]) .menu-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0;
    overflow: visible;
  }

  /* Scale animation for menus positioned below the anchor */
  @keyframes menu-scale-in {
    0% {
      transform: scaleY(0);
      transform-origin: top center;
      opacity: 0;
    }
    100% {
      transform: scaleY(1);
      transform-origin: top center;
      opacity: 1;
    }
  }

  /* Scale animation for menus positioned above the anchor */
  @keyframes menu-scale-in-up {
    0% {
      transform: scaleY(0);
      transform-origin: bottom center;
      opacity: 0;
    }
    100% {
      transform: scaleY(1);
      transform-origin: bottom center;
      opacity: 1;
    }
  }

  /* Position-specific animations using JavaScript-detected classes */
  :host(.menu-positioned-above):popover-open {
    animation: menu-scale-in-up 0.15s cubic-bezier(0, 0, 0.2, 1) forwards;
  }

  :host(.menu-positioned-below):popover-open {
    animation: menu-scale-in 0.15s cubic-bezier(0, 0, 0.2, 1) forwards;
  }

  .menu-container,
  .submenu-container {
    padding: 8px 0;
    outline: none;
  }

  ::slotted(ui-divider),
  .menu-divider {
    height: 1px;
    background-color: var(--md-sys-color-outline-variant);
    margin: 8px 0;
    display: block;
    border: none;
  }

  /* Focus Ring */
  ui-focus-ring {
    --md-focus-ring-color: var(--md-sys-color-primary);
    --md-focus-ring-width: 2px;
  }

  /* Ripple Effect */
  ui-ripple {
    --md-ripple-color: var(--md-sys-color-primary);
    --md-ripple-opacity: 0.12;
  }

  /* Responsive Design */
  @media (max-width: 600px) {
    :host {
      min-width: 180px;
    }

    .menu-container,
    .submenu-container {
      max-width: 280px;
    }
  }

  /* High Contrast Mode */
  @media (prefers-contrast: high) {
    .menu-container,
    .submenu-container {
      border: 1px solid var(--md-sys-color-outline);
    }

    .menu-divider,
    ::slotted(ui-divider) {
      background-color: var(--md-sys-color-outline);
    }
  }

  /* Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    :host(:popover-open) {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
`
