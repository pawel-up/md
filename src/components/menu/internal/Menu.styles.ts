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

  :host(:popover-open) {
    display: block;
    background-color: var(--md-sys-color-surface-container);
    /* border-radius: var(--md-sys-shape-corner-extra-small);
    box-shadow: var(--md-sys-elevation-3); */
    animation: menu-scale-in 0.15s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    box-shadow: var(--md-sys-elevation-1);
    border-radius: var(--md-sys-shape-corner-medium);
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
    animation: menu-scale-in-up 0.15s var(--md-sys-motion-easing-standard-accelerate) forwards;
  }

  :host(.menu-positioned-below):popover-open {
    animation: menu-scale-in 0.15s var(--md-sys-motion-easing-standard-accelerate) forwards;
  }

  .menu-container {
    padding: 8px 0;
    outline: none;
  }

  .menu-divider {
    height: 1px;
    background-color: var(--md-sys-color-outline-variant);
    margin: 8px 0;
  }

  /* Menu Item Styles */
  .menu-item {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 48px;
    padding: 0 16px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.2s ease;
  }

  .menu-item:hover {
    background-color: var(--md-sys-color-surface-variant);
  }

  .menu-item:focus {
    background-color: var(--md-sys-color-surface-variant);
  }

  .menu-item[disabled] {
    opacity: 0.38;
    cursor: not-allowed;
    pointer-events: none;
  }

  .menu-item-content {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 12px;
  }

  .menu-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: var(--md-sys-color-on-surface);
    font-size: 20px;
  }

  .menu-item-label {
    flex: 1;
    color: var(--md-sys-color-on-surface);
    font-family: var(--md-sys-typescale-label-large-font-family-name);
    font-size: var(--md-sys-typescale-label-large-font-size);
    font-weight: var(--md-sys-typescale-label-large-font-weight);
    line-height: var(--md-sys-typescale-label-large-line-height);
    letter-spacing: var(--md-sys-typescale-label-large-letter-spacing);
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

  .menu-item-with-submenu {
    position: relative;
  }

  .menu-item-with-submenu:hover .menu-item-arrow {
    color: var(--md-sys-color-primary);
  }

  /* Sub-menu Styles */
  .submenu-container {
    max-width: 320px;
    background-color: var(--md-sys-color-surface);
    border-radius: var(--md-sys-shape-corner-extra-small);
    box-shadow: var(--md-sys-elevation-level3);
    padding: 8px 0;
  }

  /* Submenu positioning with Anchor API */
  ui-sub-menu {
    display: none;
  }

  ui-sub-menu:popover-open {
    display: block;
    background-color: var(--md-sys-color-surface);
    border-radius: var(--md-sys-shape-corner-extra-small);
    box-shadow: var(--md-sys-elevation-level3);
    min-width: 200px;
    max-width: 320px;
    padding: 8px 0;
    z-index: 1000;
    animation: submenu-scale-in 0.12s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  /* Submenu scale animation */
  @keyframes submenu-scale-in {
    0% {
      transform: scaleY(0) scaleX(0.8);
      transform-origin: left top;
      opacity: 0;
    }
    100% {
      transform: scaleY(1) scaleX(1);
      transform-origin: left top;
      opacity: 1;
    }
  }

  /* Focus Ring */
  md-focus-ring {
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

    .menu-container {
      max-width: 280px;
    }

    ui-sub-menu:popover-open {
      min-width: 180px;
      max-width: 280px;
    }

    .submenu-container {
      max-width: 280px;
    }
  }

  /* High Contrast Mode */
  @media (prefers-contrast: high) {
    .menu-container {
      border: 1px solid var(--md-sys-color-outline);
    }

    .submenu-container {
      border: 1px solid var(--md-sys-color-outline);
    }

    .menu-divider {
      background-color: var(--md-sys-color-outline);
    }
  }

  /* Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    .menu-item {
      transition: none;
    }

    :host(:popover-open) {
      animation: none;
      opacity: 1;
      transform: none;
    }

    ui-sub-menu:popover-open {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
`
