import { html, TemplateResult } from 'lit'
import { reactive } from '../../../src/decorators/index.js'
import { DemoPage } from '../../../src/demo/DemoPage.js'
import type { MdButtonShape, MdButtonSize, MdButtonColor } from '../../../src/components/button/internals/button.js'

import '../../../src/components/button/ui-button.js'
import '../../../src/components/icons/ui-icon.js'
import '../../../src/components/button/ui-button-group.js'

class ComponentDemoPage extends DemoPage {
  override accessor componentName = 'UI button group'

  @reactive() accessor size: MdButtonSize = 's'

  @reactive() accessor shape: MdButtonShape = 'round'

  @reactive() accessor color: MdButtonColor = 'filled'

  handleSizeChange(e: Event): void {
    const select = e.target as HTMLSelectElement
    this.size = select.value as MdButtonSize
  }

  handleShapeChange(e: Event): void {
    const select = e.target as HTMLSelectElement
    this.shape = select.value as MdButtonShape
  }

  handleColorChange(e: Event): void {
    const select = e.target as HTMLSelectElement
    this.color = select.value as MdButtonColor
  }

  readonly icon = html`<ui-icon slot="icon" icon="edit"></ui-icon>`

  contentTemplate(): TemplateResult {
    const { size: s, icon: i, color: c } = this
    return html`
      <a href="../">Back</a>
      ${this.renderConfigurationSection()}
      <section class="demo-section ${s}">
        <h2 class="display-large">Anatomy</h2>
        <div class="frame">
          <div class="demo-row">
            <ui-button-group size="${s}">
              <ui-button color="tonal">${i}</ui-button>
              <ui-button color="tonal">${i}</ui-button>
              <ui-button color="tonal">${i}Three</ui-button>
              <ui-button color="tonal">${i}</ui-button>
              <ui-button color="tonal">${i}</ui-button>
            </ui-button-group>
          </div>
          <div class="demo-row">
            <ui-button-group type="connected" size="${s}">
              <ui-button color="filled">${i}Label</ui-button>
              <ui-button color="filled">${i}Label</ui-button>
              <ui-button color="filled">${i}Label</ui-button>
              <ui-button color="filled">${i}Label</ui-button>
              <ui-button color="filled">${i}Label</ui-button>
            </ui-button-group>
          </div>
        </div>

        <section class="demo-section ${s}">
          <h2 class="display-large">States</h2>
          <h3 class="headline-medium">Connected button group</h3>

          <div class="frame">
            <h4 class="title-medium">Multi selection</h4>
            <div class="demo-row">
              <ui-button-group type="connected" size="${s}" multiple>
                <ui-button color="${c}" toggle>${i}Label</ui-button>
                <ui-button color="${c}" toggle>${i}Label</ui-button>
                <ui-button color="${c}" toggle>${i}Label</ui-button>
                <ui-button color="${c}" toggle>${i}Label</ui-button>
                <ui-button color="${c}" toggle>${i}Label</ui-button>
              </ui-button-group>
            </div>

            <h4 class="title-medium">Single selection</h4>
            <div class="demo-row">
              <ui-button-group type="connected" size="${s}">
                <ui-button color="${c}" toggle>${i}Label</ui-button>
                <ui-button color="${c}" toggle>${i}Label</ui-button>
                <ui-button color="${c}" toggle>${i}Label</ui-button>
                <ui-button color="${c}" toggle>${i}Label</ui-button>
                <ui-button color="${c}" toggle>${i}Label</ui-button>
              </ui-button-group>
            </div>
          </div>
        </section>

        <section class="demo-section ${s}">
          <h3 class="headline-medium">Standard button group</h3>

          <div class="frame">
            <h4 class="title-medium">Multi selection</h4>
            <div class="demo-row">
              <ui-button-group type="standard" size="${s}" multiple>
                <ui-button color="${c}" toggle>${i}Label</ui-button>
                <ui-button color="${c}" toggle>${i}Label</ui-button>
                <ui-button color="${c}" toggle>${i}Label</ui-button>
                <ui-button color="${c}" toggle>${i}Label</ui-button>
                <ui-button color="${c}" toggle>${i}Label</ui-button>
              </ui-button-group>
            </div>

            <h4 class="title-medium">Single selection</h4>
            <div class="demo-row">
              <ui-button-group type="standard" size="${s}">
                <ui-button color="${c}" toggle>${i}Label</ui-button>
                <ui-button color="${c}" toggle>${i}Label</ui-button>
                <ui-button color="${c}" toggle>${i}Label</ui-button>
                <ui-button color="${c}" toggle>${i}Label</ui-button>
                <ui-button color="${c}" toggle>${i}Label</ui-button>
              </ui-button-group>
            </div>
          </div>
        </section>
      </section>
    `
  }

  renderConfigurationSection(): TemplateResult {
    const { size: s, shape: h, color: c } = this
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
        <div class="md-select outlined">
          <label for="color">Color</label>
          <select id="color" @change="${this.handleColorChange}" name="color" .value="${c}">
            <button>
              <selectedcontent></selectedcontent>
            </button>
            <option value="elevated">Elevated</option>
            <option value="filled">Filled</option>
            <option value="outlined">Outlined</option>
            <option value="text">Text</option>
            <option value="tonal">Tonal</option>
          </select>
        </div>
      </section>
    `
  }
}

const instance = new ComponentDemoPage()
instance.render()
