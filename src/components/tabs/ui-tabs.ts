import { customElement } from 'lit/decorators.js'
import Element from './internals/Tabs.js'
import styles from './internals/Tabs.styles.js'
import type { CSSResultOrNative } from 'lit'

@customElement('ui-tabs')
export class UiTabsElement extends Element {
  static override styles: CSSResultOrNative[] = [styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-tabs': UiTabsElement
  }
}

export type { TabsPriority, TabSelectionDetail } from './internals/Tabs.js'
