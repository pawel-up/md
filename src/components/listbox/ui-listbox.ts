import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/Listbox.js'
import styles from '../list/internals/List.styles.js'

@customElement('ui-listbox')
export class UiListElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-listbox': Element
  }
}
