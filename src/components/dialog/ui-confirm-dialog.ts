import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/ConfirmDialog.js'
import dialogStyles from './internals/Dialog.styles.js'

/**
 * A simple Material Design 3 styled confirm dialog component.
 *
 * This dialog is designed specifically for confirmation workflows where users
 * need to confirm or dismiss an action. It provides a clean, accessible interface
 * with customizable button labels and content.
 *
 * **Features:**
 * - Material Design 3 styling
 * - Customizable confirm and dismiss button labels
 * - Modal by default
 * - Accessible keyboard navigation
 * - Slot-based content structure
 *
 * **Usage:**
 * ```html
 * <ui-confirm-dialog .open="${showDialog}" @close="${handleClose}">
 *   <span slot="title">Confirm Action</span>
 *   <p>Are you sure you want to proceed with this action?</p>
 * </ui-confirm-dialog>
 * ```
 *
 * **Customizing Button Labels:**
 * ```html
 * <ui-confirm-dialog
 *   confirmLabel="Delete"
 *   dismissLabel="Keep"
 *   .open="${showDialog}"
 * >
 *   <span slot="title">Delete Item</span>
 *   <p>This action cannot be undone.</p>
 * </ui-confirm-dialog>
 * ```
 *
 * @slot title - The dialog title
 * @slot - The main content body
 */
@customElement('ui-confirm-dialog')
export class UiConfirmDialogElement extends Element {
  static override styles: CSSResultOrNative[] = [dialogStyles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-confirm-dialog': UiConfirmDialogElement
  }
}
