import { html, type TemplateResult } from 'lit'
import BaseButton from '../../button/internals/base.js'
import { property } from 'lit/decorators.js'

export type MdIconButtonColor = 'filled' | 'outlined' | 'standard' | 'tonal'
export type MdIconButtonWidth = 'default' | 'narrow' | 'wide'

/**
 * An icon button component that extends the functionality of a standard button,
 * but is specifically designed to hold an icon.
 * @slot - The default slot for the icon.
 */
export default class IconButton extends BaseButton {
  /**
   * The color of the button.
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor color: MdIconButtonColor = 'standard'
  /**
   * The width of the button.
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor width: MdIconButtonWidth = 'default'

  protected override render(): TemplateResult {
    return html`
      ${this.renderFocusRing()} ${this.renderRipple()}
      <slot></slot>
    `
  }
}
