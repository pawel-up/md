import { TemplateResult, html } from 'lit'
import { ClassInfo, classMap } from 'lit/directives/class-map.js'
import UiDialog from './Dialog.js'

import '../../button/ui-button.js'

/**
 * A simple Material Design 3 styled confirm dialog for confirming user actions.
 *
 * This dialog provides a clean way to ask users to confirm or dismiss an action.
 * It supports customizable button labels and content through slots.
 *
 * **Usage Example:**
 * ```html
 * <ui-confirm-dialog modal .open="${this.showConfirm}" @close="${this.handleConfirmClose}">
 *   <span slot="title">Delete Item</span>
 *   <p>Are you sure you want to delete this item? This action cannot be undone.</p>
 * </ui-confirm-dialog>
 * ```
 *
 * **Event Handling:**
 * Listen for the `close` event to handle user interaction:
 * ```javascript
 * dialog.addEventListener('close', (e) => {
 *   const { cancelled } = e.detail;
 *   if (!cancelled) {
 *     // User confirmed the action
 *     performAction();
 *   }
 * });
 * ```
 *
 * @slot title - The dialog title content
 * @slot - The main body content of the dialog
 * @fires close - Dispatched when the dialog is closed with closing reason details
 */
export default class ConfirmDialog extends UiDialog {
  constructor() {
    super()
    // Set modal by default for confirm dialogs
    this.modal = true
    this.confirmLabel = 'Confirm'
    this.dismissLabel = 'Cancel'
  }

  protected override renderContent(): TemplateResult[] {
    return [this.renderTitle(), this.renderBody(), this.renderButtons()]
  }

  protected override renderButtons(): TemplateResult {
    const classes: ClassInfo = {
      'buttons': true,
      'with-buttons': true,
    }

    return html`
      <div class="${classMap(classes)}" part="buttons">
        <ui-button
          color="text"
          value="dismiss"
          class="internal-button"
          @click="${this.handleDismiss}"
          part="dismiss-button"
        >
          ${this.dismissLabel}
        </ui-button>
        <ui-button
          color="filled"
          value="confirm"
          class="internal-button"
          ?destructive="${this.destructive}"
          @click="${this.handleConfirm}"
          part="confirm-button"
        >
          ${this.confirmLabel}
        </ui-button>
      </div>
    `
  }
}
