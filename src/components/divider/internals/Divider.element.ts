import { html, LitElement, TemplateResult } from 'lit'
import { property } from 'lit/decorators.js'

export enum DividerType {
  full = 'full',
  inset = 'inset',
  middle = 'middle',
}

/**
 * A divider element.
 */
export default class UiDivider extends LitElement {
  /**
   * The predefined type of the divider.
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor type: DividerType

  /**
   * Whether to render the divider as a vertical separation.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor vertical = false

  constructor() {
    super()
    this.type = DividerType.full
  }

  override connectedCallback(): void {
    super.connectedCallback()
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'presentation')
    }
  }

  protected override render(): TemplateResult {
    return html`<div class="container"></div>`
  }
}
