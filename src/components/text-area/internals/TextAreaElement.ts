import { html, TemplateResult } from 'lit'
import { property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { StyleInfo, styleMap } from 'lit/directives/style-map.js'
import Input from '../../input/Input.js'

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

  override connectedCallback(): void {
    super.connectedCallback()
    this.setAttribute('aria-multiline', 'true')
  }

  protected override renderInput(): TemplateResult {
    const placeholderValue = this.placeholder || undefined
    const maxLengthValue = this.maxLength > -1 ? this.maxLength : undefined
    const roleValue = this.dataRole || undefined
    const { disabled } = this

    const style: StyleInfo = {}
    if (this.textDirection) {
      style.direction = this.textDirection
    }

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
        autocomplete="${ifDefined(this.autocomplete)}"
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
