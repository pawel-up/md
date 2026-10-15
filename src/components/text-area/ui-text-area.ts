import type { CSSResultOrNative } from 'lit'
import { customElement } from 'lit/decorators.js'
import Element from './internals/TextAreaElement.js'
import styles from '../text-field/internals/filled.styles.js'
import common from '../text-field/internals/common.styles.js'

/**
 * Material Design 3 multi-line text area component.
 *
 * @slot prefix - A slot in which to render prefixes of the input
 * @slot suffix - A slot in which to render suffixes of the input
 *
 * @csspart input - The native textarea element.
 * @csspart content - The container wrapping prefix, body, visibility toggle, and suffix.
 * @csspart body - The container holding the label and native textarea.
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
@customElement('ui-text-area')
export class UiTextAreaElement extends Element {
  static override styles: CSSResultOrNative[] = [common, styles]
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-text-area': Element
  }
}
