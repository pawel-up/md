import { html, TemplateResult } from 'lit'
import '../../../src/components/checkbox/ui-checkbox.js'
import CheckboxElement from '../../../src/components/checkbox/internals/CheckboxElement.js'
import { DemoPage } from '../../../src/demo/DemoPage.js'
import { reactive } from '../../../src/decorators/index.js'

class ComponentDemoPage extends DemoPage {
  override accessor componentName = 'UI checkbox'

  @reactive() accessor formValues: string | undefined

  _changeHandler(e: Event): void {
    const button = e.target as CheckboxElement
    console.log(`Log: ${button.value} checkbox was clicked.`)
  }

  _submitHandler(e: SubmitEvent): void {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const values = Array.from(new FormData(form)) as string[][]

    const serialized = new URLSearchParams(values).toString()
    this.formValues = serialized
  }

  contentTemplate(): TemplateResult {
    const { formValues } = this
    return html`
      <a href="../">Back</a>
      <section class="demo-section">
        <h2 class="title-large">States</h2>
        <div class="demo-row grid-5">
          <ui-checkbox
            @change="${this._changeHandler}"
            name="checkbox"
            value="unchecked"
            aria-labelledby="acu"
          ></ui-checkbox>
          <ui-checkbox
            checked
            @change="${this._changeHandler}"
            name="checkbox"
            value="Checked"
            aria-labelledby="acc"
          ></ui-checkbox>
          <ui-checkbox
            indeterminate
            @change="${this._changeHandler}"
            name="checkbox"
            value="Indeterminate"
            aria-labelledby="aci"
          ></ui-checkbox>
          <ui-checkbox
            checked
            indeterminate
            @change="${this._changeHandler}"
            name="checkbox"
            value="Checked, indeterminate"
            aria-labelledby="acci"
          ></ui-checkbox>
          <ui-checkbox
            disabled
            @change="${this._changeHandler}"
            name="checkbox"
            value="disabled"
            aria-labelledby="acd"
          ></ui-checkbox>

          <p class="label-large" id="acu">Unchecked</p>
          <p class="label-large" id="acc">Checked</p>
          <p class="label-large" id="aci">Indeterminate</p>
          <p class="label-large" id="acci">Checked, indeterminate</p>
          <p class="label-large" id="acd">Disabled</p>
        </div>
      </section>

      <section class="demo-section">
        <h2 class="title-large">Invalid checkboxes</h2>
        <div class="demo-row grid-3">
          <label class="label-large">
            <ui-checkbox
              required
              aria-required="true"
              @change="${this._changeHandler}"
              name="checkbox"
              value="error, unselected"
              invalid
            ></ui-checkbox>
            Invalid, unselected
          </label>
          <label class="label-large">
            <ui-checkbox
              required
              aria-required="true"
              checked
              @change="${this._changeHandler}"
              name="checkbox"
              value="error, selected"
              invalid
            ></ui-checkbox>
            Invalid, selected
          </label>
          <label class="label-large">
            <ui-checkbox
              required
              aria-required="true"
              indeterminate
              @change="${this._changeHandler}"
              name="checkbox"
              value="error, indeterminate"
              aria-labelledby="aci"
              invalid
            ></ui-checkbox>
            Invalid, indeterminate
          </label>
        </div>
      </section>

      <section class="demo-section">
        <h2 class="title-large">Disabled state</h2>
        <div class="demo-row grid-4">
          <ui-checkbox
            disabled
            @change="${this._changeHandler}"
            name="checkbox"
            value="disabled, unchecked"
            aria-labelledby="acdu"
          ></ui-checkbox>
          <ui-checkbox
            disabled
            checked
            @change="${this._changeHandler}"
            name="checkbox"
            value="disabled, checked"
            aria-labelledby="acdc"
          ></ui-checkbox>
          <ui-checkbox
            disabled
            invalid
            @change="${this._changeHandler}"
            name="checkbox"
            value="disabled, checked, invalid"
            aria-labelledby="acdui"
          ></ui-checkbox>
          <ui-checkbox
            disabled
            checked
            invalid
            @change="${this._changeHandler}"
            name="checkbox"
            value="disabled, checked, invalid"
            aria-labelledby="acdci"
          ></ui-checkbox>
          <p class="label-large" id="acdu">Unchecked</p>
          <p class="label-large" id="acdc">Checked</p>
          <p class="label-large" id="acdui">Unchecked, invalid</p>
          <p class="label-large" id="acdci">Checked, invalid</p>
        </div>
      </section>

      <section class="demo-section">
        <h2 class="title-large">Labels</h2>
        <div class="demo-row">
          <label class="label-large">
            <ui-checkbox
              @change="${this._changeHandler}"
              name="checkbox"
              value="custom label"
              id="customCheckbox"
              required
            ></ui-checkbox>
            Surrounded with label
          </label>
        </div>
        <div class="demo-row">
          <ui-checkbox
            @change="${this._changeHandler}"
            name="checkbox"
            value="build-in label"
            required
            id="refLabelInput"
            aria-labelledby="refLabel"
          ></ui-checkbox>
          <label class="label-large" for="refLabelInput" id="refLabel">Referenced with id/ref/aria</label>
        </div>
      </section>

      <section class="demo-section">
        <h2 class="title-large">A checkbox in a form</h2>
        <form method="get" action="#" @submit="${this._submitHandler}">
          <ui-checkbox required name="newsletter" aria-labelledby="newsletter" id="newsletterCheckbox"></ui-checkbox>
          <label class="label-medium" id="newsletter" for="newsletterCheckbox">Newsletter</label>

          <label class="label-medium">
            <ui-checkbox name="other" value="optional value"></ui-checkbox>
            Optional checkbox
          </label>

          <label class="label-medium">
            <ui-checkbox name="indeterminate" value="indeterminate value" checked indeterminate></ui-checkbox>
            Always indeterminate
          </label>

          <ui-button name="submit" value="on" type="submit">Submit</ui-button>
        </form>

        ${formValues
          ? html`
              <output>
                <code><pre>${formValues}</pre></code>
              </output>
            `
          : html``}
      </section>
    `
  }
}

const instance = new ComponentDemoPage()
instance.render()
