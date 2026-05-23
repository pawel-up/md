import { customElement } from 'lit/decorators.js'
import Element from './internals/DateTime.js'

@customElement('ui-date-time')
export class UiDateTimeElement extends Element {
  //
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-date-time': Element
  }
}
