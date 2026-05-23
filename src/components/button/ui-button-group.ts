import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/group.js'
import styles from './internals/group.styles.js'

@customElement('ui-button-group')
export class UiButtonGroupElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-button-group': UiButtonGroupElement
  }
}

export type { MdGroupType } from './internals/group.js'
