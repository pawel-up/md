import { html, type TemplateResult } from 'lit'
import BaseButton from '../../button/internals/base.js'
import { property } from 'lit/decorators.js'

export type MdIconButtonColor = 'elevated' | 'filled' | 'outlined' | 'standard' | 'tonal'
export type MdIconButtonWidth = 'default' | 'narrow' | 'wide'

/**
 * An icon button component that extends the functionality of a standard button,
 * but is specifically designed to hold an icon.
 *
 * @slot - The default slot for the icon.
 * @slot selected - The slot for the icon displayed when the button is in a selected toggle state.
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

  /**
   * Whether the button has a slotted element for the 'selected' slot.
   */
  get hasSelectedSlot(): boolean {
    return Boolean(this.querySelector('[slot="selected"]'))
  }

  protected override render(): TemplateResult {
    const showSelectedSlot = this.toggle && this.selected && this.hasSelectedSlot
    return html`
      ${this.renderFocusRing()} ${this.renderRipple()}
      <slot name="selected" ?hidden="${!showSelectedSlot}"></slot>
      <slot ?hidden="${showSelectedSlot}"></slot>
    `
  }
}
