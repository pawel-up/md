import { html, TemplateResult } from 'lit'
import { DemoPage } from '../../../src/demo/DemoPage.js'
import '../../../src/components/focus-ring/ui-focus-ring.js'

class ComponentDemoPage extends DemoPage {
  override accessor componentName = 'Focus Ring'

  contentTemplate(): TemplateResult {
    return html` <a href="../">Back</a> ${this.renderBasic()} ${this.renderInward()} ${this.renderCustomStyles()}
      ${this.renderInputElements()} ${this.renderCard()}`
  }

  renderBasic(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Default Focus Ring</h2>
        <p>
          The focus ring can be used to provide a visible focus indicator for any element. It automatically manages
          visibility based on the focus state of the control element.
        </p>

        <div class="demo-container">
          <button id="button1" class="demo-button">
            <ui-focus-ring for="button1"></ui-focus-ring>
            Button with Focus Ring
          </button>
        </div>
      </section>
    `
  }

  renderInward(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Inward Focus Ring</h2>
        <p>The inward focus ring is positioned inside the control bounds, providing a different visual style.</p>

        <div class="demo-container">
          <button id="button2" class="demo-button">
            <ui-focus-ring for="button2" inward></ui-focus-ring>
            Button with Inward Focus Ring
          </button>
        </div>
      </section>
    `
  }

  renderCustomStyles(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Custom Styled Focus Ring</h2>
        <p>The custom focus ring is styled with different colors and widths.</p>

        <div class="demo-container">
          <button id="button3" class="demo-button custom-focus">
            <ui-focus-ring for="button3"></ui-focus-ring>
            Button with Custom Colors
          </button>
        </div>
      </section>
    `
  }

  renderBorderStyles(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Different Border Styles</h2>

        <div class="demo-container">
          <button id="button4" class="demo-button dashed-focus">
            <ui-focus-ring for="button4"></ui-focus-ring>
            Dashed Focus Ring
          </button>

          <button id="button5" class="demo-button thick-focus">
            <ui-focus-ring for="button5"></ui-focus-ring>
            Thick Focus Ring
          </button>
        </div>
      </section>
    `
  }

  renderInputElements(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Input Elements</h2>

        <div class="demo-container">
          <div class="input-container">
            <input id="input1" type="text" placeholder="Text input with focus ring" class="demo-input" />
            <ui-focus-ring for="input1"></ui-focus-ring>
          </div>

          <div class="input-container">
            <textarea id="textarea1" placeholder="Textarea with focus ring" class="demo-textarea"></textarea>
            <ui-focus-ring for="textarea1"></ui-focus-ring>
          </div>
        </div>
      </section>
    `
  }

  renderCard(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Card with Focus Ring</h2>

        <div class="demo-container">
          <div id="card1" class="demo-card" tabindex="0">
            <ui-focus-ring for="card1"></ui-focus-ring>
            <h4>Focusable Card</h4>
            <p>This card can receive focus and shows a focus ring.</p>
          </div>
        </div>
      </section>
    `
  }
}
const instance = new ComponentDemoPage()
instance.render()
