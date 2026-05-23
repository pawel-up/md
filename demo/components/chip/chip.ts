import { html, svg, TemplateResult } from 'lit'
import { iconWrapper } from '../../../src/components/icons/Icons.js'
import type UiChip from '../../../src/components/chip/internals/Chip.js'
import { DemoPage } from '../../../src/demo/DemoPage.js'
import '../../../src/components/chip/ui-chip.js'
import '../../../src/components/chip/ui-chip-set.js'
import '../../../src/components/icons/ui-icon.js'

const calendarIcon = iconWrapper(
  svg`<path d="M17 22v-3h-3v-2h3v-3h2v3h3v2h-3v3ZM5 20q-.825 0-1.413-.587Q3 18.825 3 18V6q0-.825.587-1.412Q4.175 4 5 4h1V2h2v2h6V2h2v2h1q.825 0 1.413.588Q19 5.175 19 6v6.1q-.5-.075-1-.075t-1 .075V10H5v8h7q0 .5.075 1t.275 1ZM5 8h12V6H5Zm0 0V6v2Z"/>`
)

class ComponentDemoPage extends DemoPage {
  override accessor componentName = 'UI chip'

  handleClickHandler(e: Event): void {
    const chip = e.target as UiChip
    console.log(`A ${chip.type} chip was clicked.`)
  }

  handleClose(e: Event): void {
    const chip = e.target as UiChip
    console.log(`A ${chip.type} chip was closed.`)
  }

  handleList(e: Event): void {
    const chip = e.target as UiChip
    console.log(`A ${chip.type} chip requested to trigger a list.`)
  }

  handleSelect(e: Event): void {
    const chip = e.target as UiChip
    console.log('A filter chip was selected, current state is', chip.checked)
  }

  contentTemplate(): TemplateResult {
    return html`
      <a href="../">Back</a>
      <section class="demo-section">
        <h2 class="display-large">Assist chip</h2>

        <div class="grid-5">
          <span>&nbsp</span>
          <span class="column-title title-medium">Regular</span>
          <span class="column-title title-medium">Icon</span>
          <span class="column-title title-medium">Avatar</span>
          <span class="column-title title-medium">Elevated</span>

          <span class="row-name title-small">Enabled</span>
          <ui-chip type="assist" @click="${this.handleClickHandler}">Assist</ui-chip>
          <ui-chip type="assist" @click="${this.handleClickHandler}">
            <ui-icon slot="icon">${calendarIcon}</ui-icon>
            Assist
          </ui-chip>
          <ui-chip type="assist" @click="${this.handleClickHandler}">
            <img src="./pawel6c9a.jpg" slot="avatar" alt="Pawel Psztyc" />
            Assist
          </ui-chip>
          <ui-chip type="assist" @click="${this.handleClickHandler}" elevated>
            <ui-icon slot="icon">${calendarIcon}</ui-icon>Assist
          </ui-chip>

          <span class="row-name title-small">Disabled</span>
          <ui-chip type="assist" disabled @click="${this.handleClickHandler}">Assist</ui-chip>
          <ui-chip type="assist" @click="${this.handleClickHandler}" disabled>
            <ui-icon slot="icon">${calendarIcon}</ui-icon>
            Assist
          </ui-chip>
          <ui-chip type="assist" disabled @click="${this.handleClickHandler}">
            <img src="./pawel6c9a.jpg" slot="avatar" alt="Pawel Psztyc" />
            Assist
          </ui-chip>
          <ui-chip type="assist" @click="${this.handleClickHandler}" disabled elevated>
            <ui-icon slot="icon">${calendarIcon}</ui-icon>
            Assist
          </ui-chip>
        </div>
      </section>

      <section class="demo-section">
        <h2 class="display-large">Filter chip</h2>
        <div class="grid-5">
          <span>&nbsp</span>
          <span class="column-title title-medium">Unchecked</span>
          <span class="column-title title-medium">Checked</span>
          <span class="column-title title-medium">List</span>
          <span class="column-title title-medium">Elevated</span>

          <span class="row-name title-small">Enabled</span>
          <ui-chip type="filter" @click="${this.handleClickHandler}" @select="${this.handleSelect}">Filter</ui-chip>
          <ui-chip type="filter" checked @click="${this.handleClickHandler}" @select="${this.handleSelect}"
            >Filter</ui-chip
          >
          <ui-chip
            type="filter"
            list
            @click="${this.handleClickHandler}"
            @list="${this.handleList}"
            @select="${this.handleSelect}"
            >Other</ui-chip
          >
          <ui-chip
            type="filter"
            list
            elevated
            @click="${this.handleClickHandler}"
            @list="${this.handleList}"
            @select="${this.handleSelect}"
            >Other</ui-chip
          >

          <span class="row-name title-small">Disabled</span>
          <ui-chip type="filter" disabled @click="${this.handleClickHandler}" @select="${this.handleSelect}"
            >Filter</ui-chip
          >
          <ui-chip type="filter" disabled checked @click="${this.handleClickHandler}" @select="${this.handleSelect}"
            >Filter</ui-chip
          >
          <ui-chip
            type="filter"
            list
            disabled
            @click="${this.handleClickHandler}"
            @list="${this.handleList}"
            @select="${this.handleSelect}"
            >Other</ui-chip
          >
          <ui-chip
            type="filter"
            list
            elevated
            disabled
            @click="${this.handleClickHandler}"
            @list="${this.handleList}"
            @select="${this.handleSelect}"
            >Other</ui-chip
          >
        </div>
      </section>

      <section class="demo-section">
        <h2 class="display-large">Input chip</h2>

        <div class="grid-5">
          <span>&nbsp</span>
          <span class="column-title title-medium">Regular</span>
          <span class="column-title title-medium">removable</span>
          <span class="column-title title-medium">Disabled</span>
          <span class="column-title title-medium">Elevated</span>

          <span class="row-name title-small">Regular</span>
          <ui-chip type="input" @click="${this.handleClickHandler}">Input</ui-chip>
          <ui-chip type="input" removable @click="${this.handleClickHandler}" @close="${this.handleClose}"
            >Input</ui-chip
          >
          <ui-chip type="input" disabled @click="${this.handleClickHandler}">Input</ui-chip>
          <ui-chip type="input" elevated @click="${this.handleClickHandler}">Input</ui-chip>

          <span class="row-name title-small">With icon</span>
          <ui-chip type="input" @click="${this.handleClickHandler}">
            <ui-icon slot="icon">${calendarIcon}</ui-icon>
            Input
          </ui-chip>
          <ui-chip type="input" @click="${this.handleClickHandler}" removable @close="${this.handleClose}">
            <ui-icon slot="icon">${calendarIcon}</ui-icon>
            Input
          </ui-chip>
          <ui-chip type="input" @click="${this.handleClickHandler}" removable disabled @close="${this.handleClose}">
            <ui-icon slot="icon">${calendarIcon}</ui-icon>
            Input
          </ui-chip>
          <ui-chip type="input" @click="${this.handleClickHandler}" removable elevated @close="${this.handleClose}">
            <ui-icon slot="icon">${calendarIcon}</ui-icon>
            Input
          </ui-chip>

          <span class="row-name title-small">With avatar</span>
          <ui-chip type="input" @click="${this.handleClickHandler}">
            <img src="./pawel6c9a.jpg" slot="avatar" alt="Pawel Psztyc" />
            Input
          </ui-chip>
          <ui-chip type="input" @click="${this.handleClickHandler}" removable @close="${this.handleClose}">
            <img src="./pawel6c9a.jpg" slot="avatar" alt="Pawel Psztyc" />
            Input
          </ui-chip>
          <ui-chip type="input" @click="${this.handleClickHandler}" removable disabled @close="${this.handleClose}">
            <img src="./pawel6c9a.jpg" slot="avatar" alt="Pawel Psztyc" />
            Input
          </ui-chip>
          <ui-chip type="input" @click="${this.handleClickHandler}" removable elevated @close="${this.handleClose}">
            <img src="./pawel6c9a.jpg" slot="avatar" alt="Pawel Psztyc" />
            Input
          </ui-chip>
        </div>
      </section>

      <section class="demo-section">
        <h2 class="display-large">Suggestion chip</h2>
        <div class="demo-row grid-3 frame">
          <ui-chip type="suggestion" @click="${this.handleClickHandler}">Enabled</ui-chip>
          <ui-chip type="suggestion" @click="${this.handleClickHandler}" elevated>Elevated</ui-chip>
          <ui-chip type="suggestion" disabled @click="${this.handleClickHandler}">Disabled</ui-chip>
        </div>
      </section>

      <section class="demo-section">
        <h2 class="display-large">Chip set</h2>
        <ui-chip-set>
          <ui-chip type="input" @click="${this.handleClickHandler}" removable>Input</ui-chip>
          <ui-chip type="input" @click="${this.handleClickHandler}" removable>Input</ui-chip>
          <ui-chip type="input" @click="${this.handleClickHandler}" removable>Input</ui-chip>
        </ui-chip-set>
      </section>
    `
  }
}

const instance = new ComponentDemoPage()
instance.render()
