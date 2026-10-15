import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/TextField.js'
import styles from './internals/outlined.styles.js'
import common from './internals/common.styles.js'

/**
 * Material Design 3 outlined text field component.
 *
 * @slot prefix - A slot in which to render prefixes of the input
 * @slot suffix - A slot in which to render suffixes of the input
 *
 * @csspart input - The native input element.
 * @csspart content - The container wrapping prefix, body, visibility toggle, and suffix.
 * @csspart body - The container holding the label and native input.
 * @csspart label - The resting or floating label text element.
 * @csspart prefix - The container for the leading slot content.
 * @csspart suffix - The container for the trailing slot content.
 * @csspart outline - The container for the outlined border elements.
 * @csspart outline-label - The label element rendered within the outline notch.
 * @csspart supporting-text - The container for supporting text, error text, and character counter.
 * @csspart supporting-text-end - The character counter text element.
 * @csspart password-toggle - The built-in visibility toggle icon button.
 * @csspart visibility-toggle - Alias for the built-in visibility toggle icon button.
 */
@customElement('ui-outlined-text-field')
export class UiOutlinedTextFieldElement extends Element {
  static override styles: CSSResultOrNative[] = [common, styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-outlined-text-field': UiOutlinedTextFieldElement
  }
}
