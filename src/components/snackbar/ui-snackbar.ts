import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import { Snackbar } from './internals/Snackbar.js'
import styles from './internals/Snackbar.styles.js'

@customElement('ui-snackbar')
export class UiSnackbar extends Snackbar {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-snackbar': UiSnackbar
  }
}
