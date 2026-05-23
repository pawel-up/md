import { html, TemplateResult } from 'lit'
import { DemoPage } from '../../../src/demo/DemoPage.js'
import { reactive } from '../../../src/decorators/index.js'
import { HorizontalAlignment, VerticalAlignment } from '../../../src/lib/ElementPositioning.js'
import '../../../src/components/dropdown-list/ui-dropdown-list.js'
import '../../../src/components/list/ui-list.js'
import '../../../src/components/list/ui-list-item.js'
import '../../../src/components/icon-button/ui-icon-button.js'
import '../../../src/components/icons/ui-icon.js'
import '../../../src/components/button/ui-button.js'

class ComponentDemoPage extends DemoPage {
  override accessor componentName = 'UI dropdown list'

  @reactive() accessor list1Selected: string | undefined

  @reactive() accessor list2Selected: string | undefined

  @reactive() accessor list3Selected: string | undefined

  @reactive() accessor verticalAlign: VerticalAlignment | undefined

  @reactive() accessor horizontalAlign: HorizontalAlignment | undefined

  @reactive() accessor noOverlap: boolean | undefined

  list1SelectHandler(e: CustomEvent): void {
    const target = e.detail.item as HTMLElement | undefined
    if (!target) {
      return
    }
    this.list1Selected = target.dataset.item as string
  }

  list2SelectHandler(e: CustomEvent): void {
    const target = e.detail.item as HTMLElement | undefined
    if (!target) {
      return
    }
    this.list2Selected = target.dataset.item
  }

  list3SelectHandler(e: CustomEvent): void {
    const target = e.detail.item as HTMLElement | undefined
    if (!target) {
      return
    }
    this.list3Selected = target.dataset.item
  }

  noOverlapHandler(e: Event): void {
    const input = e.target as HTMLInputElement
    this.noOverlap = input.checked
  }

  verticalHandler(e: Event): void {
    const target = e.target as HTMLSelectElement
    if (target.value) {
      this.verticalAlign = target.value as VerticalAlignment
    } else {
      this.verticalAlign = undefined
    }
  }

  horizontalHandler(e: Event): void {
    const target = e.target as HTMLSelectElement
    if (target.value) {
      this.horizontalAlign = target.value as HorizontalAlignment
    } else {
      this.horizontalAlign = undefined
    }
  }

  contentTemplate(): TemplateResult {
    const { list1Selected, list2Selected, list3Selected, verticalAlign, horizontalAlign, noOverlap } = this
    return html`
      <a href="../">Back</a>
      <section class="demo-section">
        <h2 class="title-large">Icon button list</h2>

        <div class="demo-row">
          <ui-dropdown-list @select="${this.list1SelectHandler}">
            <ui-icon-button aria-label="Trigger the menu"><ui-icon icon="moreVert"></ui-icon></ui-icon-button>
            <ui-list slot="dropdown" role="menu">
              <ui-list-item role="menuitem" data-item="item 1">Item 1</ui-list-item>
              <ui-list-item role="menuitem" data-item="item 2">Item 2</ui-list-item>
              <ui-list-item role="menuitem" data-item="item 3">Item 3</ui-list-item>
              <ui-list-item role="menuitem" data-item="item 4">Item 4</ui-list-item>
            </ui-list>
          </ui-dropdown-list>
          <p>Last selected: ${list1Selected || 'none'}</p>
        </div>

        <h2 class="title-large">Button list</h2>

        <div class="demo-row">
          <ui-dropdown-list @select="${this.list2SelectHandler}">
            <ui-button color="outlined">Click me</ui-button>
            <ui-list slot="dropdown" role="menu">
              <ui-list-item role="menuitem" data-item="item 1">Item 1</ui-list-item>
              <ui-list-item role="menuitem" data-item="item 2">Item 2</ui-list-item>
              <ui-list-item role="menuitem" data-item="item 3">Item 3</ui-list-item>
              <ui-list-item role="menuitem" data-item="item 4">Item 4</ui-list-item>
            </ui-list>
          </ui-dropdown-list>
          <p>Last selected: ${list2Selected || 'none'}</p>
        </div>

        <h2 class="title-large">A list in an <code>overflow: hidden</code> element</h2>

        <div class="demo-row">
          <div class="button-in-lists">
            <ui-dropdown-list
              @select="${this.list3SelectHandler}"
              .verticalAlign="${verticalAlign}"
              .horizontalAlign="${horizontalAlign}"
              ?noOverlap="${noOverlap}"
            >
              <ui-icon-button aria-label="Trigger the menu"><ui-icon icon="moreVert"></ui-icon></ui-icon-button>
              <ui-list slot="dropdown" role="menu">
                <ui-list-item role="menuitem" data-item="item 1">Item 1</ui-list-item>
                <ui-list-item role="menuitem" data-item="item 2">Item 2</ui-list-item>
                <ui-list-item role="menuitem" data-item="item 3">Item 3</ui-list-item>
                <ui-list-item role="menuitem" data-item="item 4">Item 4</ui-list-item>
              </ui-list>
            </ui-dropdown-list>
          </div>
          <label for="verticalAlign">Vertical align</label>
          <select id="verticalAlign" @change="${this.verticalHandler}">
            <option value="">None</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="middle">Middle</option>
            <option value="auto">Auto</option>
          </select>
          <label for="horizontalAlign">Horizontal align</label>
          <select id="horizontalAlign" @change="${this.horizontalHandler}">
            <option value="">None</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="middle">Middle</option>
            <option value="auto">Auto</option>
          </select>

          <label>
            <input type="checkbox" name="noOverlap" @change="${this.noOverlapHandler}" />
            No overlap
          </label>

          <p>Last selected: ${list3Selected || 'none'}</p>
        </div>
      </section>
    `
  }
}

const instance = new ComponentDemoPage()
instance.render()
