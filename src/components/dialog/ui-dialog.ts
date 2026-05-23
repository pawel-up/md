import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/Dialog.js'
import styles from './internals/Dialog.styles.js'

@customElement('ui-dialog')
export class UiDialogElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-dialog': UiDialogElement
  }
}

export type { UiDialogClosingReason } from './internals/Dialog.js'
