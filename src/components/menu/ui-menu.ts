import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internal/Menu.js'
import styles from './internal/Menu.styles.js'

/**
 * Material Design 3 Menu component with sub-menu support.
 */
@customElement('ui-menu')
export class UiMenuElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-menu': UiMenuElement
  }
}

export type { UiListItemsChange, UiListSelection } from '../list/internals/List.js'
