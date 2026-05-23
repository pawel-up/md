import { html, TemplateResult } from 'lit'
import { DemoPage } from '../../../src/demo/DemoPage.js'

import '../../../src/components/listbox/ui-listbox.js'
import '../../../src/components/list/ui-list-item.js'

class ComponentDemoPage extends DemoPage {
  override accessor componentName = 'UI listbox'

  contentTemplate(): TemplateResult {
    return html`
      <a href="../">Back</a>
      <section class="demo-section">
        <h2 class="title-large">Listbox</h2>
        <ui-listbox>
          <ui-list-item role="menuitem" data-item="item 1">Item 1</ui-list-item>
          <ui-list-item role="menuitem" data-item="item 2">Item 2</ui-list-item>
          <ui-list-item role="menuitem" data-item="item 3">Item 3</ui-list-item>
          <ui-list-item role="menuitem" data-item="item 4">Item 4</ui-list-item>
        </ui-listbox>
      </section>
    `
  }
}

const instance = new ComponentDemoPage()
instance.render()
