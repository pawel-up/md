import { css } from 'lit'

export default css`
  :host {
    display: inline-block;
    vertical-align: middle;
    outline: none;
    width: 52px;
    height: 40px;
    -webkit-tap-highlight-color: transparent;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  .surface {
    position: relative;
    width: inherit;
    height: inherit;

    display: flex;
    align-items: center;
  }

  /* Track */
  .track {
    position: absolute;
    inset: 4px 0 0;
    z-index: 1;

    width: inherit;
    height: 32px;
    box-sizing: border-box;

    border: 2px var(--md-sys-color-outline) solid;
    border-radius: var(--md-sys-shape-corner-extra-large);
    background-color: var(--md-sys-color-surface-container-highest);

    transition:
      opacity 90ms cubic-bezier(0.4, 0, 0.2, 1),
      background-color 90ms cubic-bezier(0.4, 0, 0.2, 1),
      border-color 90ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .track.tracking,
  .thumb.tracking {
    transition: none;
  }

  .thumb {
    height: 20px;
    width: 20px;
    border-radius: var(--md-sys-shape-corner-full);
    background-color: var(--md-sys-color-outline);
    transform: translateX(6px) scale(0.8);
    transform-origin: center center;
    transition: transform 75ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
    cursor: pointer;
  }

  :host([checked]) .thumb {
    background-color: var(--md-sys-color-on-primary);
  }

  .withIcon .thumb {
    transform: translateX(6px) scale(1.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host(:active) .thumb,
  .pressed .thumb {
    transform: translateX(6px) scale(1.4);
  }

  :host([checked]) .thumb,
  :host([checked]) .withIcon .thumb {
    transform: translateX(26px) scale(1.2);
  }

  :host([checked]:active) .thumb,
  :host([checked]) .pressed .thumb {
    transform: translateX(26px) scale(1.4);
  }

  .state {
    position: absolute;
    inset: 0;
    z-index: 2;
    width: 40px;
    height: 40px;
    border-radius: var(--md-sys-shape-corner-full);
    transform: translateX(-5px);
    transition: transform 90ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  :host([checked]) .state {
    transform: translateX(18px);
    cursor: pointer;
  }

  .content {
    z-index: 3;
    position: relative;
  }

  .icon {
    fill: var(--md-sys-color-surface-variant);
    width: 16px;
    height: 16px;
  }

  :host([checked]) .icon {
    fill: var(--md-sys-color-on-primary-container);
  }

  :host([checked]) .track {
    background-color: var(--md-sys-color-primary);
    border-width: 0;
  }

  /* Hover state */

  :host(:hover) .track {
    background-color: var(--md-sys-color-surface-variant);
    border-color: var(--md-sys-color-outline);
  }

  :host(:hover) .state {
    background-color: var(--md-sys-color-on-surface);
    opacity: var(--md-sys-state-hover-state-layer-opacity);
  }

  :host([checked]:hover) .track {
    background-color: var(--md-sys-color-primary);
    border-width: 0;
  }

  :host([checked]:hover) .state {
    background-color: var(--md-sys-color-primary);
    opacity: var(--md-sys-state-hover-state-layer-opacity);
  }

  :host(:hover) .thumb {
    background-color: var(--md-sys-color-on-surface-variant);
  }

  :host([checked]:hover) .thumb {
    background-color: var(--md-sys-color-primary-container);
  }

  :host(:hover) .icon {
    fill: var(--md-sys-color-surface-variant);
  }

  :host([checked]:hover) .icon {
    fill: var(--md-sys-color-on-primary-container);
  }

  /* Focus state */

  :host(:focus) .track {
    background-color: var(--md-sys-color-surface-variant);
    border-color: var(--md-sys-color-outline);
  }

  :host([checked]:focus) .track {
    background-color: var(--md-sys-color-primary);
    border-width: 0;
  }

  :host(:focus) .state {
    background-color: var(--md-sys-color-on-surface);
    opacity: var(--md-sys-state-focus-state-layer-opacity);
  }

  :host([checked]:focus) .state {
    background-color: var(--md-sys-color-primary);
    opacity: var(--md-sys-state-focus-state-layer-opacity);
  }

  :host(:focus) .thumb {
    background-color: var(--md-sys-color-on-surface-variant);
  }

  :host([checked]:focus) .thumb {
    background-color: var(--md-sys-color-primary-container);
  }

  :host(:focus) .icon {
    fill: var(--md-sys-color-surface-variant);
  }

  :host([checked]:focus) .icon {
    fill: var(--md-sys-color-on-primary-container);
  }

  /* Pressed state */

  :host(:active) .track,
  .pressed .track {
    background-color: var(--md-sys-color-surface-variant);
    border-color: var(--md-sys-color-outline);
  }

  :host([checked]:active) .track,
  :host([checked]) .pressed .track {
    background-color: var(--md-sys-color-primary);
    border-width: 0;
  }

  :host(:active) .state,
  .pressed .state {
    background-color: var(--md-sys-color-on-surface);
    opacity: var(--md-sys-state-pressed-state-layer-opacity);
  }

  :host([checked]:active) .state,
  :host([checked]) .pressed .state {
    background-color: var(--md-sys-color-primary);
    opacity: var(--md-sys-state-pressed-state-layer-opacity);
  }

  :host(:active) .thumb,
  .pressed .thumb {
    background-color: var(--md-sys-color-on-surface-variant);
  }

  :host([checked]:active) .thumb,
  :host([checked]) .pressed .thumb {
    background-color: var(--md-sys-color-primary-container);
  }

  :host(:active) .icon,
  .pressed .icon {
    fill: var(--md-sys-color-surface-variant);
  }

  :host([checked]:active) .icon,
  :host([checked]) .pressed .icon {
    fill: var(--md-sys-color-on-primary-container);
  }

  /* Disabled state */

  :host([disabled]) .track {
    background-color: var(--md-sys-color-surface-variant);
    border-color: var(--md-sys-color-on-surface);
    opacity: 0.12;
  }

  :host([disabled][checked]) .track {
    background-color: var(--md-sys-color-on-surface);
    border-width: 0;
  }

  :host([disabled]) .thumb {
    background-color: var(--md-sys-color-on-surface);
    opacity: 0.38;
  }

  :host([disabled][checked]) .thumb {
    background-color: var(--md-sys-color-surface);
    opacity: 1;
  }

  :host([disabled]) .icon {
    fill: var(--md-sys-color-surface-variant);
    opacity: 0.38;
  }

  :host([disabled][checked]) .icon {
    fill: var(--md-sys-color-on-surface);
    opacity: 0.38;
  }
`
