import { LitElement, type PropertyValues, html } from 'lit'
import { property, queryAssignedElements } from 'lit/decorators.js'
import UiButtonElement from './button.js'
import type { MdButtonSize } from './button.js'

export type MdGroupType = 'standard' | 'connected'

/**
 * A group of buttons that can be selected.
 *
 * When a group of buttons is added to the group element, the group element
 * becomes the manager of the buttons type, size, and selection state.
 *
 * All buttons added to the group will inherit the size from the group, but also the `shape` is set
 * based on the group type.
 *
 * Buttons don't need to be have the `toggle` attribute set. In such case, the button
 * will not participate in the selection state management.
 */
export default class ButtonGroup extends LitElement {
  /**
   * If true, multiple buttons can be selected.
   * When set to false, the group deselects all other buttons when one is selected.
   * @attribute
   */
  @property({ type: Boolean }) accessor multiple = false

  /**
   * The type of button group.
   * - 'standard': Standard button group.
   * - 'connected': Connected button group (buttons are visually connected).
   * @attribute
   */
  @property({ type: String }) accessor type: MdGroupType = 'standard'

  /**
   * The size of the buttons used with this group.
   * @attribute
   */
  @property({ type: String, reflect: true }) accessor size: MdButtonSize = 's'

  @queryAssignedElements({ flatten: true, selector: 'ui-button' }) private accessor buttons!: UiButtonElement[]

  /**
   * The MutationObserver instance used to watch for changes in slotted children.
   */
  protected observer?: MutationObserver

  override connectedCallback(): void {
    super.connectedCallback()
    this.observer = new MutationObserver(this.handleMutations.bind(this))
    this.observer.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ['selected'] })
    this.updateChildren()
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this.observer?.disconnect()
    this.observer = undefined
  }

  protected override firstUpdated(changed: PropertyValues): void {
    this.updateChildren()
    super.firstUpdated(changed)
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('size')) {
      this.updateChildren()
    }
  }

  protected handleMutations(mutations: MutationRecord[]): void {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'selected') {
        const target = mutation.target as UiButtonElement
        if (target instanceof UiButtonElement && target.toggle && target.selected) {
          this.activate(target)
        }
      } else if (mutation.type === 'childList') {
        this.updateChildren()
      }
    }
  }

  protected updateChildren(): void {
    const isConnected = this.type === 'connected'
    this.buttons.forEach((button) => {
      button.size = this.size
      if (isConnected) {
        button.shape = 'square'
      } else {
        button.shape = 'round'
      }
    })
  }

  /**
   * In multi selection mode, this method does nothing.
   * In single selection mode, it activates the clicked button and deactivates all others.
   */
  activate(button: UiButtonElement) {
    if (this.multiple) {
      // In multiselection, we don't need to do anything here
      return
    }
    this.buttons.forEach((btn) => {
      if (!btn.toggle || btn === button || !btn.selected) {
        return
      }
      btn.selected = false
    })
    if (button.toggle && !button.selected) {
      button.selected = true
    }
  }

  override render() {
    return html`<slot></slot>`
  }
}
