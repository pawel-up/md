import { css } from 'lit'

/**
 * Definitions that style a `<dialog>` element as material dialog.
 *
 * The dialog has to have the following structure:
 *
 * ```html
 * <dialog>
 *  <form> <!-- optional -->
 *    <h3>Title</h3> <!-- h1, h2, or h3 -->
 *    <!-- Any content -->
 *    <div class="dialog-buttons">
 *      <ui-button color="text" value="cancel" submit>Cancel</ui-button>
 *      <ui-button color="text" value="submit" submit>Create</ui-button>
 *    </div>
 *  </form>
 * </dialog>
 * ```
 */
export default css`
  dialog {
    border: none;
    border-radius: var(--md-sys-shape-corner-extra-large);
    background-color: var(--md-sys-color-surface);
    box-shadow: var(--md-sys-elevation-3);
    color: var(--md-sys-color-on-surface-variant);
    padding: 24px;

    font-family: var(--md-sys-typescale-body-medium-font);
    font-weight: var(--md-sys-typescale-body-medium-weight);
    font-size: var(--md-sys-typescale-body-medium-size);
    letter-spacing: var(--md-sys-typescale-body-medium-tracking);
    line-height: var(--md-sys-typescale-body-medium-height);
  }

  dialog::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: var(--md-sys-color-surface-tint);
    opacity: 0.11;
    pointer-events: none;
  }

  dialog h1,
  dialog h2,
  dialog h3 {
    color: var(--md-sys-color-on-surface);
    margin: 0;
    padding: 0;
    font-family: var(--md-sys-typescale-headline-small-font);
    font-weight: var(--md-sys-typescale-headline-small-weight);
    font-size: var(--md-sys-typescale-headline-small-size);
    letter-spacing: var(--md-sys-typescale-headline-small-tracking);
    line-height: var(--md-sys-typescale-headline-small-height);
    margin-bottom: 16px;
    text-align: center;
  }

  dialog .dialog-buttons {
    margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: end;
  }

  dialog[open] {
    animation: 250ms cubic-bezier(0.2, 0, 0, 1) show-dialog;
  }

  dialog[open]::backdrop {
    animation: 250ms cubic-bezier(0.2, 0, 0, 1) show-backdrop;
  }

  @keyframes show-dialog {
    from {
      transform: translateY(-110%) scaleY(0);
    }
    to {
      transform: translateY(0%) scaleY(1);
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
`
