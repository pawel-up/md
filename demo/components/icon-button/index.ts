import { html, TemplateResult } from 'lit'
import { DemoPage } from '../../../src/demo/DemoPage.js'
import IconButtonElement, { type MdIconButtonWidth } from '../../../src/components/icon-button/internals/IconButton.js'
import reactive from '../../../src/decorators/reactive.js'
import type { MdButtonSize, MdButtonShape } from '../../../src/components/button/internals/base.js'

import '../../../src/components/icon-button/ui-icon-button.js'
import '../../../src/components/icons/ui-icon.js'

class ComponentDemoPage extends DemoPage {
  override accessor componentName = 'UI icon button'

  @reactive() accessor size: MdButtonSize = 's'

  @reactive() accessor shape: MdButtonShape = 'round'

  @reactive() accessor width: MdIconButtonWidth = 'default'

  _clickHandler(e: Event): void {
    const button = e.target as IconButtonElement
    console.log(`A ${button.localName} button was clicked.`)
  }

  _activeHandler(e: Event): void {
    const button = e.target as IconButtonElement
    console.log(`A ${button.localName} button was ${button.selected ? 'activated' : 'deactivated'}`)
  }

  handleSizeChange(e: Event): void {
    const select = e.target as HTMLSelectElement
    this.size = select.value as MdButtonSize
  }

  handleShapeChange(e: Event): void {
    const select = e.target as HTMLSelectElement
    this.shape = select.value as MdButtonShape
  }

  handleWidthChange(e: Event): void {
    const select = e.target as HTMLSelectElement
    this.width = select.value as MdIconButtonWidth
  }

  readonly icon = html`<ui-icon>settings</ui-icon>`

  contentTemplate(): TemplateResult {
    const { size: s, shape: h, icon: i, width: w } = this
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
          <ui-icon-button color="filled" .size="${s}" .shape="${h}" .width="${w}">${i}</ui-icon-button>
          <ui-icon-button color="filled" .size="${s}" .shape="${h}" .width="${w}" toggle>${i}</ui-icon-button>
          <ui-icon-button color="filled" .size="${s}" .shape="${h}" .width="${w}" toggle selected>${i}</ui-icon-button>
          <span class="legend-marker">B</span>
          <ui-icon-button color="tonal" .size="${s}" .shape="${h}" .width="${w}">${i}</ui-icon-button>
          <ui-icon-button color="tonal" .size="${s}" .shape="${h}" .width="${w}" toggle>${i}</ui-icon-button>
          <ui-icon-button color="tonal" .size="${s}" .shape="${h}" .width="${w}" toggle selected>${i}</ui-icon-button>
          <span class="legend-marker">C</span>
          <ui-icon-button color="outlined" .size="${s}" .shape="${h}" .width="${w}">${i}</ui-icon-button>
          <ui-icon-button color="outlined" .size="${s}" .shape="${h}" .width="${w}" toggle>${i}</ui-icon-button>
          <ui-icon-button color="outlined" .size="${s}" .shape="${h}" .width="${w}" toggle selected
            >${i}</ui-icon-button
          >
          <span class="legend-marker">D</span>
          <ui-icon-button .size="${s}" .shape="${h}" .width="${w}">${i}</ui-icon-button>
          <ui-icon-button .size="${s}" .shape="${h}" .width="${w}" toggle>${i}</ui-icon-button>
          <ui-icon-button .size="${s}" .shape="${h}" .width="${w}" toggle selected>${i}</ui-icon-button>
        </div>
        <p class="body-medium">A. Filled, B. Tonal, C. Outlined, D. Standard</p>
        <ol class="decimal body-medium">
          <li>Default</li>
          <li>Toggle: unselected</li>
          <li>Toggle: selected</li>
        </ol>
      </section>
    `
  }

  renderConfigurationSection(): TemplateResult {
    const { size: s, shape: h, width: w } = this
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
          <label for="width">Width</label>
          <select id="width" @change="${this.handleWidthChange}" name="width" .value="${w}">
            <button>
              <selectedcontent></selectedcontent>
            </button>
            <option value="default">Default</option>
            <option value="narrow">Narrow</option>
            <option value="wide">Wide</option>
          </select>
        </div>
      </section>
    `
  }
}

const instance = new ComponentDemoPage()
instance.render()
