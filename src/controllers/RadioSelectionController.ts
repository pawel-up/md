import { ReactiveController, ReactiveControllerHost } from 'lit'

export interface IRadioSelectionControllerHost extends ReactiveControllerHost, HTMLElement {
  checked?: boolean
  required?: boolean
  disabled?: boolean
  name?: string
  value?: string
  readonly form: HTMLFormElement | null
}

/**
 * An ordered list of inputs added to the document. Selection order depends on that list.
 */
const inputs: IRadioSelectionControllerHost[] = []

/**
 * A controller that groups radios by name and manages selection of a radio input in a group.
 *
 * A group is defined as:
 * - radio inputs with the same name associated with the same form
 * - radio inputs with the same name not associated with any form
 *
 * The radio input must call the `handleSelection()` method on this controller to manage the selection
 * in the group.
 */
export class RadioSelectionController implements ReactiveController {
  constructor(private readonly element: IRadioSelectionControllerHost) {
    this.element.addController(this)
  }

  hostConnected(): void {
    const { element } = this
    inputs.push(element)
  }

  hostDisconnected(): void {
    const index = inputs.indexOf(this.element)
    if (index >= 0) {
      inputs.splice(index, 1)
    }
  }

  /**
   * Selects the current element and deselects other elements in the group.
   */
  handleSelection(): void {
    const { element } = this
    const group = this._findGroup(element)
    const isRequired = group.some((i) => !!i.required || typeof i.dataset.required === 'string')
    for (let i = 0, len = group.length; i < len; i++) {
      const item = group[i]
      if (item === element) {
        item.checked = true
        item.setAttribute('tabindex', '0')
        if (isRequired) {
          item.required = true
        }
      } else {
        if (item.required) {
          item.required = false
        }
        if (item.checked) {
          item.checked = false
        }
        item.removeAttribute('tabindex')
      }
    }
  }

  /**
   * A handler for the keydown event. Changes the selection (when there's a selection in the group).
   */
  handleKeyDown(e: KeyboardEvent): void {
    if (['ArrowUp', 'ArrowLeft'].includes(e.code)) {
      e.preventDefault()
      this.selectPrevious()
    } else if (['ArrowDown', 'ArrowRight'].includes(e.code)) {
      e.preventDefault()
      this.selectNext()
    }
  }

  selectNext(): void {
    const { element } = this
    const group = this._findGroup(element)
    if (group.length < 2) {
      // 0 or 1 input, no way to go.
      return
    }
    const next = this.findNextInput(group, element)
    if (next) {
      next.click()
    }
  }

  selectPrevious(): void {
    const { element } = this
    const group = this._findGroup(element)
    if (group.length < 2) {
      // 0 or 1 input, no way to go.
      return
    }
    const previous = this.findPreviousInput(group, element)
    if (previous) {
      previous.click()
    }
  }

  findNextInput(
    group: IRadioSelectionControllerHost[],
    current: IRadioSelectionControllerHost
  ): IRadioSelectionControllerHost | null {
    const currentIndex = group.indexOf(current)
    if (currentIndex < 0) {
      return null
    }
    let i = currentIndex
    let next: IRadioSelectionControllerHost | null = null
    do {
      i++
      if (i === currentIndex) {
        // looped back from the start, no active element to find.
        return null
      }
      const item = group[i]
      if (!item) {
        i = -1
        continue
      }
      if (!item.disabled) {
        next = item
      }
    } while (!next)
    return next
  }

  findPreviousInput(
    group: IRadioSelectionControllerHost[],
    current: IRadioSelectionControllerHost
  ): IRadioSelectionControllerHost | null {
    const currentIndex = group.indexOf(current)
    if (currentIndex < 0) {
      return null
    }
    let i = currentIndex
    let result: IRadioSelectionControllerHost | null = null
    do {
      i--
      if (i === currentIndex) {
        // looped back from the end, no active element to find.
        return null
      }
      const item = group[i]
      if (!item) {
        i = group.length
        continue
      }
      if (!item.disabled) {
        result = item
      }
    } while (!result)
    return result
  }

  private _findGroup(element: IRadioSelectionControllerHost): IRadioSelectionControllerHost[] {
    let group: IRadioSelectionControllerHost[]
    if (element.form) {
      group = this._findFormGroup(element.name || '', element.form)
    } else {
      group = this._findDocumentGroup(element)
    }
    return group
  }

  /**
   * @param name The name of the input
   * @param form The associated form
   * @returns Ordered list of input group for the same form.
   */
  private _findFormGroup(name: string, form: HTMLFormElement): IRadioSelectionControllerHost[] {
    const group = inputs.filter((node) => {
      if (node.name !== name) {
        return false
      }
      if (node.form !== form) {
        return false
      }
      return true
    })
    return group
  }

  /**
   * @param element The element to find its group
   * @returns Ordered list of inputs with the same name that don't belong to any form.
   */
  private _findDocumentGroup(element: IRadioSelectionControllerHost): IRadioSelectionControllerHost[] {
    const { name = '' } = element
    const group = inputs.filter((node) => {
      if (node.form) {
        return false
      }
      return name === (node.name || '')
    })
    return group
  }

  /**
   * When multiple inputs within the same group have the `required` attribute
   * then the validation is reported incorrectly on inputs where the `tabindex` was removed from.
   * This triggers a console error (not an error in a sense of stopping JS execution) that
   * the form control is not focusable.
   * This removes the `required` attribute from the input when there's another radio button that has the
   * required attribute.
   */
  clearRequired(): void {
    const { element } = this
    if (!element.required) {
      return
    }
    const group = this._findGroup(element)
    let hasPreviousRequired = false
    for (let i = 0, len = group.length; i < len; i++) {
      const item = group[i]
      if (item === element) {
        break
      }
      if (item.required && !item.disabled) {
        hasPreviousRequired = true
        break
      }
    }
    if (hasPreviousRequired) {
      element.required = false
      element.dataset.required = ''
    }
  }

  /**
   * Removes the tabindex attribute from the input when there's another input with
   * `tabindex` within the same group. This way the user can `tab` to the next input instead
   * of tabbing through all inputs in the group.
   *
   * Note, tabindex values within a group may be different but it has no semantic or logical
   * meaning as navigation within a group happens with arrows and not tab.
   *
   */
  clearTabindex(): void {
    const { element } = this
    const elementIndex = this._readTabIndex(element)
    if (elementIndex < 0) {
      return
    }
    const group = this._findGroup(element)
    if (group.length < 2) {
      // noting to clear.
      return
    }
    let hasFocusableElement = false
    for (let i = 0, len = group.length; i < len; i++) {
      const item = group[i]
      if (item === element) {
        break
      }
      if (item.disabled) {
        continue
      }
      const index = this._readTabIndex(item)
      if (index >= 0) {
        hasFocusableElement = true
        break
      }
    }
    if (hasFocusableElement) {
      element.removeAttribute('tabindex')
    }
  }

  protected _readTabIndex(element: HTMLElement): number {
    const tIndex = element.getAttribute('tabindex')
    if (!tIndex) {
      return -1
    }
    const num = Number(tIndex)
    if (!Number.isInteger(num)) {
      return -1
    }
    return num
  }
}
