import { css } from 'lit'

export default css`
  :host {
    display: block;
    width: auto;
    position: relative;
    overflow: hidden;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  .container {
    height: var(--ui-progress-height, 4px);
    width: inherit;
    position: relative;
    overflow: hidden;
    background-color: var(--ui-progress-track-color, var(--md-sys-color-surface-variant));
  }

  .container.disabled {
    opacity: 0.38;
  }

  .primary {
    background-color: var(--ui-progress-primary-progress-color, var(--md-sys-color-primary));
  }

  .secondary {
    background-color: var(--ui-progress-secondary-progress-color, var(--md-sys-color-secondary));
  }

  .primary.linear,
  .secondary {
    position: absolute;
    inset: 0;
    transform-origin: left center;
    transform: scaleX(0);
    will-change: transform;
    transition: transform var(--ui-progress-scale-duration, 230ms) var(--md-sys-animation-easing-standard);
  }

  .primary.indeterminate::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: inherit;
    transform-origin: left center;
    animation: indeterminate var(--ui-progress-indeterminate-cycle-duration, 2.3s) cubic-bezier(0.27, 0, 0.86, 0.98)
      infinite;
  }

  .primary.indeterminate::after {
    content: '';
    position: absolute;
    background-color: inherit;
    top: 0;
    left: 0;
    bottom: 0;
    animation: indeterminate-short var(--ui-progress-indeterminate-cycle-duration, 2.3s)
      cubic-bezier(0.41, 0.41, 0.44, 1) infinite;
    animation-delay: 0.95s;
  }

  @keyframes indeterminate {
    0% {
      left: -35%;
      right: 100%;
    }
    60% {
      left: 100%;
      right: -90%;
    }
    100% {
      left: 100%;
      right: -90%;
    }
  }

  @keyframes indeterminate-short {
    0% {
      left: -200%;
      right: 100%;
    }
    60% {
      left: 107%;
      right: -8%;
    }
    100% {
      left: 107%;
      right: -8%;
    }
  }
`
