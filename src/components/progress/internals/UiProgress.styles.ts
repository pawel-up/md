import { css } from 'lit'

export default css`
  :host {
    display: block;
    box-sizing: border-box;
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  .container {
    box-sizing: border-box;
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

  :host([wavy]) {
    overflow: visible;
  }

  :host([thick]:not([wavy])) .container {
    height: var(--ui-progress-height, 8px);
  }

  /* Stop Indicator (Material Design 3 accessibility standard) */
  .stop-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: var(
      --ui-progress-stop-indicator-color,
      var(--ui-progress-primary-progress-color, var(--md-sys-color-primary))
    );
    margin-left: 4px;
    flex-shrink: 0;
  }

  .container .stop-dot {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 0;
  }

  :host([thick]:not([wavy])) .container .stop-dot,
  .wavy-container.thick .stop-dot {
    width: 8px;
    height: 8px;
  }

  /* Wavy Variant (Material Design 3 Expressive) */
  .wavy-container {
    box-sizing: border-box;
    width: 100%;
    height: 10px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  .wavy-container.thick {
    height: 14px;
  }

  .wavy-container.disabled {
    opacity: 0.38;
  }

  .wavy-active {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    transition: width var(--ui-progress-scale-duration, 230ms) var(--md-sys-animation-easing-standard);
    border-radius: 2px 4px 4px 2px;
  }

  .wavy-container:not(.thick) .wavy-active:not([style*='width: 0%']) {
    min-width: 4px;
  }

  .wavy-container.thick .wavy-active {
    border-radius: 4px 8px 8px 4px;
  }

  .wavy-container.thick .wavy-active:not([style*='width: 0%']) {
    min-width: 8px;
  }

  .wavy-active.complete {
    width: 100%;
    border-radius: 2px;
  }

  .wavy-container.thick .wavy-active.complete {
    border-radius: 4px;
  }

  .complete-line {
    width: 100%;
    background-color: var(--ui-progress-primary-progress-color, var(--md-sys-color-primary));
    border-radius: 2px;
  }

  .wavy-container.thick .complete-line {
    border-radius: 4px;
  }

  .wavy-active.indeterminate {
    width: auto;
    border-radius: 4px;
    animation: wavy-indeterminate-primary var(--ui-progress-indeterminate-cycle-duration, 2.4s)
      cubic-bezier(0.35, 0.1, 0.25, 1) infinite;
  }

  .wavy-active.indeterminate.secondary-wave {
    animation: wavy-indeterminate-secondary var(--ui-progress-indeterminate-cycle-duration, 2.4s)
      cubic-bezier(0.35, 0.1, 0.25, 1) infinite;
    animation-delay: 1.1s;
  }

  .wavy-container.thick .wavy-active.indeterminate {
    border-radius: 8px;
  }

  .wavy-svg {
    position: absolute;
    left: 0;
    top: 0;
    width: max(5600px, 100% + 80px);
    height: 100%;
    overflow: visible;
    animation: wave-travel var(--ui-progress-wave-speed, 0.65s) linear infinite;
  }

  .wavy-path {
    fill: none;
    stroke: var(--ui-progress-primary-progress-color, var(--md-sys-color-primary));
    stroke-linecap: round;
  }

  .wavy-track {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    transition: left var(--ui-progress-scale-duration, 230ms) var(--md-sys-animation-easing-standard);
  }

  .wavy-track.full-track {
    left: 0;
    right: 0;
    width: 100%;
  }

  .track-line {
    flex: 1;
    background-color: var(--ui-progress-track-color, var(--md-sys-color-surface-variant));
    border-radius: 2px;
  }

  .wavy-container.thick .track-line {
    border-radius: 4px;
  }

  @keyframes wave-travel {
    from {
      transform: translateX(-40px);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes wavy-indeterminate-primary {
    0% {
      left: -40%;
      right: 100%;
    }
    45% {
      left: 15%;
      right: 40%;
    }
    80% {
      left: 95%;
      right: -25%;
    }
    100% {
      left: 100%;
      right: -40%;
    }
  }

  @keyframes wavy-indeterminate-secondary {
    0% {
      left: -60%;
      right: 100%;
    }
    50% {
      left: -5%;
      right: 65%;
    }
    85% {
      left: 85%;
      right: -20%;
    }
    100% {
      left: 100%;
      right: -40%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .wavy-svg {
      animation: none;
    }

    .wavy-active.indeterminate {
      animation: none;
      left: 0;
      right: 50%;
    }

    .wavy-active.indeterminate.secondary-wave {
      display: none;
    }
  }
`
