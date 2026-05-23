import { html, LitElement, type PropertyValues, type TemplateResult } from 'lit'
import { property, queryAssignedElements } from 'lit/decorators.js'
import type UiListItem from './ListItem.js'

const NAVIGATION_KEYS = {
  ArrowDown: 'ArrowDown',
  ArrowUp: 'ArrowUp',
  Home: 'Home',
  End: 'End',
}

const ACTIVATION_KEYS = {
  Enter: 'Enter',
  Space: ' ',
}

export interface UiListSelection {
  item: HTMLElement
  index: number
}

export interface UiListItemsChange {
  items: UiListItem[]
}

/**
 * @fires select - Dispatched when the user click or press `Enter` or `Space` on any active list item.
 *                 The `event.detail` object contains the `item` and `index` properties.
 * @fires itemschange - Dispatched when the list items change, e.g. when the slot changes.
 *                The `event.detail` object contains the `items` property with the list of items.
 * @fires highlightchange - Dispatched when the highlighted item changes.
 *                The `event.detail` object contains the `items` property with the list of items.
 */
export default class UiList extends LitElement {
  /**
   * The computed list of list items to render.
   */
  accessor items: UiListItem[] = []

  activeListItem: UiListItem | null = null

  highlightListItem: UiListItem | null = null

  /**
   * The CSS selector that is used to recognize which items are
   * active list items (can be selected, focused, etc.)
   * @attribute
   */
  @property({ type: String }) accessor selector: string

  /**
   * When set it marks last activated list item as selected.
   * @attribute
   */
  @property({ type: Boolean }) accessor selectActive: boolean | undefined

  @queryAssignedElements({ flatten: true }) protected accessor assignedElements!: HTMLElement[]

  /**
   * When set it delegates focus to the active child of a list item.
   * Used when the list has input controls like checkboxes or switches.
   * When set, the list behaves like a regular HTML (but styled) listbox
   * and does not manage focus on its own.
   * @attribute
   */
  @property({ type: Boolean }) accessor delegateFocus: boolean | undefined

  /**
   * When set, the list can be collapsed and expanded.
   * The first item acts as a header.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor collapsible: boolean | undefined

  constructor() {
    super()
    this.selector = 'ui-list-item'
    this.addEventListener('keydown', this.handleKeydown.bind(this))
    this.addEventListener('click', this.handleClick.bind(this))
    this.addEventListener('focus', this.handleFocusEvent.bind(this))
  }

  override connectedCallback(): void {
    super.connectedCallback()
    if (!this.hasAttribute('tabindex') && !this.delegateFocus) {
      this.setAttribute('tabindex', '0')
    }
  }

  override focus(options?: FocusOptions): void {
    this.handleFocus(options)
  }

  override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties)

    this.updateItems()
  }

  protected handleFocusEvent(event: FocusEvent): void {
    if (event.target !== this) {
      return
    }
    this.handleFocus()
  }

  protected handleFocus(options?: FocusOptions): void {
    if (this.activeListItem) {
      this.activeListItem.focus(options)
    } else {
      this.activateFirstItem()
    }
  }

  activateFirstItem(): void {
    this.activeListItem = this.getFirstItem()
    this.activeListItem?.activate()
  }

  activateLastItem(): void {
    this.activeListItem = this.getLastItem()
    this.activeListItem?.activate()
  }

  resetActiveListItem(): void {
    this.activeListItem = null
    this.setAttribute('tabindex', '0')
  }

  protected updateItems(): void {
    const elements = this.assignedElements || []
    const items = elements.filter(this.isListItem, this)
    this.items = items
    if (this.delegateFocus) {
      // remove tabindex from the list and items
      items.forEach((item) => item.removeAttribute('tabindex'))
    }
    if (this.activeListItem && !items.includes(this.activeListItem)) {
      this.activeListItem = null
    }
    if (this.highlightListItem && !items.includes(this.highlightListItem)) {
      this.highlightListItem = null
    }
    this.updateChildrenVisibility()
    this.dispatchEvent(
      new CustomEvent<UiListItemsChange>('itemschange', { bubbles: false, composed: false, detail: { items } })
    )
  }

  protected updateChildrenVisibility(): void {
    if (!this.collapsible) return

    const parents = new Set<string>()
    const parentToLastChild = new Map<string, UiListItem>()

    this.items.forEach((item) => {
      if (item.parent) {
        parents.add(item.parent)
        parentToLastChild.set(item.parent, item)
      }
    })

    const openParents = new Set(this.items.filter((i) => i.open).map((i) => i.id))

    this.items.forEach((item) => {
      item.group = parents.has(item.id)

      if (item.parent) {
        item.collapsed = !openParents.has(item.parent)
        item.toggleAttribute('last-in-group', parentToLastChild.get(item.parent) === item)
      } else {
        item.removeAttribute('last-in-group')
      }
    })
  }

  /**
   * @return Whether the given element is a list item element.
   */
  protected isListItem(element: Element): element is UiListItem {
    if (element.nodeType !== Node.ELEMENT_NODE) {
      return false
    }
    return element.matches(this.selector)
  }

  getFirstItem(): UiListItem {
    return this.items[0]
  }

  getLastItem(): UiListItem {
    return this.items[this.items.length - 1]
  }

  getPreviousItem(item: UiListItem): UiListItem {
    const { items } = this
    const curIndex = items.indexOf(item)
    if (curIndex < 0) {
      return item
    }
    let i = curIndex
    let result: HTMLElement | undefined
    do {
      i--
      if (i === curIndex) {
        // looped back from the end, no active element to find.
        return item
      }
      const tmp = items[i]
      if (!tmp) {
        i = items.length
        continue
      }
      if (this.isSelectable(tmp)) {
        result = tmp
      }
    } while (!result)
    return (result as UiListItem) || item
  }

  getNextItem(item: UiListItem): UiListItem {
    const { items } = this
    const curIndex = items.indexOf(item)
    if (curIndex < 0) {
      return item
    }
    let i = curIndex
    let next: HTMLElement | undefined
    do {
      i++
      if (i === curIndex) {
        // looped back from the start, no active element to find.
        return item
      }
      const tmp = items[i]
      if (!tmp) {
        i = -1
        continue
      }
      if (this.isSelectable(tmp)) {
        next = tmp
      }
    } while (!next)
    return (next as UiListItem) || item
  }

  protected isSelectable(element: HTMLElement): boolean {
    if ((element as unknown as { disabled: boolean }).disabled) {
      return false
    }
    if (element.hasAttribute('disabled')) {
      return false
    }
    if (element.hidden && element.hasAttribute('hidden')) {
      return false
    }
    if ((element as UiListItem).collapsed) {
      return false
    }
    return true
  }

  protected isListItemActive(item: UiListItem): boolean {
    return item.isActive()
  }

  protected deactivateListItem(item: UiListItem): void {
    item.deactivate()
  }

  protected activateListItem(item?: UiListItem | null): void {
    if (!item) {
      return
    }
    this.removeAttribute('tabindex')
    item.activate()
    item.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
  }

  handleKeydown(event: KeyboardEvent): void {
    if (this.delegateFocus) {
      return
    }
    if (Object.values(ACTIVATION_KEYS).includes(event.key)) {
      this.activateFromEvent(event)
      return
    }
    if (Object.values(NAVIGATION_KEYS).indexOf(event.key) === -1) return

    for (const item of this.items) {
      if (this.isListItemActive(item)) {
        this.activeListItem = item
      }

      this.deactivateListItem(item)
    }

    if (event.key === NAVIGATION_KEYS.ArrowDown) {
      event.preventDefault()
      this.activateNext()
    }

    if (event.key === NAVIGATION_KEYS.ArrowUp) {
      event.preventDefault()
      this.activatePrevious()
    }

    if (event.key === NAVIGATION_KEYS.Home) {
      event.preventDefault()
      this.activateFirst()
    }

    if (event.key === NAVIGATION_KEYS.End) {
      event.preventDefault()
      this.activateLast()
    }
  }

  activateFirst(): void {
    this.activeListItem = this.getFirstItem()
    if (this.activeListItem) {
      this.activateListItem(this.activeListItem)
    }
  }

  activateLast(): void {
    this.activeListItem = this.getLastItem()
    if (this.activeListItem) {
      this.activateListItem(this.activeListItem)
    }
  }

  activateNext(item = this.activeListItem): void {
    this.activeListItem = item ? this.getNextItem(item) : this.getFirstItem()
    if (this.activeListItem) {
      this.activateListItem(this.activeListItem)
    }
  }

  activatePrevious(item = this.activeListItem): void {
    this.activeListItem = item ? this.getPreviousItem(item) : this.getLastItem()
    if (this.activeListItem) {
      this.activateListItem(this.activeListItem)
    }
  }

  /**
   * Sets `highlight` class on the next item.
   * @param item When not set it highlights the first item. Default to `this.highlightListItem`.
   *             Pass `null` to select first item.
   */
  highlightNext(item = this.highlightListItem): void {
    const next = item ? this.getNextItem(item) : this.getFirstItem()
    this.highlightItem(next)
  }

  /**
   * Sets `highlight` class on the previous item.
   * @param item When not set it highlights the last item. Default to `this.highlightListItem`.
   *             Pass `null` to select last item.
   */
  highlightPrevious(item = this.highlightListItem): void {
    const previous = item ? this.getPreviousItem(item) : this.getLastItem()
    this.highlightItem(previous)
  }

  highlightFirst(): void {
    const item = this.getFirstItem()
    this.highlightItem(item)
  }

  highlightLast(): void {
    const item = this.getLastItem()
    this.highlightItem(item)
  }

  handleClick(event: MouseEvent): void {
    this.activateFromEvent(event)
  }

  highlightItem(item?: UiListItem | null): void {
    if (this.highlightListItem === item) {
      return
    }
    if (this.highlightListItem) {
      this.highlightListItem.classList.remove('highlight')
    }
    this.highlightListItem = item || null
    if (this.highlightListItem) {
      this.highlightListItem.classList.add('highlight')
      this.highlightListItem.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
    }
    this.dispatchEvent(
      new CustomEvent('highlightchange', { bubbles: false, composed: false, detail: { item: this.highlightListItem } })
    )
  }

  /**
   * Activates a list item from an Event.
   * Activate means dispatches a non-bubbling CustomEvent with the item in the detail.
   */
  protected activateFromEvent(e: Event): void {
    const path = e.composedPath()
    let item: UiListItem | undefined
    while (!item) {
      const next = path.shift() as Element
      if (next === this) {
        break
      }
      if (!this.isListItem(next) || !this.isSelectable(next)) {
        continue
      }
      item = next as UiListItem
    }
    if (!item) {
      return
    }
    this.manageSelection(item)
    item.activate()
    this.activeListItem = item
    e.preventDefault()
    this.notifySelect(item)
  }

  /**
   * @param item The UiListItem that is selected.
   * @returns True when the event was canceled.
   */
  notifySelect(item: UiListItem, index?: number): boolean {
    const resolvedIndex = index ?? this.items.indexOf(item)
    if (resolvedIndex === -1) {
      return false
    }
    const event = new CustomEvent<UiListSelection>('select', {
      cancelable: true,
      detail: {
        item,
        index: resolvedIndex,
      },
    })
    this.dispatchEvent(event)

    if (this.collapsible) {
      if (item.group) {
        item.open = !item.open
        this.updateChildrenVisibility()
      }
    }

    return event.defaultPrevented
  }

  protected manageSelection(item: UiListItem): void {
    if (!this.selectActive) {
      return
    }
    const { items } = this
    items.forEach((current) => current.classList.remove('select'))
    item.classList.add('select')
  }

  override render(): TemplateResult {
    return html`<slot @slotchange="${this.updateItems}"></slot>`
  }
}
