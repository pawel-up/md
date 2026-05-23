import { html, TemplateResult } from 'lit'
import '../../../src/components/segmented-button/ui-segmented-button.js'
import '../../../src/components/segmented-button/ui-segmented-button-set.js'
import '../../../src/components/icons/ui-icon.js'
import { DemoPage } from '../../../src/demo/DemoPage.js'

class ComponentDemoPage extends DemoPage {
  override accessor componentName = 'UI segmented buttons'

  contentTemplate(): TemplateResult {
    return html`
      <a href="../">Back</a>
      <section class="demo-section">
        <h2 class="title-large">Single selection buttons</h2>
        <div class="demo-row">
          <ui-segmented-button-set>
            <ui-segmented-button>Option 1</ui-segmented-button>
            <ui-segmented-button>Option 2</ui-segmented-button>
            <ui-segmented-button>Option 3</ui-segmented-button>
          </ui-segmented-button-set>
        </div>

        <h2 class="title-large">Preselected button (multi)</h2>
        <div class="demo-row">
          <ui-segmented-button-set multiselect>
            <ui-segmented-button>Driving</ui-segmented-button>
            <ui-segmented-button selected>Public transport</ui-segmented-button>
            <ui-segmented-button>Biking</ui-segmented-button>
          </ui-segmented-button-set>
        </div>

        <h2 class="title-large">Icons</h2>
        <div class="demo-row">
          <ui-segmented-button-set>
            <ui-segmented-button>
              Option 1
              <ui-icon slot="icon" icon="add"></ui-icon>
            </ui-segmented-button>
            <ui-segmented-button>
              Option 2
              <ui-icon slot="icon" icon="deleteOutline"></ui-icon>
            </ui-segmented-button>
            <ui-segmented-button>
              Option 3
              <ui-icon slot="icon" icon="cancel"></ui-icon>
            </ui-segmented-button>
          </ui-segmented-button-set>
        </div>
      </section>
    `
  }
}

const instance = new ComponentDemoPage()
instance.render()
