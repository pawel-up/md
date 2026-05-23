import { randomString } from '@api-client/core/lib/math/Random.js'
import { query } from 'lit/decorators.js'
import UiList from '../../list/internals/List.js'
import UiListItem from '../../list/internals/ListItem.js'

/**
 * The listbox is used for lists from which a user may select one or more items which are static and,
 * unlike HTML <select> elements, may contain images.
 *
 * Note, this will automatically set `role` to `option` and `aria-selected` to `false` on each child
 * that is a valid list item.
 *
 * TODO:
 * - define a checkbox item, space toggle a checkbox.
 */
export default class UiListbox extends UiList {
  @query('[aria-selected=true]') protected accessor ariaSelectedElement!: UiListItem

  override connectedCallback(): void {
    super.connectedCallback()
    this.setAttribute('role', 'listbox')
  }

  protected override updateItems(): void {
    super.updateItems()
    this.items.forEach((i) => {
      if (!this.isListItem(i)) {
        return
      }
      if (i.getAttribute('role') !== 'option') {
        i.setAttribute('role', 'option')
      }
      if (i.hasAttribute('aria-selected')) {
        i.setAttribute('aria-selected', 'false')
      }
    })
  }

  protected beforeActivation(): void {
    this.removeAttribute('aria-activedescendant')
    const active = this.ariaSelectedElement
    if (active) {
      active.setAttribute('aria-selected', 'false')
    }
  }

  protected afterActivation(item?: UiListItem | null): void {
    if (!item) {
      return
    }
    item.setAttribute('aria-selected', 'true')
    if (!item.id) {
      item.id = `option-${randomString(4)}`
    }
    this.setAttribute('aria-activedescendant', item.id)
  }

  override highlightItem(item?: UiListItem | null): void {
    this.beforeActivation()
    super.highlightItem(item)
    this.afterActivation(this.highlightListItem)
  }

  override activateListItem(item: UiListItem | null): void {
    this.beforeActivation()
    super.activateListItem(item)
    this.afterActivation(this.activeListItem)
  }
}
