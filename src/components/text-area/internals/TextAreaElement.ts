import { html, TemplateResult } from 'lit'
import { property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { styleMap } from 'lit/directives/style-map.js'
import Input from '../../input/Input.js'

/**
 * Multi-line text area internal component.
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
export default class TextAreaElement extends Input {
  /**
   * Binds this to the `<textarea>`'s `cols` property.
   * @attr
   */
  @property({ type: Number })
  accessor cols: number | undefined

  /**
   * Binds this to the `<textarea>`'s `rows` property.
   * @attr
   */
  @property({ type: Number })
  accessor rows: number | undefined

  /**
   * Binds this to the `<textarea>`'s `wrap` property.
   * @attr
   */
  @property({ type: String })
  accessor wrap: 'soft' | 'hard' | undefined

  protected override readonly isMultiline = true

  override connectedCallback(): void {
    super.connectedCallback()
    this.setAttribute('aria-multiline', 'true')
  }

  protected override renderInput(): TemplateResult {
    const placeholderValue = this.placeholder || undefined
    const maxLengthValue = this.maxLength > -1 ? this.maxLength : undefined
    const roleValue = this.dataRole || undefined
    const { disabled } = this

    const style = this.computeInputStyles()

    const ariaActiveDescendantValue = this.ariaActiveDescendant || undefined
    const ariaAutoCompleteValue = this.ariaAutoComplete || undefined
    const ariaControlsValue = this.ariaControls || undefined
    const ariaDescribedByValue = this.getAriaDescribedBy() || undefined
    const ariaExpandedValue = this.ariaExpanded || undefined
    const ariaLabelValue = this.ariaLabel || this.label || undefined
    const ariaLabelledByValue = this.ariaLabelledBy || undefined

    return html`
      <textarea
        class="input"
        part="input"
        style=${styleMap(style)}
        name="${ifDefined(this.name)}"
        .value=${live(this.getInputValue())}
        maxlength=${ifDefined(maxLengthValue)}
        minlength=${ifDefined(this.minLength)}
        placeholder=${ifDefined(placeholderValue)}
        role=${ifDefined(roleValue as 'textbox')}
        ?disabled=${disabled}
        ?readonly=${this.readOnly}
        ?required=${this.required}
        autocomplete="${ifDefined(this.autocomplete as 'on')}"
        autocapitalize="${ifDefined(this.autocapitalize)}"
        inputmode="${ifDefined(this.inputMode)}"
        cols="${ifDefined(this.cols)}"
        rows="${ifDefined(this.rows)}"
        wrap="${ifDefined(this.wrap)}"
        spellcheck="${ifDefined(this.spellcheck)}"
        @change=${this.retargetEvent}
        @input=${this.handleInput}
        @select=${this.retargetEvent}
        @invalid=${this.invalidHandler}
        aria-activedescendant=${ifDefined(ariaActiveDescendantValue)}
        aria-autocomplete=${ifDefined(ariaAutoCompleteValue)}
        aria-controls=${ifDefined(ariaControlsValue)}
        aria-describedby=${ifDefined(ariaDescribedByValue)}
        aria-expanded=${ifDefined(ariaExpandedValue)}
        aria-invalid=${this.getError()}
        aria-label=${ifDefined(ariaLabelValue)}
        aria-labelledby=${ifDefined(ariaLabelledByValue)}
      ></textarea>
    `
  }
}
