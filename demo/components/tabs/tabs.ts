import { html, svg, TemplateResult } from 'lit'
import { DemoPage } from '../../../src/demo/DemoPage.js'
import '../../../src/components/tabs/ui-tab.js'
import '../../../src/components/tabs/ui-tabs.js'
import '../../../src/components/icons/ui-icon.js'
import { iconWrapper } from '../../../src/components/icons/Icons.js'
import { reactive } from '../../../src/decorators/index.js'
import { TabSelectionDetail } from '../../../src/components/tabs/internals/Tabs.js'

const travelIcon = iconWrapper(
  svg`<path d="M8.5 22v-1.5l2-1.5v-5.5L2 16v-2l8.5-5V3.5q0-.625.438-1.062Q11.375 2 12 2t1.062.438q.438.437.438 1.062V9l8.5 5v2l-8.5-2.5V19l2 1.5V22L12 21Z"/>`
)
const hotelIcon = iconWrapper(
  svg`<path d="M1 19V4h2v10h8V6h8q1.65 0 2.825 1.175Q23 8.35 23 10v9h-2v-3H3v3Zm6-6q-1.25 0-2.125-.875T4 10q0-1.25.875-2.125T7 7q1.25 0 2.125.875T10 10q0 1.25-.875 2.125T7 13Zm6 1h8v-4q0-.825-.587-1.413Q19.825 8 19 8h-6Zm-6-3q.425 0 .713-.288Q8 10.425 8 10t-.287-.713Q7.425 9 7 9t-.713.287Q6 9.575 6 10t.287.712Q6.575 11 7 11Zm0-1Zm6-2v6Z"/>`
)
const cityIcon = iconWrapper(
  svg`<path d="M3 21V7h6V5l3-3 3 3v6h6v10Zm2-2h2v-2H5Zm0-4h2v-2H5Zm0-4h2V9H5Zm6 8h2v-2h-2Zm0-4h2v-2h-2Zm0-4h2V9h-2Zm0-4h2V5h-2Zm6 12h2v-2h-2Zm0-4h2v-2h-2Z"/>`
)
const taxiIcon = iconWrapper(
  svg`<path d="M6 19v1q0 .425-.287.712Q5.425 21 5 21H4q-.425 0-.712-.288Q3 20.425 3 20v-8l2.1-6q.15-.45.538-.725Q6.025 5 6.5 5H9V3h6v2h2.5q.475 0 .863.275.387.275.537.725l2.1 6v8q0 .425-.288.712Q20.425 21 20 21h-1q-.425 0-.712-.288Q18 20.425 18 20v-1Zm-.2-9h12.4l-1.05-3H6.85ZM5 12v5Zm2.5 4q.625 0 1.062-.438Q9 15.125 9 14.5t-.438-1.062Q8.125 13 7.5 13t-1.062.438Q6 13.875 6 14.5t.438 1.062Q6.875 16 7.5 16Zm9 0q.625 0 1.062-.438Q18 15.125 18 14.5t-.438-1.062Q17.125 13 16.5 13t-1.062.438Q15 13.875 15 14.5t.438 1.062Q15.875 16 16.5 16ZM5 17h14v-5H5Z"/>`
)

class ComponentDemoPage extends DemoPage {
  override accessor componentName = 'UI tabs'

  @reactive() accessor selected1 = 'travel1'

  @reactive() accessor selected2 = 'hotel2'

  @reactive() accessor selected3 = 'travelHotel3'

  @reactive() accessor selected4 = 'cars4'

  @reactive() accessor selected5 = 'travel5'
  @reactive() accessor selected6 = 'travel6'
  @reactive() accessor selected7 = 'travel7'

  handleTabsChange(e: CustomEvent): void {
    const info = e.detail as TabSelectionDetail
    console.log(info)
    const property = (e.target as HTMLElement).dataset.property as 'selected1' | undefined
    if (!property) {
      return
    }
    this[property] = info.item.getAttribute('aria-controls') || ''
  }

  contentTemplate(): TemplateResult {
    return html`
      <a href="../">Back</a>
      ${this.renderPrimaryDemo()} ${this.renderSecondaryTabs()} ${this.renderIconTabs()} ${this.renderScrollableDemo()}
      ${this.renderThemedTabs()}
    `
  }

  renderPrimaryDemo(): TemplateResult {
    const { selected1 } = this
    return html`
      <section class="demo-section">
        <h2 class="display-large">Primary tabs</h2>

        <div class="frame">
          <ui-tabs data-property="selected1" @change="${this.handleTabsChange}">
            <ui-tab aria-controls="travel1">Travel</ui-tab>
            <ui-tab aria-controls="hotel1">Hotel</ui-tab>
            <ui-tab aria-controls="travelHotel1">Travel + Hotel</ui-tab>
            <ui-tab aria-controls="cars1">Cars</ui-tab>
          </ui-tabs>

          <div class="page">
            <p id="travel1" ?hidden="${selected1 !== 'travel1'}">Travel page</p>
            <p id="hotel1" ?hidden="${selected1 !== 'hotel1'}">Hotel page</p>
            <p id="travelHotel1" ?hidden="${selected1 !== 'travelHotel1'}">Hotel & travel page</p>
            <p id="cars1" ?hidden="${selected1 !== 'cars1'}">Cars page</p>
          </div>
        </div>
      </section>
    `
  }

  renderSecondaryTabs(): TemplateResult {
    const { selected2 } = this
    return html`
      <section class="demo-section">
        <h2 class="display-large">Secondary tabs</h2>

        <div class="frame">
          <ui-tabs priority="secondary" data-property="selected2" @change="${this.handleTabsChange}">
            <ui-tab aria-controls="travel2">Travel</ui-tab>
            <ui-tab aria-controls="hotel2" selected>Hotel</ui-tab>
            <ui-tab aria-controls="travelHotel2">Travel + Hotel</ui-tab>
            <ui-tab aria-controls="cars2">Cars</ui-tab>
          </ui-tabs>

          <div class="page">
            <p id="travel2" ?hidden="${selected2 !== 'travel2'}">Travel page</p>
            <p id="hotel2" ?hidden="${selected2 !== 'hotel2'}">Hotel page</p>
            <p id="travelHotel2" ?hidden="${selected2 !== 'travelHotel2'}">Hotel & travel page</p>
            <p id="cars2" ?hidden="${selected2 !== 'cars2'}">Cars page</p>
          </div>
        </div>
      </section>
    `
  }

  renderIconTabs(): TemplateResult {
    const { selected3, selected4 } = this
    return html`
      <section class="demo-section">
        <h2 class="display-large">Primary icon tabs</h2>
        <div class="frame">
          <ui-tabs data-property="selected3" @change="${this.handleTabsChange}">
            <ui-tab aria-controls="travel3">
              <ui-icon slot="icon">${travelIcon}</ui-icon>
              Travel
            </ui-tab>
            <ui-tab aria-controls="hotel3">
              <ui-icon slot="icon">${hotelIcon}</ui-icon>
              Hotel
            </ui-tab>
            <ui-tab aria-controls="travelHotel3" selected>
              <ui-icon slot="icon">${cityIcon}</ui-icon>
              Travel + Hotel
            </ui-tab>
            <ui-tab aria-controls="cars3">
              <ui-icon slot="icon">${taxiIcon}</ui-icon>
              Cars
            </ui-tab>
          </ui-tabs>
          <div class="page">
            <p id="travel3" ?hidden="${selected3 !== 'travel3'}">Travel page</p>
            <p id="hotel3" ?hidden="${selected3 !== 'hotel3'}">Hotel page</p>
            <p id="travelHotel3" ?hidden="${selected3 !== 'travelHotel3'}">Hotel & travel page</p>
            <p id="cars3" ?hidden="${selected3 !== 'cars3'}">Cars page</p>
          </div>
        </div>
      </section>
      <section class="demo-section">
        <h2 class="display-large">Secondary icon tabs</h2>

        <div class="frame">
          <ui-tabs priority="secondary" data-property="selected4" @change="${this.handleTabsChange}">
            <ui-tab aria-controls="travel4">
              <ui-icon slot="icon">${travelIcon}</ui-icon>
              Travel
            </ui-tab>
            <ui-tab aria-controls="hotel4">
              <ui-icon slot="icon">${hotelIcon}</ui-icon>
              Hotel
            </ui-tab>
            <ui-tab aria-controls="travelHotel4">
              <ui-icon slot="icon">${cityIcon}</ui-icon>
              Travel + Hotel
            </ui-tab>
            <ui-tab aria-controls="cars4" selected>
              <ui-icon slot="icon">${taxiIcon}</ui-icon>
              Cars
            </ui-tab>
          </ui-tabs>
          <div class="page">
            <p id="travel4" ?hidden="${selected4 !== 'travel4'}">Travel page</p>
            <p id="hotel4" ?hidden="${selected4 !== 'hotel4'}">Hotel page</p>
            <p id="travelHotel4" ?hidden="${selected4 !== 'travelHotel4'}">Hotel & travel page</p>
            <p id="cars4" ?hidden="${selected4 !== 'cars4'}">Cars page</p>
          </div>
        </div>
      </section>
    `
  }

  renderScrollableDemo(): TemplateResult {
    const { selected5 } = this
    return html`
      <section class="demo-section">
        <h2 class="display-large">Scrollable tabs</h2>
        <div class="frame scrollable">
          <ui-tabs data-property="selected5" @change="${this.handleTabsChange}">
            <ui-tab aria-controls="travel5" selected>Travel</ui-tab>
            <ui-tab aria-controls="hotel5">Hotel</ui-tab>
            <ui-tab aria-controls="travelHotel5">Travel + Hotel</ui-tab>
            <ui-tab aria-controls="cars5" disabled>Cars</ui-tab>

            <ui-tab aria-controls="travel51">Travel (1)</ui-tab>
            <ui-tab aria-controls="hotel51">Hotel (1)</ui-tab>
            <ui-tab aria-controls="travelHotel51">Travel + Hotel (1)</ui-tab>
            <ui-tab aria-controls="cars51" disabled>Cars (1)</ui-tab>

            <ui-tab aria-controls="travel52">Travel (2)</ui-tab>
            <ui-tab aria-controls="hotel52">Hotel (2)</ui-tab>
            <ui-tab aria-controls="travelHotel52">Travel + Hotel (2)</ui-tab>
            <ui-tab aria-controls="cars52" disabled>Cars (2)</ui-tab>
          </ui-tabs>

          <div class="page">
            <p id="travel5" ?hidden="${selected5 !== 'travel5'}">Travel page</p>
            <p id="hotel5" ?hidden="${selected5 !== 'hotel5'}">Hotel page</p>
            <p id="travelHotel5" ?hidden="${selected5 !== 'travelHotel5'}">Hotel & travel page</p>
            <p id="cars5" ?hidden="${selected5 !== 'cars5'}">Cars page</p>

            <p id="travel51" ?hidden="${selected5 !== 'travel51'}">Travel page (1)</p>
            <p id="hotel51" ?hidden="${selected5 !== 'hotel51'}">Hotel page (1)</p>
            <p id="travelHotel51" ?hidden="${selected5 !== 'travelHotel51'}">Hotel & travel page (1)</p>
            <p id="cars51" ?hidden="${selected5 !== 'cars51'}">Cars page (1)</p>

            <p id="travel52" ?hidden="${selected5 !== 'travel52'}">Travel page (2)</p>
            <p id="hotel52" ?hidden="${selected5 !== 'hotel52'}">Hotel page (2)</p>
            <p id="travelHotel52" ?hidden="${selected5 !== 'travelHotel52'}">Hotel & travel page (2)</p>
            <p id="cars52" ?hidden="${selected5 !== 'cars52'}">Cars page (2)</p>
          </div>
        </div>
      </section>
    `
  }

  renderThemedTabs(): TemplateResult {
    const { selected6, selected7 } = this
    return html`
      <section class="demo-section">
        <h2 class="display-large">Themed tabs</h2>

        <div class="frame themed">
          <ui-tabs data-property="selected6" @change="${this.handleTabsChange}">
            <ui-tab aria-controls="travel6">Travel</ui-tab>
            <ui-tab aria-controls="hotel6">Hotel</ui-tab>
            <ui-tab aria-controls="travelHotel6">Travel + Hotel</ui-tab>
            <ui-tab aria-controls="cars6">Cars</ui-tab>
          </ui-tabs>

          <div class="page">
            <p id="travel6" ?hidden="${selected6 !== 'travel6'}">Travel page</p>
            <p id="hotel6" ?hidden="${selected6 !== 'hotel6'}">Hotel page</p>
            <p id="travelHotel6" ?hidden="${selected6 !== 'travelHotel6'}">Hotel & travel page</p>
            <p id="cars6" ?hidden="${selected6 !== 'cars6'}">Cars page</p>
          </div>
        </div>

        <div class="frame themed">
          <ui-tabs priority="secondary" data-property="selected7" @change="${this.handleTabsChange}">
            <ui-tab aria-controls="travel7">Travel</ui-tab>
            <ui-tab aria-controls="hotel7" selected>Hotel</ui-tab>
            <ui-tab aria-controls="travelHotel7">Travel + Hotel</ui-tab>
            <ui-tab aria-controls="cars7">Cars</ui-tab>
          </ui-tabs>

          <div class="page">
            <p id="travel7" ?hidden="${selected7 !== 'travel7'}">Travel page</p>
            <p id="hotel7" ?hidden="${selected7 !== 'hotel7'}">Hotel page</p>
            <p id="travelHotel7" ?hidden="${selected7 !== 'travelHotel7'}">Hotel & travel page</p>
            <p id="cars7" ?hidden="${selected7 !== 'cars7'}">Cars page</p>
          </div>
        </div>
      </section>
    `
  }
}

const instance = new ComponentDemoPage()
instance.render()
