import { html, TemplateResult } from 'lit'
import { reactive } from '../../../src/decorators/index.js'
import type ButtonElement from '../../../src/components/button/internals/button.js'
import { DemoPage } from '../../../src/demo/DemoPage.js'
import type { MdButtonShape, MdButtonSize, MdButtonColor } from '../../../src/components/button/internals/button.js'

import '../../../src/components/button/ui-button.js'
import '../../../src/components/icons/ui-icon.js'
import '../../../src/components/dialog/ui-dialog.js'
import '../../../src/components/text-field/ui-outlined-text-field.js'
import '../../../src/components/text-field/ui-filled-text-field.js'

class ComponentDemoPage extends DemoPage {
  override accessor componentName = 'UI button'

  @reactive() accessor formValues: string | undefined

  @reactive() accessor dialogOpened = false

  @reactive() accessor size: MdButtonSize = 's'

  @reactive() accessor shape: MdButtonShape = 'round'

  _clickHandler(e: Event): void {
    const button = e.target as ButtonElement
    console.log(`A ${button.type} button was clicked.`)
  }

  _submitHandler(e: SubmitEvent): void {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const values = Array.from(new FormData(form)) as string[][]

    const serialized = new URLSearchParams(values).toString()
    this.formValues = serialized
    this.dialogOpened = false
  }

  openDialog(): void {
    this.dialogOpened = true
  }

  dialogClosed(): void {
    this.dialogOpened = false
  }

  handleSizeChange(e: Event): void {
    const select = e.target as HTMLSelectElement
    this.size = select.value as MdButtonSize
  }

  handleShapeChange(e: Event): void {
    const select = e.target as HTMLSelectElement
    this.shape = select.value as MdButtonShape
  }

  readonly icon = html`<ui-icon slot="icon" icon="edit"></ui-icon>`

  contentTemplate(): TemplateResult {
    const { size: s, shape: h, icon: i } = this
    return html`
      <a href="../">Back</a>
      ${this.renderConfigurationSection()}
      <section class="demo-section ${s}">
        <h2 class="display-large">Color</h2>
        <div class="color-grid">
          <span>&nbsp</span>
          <span class="legend-marker">1</span>
          <span class="legend-marker">2</span>
          <span class="legend-marker">3</span>
          <span class="legend-marker">A</span>
          <ui-button color="elevated" .size="${s}" .shape="${h}">${i}elevated button</ui-button>
          <ui-button color="elevated" .size="${s}" .shape="${h}" toggle>${i}elevated unselected</ui-button>
          <ui-button color="elevated" .size="${s}" .shape="${h}" toggle selected>${i}elevated selected</ui-button>
          <span class="legend-marker">B</span>
          <ui-button color="filled" .size="${s}" .shape="${h}">${i}filled button</ui-button>
          <ui-button color="filled" .size="${s}" .shape="${h}" toggle>${i}filled unselected</ui-button>
          <ui-button color="filled" .size="${s}" .shape="${h}" toggle selected>${i}filled selected</ui-button>
          <span class="legend-marker">C</span>
          <ui-button color="tonal" .size="${s}" .shape="${h}">${i}tonal button</ui-button>
          <ui-button color="tonal" .size="${s}" .shape="${h}" toggle>${i}tonal unselected</ui-button>
          <ui-button color="tonal" .size="${s}" .shape="${h}" toggle selected>${i}tonal selected</ui-button>
          <span class="legend-marker">D</span>
          <ui-button color="outlined" .size="${s}" .shape="${h}">${i}outlined button</ui-button>
          <ui-button color="outlined" .size="${s}" .shape="${h}" toggle>${i}outlined unselected</ui-button>
          <ui-button color="outlined" .size="${s}" .shape="${h}" toggle selected>${i}outlined selected</ui-button>
          <span class="legend-marker">E</span>
          <ui-button color="text" .size="${s}" .shape="${h}">${i}text button</ui-button>
        </div>
        <p class="body-medium">A. Elevated, B. Filled, C. Tonal, D. Outlined, E. Text</p>
        <ol class="decimal body-medium">
          <li>Default</li>
          <li>Toggle: unselected</li>
          <li>Toggle: selected</li>
        </ol>
      </section>

      ${this.renderStatesSection('elevated')} ${this.renderStatesSection('filled')} ${this.renderStatesSection('tonal')}
      ${this.renderStatesSection('outlined')}

      <section class="demo-section ${s}">
        <h3 class="headline-medium">Text button states</h3>

        <div class="state-grid">
          <span>&nbsp</span>
          <span class="legend-marker">1</span>
          <span></span>
          <span></span>
          <span class="legend-marker">A</span>
          <ui-button color="text" .size="${s}" .shape="${h}">enabled</ui-button>
          <span></span>
          <span></span>
          <span class="legend-marker">B</span>
          <ui-button color="text" .size="${s}" .shape="${h}" disabled>disabled</ui-button>
          <span></span>
          <span></span>
        </div>
        <p class="body-medium">A. Enabled, B. Disabled</p>
        <ol class="decimal body-medium">
          <li>Default</li>
        </ol>
      </section>

      <section class="demo-section ${s}">
        <h2 class="display-large">A submit button within a form</h2>
        <div class="frame">
          <form method="GET" action="#" @submit="${this._submitHandler}">
            <label for="formInput">An input</label>
            <input type="text" id="formInput" required name="input" />
            <label for="checkboxInput">A checkbox</label>
            <input type="checkbox" id="checkboxInput" name="flag" />
            <ui-button name="submit" value="on" type="submit">Submit</ui-button>
          </form>
        </div>
      </section>

      <section class="demo-section ${s}">
        <h2 class="display-large">A submit button outside a form</h2>
        <div class="frame">
          <form method="GET" action="#" @submit="${this._submitHandler}" id="myForm">
            <label for="formInput">An input</label>
            <input type="text" id="formInput" required name="input" />
            <label for="checkboxInput">A checkbox</label>
            <input type="checkbox" id="checkboxInput" name="flag" />
          </form>
          <div>
            <ui-button name="submit" value="on" type="submit" form="myForm">Submit</ui-button>
          </div>
        </div>
      </section>

      <section class="demo-section ${s}">
        <h2 class="display-large">Buttons in a dialog</h2>
        <div class="frame">
          <ui-button @click="${this.openDialog}">Open dialog</ui-button>
        </div>
        <ui-dialog ?open="${this.dialogOpened}" @close="${this.dialogClosed}" modal>
          <span slot="title">Dialog with a form</span>
          <form method="GET" action="#" @submit="${this._submitHandler}" id="dialogForm">
            <label for="formInput">An input</label>
            <input type="text" id="formInput" required name="input" />
            <label for="checkboxInput">A checkbox</label>
            <input type="checkbox" id="checkboxInput" name="flag" />
          </form>
          <ui-button color="text" slot="button" value="dismiss">Dismiss</ui-button>
          <ui-button color="text" slot="button" name="submit" value="confirm" type="submit" form="dialogForm"
            >Submit</ui-button
          >
        </ui-dialog>
      </section>

      ${this.formValues
        ? html`
            <output>
              <code><pre>${this.formValues}</pre></code>
            </output>
          `
        : html``}
    `
  }

  renderStatesSection(type: MdButtonColor): TemplateResult {
    const { size: s, shape: h } = this
    return html`
      <section class="demo-section ${s}">
        <h3 class="headline-medium">${type} button states</h3>

        <div class="state-grid">
          <span>&nbsp</span>
          <span class="legend-marker">1</span>
          <span class="legend-marker">2</span>
          <span class="legend-marker">3</span>
          <span class="legend-marker">A</span>
          <ui-button color="${type}" .size="${s}" .shape="${h}">enabled</ui-button>
          <ui-button color="${type}" .size="${s}" .shape="${h}" toggle>enabled</ui-button>
          <ui-button color="${type}" .size="${s}" .shape="${h}" toggle selected>enabled</ui-button>
          <span class="legend-marker">B</span>
          <ui-button color="${type}" .size="${s}" .shape="${h}" disabled>disabled</ui-button>
          <ui-button color="${type}" .size="${s}" .shape="${h}" toggle disabled>disabled</ui-button>
          <ui-button color="${type}" .size="${s}" .shape="${h}" toggle selected disabled>disabled</ui-button>
        </div>
        <p class="body-medium">A. Enabled, B. Disabled</p>
        <ol class="decimal body-medium">
          <li>Default</li>
          <li>Toggle: unselected</li>
          <li>Toggle: selected</li>
        </ol>
      </section>
    `
  }

  renderConfigurationSection(): TemplateResult {
    const { size: s, shape: h } = this
    return html`
      <section class="demo-section">
        <h2 class="title-large">Configuration</h2>
        <div class="md-select outlined">
          <label for="size">Size</label>
          <select class="md-select" id="size" @change="${this.handleSizeChange}" name="size" .value="${s}">
            <button>
              <selectedcontent></selectedcontent>
            </button>
            <option value="xs">Extra small</option>
            <option value="s">Small</option>
            <option value="m">Medium</option>
            <option value="l">Large</option>
            <option value="xl">Extra large</option>
          </select>
        </div>
        <div class="md-select outlined">
          <label for="shape">Shape</label>
          <select id="shape" @change="${this.handleShapeChange}" name="shape" .value="${h}">
            <button>
              <selectedcontent></selectedcontent>
            </button>
            <option value="round">Round</option>
            <option value="square">Square</option>
          </select>
        </div>
      </section>
    `
  }
}

const instance = new ComponentDemoPage()
instance.render()
