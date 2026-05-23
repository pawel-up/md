import { html, TemplateResult } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { live } from 'lit/directives/live.js'
import { StyleInfo, styleMap } from 'lit/directives/style-map.js'
import Input from '../../input/Input.js'

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
      <input
        class="input"
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
        autocomplete="${ifDefined(this.autocomplete)}"
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
