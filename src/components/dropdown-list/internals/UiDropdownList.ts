import { randomId } from '../../../lib/random.js'
import { html, LitElement, PropertyValues, TemplateResult } from 'lit'
import { property, queryAssignedElements, state } from 'lit/decorators.js'
import { ClassInfo, classMap } from 'lit/directives/class-map.js'
import { StyleInfo, styleMap } from 'lit/directives/style-map.js'
import { positionOverlay, type HorizontalAlignment, type VerticalAlignment } from '../../../lib/ElementPositioning.js'
import * as ScrollHelper from '../../../lib/ScrollHelper.js'

const itemRole = ['menuitem', 'menuitemcheckbox', 'menuitemradio']

export interface UiDropdownListSelection {
  item: HTMLElement
}

/**
 * An overlay list rendered over a button.
 *
 * Examples:
 *
 * <ui-dropdown-list>
 *  <ui-button color="filled">Click me</ui-button>
 *  <ui-list slot="dropdown" role="menu">
 *    <ui-list-item role="menuitem">Item 1</ui-list-item>
 *    <ui-list-item role="menuitem">Item 2</ui-list-item>
 *  </ui-list>
 * </ui-dropdown-list>
 *
 * @slot - The default slot for the dropdown trigger (button)
 * @slot dropdown - The slot for the list.
 * @fires select - Custom event with the selected item on the `detail.item` when the user selected an item.
 *                 When the event is cancelled then there's no side effects (closing the dropdown)
 * @fires dropdownopen - An event informing other dropdowns that this one was opened and other should close.
 * @fires open - An event dispatched when the open state change through a user interaction
 */
export default class UiDropdownList extends LitElement {
  @queryAssignedElements()
  protected accessor triggers!: HTMLElement[]

  @queryAssignedElements({ slot: 'dropdown' })
  protected accessor dropdowns!: HTMLElement[]

  @state() protected accessor triggerId = `ui-trigger-${randomId()}`

  @state() protected accessor menuId = `ui-menu-${randomId()}`

  /**
   * Whether the menu is opened.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor open = false

  /**
   * The vertical (y-axis) alignment of the dropdown content.
   * - top
   * - bottom
   * - middle
   *
   * No value means the natural position according to the box model.
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor verticalAlign: VerticalAlignment | undefined

  /**
   * The horizontal (x-axis) alignment of the dropdown content.
   * - top
   * - bottom
   * - middle
   *
   * No value means the natural position according to the box model.
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor horizontalAlign: HorizontalAlignment | undefined

  /**
   * Affects the `horizontal` and `vertical` positioning so that the target element does not overlap with the anchor.
   * For example, when the `vertical` align is `top`, the top edge of the target will be rendered at the bottom
   * of the anchor down to the edge of the viewport.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) accessor noOverlap: boolean | undefined

  /**
   * When set it closes the opened list when registering a click outside the list.
   * @attribute
   */
  @property({ type: Boolean }) accessor closeOnOutsideClick: boolean | undefined

  /**
   * When set it makes the drop-down to match the width of the trigger.
   * Be careful as this may crop the content when the trigger is not wide enough.
   * @attribute
   */
  @property({ type: Boolean }) accessor matchTriggerWidth: boolean | undefined

  /**
   * When set it closes the drop-down when `tab` button is pressed.
   * This is not a default behavior since the drop-down content can have its own logic
   * related to tab index.
   */
  @property({ type: Boolean }) accessor closeOnTab: boolean | undefined

  /**
   * The first element located in the default slot.
   */
  protected get trigger(): HTMLElement | null {
    const { triggers } = this
    if (!triggers || !triggers.length) {
      return null
    }
    const [button] = triggers
    return button
  }

  /**
   * The first element located in the "dropdown" slot.
   */
  protected get dropdown(): HTMLElement | null {
    const { dropdowns } = this
    if (!dropdowns || !dropdowns.length) {
      return null
    }
    const [content] = dropdowns
    return content
  }

  @state() protected accessor overlayPositioning: StyleInfo | undefined

  /**
   * Flag set to true when the dropdown is closed via an interaction that
   * shouldn't restore focus to the trigger (such as clicking outside or
   * another dropdown opening).
   */
  protected _blockFocusRestore = false

  constructor() {
    super()
    this.dropdownOpenHandler = this.dropdownOpenHandler.bind(this)
    this.scrollHandler = this.scrollHandler.bind(this)
    this.clickHandler = this.clickHandler.bind(this)
    this.verticalAlign = 'auto'
  }

  override connectedCallback(): void {
    super.connectedCallback()
    window.addEventListener('dropdownopen', this.dropdownOpenHandler)
    window.addEventListener('click', this.clickHandler, { capture: true })
    ScrollHelper.addListeners(this, this.scrollHandler)

    this.setAttribute('aria-haspopup', 'menu')
    this.setAttribute('aria-expanded', 'false')
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    window.removeEventListener('dropdownopen', this.dropdownOpenHandler)
    window.removeEventListener('click', this.clickHandler, { capture: true })
    ScrollHelper.removeListeners(this)
  }

  protected dropdownOpenHandler(e: Event): void {
    if (!this.open) {
      return
    }
    const [source] = e.composedPath()
    if (source === this) {
      return
    }
    this._blockFocusRestore = true
    this.close()
  }

  protected override willUpdate(cp: PropertyValues<this>): void {
    super.willUpdate(cp)
    if ((cp.has('noOverlap') || cp.has('verticalAlign') || cp.has('horizontalAlign') || cp.has('open')) && this.open) {
      this.computePositioning()
    }
  }

  protected override updated(cp: PropertyValues<this>): void {
    super.updated(cp)
    if (cp.has('open') && cp.get('open') !== undefined) {
      // When undefined then the component is initializing.
      // In that case, we don't want to trigger opened/closed handlers since
      // they manage focus.
      this.toggleOpened()
      this.updateExpanded()
      // this.manageTabindex()
    }
  }

  protected updateExpanded(): void {
    this.setAttribute('aria-expanded', String(this.open))
  }

  protected triggerChanged(): void {
    const { trigger } = this
    if (!trigger) {
      return
    }
    this.decorateTrigger(trigger)
  }

  protected dropdownChanged(): void {
    const { dropdown } = this
    if (!dropdown) {
      return
    }
    this.decorateDropdown(dropdown)
  }

  /**
   * Decorates the trigger with aria attributes.
   */
  protected decorateTrigger(button: HTMLElement): void {
    button.setAttribute('aria-controls', this.menuId)
    button.setAttribute('tabindex', '0')
    if (button.id) {
      this.triggerId = button.id
    } else {
      button.id = this.triggerId
    }
  }

  protected decorateDropdown(list: HTMLElement): void {
    if (!list.hasAttribute('role')) {
      list.setAttribute('role', 'menu')
    }
    if (!list.hasAttribute('aria-labelledby')) {
      list.setAttribute('aria-labelledby', this.triggerId)
    }
    list.setAttribute('tabindex', '-1')
    list.id = this.menuId
  }

  protected triggerClickHandler(): void {
    this.open = !this.open
    this.notifyOpen()
  }

  protected triggerKeyDownHandler(e: KeyboardEvent): void {
    if (['Enter', 'Space', 'ArrowDown', 'ArrowUp'].includes(e.code)) {
      e.preventDefault()
      this.open = true
      this.notifyOpen()
    }
  }

  protected contentKeyDownHandler(e: KeyboardEvent): void {
    if (['Enter', 'Space'].includes(e.code)) {
      // The UiList cancels the event when an item is selected
      this.activate(e)
      return
    }
    if (e.defaultPrevented) {
      return
    }
    if (e.code === 'Escape') {
      this.close()
    } else if (e.code === 'Tab') {
      if (this.closeOnTab) {
        this._blockFocusRestore = true
        this.close()
      }
    }
  }

  protected contentClickHandler(e: PointerEvent): void {
    this.activate(e)
  }

  close(): void {
    this.open = false
    this.notifyOpen()
  }

  protected contentCloseHandler(e: Event): void {
    e.stopPropagation()
    this.close()
  }

  /**
   * Since the container for the dropdown content is positioned as fixed
   * we need to position the dropdown according to the configured rules.
   */
  protected computePositioning(): void {
    const { trigger, dropdown } = this
    if (!trigger || !dropdown) {
      return
    }
    this.overlayPositioning = positionOverlay(dropdown, trigger, {
      horizontal: this.horizontalAlign,
      vertical: this.verticalAlign,
      noOverlap: this.noOverlap,
      constrain: true,
      constrainPaddingY: 20,
      matchAnchorWidth: this.matchTriggerWidth,
    })
  }

  protected scrollHandler(): void {
    if (this.open) {
      this.computePositioning()
    }
  }

  protected clickHandler(e: Event): void {
    if (!this.open || !this.closeOnOutsideClick) {
      return
    }
    const inside = e.composedPath().some((i) => i === this)
    if (inside) {
      return
    }
    this._blockFocusRestore = true
    this.close()
  }

  protected toggleOpened(): void {
    const { open } = this
    if (open) {
      this.handleOpened()
    } else {
      this.handleClosed()
    }
  }

  /**
   * When set, it is the last active child of the dropdown
   * before the tabindex was removed from it. It is used to restore focus
   * when the dropdown is re-opened.
   */
  lastActiveChild?: HTMLElement

  /**
   * When the list is closed, the tabindex of the dropdown is removed to prevent
   * it from being focused while invisible.
   */
  protected manageTabindex(): void {
    const { dropdown } = this
    if (!dropdown) {
      return
    }
    if (this.open) {
      if (this.lastActiveChild) {
        this.lastActiveChild.setAttribute('tabindex', '0')
        this.lastActiveChild.focus()
        this.lastActiveChild = undefined
      } else {
        // If no last active child, focus the dropdown itself
        dropdown.setAttribute('tabindex', '0')
      }
    } else {
      // const activeChild = dropdown.querySelector(':focus') || dropdown
      // this.lastActiveChild = activeChild as HTMLElement
      // activeChild.removeAttribute('tabindex')
      this.trigger?.focus()
    }
  }

  /**
   * Checks whether the element is disabled.
   */
  protected isElementDisabled(el: HTMLElement): boolean {
    const item = el as unknown as { disabled?: boolean }
    if (item.disabled) {
      return true
    }
    if (el.hasAttribute('disabled')) {
      return true
    }
    return el.getAttribute('aria-disabled') === 'true'
  }

  protected handleOpened(): void {
    this._blockFocusRestore = false
    const { trigger, dropdown } = this
    if (trigger) {
      trigger.removeAttribute('tabindex')
    }
    if (this.lastActiveChild && !this.isElementDisabled(this.lastActiveChild)) {
      this.lastActiveChild.setAttribute('tabindex', '0')
      this.lastActiveChild.focus()
      this.lastActiveChild = undefined
    } else if (dropdown) {
      this.lastActiveChild = undefined
      dropdown.setAttribute('tabindex', '0')
      dropdown.focus()
    }
  }

  protected handleClosed(): void {
    const { trigger, dropdown } = this
    if (trigger) {
      trigger.setAttribute('tabindex', '0')
      if (!this._blockFocusRestore) {
        trigger.focus()
      }
    }
    this._blockFocusRestore = false
    if (dropdown) {
      const activeChild = dropdown.querySelector('[tabindex="0"]')
      if (activeChild) {
        const activeElement = activeChild as HTMLElement
        if (!this.isElementDisabled(activeElement)) {
          this.lastActiveChild = activeElement
        } else {
          this.lastActiveChild = undefined
        }
        activeChild.removeAttribute('tabindex')
      }
      dropdown.removeAttribute('tabindex')
    }
  }

  protected activate(e: Event): void {
    // if (e.defaultPrevented) {
    //   We now cancel the event in the menu list
    //   return
    // }
    const path = e.composedPath()
    let item: HTMLElement | undefined
    while (!item) {
      const next = path.shift() as Element
      if (next === this) {
        break
      }
      if (next.nodeType !== Node.ELEMENT_NODE) {
        continue
      }
      if (itemRole.includes(next.getAttribute('role') || '')) {
        item = next as HTMLElement
      }
    }
    if (!item) {
      return
    }
    const event = new CustomEvent<UiDropdownListSelection>('select', {
      cancelable: true,
      // composed: true,
      detail: {
        item,
      },
    })
    this.dispatchEvent(event)
    if (event.defaultPrevented) {
      return
    }
    this.close()
  }

  protected notifyOpen(): void {
    this.dispatchEvent(new Event('open'))
    if (this.open) {
      this.dispatchEvent(
        new Event('dropdownopen', {
          bubbles: true,
          composed: true,
          cancelable: true,
        })
      )
    }
  }

  protected override render(): TemplateResult {
    const classes: ClassInfo = {
      container: true,
      open: this.open,
    }

    return html` <div class="${classMap(classes)}">${this.renderTrigger()} ${this.renderContent()}</div> `
  }

  protected renderTrigger(): TemplateResult {
    return html`
      <div class="trigger" @click="${this.triggerClickHandler}" @keydown="${this.triggerKeyDownHandler}">
        <slot @slotchange="${this.triggerChanged}"></slot>
      </div>
    `
  }

  protected renderContent(): TemplateResult {
    const contentStyles = this.overlayPositioning || {}
    return html`
      <div class="content" style="${styleMap(contentStyles)}">
        <slot
          name="dropdown"
          @slotchange="${this.dropdownChanged}"
          @keydown="${this.contentKeyDownHandler}"
          @click="${this.contentClickHandler}"
          @close="${this.contentCloseHandler}"
        ></slot>
      </div>
    `
  }
}
