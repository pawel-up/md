import { html, TemplateResult } from 'lit'
import { property, queryAssignedElements } from 'lit/decorators.js'
import { UiElement } from '../../UiElement.js'
import SegmentedButton from './SegmentedButton.js'

export interface ISegmentedButtonSelectionDetail {
  /**
   * A reference to the selected button.
   */
  button: SegmentedButton
  /**
   * Whether the button is selected.
   */
  selected: boolean
  /**
   * The index of the selected button.
   */
  index: number
}

/**
 * @fires select - When button's selection change.
 */
export default class SegmentedButtonsSet extends UiElement {
  disabled = false

  /**
   * Whether multiple buttons can be selected at once.
   * @attribute
   */
  @property({ type: Boolean }) accessor multiselect = false

  @queryAssignedElements({ flatten: true }) accessor buttons!: SegmentedButton[]

  constructor() {
    super()
    this.addEventListener('trigger', this.handleButtonTrigger.bind(this))
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.setAttribute('role', 'group')
  }

  isButtonDisabled(index: number): boolean {
    if (this.isOutOfBounds(index)) return false
    return this.buttons[index].disabled
  }

  setButtonDisabled(index: number, disabled: boolean): void {
    if (this.isOutOfBounds(index)) return
    this.buttons[index].disabled = disabled
  }

  isButtonSelected(index: number): boolean {
    if (this.isOutOfBounds(index)) return false
    return this.buttons[index].selected
  }

  setButtonSelected(index: number, selected: boolean): void {
    // Ignore out-of-index values.
    if (this.isOutOfBounds(index)) return
    // Ignore disabled buttons.
    if (this.isButtonDisabled(index)) return

    if (this.multiselect) {
      this.buttons[index].selected = selected
      this.dispatchSelected(index)
      return
    }

    // Single-select segmented buttons are not unselectable.
    if (!selected) return

    this.buttons[index].selected = true
    this.dispatchSelected(index)
    // Deselect all other buttons for single-select.
    for (let i = 0; i < this.buttons.length; i++) {
      if (i === index) continue
      this.buttons[i].selected = false
    }
  }

  private handleButtonTrigger(e: Event): void {
    const index = this.buttons.indexOf(e.target as SegmentedButton)
    this.toggleSelection(index)
  }

  private toggleSelection(index: number): void {
    this.setButtonSelected(index, !this.buttons[index].selected)
  }

  private isOutOfBounds(index: number): boolean {
    return index < 0 || index >= this.buttons.length
  }

  private dispatchSelected(index: number): void {
    this.dispatchEvent(
      new CustomEvent<ISegmentedButtonSelectionDetail>('select', {
        detail: {
          button: this.buttons[index],
          selected: this.buttons[index].selected,
          index,
        },
        bubbles: true,
        composed: true,
      })
    )
  }

  override render(): TemplateResult {
    return html`<slot></slot>`
  }
}
