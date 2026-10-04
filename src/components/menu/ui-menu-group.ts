import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internal/MenuGroup.js'
import styles from './internal/MenuGroup.styles.js'

/**
 * Material Design 3 Menu Group component.
 */
@customElement('ui-menu-group')
export class UiMenuGroupElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-menu-group': UiMenuGroupElement
  }
}
