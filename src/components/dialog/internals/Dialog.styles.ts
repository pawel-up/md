import { css } from 'lit'

export default css`
  :host {
    display: contents;
  }

  dialog {
    overflow: auto;
    /* Do not override the display value here. It will render the dialog even when hidden */

    border: none;
    border-radius: var(--md-sys-shape-corner-extra-large);
    background-color: var(--md-sys-color-surface-container-high);
    box-shadow: var(--md-sys-elevation-3);
    color: var(--md-sys-color-on-surface-variant);
    padding: 24px;

    max-width: var(--ui-dialog-max-width, 90vw);
    max-height: var(--ui-dialog-max-height, 90vh);
    width: var(--ui-dialog-width, revert);
    height: var(--ui-dialog-height, revert);
  }

  dialog:open {
    animation: 250ms cubic-bezier(0.2, 0, 0, 1) show-dialog;
    display: flex;
    flex-direction: column;
  }

  /* Positioning for non-modal dialogs */
  dialog.non-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
    z-index: 1000;
  }

  dialog.non-modal:open {
    /* Override the animation transform for non-modal dialogs to account for centering */
    animation: 250ms cubic-bezier(0.2, 0, 0, 1) show-non-modal-dialog;
  }

  dialog:open::backdrop {
    animation: 250ms cubic-bezier(0.2, 0, 0, 1) show-backdrop;
  }

  .container {
    display: flex;
    flex-direction: column;
    flex: 1;
    /* overflow: hidden; */
  }

  .icon {
    display: none;
  }

  .icon.with-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .icon ::slotted(*) {
    color: var(--md-sys-color-secondary);
    fill: var(--md-sys-color-secondary);
    width: 24px;
    height: 24px;
  }

  .icon.destructive ::slotted(*) {
    color: var(--md-sys-color-error);
    fill: var(--md-sys-color-error);
  }

  .title {
    display: none;
    color: var(--md-sys-color-on-surface);
    font-family: var(--md-sys-typescale-headline-small-font);
    font-weight: var(--md-sys-typescale-headline-small-weight);
    font-size: var(--md-sys-typescale-headline-small-size);
    letter-spacing: var(--md-sys-typescale-headline-small-tracking);
    line-height: var(--md-sys-typescale-headline-small-height);
    margin: 0;
    padding: 0;
    text-align: center;
  }

  .title.with-title {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .content {
    font-family: var(--md-sys-typescale-body-medium-font);
    font-weight: var(--md-sys-typescale-body-medium-weight);
    font-size: var(--md-sys-typescale-body-medium-size);
    letter-spacing: var(--md-sys-typescale-body-medium-tracking);
    line-height: var(--md-sys-typescale-body-medium-height);
    /* Do not set those here. Use the "constrain" property instead */
    /* overflow: auto; */
    /* flex: 1; */
  }

  :host([constrain]) {
    .container {
      /* with the constrain property set we want to force the content to overflow */
      overflow: hidden;
      .content {
        overflow: hidden;
        flex: 1;
        ::slotted(*) {
          overflow: auto;
        }
      }
    }
  }

  .buttons {
    display: none;
    display: flex;
    align-items: center;
    justify-content: end;
  }

  .buttons.with-buttons {
    margin-top: 24px;
  }

  .buttons ::slotted(:not(:last-child)) {
    margin-right: 12px;
  }

  .content ::slotted(*) {
    background-color: var(--md-sys-color-surface-container-high);
  }

  @keyframes show-dialog {
    from {
      transform: translateY(-110%) scaleY(0);
    }
    to {
      transform: translateY(0%) scaleY(1);
    }
  }

  @keyframes show-non-modal-dialog {
    from {
      transform: translate(-50%, -50%) translateY(-110%) scaleY(0);
    }
    to {
      transform: translate(-50%, -50%) translateY(0%) scaleY(1);
    }
  }

  @keyframes show-backdrop {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Destructive button styling for dangerous actions */
  .internal-button.destructive {
    --_background-color: var(--md-sys-color-error);
    --_color: var(--md-sys-color-on-error);

    /* Override ripple colors for better interaction feedback */
    --md-ripple-hover-state-layer-color: var(--md-sys-color-on-error);
    --md-ripple-focus-state-layer-color: var(--md-sys-color-on-error);
    --md-ripple-pressed-state-layer-color: var(--md-sys-color-on-error);
  }
`
