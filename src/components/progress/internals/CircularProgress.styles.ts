import { css } from 'lit'

export default css`
  :host {
    --ui-circular-progress-arc-duration: 1333ms;
    --ui-circular-progress-cycle-duration: calc(4 * var(--ui-circular-progress-arc-duration));
    --ui-circular-progress-linear-rotate-duration: calc(var(--ui-circular-progress-arc-duration) * 360 / 306);
    --ui-circular-progress-indeterminate-easing: cubic-bezier(0.4, 0, 0.2, 1);
    --_container-padding: 4px;
    --_size: var(--ui-circular-progress-size, 48px);

    --_active-indicator-color: var(--ui-circular-progress-active-indicator-color, var(--md-sys-color-primary));
    --_active-indicator-width: var(--ui-circular-progress-active-indicator-width, 10);
    --_four-color-active-indicator-four-color: var(
      --ui-circular-progress-four-color-active-indicator-four-color,
      var(--md-sys-color-tertiary-container)
    );
    --_four-color-active-indicator-one-color: var(
      --ui-circular-progress-four-color-active-indicator-one-color,
      var(--md-sys-color-primary)
    );
    --_four-color-active-indicator-three-color: var(
      --ui-circular-progress-four-color-active-indicator-three-color,
      var(--md-sys-color-tertiary)
    );
    --_four-color-active-indicator-two-color: var(
      --ui-circular-progress-four-color-active-indicator-two-color,
      var(--md-sys-color-primary-container)
    );

    display: inline-flex;
    vertical-align: middle;
    width: var(--_size);
    height: var(--_size);
    position: relative;
    align-items: center;
    justify-content: center;

    contain: strict;
    content-visibility: auto;
  }

  .progress,
  .spinner,
  .left,
  .right,
  .circle,
  svg,
  .track,
  .active-track {
    position: absolute;
    inset: 0;
  }

  svg {
    transform: rotate(-90deg);
  }

  circle {
    cx: 50%;
    cy: 50%;
    r: calc(50% * (1 - var(--_active-indicator-width) / 100));
    stroke-width: calc(var(--_active-indicator-width) * 1%);
    stroke-dasharray: 100;
    fill: transparent;
  }

  .active-track {
    transition: stroke-dashoffset 500ms cubic-bezier(0, 0, 0.2, 1);
    stroke: var(--_active-indicator-color);
  }

  .track {
    stroke: transparent;
  }

  :host([indeterminate]) {
    animation: linear infinite linear-rotate;
    animation-duration: var(--ui-circular-progress-linear-rotate-duration);
  }

  .spinner {
    animation: infinite both rotate-arc;
    animation-duration: var(--ui-circular-progress-cycle-duration);
    animation-timing-function: var(--ui-circular-progress-indeterminate-easing);
  }

  .left {
    overflow: hidden;
    inset: 0 50% 0 0;
  }

  .right {
    overflow: hidden;
    inset: 0 0 0 50%;
  }

  .circle {
    box-sizing: border-box;
    border-radius: 50%;
    --_padding-box-width: calc(var(--_size) - 2 * var(--_container-padding));
    --_active-indicator-fraction: calc(var(--_active-indicator-width) / 100);
    border: solid calc(var(--_active-indicator-fraction) * var(--_padding-box-width));
    border-color: var(--_active-indicator-color) var(--_active-indicator-color) transparent transparent;
    animation: expand-arc;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
    animation-duration: var(--ui-circular-progress-arc-duration), var(--ui-circular-progress-cycle-duration);
    animation-timing-function: var(--ui-circular-progress-indeterminate-easing);
  }

  .left .circle {
    rotate: 135deg;
    inset: 0 -100% 0 0;
  }

  .right .circle {
    rotate: 100deg;
    inset: 0 0 0 -100%;
    animation-delay: calc(-0.5 * var(--ui-circular-progress-arc-duration)), 0ms;
  }

  :host([fourcolor]) .circle {
    animation-name: expand-arc, four-color;
  }

  @keyframes expand-arc {
    0% {
      transform: rotate(265deg);
    }
    50% {
      transform: rotate(130deg);
    }
    100% {
      transform: rotate(265deg);
    }
  }

  @keyframes rotate-arc {
    12.5% {
      transform: rotate(135deg);
    }
    25% {
      transform: rotate(270deg);
    }
    37.5% {
      transform: rotate(405deg);
    }
    50% {
      transform: rotate(540deg);
    }
    62.5% {
      transform: rotate(675deg);
    }
    75% {
      transform: rotate(810deg);
    }
    87.5% {
      transform: rotate(945deg);
    }
    100% {
      transform: rotate(1080deg);
    }
  }

  @keyframes linear-rotate {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes four-color {
    0% {
      border-top-color: var(--_four-color-active-indicator-one-color);
      border-right-color: var(--_four-color-active-indicator-one-color);
    }
    15% {
      border-top-color: var(--_four-color-active-indicator-one-color);
      border-right-color: var(--_four-color-active-indicator-one-color);
    }
    25% {
      border-top-color: var(--_four-color-active-indicator-two-color);
      border-right-color: var(--_four-color-active-indicator-two-color);
    }
    40% {
      border-top-color: var(--_four-color-active-indicator-two-color);
      border-right-color: var(--_four-color-active-indicator-two-color);
    }
    50% {
      border-top-color: var(--_four-color-active-indicator-three-color);
      border-right-color: var(--_four-color-active-indicator-three-color);
    }
    65% {
      border-top-color: var(--_four-color-active-indicator-three-color);
      border-right-color: var(--_four-color-active-indicator-three-color);
    }
    75% {
      border-top-color: var(--_four-color-active-indicator-four-color);
      border-right-color: var(--_four-color-active-indicator-four-color);
    }
    90% {
      border-top-color: var(--_four-color-active-indicator-four-color);
      border-right-color: var(--_four-color-active-indicator-four-color);
    }
    100% {
      border-top-color: var(--_four-color-active-indicator-one-color);
      border-right-color: var(--_four-color-active-indicator-one-color);
    }
  }

  @media (forced-colors: active) {
    .active-track {
      stroke: CanvasText;
    }

    .circle {
      border-color: CanvasText CanvasText Canvas Canvas;
    }
  }
`
