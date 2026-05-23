/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { html, TemplateResult } from 'lit'
import { DemoPage } from '../../../src/demo/DemoPage.js'
import '../../../src/components/progress/ui-progress.js'
import '../../../src/components/progress/ui-circular-progress.js'
import '../../../src/components/button/ui-button.js'

class ComponentDemoPage extends DemoPage {
  override accessor componentName = 'UI progress'

  repeat = 0

  maxRepeat = 5

  animating = false

  startProgress(): void {
    const progress = document.querySelector('ui-progress')!
    const button = document.querySelector('ui-button')!
    this.repeat = 0
    progress.value = progress.min
    progress.style.setProperty('--ui-progress-scale-duration', '0')
    button.disabled = true
    if (!this.animating) {
      this.nextProgress()
    }
  }

  nextProgress(): void {
    const progress = document.querySelector('ui-progress')!
    const button = document.querySelector('ui-button')!
    this.animating = true
    if (progress.value < progress.max) {
      progress.value += progress.step || 1
    } else {
      if (++this.repeat >= this.maxRepeat) {
        this.animating = false
        button.disabled = false
        return
      }
      progress.value = progress.min
    }
    requestAnimationFrame(this.nextProgress.bind(this))
  }

  contentTemplate(): TemplateResult {
    return html`
      <a href="../">Back</a>
      ${this.imperativeTemplate()} ${this.indeterminateTemplate()} ${this.styledTemplate()} ${this.disabledTemplate()}
      ${this.secondaryTemplate()} ${this.circularProgressTemplate()} ${this.circularProgressIndeterminateTemplate()}
    `
  }

  imperativeTemplate(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Imperative control</h2>
        <p>
          Once started, loops 5 times before stopping.
          <ui-button color="elevated" @click="${this.startProgress}" id="start">Start</ui-button>
        </p>
        <ui-progress id="progress" aria-label="Imperative control"></ui-progress>
      </section>
    `
  }

  indeterminateTemplate(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Indeterminate value</h2>
        <div class="demo-row">
          <ui-progress indeterminate aria-label="indeterminate progress"></ui-progress>
        </div>
        <div class="demo-row">
          <ui-progress indeterminate class="slow" aria-label="slow indeterminate progress"></ui-progress>
        </div>
      </section>
    `
  }

  styledTemplate(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Styling</h2>
        <div class="demo-row">
          <ui-progress
            value="40"
            secondaryProgress="80"
            class="blue"
            aria-label="Blue progress with a secondary progress"
          ></ui-progress>
        </div>
        <div class="demo-row">
          <ui-progress value="800" min="100" max="1000" class="red" aria-label="Red progress"></ui-progress>
        </div>
        <div class="demo-row">
          <ui-progress value="60" class="green" aria-label="green progress"></ui-progress>
        </div>
      </section>
    `
  }

  disabledTemplate(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Disabled state</h2>
        <div class="demo-row">
          <ui-progress value="40" secondaryProgress="80" disabled aria-label="Disabled progress"></ui-progress>
        </div>
        <div class="demo-row">
          <ui-progress indeterminate disabled aria-label="Disabled indeterminate progress"></ui-progress>
        </div>
      </section>
    `
  }

  secondaryTemplate(): TemplateResult {
    return html`
      <section class="demo-section secondary">
        <h2 class="title-large">Timeline</h2>
        <p>0 - 12 (Δ 12)</p>
        <ui-progress value="0" secondaryProgress="12" max="328" aria-label="Value 1"></ui-progress>
        <p>12 - 15 (Δ 3)</p>
        <ui-progress value="12" secondaryProgress="15" max="328" aria-label="Value 2"></ui-progress>
        <p>15 - 204 (Δ ${204 - 15})</p>
        <ui-progress value="15" secondaryProgress="204" max="328" aria-label="Value 3"></ui-progress>
        <p>204 - 254 (Δ ${254 - 204})</p>
        <ui-progress value="204" secondaryProgress="254" max="328" aria-label="Value 4"></ui-progress>
        <p>254 - 254 (Δ 0)</p>
        <ui-progress value="254" secondaryProgress="254" max="328" aria-label="Value 5"></ui-progress>
        <p>254 - 328 (Δ ${328 - 254})</p>
        <ui-progress value="254" secondaryProgress="328" max="328" aria-label="Value 6"></ui-progress>
      </section>
    `
  }

  circularProgressTemplate(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Circular Progress</h2>
        <div class="demo-row">
          <ui-circular-progress value="40" max="100" aria-label="Circular progress"></ui-circular-progress>
        </div>
      </section>
    `
  }

  circularProgressIndeterminateTemplate(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="title-large">Circular Indeterminate Progress</h2>
        <div class="demo-row">
          <ui-circular-progress indeterminate aria-label="Circular indeterminate progress"></ui-circular-progress>
        </div>
      </section>
    `
  }
}

const instance = new ComponentDemoPage()
instance.render()
