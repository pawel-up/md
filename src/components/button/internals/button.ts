import { property } from 'lit/decorators.js'
import BaseButton from './base.js'
export type { ButtonType, MdButtonShape, MdButtonSize } from './base.js'

export type MdButtonColor = 'elevated' | 'filled' | 'outlined' | 'text' | 'tonal'

/**
 * A material design button with M3 Expressive features - CSS-native implementation.
 */
export default class Button extends BaseButton {
  /**
   * The color of the button.
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor color: MdButtonColor = 'filled'

  /**
   * Whether the button represents a destructive action.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor destructive = false
}
