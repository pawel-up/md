import { css } from 'lit'

/* Material Design 3 Floating Action Button (FAB) Container & Menu Styles */
export default css`
  :host {
    all: unset;

    display: inline-flex;
    flex-direction: column;
    align-items: end;
    box-sizing: border-box;
    position: relative;
    user-select: none;
    -webkit-tap-highlight-color: transparent;

    --md-fab-margin: 16px;
    --md-fab-margin-expanded: 24px;
    --md-fab-z-index: 100;
  }

  /* Fixed placements */
  :host([placement='bottom-end']),
  :host(:not([placement])) {
    position: fixed;
    inset-block-end: var(--md-fab-margin);
    inset-inline-end: var(--md-fab-margin);
    align-items: end;
    z-index: var(--md-fab-z-index);
  }

  :host([placement='bottom-start']) {
    position: fixed;
    inset-block-end: var(--md-fab-margin);
    inset-inline-start: var(--md-fab-margin);
    align-items: start;
    z-index: var(--md-fab-z-index);
  }

  :host([placement='top-start']) {
    position: fixed;
    inset-block-start: var(--md-fab-margin);
    inset-inline-start: var(--md-fab-margin);
    align-items: start;
    flex-direction: column-reverse;
    z-index: var(--md-fab-z-index);
  }

  :host([placement='top-end']) {
    position: fixed;
    inset-block-start: var(--md-fab-margin);
    inset-inline-end: var(--md-fab-margin);
    align-items: end;
    flex-direction: column-reverse;
    z-index: var(--md-fab-z-index);
  }

  :host([placement='inline']) {
    position: relative;
    align-items: end;
  }

  /* Expanded breakpoint margin increase (840px+) */
  @media (min-width: 840px) {
    :host([placement='bottom-end']),
    :host(:not([placement])) {
      inset-block-end: var(--md-fab-margin-expanded);
      inset-inline-end: var(--md-fab-margin-expanded);
    }

    :host([placement='bottom-start']) {
      inset-block-end: var(--md-fab-margin-expanded);
      inset-inline-start: var(--md-fab-margin-expanded);
    }

    :host([placement='top-start']) {
      inset-block-start: var(--md-fab-margin-expanded);
      inset-inline-start: var(--md-fab-margin-expanded);
    }

    :host([placement='top-end']) {
      inset-block-start: var(--md-fab-margin-expanded);
      inset-inline-end: var(--md-fab-margin-expanded);
    }
  }

  /* Menu Items Container */
  .menu-container {
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 8px;
    box-sizing: border-box;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 4px;
    margin: -4px;
    scrollbar-width: thin;
    z-index: 1;
    /* Opening entrance animation is orchestrated on slotted menu items; closing is immediate per MD3 */
  }

  :host([placement='bottom-start']) .menu-container,
  :host([placement='top-start']) .menu-container {
    align-items: start;
  }

  :host([placement='top-start']) .menu-container,
  :host([placement='top-end']) .menu-container {
    margin-block-end: 0;
  }

  :host(:not([open])) .menu-container {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    max-height: 0;
    overflow: hidden;
    margin-block-end: 0;
    margin-block-start: 0;
  }

  :host([open]) .menu-container {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
    margin-block-end: 8px;
  }

  :host([open][placement='top-start']) .menu-container,
  :host([open][placement='top-end']) .menu-container {
    margin-block-end: 0;
    margin-block-start: 8px;
  }

  /* Trigger Container */
  .trigger-container {
    display: inline-flex;
    position: relative;
    z-index: 2;
  }

  /* Slotted Menu Items */
  ::slotted([slot='menu']) {
    white-space: nowrap;
    border-radius: var(--md-sys-shape-corner-full, 9999px);
  }

  :host(:not([open])) ::slotted([slot='menu']) {
    opacity: 0;
    pointer-events: none;
  }

  /* Upward opening & Right-to-Left entrance animation */
  @keyframes fabMenuItemOpen {
    0% {
      opacity: 0;
      transform: translateX(28px) scale(0.85);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @keyframes fabMenuItemOpenRtl {
    0% {
      opacity: 0;
      transform: translateX(-28px) scale(0.85);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  :host([open]) ::slotted([slot='menu']) {
    animation: fabMenuItemOpen 180ms cubic-bezier(0.05, 0.7, 0.1, 1) var(--_item-delay, 0ms) both;
  }

  :host([open]:dir(rtl)) ::slotted([slot='menu']),
  :host([open][dir='rtl']) ::slotted([slot='menu']) {
    animation: fabMenuItemOpenRtl 180ms cubic-bezier(0.05, 0.7, 0.1, 1) var(--_item-delay, 0ms) both;
  }

  /* Motion reduction */
  @media (prefers-reduced-motion: reduce) {
    :host,
    .menu-container,
    ::slotted([slot='menu']) {
      transition: none !important;
      animation: none !important;
    }
  }
`
