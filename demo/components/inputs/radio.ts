import { html, TemplateResult } from 'lit'
import '../../../src/components/radio/ui-radio.js'
import { DemoPage } from '../../../src/demo/DemoPage.js'
import { reactive } from '../../../src/decorators/index.js'
import RadioElement from '../../../src/components/radio/internals/RadioElement.js'

class ComponentDemoPage extends DemoPage {
  override accessor componentName = 'UI radio'

  @reactive() accessor formValues: string | undefined

  _changeHandler(e: Event): void {
    const button = e.target as RadioElement
    console.log(`Log: ${button.name} with value ${button.value} radio was changed.`)
  }

  _submitHandler(e: SubmitEvent): void {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const values = Array.from(new FormData(form)) as string[][]

    const serialized = new URLSearchParams(values).toString()
    this.formValues = `${serialized}&time=${Date.now()}`
  }

  contentTemplate(): TemplateResult {
    const { formValues } = this
    return html`
      <a href="../">Back</a>
      <section class="demo-section">
        <h2 class="title-large">States</h2>
        <div class="demo-row grid-4">
          <ui-radio
            name="demo"
            value="unchecked"
            checked
            aria-labelledby="aru"
            @change="${this._changeHandler}"
          ></ui-radio>
          <ui-radio
            name="demo"
            value="checked"
            checked
            aria-labelledby="arc"
            @change="${this._changeHandler}"
          ></ui-radio>
          <ui-radio
            name="demo1"
            value="disabled"
            disabled
            aria-labelledby="ard"
            @change="${this._changeHandler}"
          ></ui-radio>
          <ui-radio
            name="demo1"
            value="disabled,checked"
            disabled
            checked
            aria-labelledby="ardc"
            @change="${this._changeHandler}"
          ></ui-radio>

          <p class="label-large" id="aru">Unchecked</p>
          <p class="label-large" id="arc">Checked</p>
          <p class="label-large" id="ard">Disabled</p>
          <p class="label-large" id="ardc">Disabled, checked</p>
        </div>
      </section>

      <section class="demo-section">
        <h2 class="title-large">Mixed groups</h2>
        <div class="demo-row grid-4">
          <label class="label-medium">
            <ui-radio name="group1" value="a" @change="${this._changeHandler}"></ui-radio>
            Group 1, A
          </label>
          <label class="label-medium">
            <ui-radio name="group1" value="b" @change="${this._changeHandler}"></ui-radio>
            Group 1, B
          </label>
          <label class="label-medium">
            <ui-radio name="group2" value="a" @change="${this._changeHandler}"></ui-radio>
            Group 2, A
          </label>
          <label class="label-medium">
            <ui-radio name="group2" value="b" @change="${this._changeHandler}"></ui-radio>
            Group 2, B
          </label>
        </div>
      </section>

      <section class="demo-section">
        <h2 class="title-large">HTML form example</h2>
        <form method="get" action="#" @submit="${this._submitHandler}">
          <div class="grid-3">
            <label class="label-medium">
              <input type="radio" name="group-1" value="A" required />
              Group 1, A
            </label>
            <label class="label-medium">
              <input type="radio" name="group-1" value="B" />
              Group 1, B
            </label>
            <label class="label-medium">
              <input type="radio" name="group-1" value="C" />
              Group 1, C
            </label>
          </div>

          <div class="grid-3">
            <label class="label-medium">
              <ui-radio name="group-2" value="A" required></ui-radio>
              Group 2, A
            </label>
            <label class="label-medium">
              <ui-radio name="group-2" value="B"></ui-radio>
              Group 2, B
            </label>
            <label class="label-medium">
              <ui-radio name="group-2" value="C" required></ui-radio>
              Group 2, C
            </label>
          </div>

          <div class="grid-3">
            <label class="label-medium">
              <ui-radio name="group-3" value="A" required disabled></ui-radio>
              Group 3, A
            </label>
            <label class="label-medium">
              <ui-radio name="group-3" value="B" required></ui-radio>
              Group 3, B
            </label>
            <label class="label-medium">
              <ui-radio name="group-3" value="C" required></ui-radio>
              Group 3, C
            </label>
          </div>

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
