import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/UiDropdownList.js'
import styles from './internals/UiDropdownList.styles.js'

@customElement('ui-dropdown-list')
export class UiDropdownListElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-dropdown-list': Element
  }
}

export type { UiDropdownListSelection } from './internals/UiDropdownList.js'
