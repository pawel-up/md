import { html, LitElement, PropertyValues, TemplateResult } from 'lit'
import { property, query, queryAssignedElements, state } from 'lit/decorators.js'
import { ClassInfo, classMap } from 'lit/directives/class-map.js'
import { StyleInfo, styleMap } from 'lit/directives/style-map.js'
import { Easing } from '../../motion/animation.js'
import UiTab from './Tab.js'
import '../../icon-button/ui-icon-button.js'
import '../../divider/ui-divider.js'
import '../../icons/ui-icon.js'

export type TabsPriority = 'primary' | 'secondary'

export interface TabSelectionDetail {
  /**
   * The selected tab.
   */
  item: UiTab
  /**
   * The index of the selected tab.
   */
  index: number
}

export interface SizingInfo {
  left: number
  width: number
}

/**
 * Calculates value in percentages
 * @param w Element width
 * @param w0 Parent width
 * @return The percentage of element's width relative to parent.
 */
export function calcPercent(w: number, w0: number): number {
  return (100 * w) / w0
}

/**
 * A container for tabs.
 *
 * @fires change - A non bubbling event when selection change through user interaction.
 */
export default class UiTabs extends LitElement {
  activeItem: UiTab | null = null

  previousItem: UiTab | null = null

  /**
   * The currently selected tab, `null` only when there are no tab children.
   */
  get activeTab(): UiTab | null {
    return this.tabs.find((tab) => tab.selected) ?? null
  }

  set activeTab(tab: UiTab | null) {
    // Ignore setting activeTab to null. As long as there are children, one tab
    // must be selected.
    if (tab) {
      this.activateTab(tab)
    }
  }

  /**
   * The index of the currently selected tab.
   */
  get activeTabIndex() {
    return this.tabs.findIndex((tab) => tab.selected)
  }

  /**
   * Sets the active tab by index.
   */
  set activeTabIndex(index) {
    const activateTabAtIndex = () => {
      const tab = this.tabs[index]
      // Ignore out-of-bound indices.
      if (tab) {
        this.activateTab(tab)
      }
    }
    if (!this.slotElement) {
      // This is needed to support setting the activeTabIndex via a lit property
      // binding.
      //
      // ```ts
      // html`
      //   <ui-tabs .activeTabIndex=${1}>
      //     <ui-tab>First</ui-tab>
      //     <ui-tab>Second</ui-tab>
      //   </ui-tabs>
      // `;
      // ```
      //
      // It's needed since lit's rendering lifecycle is asynchronous, and the
      // `<slot>` element hasn't rendered, so `tabs` is empty.
      this.updateComplete.then(activateTabAtIndex)
      return
    }
    activateTabAtIndex()
  }

  get focusedTab() {
    return this.tabs.find((tab) => tab.matches(':focus-within'))
  }

  @queryAssignedElements({ flatten: true, selector: 'ui-tab' }) private accessor tabs!: UiTab[]

  @query('.tabs') private accessor tabsScrollerElement!: HTMLElement
  @query('slot') private accessor slotElement!: HTMLSlotElement

  @query('.pointer') private accessor pointer!: HTMLElement

  /**
   * The priority of the tabs.
   *
   * @default primary
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor priority: TabsPriority = 'primary'

  @state() private accessor pointerStyles: StyleInfo | undefined

  @state() private accessor indicated = false

  private observer: IntersectionObserver

  /**
   * This is set by the intersection observer. Once the tabs are in the view it turns to `true`.
   * This we can properly visualize selection.
   */
  @state() accessor isVisible: boolean | undefined

  /**
   * Whether or not to automatically select a tab when it is focused.
   */
  @property({ type: Boolean }) accessor autoActivate = false

  private readonly internals = (this as HTMLElement).attachInternals()

  constructor() {
    super()
    this.internals.role = 'tablist'
    this.observer = new IntersectionObserver(this.intersectionCallback.bind(this), {
      threshold: 1.0,
      rootMargin: '0px',
    })
    this.addEventListener('keydown', this.handleKeydown.bind(this))
    this.addEventListener('keyup', this.handleKeyup.bind(this))
    this.addEventListener('focusout', this.handleFocusout.bind(this))
  }

  protected override willUpdate(cp: PropertyValues<this>): void {
    if (cp.has('isVisible')) {
      this.handleVisibility()
    }
    super.willUpdate(cp)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.observer.observe(this)
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tablist')
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this.observer.unobserve(this)
  }

  protected intersectionCallback(entries: IntersectionObserverEntry[]): void {
    const [entry] = entries
    this.isVisible = entry.isIntersecting
  }

  /**
   * Scrolls the toolbar, if overflowing, to the active tab, or the provided
   * tab.
   *
   * @param tabToScrollTo The tab that should be scrolled to. Defaults to the
   *     active tab.
   * @return A Promise that resolves after the tab has been scrolled to.
   */
  async scrollToTab(tabToScrollTo?: UiTab | null) {
    await this.updateComplete
    const { tabs } = this
    tabToScrollTo ??= this.activeTab
    if (!tabToScrollTo || !tabs.includes(tabToScrollTo) || !this.tabsScrollerElement) {
      return
    }

    // wait for tabs to render.
    await Promise.all(tabs.map((tab) => tab.updateComplete))
    tabToScrollTo.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: !this.focusedTab ? 'instant' : 'auto',
    })
  }

  protected handleVisibility(): void {
    const { previousItem, activeItem } = this
    if (!activeItem) {
      return
    }
    this.positionPointer(activeItem, previousItem)
  }

  protected async positionPointer(tab: UiTab, old?: UiTab | null): Promise<void> {
    const { pointer, isVisible } = this
    if (!isVisible) {
      tab.indicated = true
      return
    }
    const index = this.tabs.indexOf(tab)
    if (index < 0 || !pointer) {
      this.pointerStyles = undefined
      return
    }

    if (!old) {
      // no start animation, just show indicator.
      tab.indicated = true
      return
    }
    const isPrimary = this.priority === 'primary'
    const final = this.getTabSizing(tab)
    if (this.pointerStyles && this.pointerStyles.left === `${final.left}px`) {
      tab.indicated = true
      return
    }

    // first position this indicator in the place of the old one.
    // update the view and then run the animation.
    this.indicated = true
    const starting = this.getTabSizing(old)
    this.pointerStyles = { left: `${starting.left}px`, width: `${starting.width}px` }
    await this.updateComplete
    const frames = isPrimary ? this.getPrimaryKeyframes(starting, final) : this.getSecondaryKeyframes(starting, final)

    if (this.moveAnimation) {
      this.moveAnimation.cancel()
    }
    const moveAnimation = pointer.animate(frames, {
      duration: 200,
      iterations: 1,
      easing: Easing.EMPHASIZED_DECELERATE,
    })
    const finalStyles: StyleInfo = {
      left: `${final.left}px`,
      width: `${final.width}px`,
    }
    moveAnimation.addEventListener('finish', () => {
      this.pointerStyles = finalStyles
      this.moveAnimation = undefined
      tab.indicated = true
      this.indicated = false
    })
    moveAnimation.addEventListener('cancel', () => {
      this.pointerStyles = finalStyles
    })
    this.moveAnimation = moveAnimation
  }

  protected moveAnimation?: Animation

  protected getTabSizing(tab: UiTab): SizingInfo {
    const contentBox = this.tabsScrollerElement.getBoundingClientRect()
    const sizing = tab.getIndicatorSizing()
    sizing.left = sizing.left - contentBox.x
    return sizing
  }

  protected getPrimaryKeyframes(start: SizingInfo, final: SizingInfo): Keyframe[] {
    return [
      {
        left: `${start.left}px`,
        width: `${start.width}px`,
      },
      {
        left: `${final.left}px`,
        width: `${final.width}px`,
      },
    ]
  }

  protected getSecondaryKeyframes(start: SizingInfo, final: SizingInfo): Keyframe[] {
    return [
      {
        left: `${start.left}px`,
        width: `${start.width}px`,
      },
      {
        left: `${final.left}px`,
        width: `${final.width}px`,
      },
    ]
  }

  protected async handleTabClick(e: PointerEvent): Promise<void> {
    const tab = e.composedPath().find((el) => isTab(el)) as UiTab | undefined
    if (e.defaultPrevented || !tab || tab.selected) {
      return
    }
    // Allow event to bubble
    await new Promise((resolve) => setTimeout(resolve, 0))
    this.activateTab(tab)
  }

  private activateTab(activeTab: UiTab): void {
    const { tabs } = this
    const previousTab = this.activeTab
    if (!tabs.includes(activeTab) || previousTab === activeTab) {
      // Ignore setting activeTab to a tab element that is not a child.
      return
    }
    for (const tab of tabs) {
      tab.selected = tab === activeTab
    }
    if (previousTab) {
      // Don't dispatch a change event if activating a tab when no previous tabs
      // were selected, such as when md-tabs auto-selects the first tab.
      const detail: TabSelectionDetail = {
        item: activeTab,
        index: this.tabs.indexOf(activeTab),
      }
      const defaultPrevented = !this.dispatchEvent(
        new CustomEvent('change', { detail, bubbles: false, cancelable: true })
      )
      if (defaultPrevented) {
        for (const tab of tabs) {
          tab.selected = tab === previousTab
        }
        return
      }
      previousTab.indicated = false
    }
    activeTab.indicated = false
    this.positionPointer(activeTab, previousTab)
    this.updateFocusableTab(activeTab)
    this.scrollToTab(activeTab)
  }

  private updateFocusableTab(focusableTab: UiTab): void {
    for (const tab of this.tabs) {
      tab.tabIndex = tab === focusableTab ? 0 : -1
    }
  }

  private async handleKeydown(event: KeyboardEvent): Promise<void> {
    const isLeft = event.key === 'ArrowLeft'
    const isRight = event.key === 'ArrowRight'
    const isHome = event.key === 'Home'
    const isEnd = event.key === 'End'
    // Ignore non-navigation keys
    if (event.defaultPrevented || (!isLeft && !isRight && !isHome && !isEnd)) {
      return
    }

    // Prevent default interactions, such as scrolling.
    event.preventDefault()

    // Allow event to bubble
    await new Promise((resolve) => setTimeout(resolve, 0))

    const { tabs } = this
    // Don't try to select another tab if there aren't any.
    if (tabs.length < 2) {
      return
    }

    let indexToFocus: number
    if (isHome || isEnd) {
      indexToFocus = isHome ? 0 : tabs.length - 1
    } else {
      // Check if moving forwards or backwards
      const isRtl = getComputedStyle(this).direction === 'rtl'
      const forwards = isRtl ? isLeft : isRight
      const { focusedTab } = this
      if (!focusedTab) {
        // If there is not already a tab focused, select the first or last tab
        // based on the direction we're traveling.
        indexToFocus = forwards ? 0 : tabs.length - 1
      } else {
        const focusedIndex = this.tabs.indexOf(focusedTab)
        indexToFocus = forwards ? focusedIndex + 1 : focusedIndex - 1
        if (indexToFocus >= tabs.length) {
          // Return to start if moving past the last item.
          indexToFocus = 0
        } else if (indexToFocus < 0) {
          // Go to end if moving before the first item.
          indexToFocus = tabs.length - 1
        }
      }
    }

    const tabToFocus = tabs[indexToFocus]
    tabToFocus.focus()
    if (this.autoActivate) {
      this.activateTab(tabToFocus)
    } else {
      this.updateFocusableTab(tabToFocus)
    }
  }

  // scroll to item on keyup.
  private handleKeyup() {
    this.scrollToTab(this.focusedTab ?? this.activeTab)
  }

  private handleFocusout() {
    // restore focus to selected item when blurring the tab bar.
    if (this.matches(':focus-within')) {
      return
    }

    const { activeTab } = this
    if (activeTab) {
      this.updateFocusableTab(activeTab)
    }
  }

  private handleSlotChange() {
    for (const tab of this.tabs) {
      tab.priority = this.priority
      if (tab.selected) {
        tab.indicated = true
      }
    }
    const firstTab = this.tabs[0]
    if (!this.activeTab && firstTab) {
      // If the active tab was removed, auto-select the first one. There should
      // always be a selected tab while the bar has children.
      this.activateTab(firstTab)
    }

    // When children shift, ensure the active tab is visible. For example, if
    // many children are added before the active tab, it'd be pushed off screen.
    // This ensures it stays visible.
    this.scrollToTab(this.activeTab)
    if (this.activeTab) {
      this.updateFocusableTab(this.activeTab)
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="tabs">${this.renderSlot()}</div>
      ${this.renderIndicator()}
      <ui-divider class="divider"></ui-divider>
    `
  }

  protected renderSlot(): TemplateResult {
    return html`<slot @slotchange="${this.handleSlotChange}" @click="${this.handleTabClick}"></slot>`
  }

  protected renderIndicator(): TemplateResult {
    const classes: ClassInfo = {
      indicator: true,
      indicated: this.indicated,
      primary: this.priority === 'primary',
      secondary: this.priority === 'secondary',
    }
    return html`
      <div class="${classMap(classes)}">
        <span role="presentation" class="pointer" style="${styleMap(this.pointerStyles || {})}"></span>
      </div>
    `
  }
}

function isTab(element: unknown): element is UiTab {
  return element instanceof UiTab
}
