import { css } from 'lit'

export default css`
  :host {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    display: flex;
  }

  :host([disabled]) {
    opacity: 0;
  }

  .surface {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    outline: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .surface::before,
  .surface::after {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    z-index: -1;
    content: '';
  }

  .surface::before {
    transition:
      opacity 15ms linear,
      background-color 15ms linear;
    inset: 0;
  }

  .surface::after {
    transition: opacity 375ms linear;
    transform-origin: center center;
  }

  .focused::before {
    transition-duration: 75ms;
  }

  .pressed::after {
    transition-duration: 105ms;
  }

  .surface {
    border-radius: var(--md-ripple-state-layer-shape, 0);
  }

  .surface::before {
    background-color: var(--md-ripple-hover-state-layer-color, var(--md-sys-color-primary));
  }

  .surface::after {
    background: radial-gradient(
      closest-side,
      var(--md-ripple-pressed-state-layer-color, var(--md-sys-color-primary)) max(100% - 70px, 65%),
      transparent 100%
    );
  }

  .surface.hovered::before {
    opacity: var(--md-ripple-hover-state-layer-opacity, var(--md-sys-state-hover-state-layer-opacity));
    background-color: var(--md-ripple-hover-state-layer-color, var(--md-sys-color-primary));
  }

  .surface.focused::before {
    opacity: var(--md-ripple-focus-state-layer-opacity, var(--md-sys-state-focus-state-layer-opacity));
    background-color: var(--md-ripple-focus-state-layer-color, var(--md-sys-color-primary));
  }

  .surface.pressed::after {
    opacity: var(--md-ripple-pressed-state-layer-opacity, var(--md-sys-state-pressed-state-layer-opacity));
  }

  .surface.unbounded {
    border-radius: var(--md-ripple-state-layer-shape, 9999px);
  }
`
