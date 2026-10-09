import { css } from 'lit'

export default css`
  :host {
    display: block;
    position: relative;
    --_density-offset: var(--md-density-offset, 0px);
    --_item-shape: var(--md-option-shape, var(--md-menu-item-shape, var(--md-sys-shape-corner-extra-small, 4px)));
    --_item-margin-inline: var(--md-option-margin-inline, var(--md-menu-item-margin-inline, 6px));
    --md-focus-ring-shape: var(--_item-shape);
    --md-focus-ring-shape-end-end: var(--_item-shape);
    --md-focus-ring-shape-end-start: var(--_item-shape);
    --md-focus-ring-shape-start-end: var(--_item-shape);
    --md-focus-ring-shape-start-start: var(--_item-shape);
  }

  :host([density='0']) {
    --_density-offset: 0px;
    --md-menu-item-density-height: 48px;
    --md-option-density-height: 48px;
  }

  :host([density='-1']) {
    --_density-offset: -4px;
    --md-menu-item-density-height: 44px;
    --md-option-density-height: 44px;
  }

  :host([density='-2']) {
    --_density-offset: -8px;
    --md-menu-item-density-height: 40px;
    --md-option-density-height: 40px;
  }

  :host([density='-3']) {
    --_density-offset: -12px;
    --md-menu-item-density-height: 36px;
    --md-option-density-height: 36px;
  }

  .surface {
    position: relative;
    display: flex;
    align-items: center;
    height: var(
      --md-option-density-height,
      var(
        --md-menu-item-density-height,
        var(
          --md-option-height,
          var(--md-menu-item-height, calc(48px + var(--_density-offset, var(--md-density-offset, 0px))))
        )
      )
    );
    min-height: var(
      --md-option-density-height,
      var(
        --md-menu-item-density-height,
        var(
          --md-option-height,
          var(--md-menu-item-height, calc(48px + var(--_density-offset, var(--md-density-offset, 0px))))
        )
      )
    );
    margin: 0 var(--_item-margin-inline);
    padding: 0 12px;
    border-radius: var(--_item-shape);
    cursor: pointer;
    outline: none;
    box-sizing: border-box;
    transition:
      background-color 0.15s ease,
      color 0.15s ease,
      border-radius 0.15s ease;
  }

  .surface.two-lines {
    height: var(
      --md-option-two-lines-height,
      var(
        --md-menu-item-two-lines-height,
        var(--md-list-item-two-lines-height, calc(72px + var(--_density-offset, var(--md-density-offset, 0px))))
      )
    );
    min-height: var(
      --md-option-two-lines-height,
      var(
        --md-menu-item-two-lines-height,
        var(--md-list-item-two-lines-height, calc(72px + var(--_density-offset, var(--md-density-offset, 0px))))
      )
    );
  }

  .surface.three-lines {
    height: var(
      --md-option-three-lines-height,
      var(
        --md-menu-item-three-lines-height,
        var(--md-list-item-three-lines-height, calc(88px + var(--_density-offset, var(--md-density-offset, 0px))))
      )
    );
    min-height: var(
      --md-option-three-lines-height,
      var(
        --md-menu-item-three-lines-height,
        var(--md-list-item-three-lines-height, calc(88px + var(--_density-offset, var(--md-density-offset, 0px))))
      )
    );
  }

  :host([disabled]) .surface,
  .surface[disabled] {
    opacity: 0.38;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Focus Ring */
  ui-focus-ring {
    --md-focus-ring-color: var(--md-sys-color-primary);
    --md-focus-ring-width: 2px;
    --md-focus-ring-shape: var(--_item-shape);
    --md-focus-ring-shape-end-end: var(--_item-shape);
    --md-focus-ring-shape-end-start: var(--_item-shape);
    --md-focus-ring-shape-start-end: var(--_item-shape);
    --md-focus-ring-shape-start-start: var(--_item-shape);
    margin: 0 var(--_item-margin-inline);
    z-index: 2;
  }

  /* Ripple Effect */
  ui-ripple {
    position: absolute;
    inset: 0;
    margin: 0 var(--_item-margin-inline);
    border-radius: var(--_item-shape);
    --md-ripple-state-layer-shape: var(--_item-shape);
    --md-ripple-hover-state-layer-color: currentColor;
    --md-ripple-focus-state-layer-color: currentColor;
    --md-ripple-pressed-state-layer-color: currentColor;
    z-index: 1;
  }

  /* Selected state */
  :host(.select),
  :host(.selected),
  :host([selected]) {
    --_item-shape: var(
      --md-option-selected-shape,
      var(--md-menu-item-selected-shape, var(--md-sys-shape-corner-medium, 12px))
    );
  }

  :host(.select) .surface,
  :host(.selected) .surface,
  :host([selected]) .surface,
  .surface.selected {
    background-color: var(
      --md-option-selected-bg,
      var(--md-menu-item-selected-bg, var(--md-sys-color-secondary-container))
    );
    color: var(
      --md-option-selected-color,
      var(--md-menu-item-selected-color, var(--md-sys-color-on-secondary-container))
    );
  }

  /* Selected supporting text and overline (standard) */
  :host(.select) .supporting-text,
  :host(.selected) .supporting-text,
  :host([selected]) .supporting-text,
  .surface.selected .supporting-text,
  :host(.select) .trailing-supporting-text,
  :host(.selected) .trailing-supporting-text,
  :host([selected]) .trailing-supporting-text,
  .surface.selected .trailing-supporting-text,
  :host(.select) [name='overline'],
  :host(.selected) [name='overline'],
  :host([selected]) [name='overline'],
  .surface.selected [name='overline'] {
    color: var(
      --md-option-selected-color,
      var(--md-menu-item-selected-color, var(--md-sys-color-on-secondary-container))
    );
  }

  /* Vibrant unselected state */
  :host([variant='vibrant']) .surface {
    color: var(--md-sys-color-on-tertiary-container);
  }

  :host([variant='vibrant']) .supporting-text,
  :host([variant='vibrant']) .trailing-supporting-text,
  :host([variant='vibrant']) [name='overline'],
  :host([variant='vibrant']) slot[name='start']::slotted(*),
  :host([variant='vibrant']) slot[name='end']::slotted(:not(ui-button):not(ui-checkbox):not(ui-switch)) {
    color: var(--md-sys-color-on-tertiary-container);
    fill: var(--md-sys-color-on-tertiary-container);
  }

  /* Vibrant selected state */
  :host([variant='vibrant'].select) .surface,
  :host([variant='vibrant'].selected) .surface,
  :host([variant='vibrant'][selected]) .surface {
    background-color: var(--md-sys-color-tertiary);
    color: var(--md-sys-color-on-tertiary);
  }

  :host([variant='vibrant'].select) .supporting-text,
  :host([variant='vibrant'].selected) .supporting-text,
  :host([variant='vibrant'][selected]) .supporting-text,
  :host([variant='vibrant'].select) .trailing-supporting-text,
  :host([variant='vibrant'].selected) .trailing-supporting-text,
  :host([variant='vibrant'][selected]) .trailing-supporting-text,
  :host([variant='vibrant'].select) [name='overline'],
  :host([variant='vibrant'].selected) [name='overline'],
  :host([variant='vibrant'][selected]) [name='overline'],
  :host([variant='vibrant'].select) slot[name='start']::slotted(*),
  :host([variant='vibrant'].selected) slot[name='start']::slotted(*),
  :host([variant='vibrant'][selected]) slot[name='start']::slotted(*),
  :host([variant='vibrant'].select) slot[name='end']::slotted(:not(ui-button):not(ui-checkbox):not(ui-switch)),
  :host([variant='vibrant'].selected) slot[name='end']::slotted(:not(ui-button):not(ui-checkbox):not(ui-switch)),
  :host([variant='vibrant'][selected]) slot[name='end']::slotted(:not(ui-button):not(ui-checkbox):not(ui-switch)) {
    color: var(--md-sys-color-on-tertiary);
    fill: var(--md-sys-color-on-tertiary);
  }

  /* Selection check icon */
  .selection-icon,
  .selection-check {
    color: var(
      --md-option-selected-color,
      var(--md-menu-item-selected-color, var(--md-sys-color-on-secondary-container))
    );
    fill: var(
      --md-option-selected-color,
      var(--md-menu-item-selected-color, var(--md-sys-color-on-secondary-container))
    );
    width: 24px;
    height: 24px;
  }

  :host([variant='vibrant'].select) .selection-icon,
  :host([variant='vibrant'].selected) .selection-icon,
  :host([variant='vibrant'][selected]) .selection-icon,
  :host([variant='vibrant'].select) .selection-check,
  :host([variant='vibrant'].selected) .selection-check,
  :host([variant='vibrant'][selected]) .selection-check {
    color: var(--md-sys-color-on-tertiary);
    fill: var(--md-sys-color-on-tertiary);
  }
`
