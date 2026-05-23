/* eslint-disable max-len */
import { html, svg, TemplateResult } from 'lit'
import * as EventUtils from '@api-client/core/lib/events/Utils.js'
import { DemoPage } from '../../../src/demo/DemoPage.js'
import { iconWrapper } from '../../../src/components/icons/Icons.js'
import { reactive } from '../../../src/decorators/index.js'

import '../../../src/components/list/ui-expressive-list.js'
import '../../../src/components/list/ui-expressive-list-item.js'
import '../../../src/components/checkbox/ui-checkbox.js'
import '../../../src/components/button/ui-button.js'
import '../../../src/components/icons/ui-icon.js'
import '../../../src/components/icon-button/ui-icon-button.js'

const chatIcon = iconWrapper(
  svg`<path d="M6 14h8v-2H6Zm0-3h12V9H6Zm0-3h12V6H6ZM2 22V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4v12q0 .825-.587 1.413Q20.825 18 20 18H6Zm2-4.825L5.175 16H20V4H4ZM4 4v13.175Z"/>`
)

const flightIcon = iconWrapper(svg`<path d="M14 6h-2L8 4H5l1.6 4.975L3.4 12 1 12v2h4l2 1.5h8l3 3h2v-2l-3-3v-6Z"/>`)
const hotelIcon = iconWrapper(
  svg`<path d="M1 19V4h2v10h8V6h8q1.65 0 2.825 1.175Q23 8.35 23 10v9h-2v-3H3v3Zm6-6q-1.25 0-2.125-.875T4 10q0-1.25.875-2.125T7 7q1.25 0 2.125.875T10 10q0 1.25-.875 2.125T7 13Zm6 1h8v-4q0-.825-.587-1.413Q19.825 8 19 8h-6Zm-6-3q.425 0 .713-.288Q8 10.425 8 10t-.287-.713Q7.425 9 7 9t-.713.287Q6 9.575 6 10t.287.712Q6.575 11 7 11Zm0-1Zm6-2v6Z"/>`
)

const ce = EventUtils.cancelEvent

class ComponentDemoPage extends DemoPage {
  /** Items in the dynamic selectable list. Each entry is a label string. */
  @reactive() accessor dynamicItems: string[] = ['Interactive list item', 'Highlighted item', 'Selected item']

  /** Counter used to generate unique labels for new dynamic items. */
  private _itemCounter = 4

  override accessor componentName = 'UI Expressive List'

  private _addDynamicItem(): void {
    this.dynamicItems = [...this.dynamicItems, `Item ${this._itemCounter++}`]
  }

  private _removeDynamicItem(index: number): void {
    this.dynamicItems = this.dynamicItems.filter((_, i) => i !== index)
  }

  supportingText =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.'

  contentTemplate(): TemplateResult {
    return html`
      <a href="../">Back</a>
      ${this.renderSingleLine()} ${this.renderTwoLines()} ${this.renderThreeLines()} ${this.renderSelectableList()}
      ${this.renderStaticList()} ${this.renderThemedList()} ${this.renderCollapsableList()}
    `
  }

  renderSingleLine(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="display-large">Single line</h2>
        <div class="frame">
          <ui-expressive-list selectActive>
            <ui-expressive-list-item class="select">
              <ui-icon slot="start">key</ui-icon>
              user_id
              <span slot="end-text">String</span>
              <ui-icon-button color="standard" slot="end" @pointerdown="${ce}" @click="${ce}">
                <ui-icon aria-hidden="true">more_vert</ui-icon>
              </ui-icon-button>
            </ui-expressive-list-item>
            <ui-expressive-list-item>
              <ui-icon slot="start">text_fields</ui-icon>
              full_name
              <span slot="end-text">String</span>
              <ui-icon-button color="standard" slot="end" @pointerdown="${ce}" @click="${ce}">
                <ui-icon aria-hidden="true">more_vert</ui-icon>
              </ui-icon-button>
            </ui-expressive-list-item>
            <ui-expressive-list-item>
              <ui-icon slot="start">access_time</ui-icon>
              created
              <span slot="end-text">Date time</span>
              <ui-icon-button color="standard" slot="end" @pointerdown="${ce}" @click="${ce}">
                <ui-icon aria-hidden="true">more_vert</ui-icon>
              </ui-icon-button>
            </ui-expressive-list-item>
            <ui-expressive-list-item>
              <ui-icon slot="start">calendar_today</ui-icon>
              birth_date
              <span slot="end-text">Date</span>
              <ui-icon-button color="standard" slot="end" @pointerdown="${ce}" @click="${ce}">
                <ui-icon aria-hidden="true">more_vert</ui-icon>
              </ui-icon-button>
            </ui-expressive-list-item>
            <ui-expressive-list-item>
              <ui-icon slot="start">123</ui-icon>
              numeric_property
              <span slot="end-text">Number</span>
              <ui-icon-button color="standard" slot="end" @pointerdown="${ce}" @click="${ce}">
                <ui-icon aria-hidden="true">more_vert</ui-icon>
              </ui-icon-button>
            </ui-expressive-list-item>

            <ui-expressive-list-item image="avatar">
              <span slot="start" class="avatar">A</span>
              Avatar element
              <ui-checkbox slot="end" @pointerdown="${EventUtils.cancelEvent}"></ui-checkbox>
            </ui-expressive-list-item>

            <ui-expressive-list-item image="image">
              <img src="../chip/pawel6c9a.jpg" alt="Avatar" slot="start" />
              <p slot="end-text">100+</p>
              Image element
            </ui-expressive-list-item>

            <ui-expressive-list-item image="video">
              <span slot="start" class="video-image">
                <img src="../chip/pawel6c9a.jpg" alt="video" />
              </span>
              Video image element
              <ui-checkbox
                slot="end"
                @click="${EventUtils.cancelEvent}"
                @pointerdown="${EventUtils.cancelEvent}"
              ></ui-checkbox>
            </ui-expressive-list-item>
          </ui-expressive-list>
        </div>
      </section>
    `
  }

  renderTwoLines(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="display-large">Two lines</h2>
        <div class="frame">
          <ui-expressive-list>
            <ui-expressive-list-item lines="two">
              <span slot="start">${chatIcon}</span>
              Two list item with an icon
              <p slot="supporting-text">${this.supportingText}</p>
            </ui-expressive-list-item>

            <ui-expressive-list-item image="avatar" lines="two">
              <span slot="start" class="avatar">A</span>
              Avatar element
              <p slot="supporting-text">${this.supportingText}</p>
              <ui-checkbox
                slot="end"
                @click="${EventUtils.cancelEvent}"
                @pointerdown="${EventUtils.cancelEvent}"
              ></ui-checkbox>
            </ui-expressive-list-item>

            <ui-expressive-list-item image="image" lines="two">
              <img src="../chip/pawel6c9a.jpg" alt="Avatar" slot="start" />
              <p slot="end-text">100+</p>
              <p slot="supporting-text">${this.supportingText}</p>
              Image element
            </ui-expressive-list-item>

            <ui-expressive-list-item image="video" lines="two">
              <span slot="start" class="video-image">
                <img src="../chip/pawel6c9a.jpg" alt="video" />
              </span>
              <p slot="supporting-text">${this.supportingText}</p>
              Video image element
              <ui-checkbox
                slot="end"
                @click="${EventUtils.cancelEvent}"
                @pointerdown="${EventUtils.cancelEvent}"
              ></ui-checkbox>
            </ui-expressive-list-item>
          </ui-expressive-list>
        </div>
      </section>
    `
  }

  renderThreeLines(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="display-large">Three lines</h2>
        <div class="frame">
          <ui-expressive-list>
            <ui-expressive-list-item lines="three">
              <span slot="start">${chatIcon}</span>
              Three list item with an icon
              <p slot="supporting-text">${this.supportingText}</p>
            </ui-expressive-list-item>

            <ui-expressive-list-item image="avatar" lines="three">
              <span slot="start" class="avatar">A</span>
              Avatar element
              <p slot="supporting-text">${this.supportingText}</p>
              <ui-checkbox
                slot="end"
                @click="${EventUtils.cancelEvent}"
                @pointerdown="${EventUtils.cancelEvent}"
              ></ui-checkbox>
            </ui-expressive-list-item>

            <ui-expressive-list-item image="image" lines="three">
              <img src="../chip/pawel6c9a.jpg" alt="Avatar" slot="start" />
              <p slot="end-text">100+</p>
              <p slot="supporting-text">${this.supportingText}</p>
              Image element
            </ui-expressive-list-item>

            <ui-expressive-list-item image="video" lines="three">
              <span slot="start" class="video-image">
                <img src="../chip/pawel6c9a.jpg" alt="video" />
              </span>
              <p slot="supporting-text">${this.supportingText}</p>
              Video image element
              <ui-checkbox
                slot="end"
                @click="${EventUtils.cancelEvent}"
                @pointerdown="${EventUtils.cancelEvent}"
              ></ui-checkbox>
            </ui-expressive-list-item>
          </ui-expressive-list>
        </div>
      </section>
    `
  }

  renderSelectableList(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="display-large">Selectable list (dynamic)</h2>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <ui-button @click="${() => this._addDynamicItem()}">Add item</ui-button>
          <span class="label-medium">${this.dynamicItems.length} item(s)</span>
        </div>

        <div class="frame">
          <ui-expressive-list selectActive>
            ${this.dynamicItems.map(
              (label, index) => html`
                <ui-expressive-list-item image="avatar">
                  <span slot="start" class="avatar">${index + 1}</span>
                  ${label}
                  <ui-checkbox
                    slot="end"
                    @click="${EventUtils.cancelEvent}"
                    @pointerdown="${EventUtils.cancelEvent}"
                  ></ui-checkbox>
                  <ui-button
                    slot="end"
                    @click="${(e: Event) => {
                      e.stopPropagation()
                      this._removeDynamicItem(index)
                    }}"
                  >
                    ✕
                  </ui-button>
                </ui-expressive-list-item>
              `
            )}
          </ui-expressive-list>
        </div>
      </section>
    `
  }

  renderStaticList(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="display-large">Static and disabled state</h2>
        <div class="frame">
          <ui-expressive-list>
            <ui-expressive-list-item static>
              <span slot="start">${flightIcon}</span>
              Static item (no interaction)
            </ui-expressive-list-item>

            <ui-expressive-list-item image="avatar" static>
              <span slot="start" class="avatar">H</span>
              Static avatar
              <ui-checkbox slot="end" @pointerdown="${EventUtils.cancelEvent}"></ui-checkbox>
            </ui-expressive-list-item>

            <ui-expressive-list-item disabled>
              <span slot="start">${hotelIcon}</span>
              Disabled item
            </ui-expressive-list-item>

            <ui-expressive-list-item disabled>
              2000,00
              <span slot="end-text">PLN</span>
            </ui-expressive-list-item>
          </ui-expressive-list>
        </div>
      </section>
    `
  }

  renderThemedList(): TemplateResult {
    // style="--md-sys-color-surface: #1e1e1e; --md-sys-color-on-surface: #e3e3e3; --md-sys-color-surface-variant: #444746; --md-sys-color-on-surface-variant: #c4c7c5; --md-sys-color-outline-variant: #444746;"
    return html`
      <section class="demo-section">
        <h2 class="display-large">Themed list</h2>
        <div class="frame themed">
          <ui-expressive-list selectActive>
            <ui-expressive-list-item class="select">
              <ui-icon slot="start">key</ui-icon>
              user_id
              <span slot="end-text">String</span>
              <ui-icon-button color="standard" slot="end" @pointerdown="${ce}" @click="${ce}">
                <ui-icon aria-hidden="true">more_vert</ui-icon>
              </ui-icon-button>
            </ui-expressive-list-item>
            <ui-expressive-list-item>
              <ui-icon slot="start">text_fields</ui-icon>
              full_name
              <span slot="end-text">String</span>
              <ui-icon-button color="standard" slot="end" @pointerdown="${ce}" @click="${ce}">
                <ui-icon aria-hidden="true">more_vert</ui-icon>
              </ui-icon-button>
            </ui-expressive-list-item>
            <ui-expressive-list-item>
              <ui-icon slot="start">access_time</ui-icon>
              created
              <span slot="end-text">Date time</span>
              <ui-icon-button color="standard" slot="end" @pointerdown="${ce}" @click="${ce}">
                <ui-icon aria-hidden="true">more_vert</ui-icon>
              </ui-icon-button>
            </ui-expressive-list-item>
            <ui-expressive-list-item>
              <ui-icon slot="start">calendar_today</ui-icon>
              birth_date
              <span slot="end-text">Date</span>
              <ui-icon-button color="standard" slot="end" @pointerdown="${ce}" @click="${ce}">
                <ui-icon aria-hidden="true">more_vert</ui-icon>
              </ui-icon-button>
            </ui-expressive-list-item>
            <ui-expressive-list-item>
              <ui-icon slot="start">123</ui-icon>
              numeric_property
              <span slot="end-text">Number</span>
              <ui-icon-button color="standard" slot="end" @pointerdown="${ce}" @click="${ce}">
                <ui-icon aria-hidden="true">more_vert</ui-icon>
              </ui-icon-button>
            </ui-expressive-list-item>
          </ui-expressive-list>
        </div>
      </section>
    `
  }

  renderCollapsableList(): TemplateResult {
    return html`
      <section class="demo-section">
        <h2 class="display-large">Collapsable list</h2>
        <div class="frame themed">
          <ui-expressive-list collapsible>
            <ui-expressive-list-item id="parent-1" open>
              Parent item 1
              <ui-icon-button slot="end" width="narrow">
                <ui-icon aria-hidden="true">keyboard_arrow_up</ui-icon>
              </ui-icon-button>
            </ui-expressive-list-item>
            <ui-expressive-list-item parent="parent-1">Child item 1</ui-expressive-list-item>
            <ui-expressive-list-item parent="parent-1">Child item 2</ui-expressive-list-item>
            <ui-expressive-list-item parent="parent-1">Child item 3</ui-expressive-list-item>
            <ui-expressive-list-item id="parent-2">
              Parent item 2
              <ui-icon-button slot="end" width="narrow">
                <ui-icon aria-hidden="true">keyboard_arrow_up</ui-icon>
              </ui-icon-button>
            </ui-expressive-list-item>
            <ui-expressive-list-item parent="parent-2">Child item 1</ui-expressive-list-item>
            <ui-expressive-list-item parent="parent-2">Child item 2</ui-expressive-list-item>
            <ui-expressive-list-item parent="parent-2">Child item 3</ui-expressive-list-item>
            <ui-expressive-list-item parent="parent-2">Child item 4</ui-expressive-list-item>
            <ui-expressive-list-item parent="parent-2">Child item 5</ui-expressive-list-item>
            <ui-expressive-list-item parent="parent-2">Child item 6</ui-expressive-list-item>
            <ui-expressive-list-item parent="parent-2">Child item 7</ui-expressive-list-item>
            <ui-expressive-list-item parent="parent-2">Child item 8</ui-expressive-list-item>
            <ui-expressive-list-item parent="parent-2">Child item 9</ui-expressive-list-item>
            <ui-expressive-list-item parent="parent-2">Child item 10</ui-expressive-list-item>
            <ui-expressive-list-item id="parent-3">
              Parent item 3
              <ui-icon-button slot="end" width="narrow">
                <ui-icon aria-hidden="true">keyboard_arrow_up</ui-icon>
              </ui-icon-button>
            </ui-expressive-list-item>
            <ui-expressive-list-item parent="parent-3">Child item 1</ui-expressive-list-item>
            <ui-expressive-list-item parent="parent-3">Child item 2</ui-expressive-list-item>
            <ui-expressive-list-item parent="parent-3">Child item 3</ui-expressive-list-item>
            <ui-expressive-list-item>Item not in group</ui-expressive-list-item>
          </ui-expressive-list>
        </div>
      </section>
    `
  }
}

const instance = new ComponentDemoPage()
instance.render()
