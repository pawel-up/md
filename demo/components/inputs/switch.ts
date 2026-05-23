import { html, TemplateResult } from 'lit'
import '../../../src/components/switch/ui-switch.js'
import SwitchElement from '../../../src/components/switch/internals/SwitchElement.js'
import { cancel as cancelIcon, info as infoIcon } from '../../../src/components/icons/Icons.js'
import { DemoPage } from '../../../src/demo/DemoPage.js'
import { reactive } from '../../../src/decorators/index.js'

class ComponentDemoPage extends DemoPage {
  override accessor componentName = 'API switch'

  @reactive() accessor formValues: string | undefined

  _changeHandler(e: Event): void {
    const button = e.target as SwitchElement
    console.log(`Log: ${button.value} switch was clicked.`)
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
        <div class="demo-row grid-3">
          <ui-switch @change="${this._changeHandler}" name="switch" value="unchecked" aria-labelledby="acu"></ui-switch>
          <ui-switch
            checked
            @change="${this._changeHandler}"
            name="switch"
            value="Checked"
            aria-labelledby="acc"
          ></ui-switch>
          <ui-switch
            disabled
            @change="${this._changeHandler}"
            name="switch"
            value="disabled"
            aria-labelledby="acd"
          ></ui-switch>

          <p class="label-large" id="acu">Unchecked</p>
          <p class="label-large" id="acc">Checked</p>
          <p class="label-large" id="acd">Disabled</p>
        </div>
      </section>

      <section class="demo-section">
        <h2 class="title-large">Disabled state</h2>
        <div class="demo-row grid-2">
          <ui-switch
            disabled
            @change="${this._changeHandler}"
            name="checkbox"
            value="disabled, unchecked"
            aria-labelledby="acdu"
          ></ui-switch>
          <ui-switch
            disabled
            checked
            @change="${this._changeHandler}"
            name="checkbox"
            value="disabled, checked"
            aria-labelledby="acdc"
          ></ui-switch>
          <p class="label-large" id="acdu">Unchecked</p>
          <p class="label-large" id="acdc">Checked</p>
        </div>
      </section>

      <section class="demo-section">
        <h2 class="title-large">Icons</h2>
        <div class="demo-row grid-4">
          <ui-switch
            onIcon
            checked
            @change="${this._changeHandler}"
            name="checkbox"
            value="on-icon only"
            aria-labelledby="asoni"
          ></ui-switch>
          <ui-switch
            offIcon
            @change="${this._changeHandler}"
            name="checkbox"
            value="off-icon only"
            aria-labelledby="asoffi"
          ></ui-switch>
          <ui-switch
            onIcon
            offIcon
            @change="${this._changeHandler}"
            name="checkbox"
            value="all icons"
            aria-labelledby="asi"
          ></ui-switch>
          <ui-switch
            onIcon
            offIcon
            .onIconInstance="${infoIcon}"
            .offIconInstance="${cancelIcon}"
            @change="${this._changeHandler}"
            name="checkbox"
            value="custom icons"
            aria-labelledby="asci"
          ></ui-switch>
          <p class="label-large" id="asoni">On icon only</p>
          <p class="label-large" id="asoffi">Off icon only</p>
          <p class="label-large" id="asi">Both icons</p>
          <p class="label-large" id="asci">Custom icons</p>
        </div>
      </section>

      <section class="demo-section">
        <h2 class="title-large">A switch in a form</h2>
        <form method="get" action="#" @submit="${this._submitHandler}">
          <ui-switch name="switch" aria-labelledby="switch" id="switchCheckbox"></ui-switch>
          <label class="label-medium" id="switch" for="switchCheckbox">Newsletter</label>

          <ui-button color="filled" name="submit" value="on" type="submit">Submit</ui-button>
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
