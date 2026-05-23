import { css } from 'lit'

export default css`
  :host {
    display: block;
    outline: none;
    cursor: default;
    position: relative;
    border-radius: 28px;

    color: var(--md-sys-color-on-surface);

    --md-focus-ring-shape-end-end: 28px;
    --md-focus-ring-shape-end-start: 28px;
    --md-focus-ring-shape-start-end: 28px;
    --md-focus-ring-shape-start-start: 28px;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  :host([hidden]) {
    display: none;
  }

  .surface {
    height: inherit;
    box-sizing: border-box;
    border-radius: 28px;

    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 10px 16px 10px 16px;

    gap: 16px;
    height: 56px;
  }

  :host([disabled]) .surface {
    background-color: color-mix(in srgb, var(--md-sys-color-on-surface), transparent 96%);
  }

  :host([disabled]) .surface,
  :host([disabled]) .headline,
  :host([disabled]) .supporting-text {
    color: color-mix(in srgb, var(--md-sys-color-on-surface), transparent 36%);
  }

  :host([image='image']) .surface,
  .surface.two-lines {
    height: 72px;
  }

  :host([image='video']) .surface,
  .surface.three-lines {
    height: 88px;
  }

  .ripple {
    z-index: 3;
    border-radius: 28px;
  }

  :host([image='video']) .surface {
    /* The spec says the right padding is 24px but counting from the checkbox check border.
      This does not include spacing presented by the checkbox itself (18 box, 40px state layer)
   */
    padding: 12px 16px 12px 0px;
  }

  .headline {
    font-family: var(--md-sys-typescale-body-large-font);
    font-weight: var(--md-sys-typescale-body-large-weight);
    font-size: var(--md-sys-typescale-body-large-size);
    letter-spacing: var(--md-sys-typescale-body-large-tracking);
    line-height: var(--md-sys-typescale-body-large-height);

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    display: flex;
    align-items: center;
  }

  .supporting-text {
    color: var(--md-sys-color-on-surface-variant);

    font-family: var(--md-sys-typescale-body-medium-font);
    font-weight: var(--md-sys-typescale-body-medium-weight);
    font-size: var(--md-sys-typescale-body-medium-size);
    letter-spacing: var(--md-sys-typescale-body-medium-tracking);
    line-height: var(--md-sys-typescale-body-medium-height);

    overflow: hidden;
  }

  .supporting-text ::slotted(*),
  slot[name='end-text']::slotted(*) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  slot[name='end-text']::slotted(*) {
    /* this is to make up to the 24px right padding defined in the spec. */
    margin-right: 8px;
  }

  :host([lines='three']) .supporting-text {
    height: calc(2 * var(--md-sys-typescale-body-medium-height, 1.1));
  }

  :host([lines='three']) .supporting-text ::slotted(*) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :host([lines='two']) .supporting-text ::slotted(*) {
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .trailing-supporting-text {
    color: var(--md-sys-color-on-surface-variant);

    font-family: var(--md-sys-typescale-body-small-font);
    font-weight: var(--md-sys-typescale-body-small-weight);
    font-size: var(--md-sys-typescale-body-small-size);
    letter-spacing: var(--md-sys-typescale-body-small-tracking);
    line-height: var(--md-sys-typescale-body-small-height);
  }

  .start {
    display: contents;
  }

  .start.has-start {
    align-self: stretch;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .end {
    display: contents;
  }

  .end.has-end,
  .end.has-end-text {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  :host slot[name='end']::slotted(:not(ui-button):not(ui-checkbox):not(ui-switch)) {
    color: var(--md-sys-color-on-surface-variant);
    fill: var(--md-sys-color-on-surface-variant);
  }

  :host slot[name='start']::slotted(*) {
    display: block;
  }

  :host([image='icon']) slot[name='start']::slotted(*) {
    width: 24px;
    height: 24px;
  }

  :host([image='avatar']) slot[name='start']::slotted(*) {
    width: 40px;
    height: 40px;
  }

  :host([image='image']) slot[name='start']::slotted(*) {
    width: 56px;
    height: 56px;
  }

  :host([image='video']) slot[name='start']::slotted(*) {
    width: 114px;
    height: 64px;
  }

  .body {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  :host(.highlight) .surface {
    background-color: var(--md-sys-color-tertiary-container);
    color: var(--md-sys-color-on-tertiary-container);
  }

  :host(.select) .surface {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }

  [name='overline'] {
    color: var(--md-sys-color-on-surface-variant);
    font-family: var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto));
    font-size: var(--md-sys-typescale-label-small-size, 0.6875rem);
    font-weight: var(
      --md-sys-typescale-label-small-weight,
      var(--md-ref-typeface-weight-medium, 500) --md-ref-typeface-weight-medium is not defined
    );
    line-height: var(--md-sys-typescale-label-small-line-height, 1rem);
  }

  :host([parent]) {
    transition:
      max-height 0.3s ease-in-out,
      opacity 0.3s ease-in-out,
      margin 0.3s ease-in-out,
      padding 0.3s ease-in-out;
    max-height: 120px;
    overflow: hidden;
  }

  :host([collapsed]) {
    max-height: 0;
    opacity: 0;
    margin-top: -2px;
    margin-bottom: 0;
    padding-top: 0;
    padding-bottom: 0;
    border-width: 0;
    pointer-events: none;
  }

  :host([group]) {
    cursor: pointer;
  }

  :host([group]:not([open])) ::slotted(ui-icon-button),
  :host([group]:not([open])) ::slotted(ui-icon) {
    transform: rotate(180deg);
  }

  :host([group]) ::slotted(ui-icon-button),
  :host([group]) ::slotted(ui-icon) {
    transition: transform 0.3s ease-in-out;
  }

  /* Connected Group Visuals */

  :host([group][open]) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    --md-focus-ring-shape-end-start: 0px;
    --md-focus-ring-shape-end-end: 0px;
    z-index: 1;
  }
  :host([group][open]) .surface,
  :host([group][open]) .ripple {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  :host([group][open]) .surface {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }

  :host([parent]:not([collapsed])) {
    border-radius: 0;
    --md-focus-ring-shape-start-start: 0px;
    --md-focus-ring-shape-start-end: 0px;
    --md-focus-ring-shape-end-start: 0px;
    --md-focus-ring-shape-end-end: 0px;
    z-index: 1;
  }
  :host([parent]:not([collapsed])) .surface,
  :host([parent]:not([collapsed])) .ripple {
    border-radius: 0;
  }
  :host([parent]:not([collapsed])) .surface {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }

  :host([parent][last-in-group]:not([collapsed])) {
    border-bottom-left-radius: 28px;
    border-bottom-right-radius: 28px;
    --md-focus-ring-shape-end-start: 28px;
    --md-focus-ring-shape-end-end: 28px;
  }
  :host([parent][last-in-group]:not([collapsed])) .surface,
  :host([parent][last-in-group]:not([collapsed])) .ripple {
    border-bottom-left-radius: 28px;
    border-bottom-right-radius: 28px;
  }
`
