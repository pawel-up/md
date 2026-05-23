import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/Select.js'
import styles from './internals/Select.styles.js'

@customElement('ui-select')
export class UiSelectElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-select': Element
  }
}

export type { UiSelectChangeEvent } from './internals/Select.js'
