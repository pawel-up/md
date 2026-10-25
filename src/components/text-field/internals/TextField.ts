import { html, TemplateResult } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { styleMap } from 'lit/directives/style-map.js'
import Input from '../../input/Input.js'

/**
 * Single-line text input internal component.
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
export default class TextField extends Input {
  protected override renderInput(): TemplateResult {
    const placeholderValue = this.placeholder || undefined
    const maxValue = this.max || undefined
    const maxLengthValue = this.maxLength > -1 ? this.maxLength : undefined
    const minValue = this.min || undefined
    const patternValue = this.pattern || undefined
    const roleValue = this.dataRole || undefined
    const stepValue = this.step || undefined
    const { disabled } = this

    const style = this.computeInputStyles()

    const ariaActiveDescendantValue = this.ariaActiveDescendant || undefined
    const ariaAutoCompleteValue = this.ariaAutoComplete || undefined
    const ariaControlsValue = this.ariaControls || undefined
    const ariaDescribedByValue = this.getAriaDescribedBy() || undefined
    const ariaExpandedValue = this.ariaExpanded || undefined
    const ariaLabelValue = this.getInputAriaLabel()
    const ariaLabelledByValue = this.getInputAriaLabelledBy()

    return html`
      <input
        class="input"
        part="input"
        style=${styleMap(style)}
        type=${this.effectiveType}
        name="${ifDefined(this.name)}"
        .value=${live(this.getInputValue())}
        max=${ifDefined(maxValue)}
        maxlength=${ifDefined(maxLengthValue)}
        min=${ifDefined(minValue)}
        minlength=${ifDefined(this.minLength)}
        pattern=${ifDefined(patternValue)}
        placeholder=${ifDefined(placeholderValue)}
        role=${ifDefined(roleValue as 'textbox')}
        ?disabled=${disabled}
        ?readonly=${this.readOnly}
        ?required=${this.required}
        step=${ifDefined(stepValue)}
        autocomplete="${ifDefined(this.autocomplete as 'on')}"
        autocapitalize="${ifDefined(this.autocapitalize)}"
        inputmode="${ifDefined(this.inputMode)}"
        size="${ifDefined(this.size)}"
        accept="${ifDefined(this.accept)}"
        ?multiple="${this.multiple}"
        spellcheck="${ifDefined(this.spellcheck)}"
        list="input-list"
        tabindex="${ifDefined(this.tabIndex)}"
        @change=${this.retargetEvent}
        @input=${this.handleInput}
        @select=${this.retargetEvent}
        @invalid=${this.invalidHandler}
        @keydown=${this.handleInputKeyDown}
        aria-activedescendant=${ifDefined(ariaActiveDescendantValue)}
        aria-autocomplete=${ifDefined(ariaAutoCompleteValue)}
        aria-controls=${ifDefined(ariaControlsValue)}
        aria-describedby=${ifDefined(ariaDescribedByValue)}
        aria-expanded=${ifDefined(ariaExpandedValue)}
        aria-invalid=${this.getError()}
        aria-label=${ifDefined(ariaLabelValue)}
        aria-labelledby=${ifDefined(ariaLabelledByValue)}
      />
    `
  }
}
