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
  private _prevName?: string = undefined
  private _prevDisabled?: boolean = undefined
  private _prevRequired?: boolean = undefined

  constructor(private readonly element: IRadioSelectionControllerHost) {
    this.element.addController(this)
    this._prevName = this.element.name
    this._prevDisabled = this.element.disabled
    this._prevRequired = this.element.required
  }

  hostConnected(): void {
    const { element } = this
    inputs.push(element)
    this._prevName = element.name
    this._prevDisabled = element.disabled
    this._prevRequired = element.required
    RadioSelectionController.syncGroup(this._findGroup(element))
  }

  hostDisconnected(): void {
    const { element } = this
    const index = inputs.indexOf(element)
    if (index >= 0) {
      inputs.splice(index, 1)
    }
    const remainingGroup = this._findGroupByNameAndForm(element.name || '', element.form)
    RadioSelectionController.syncGroup(remainingGroup)
  }

  hostUpdated(): void {
    const { element } = this
    const nameChanged = this._prevName !== element.name
    const disabledChanged = this._prevDisabled !== element.disabled
    const requiredChanged = this._prevRequired !== element.required

    if (nameChanged || disabledChanged || requiredChanged) {
      if (nameChanged && this._prevName !== undefined) {
        const oldGroup = this._findGroupByNameAndForm(this._prevName, element.form)
        RadioSelectionController.syncGroup(oldGroup)
      }

      const currentGroup = this._findGroup(element)
      RadioSelectionController.syncGroup(currentGroup)

      this._prevName = element.name
      this._prevDisabled = element.disabled
      this._prevRequired = element.required
    }
  }

  /**
   * Selects the current element and deselects other elements in the group.
   */
  handleSelection(): void {
    const { element } = this
    const group = this._findGroup(element)
    for (const item of group) {
      item.checked = item === element
    }
    RadioSelectionController.syncGroup(group)
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
    return this._findGroupByNameAndForm(element.name || '', element.form)
  }

  private _findGroupByNameAndForm(name: string, form: HTMLFormElement | null): IRadioSelectionControllerHost[] {
    if (form) {
      return this._findFormGroup(name, form)
    }
    return this._findDocumentGroup(name)
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
   * @param name The name of the input group
   * @returns Ordered list of inputs with the same name that don't belong to any form.
   */
  private _findDocumentGroup(name: string): IRadioSelectionControllerHost[] {
    const group = inputs.filter((node) => {
      if (node.form) {
        return false
      }
      return name === (node.name || '')
    })
    return group
  }

  /**
   * Clears required attribute on redundant elements in the group.
   */
  clearRequired(): void {
    RadioSelectionController.syncGroup(this._findGroup(this.element))
  }

  /**
   * Removes the tabindex attribute from redundant elements in the group.
   */
  clearTabindex(): void {
    RadioSelectionController.syncGroup(this._findGroup(this.element))
  }

  /**
   * Synchronizes the tabindex and required attributes for a group of radio buttons.
   */
  static syncGroup(group: IRadioSelectionControllerHost[]): void {
    if (group.length === 0) return

    let focusableElement = group.find((item) => item.checked && !item.disabled)
    if (!focusableElement) {
      focusableElement = group.find((item) => !item.disabled)
    }

    const isRequired = group.some(
      (item) => !!item.required || (item instanceof HTMLElement && typeof item.dataset.required === 'string')
    )

    for (const item of group) {
      if (item.disabled) {
        item.removeAttribute('tabindex')
        if (isRequired) {
          item.required = false
          if (item instanceof HTMLElement) {
            item.dataset.required = ''
          }
        }
        continue
      }

      // Tabindex
      if (item === focusableElement) {
        item.setAttribute('tabindex', '0')
      } else {
        item.removeAttribute('tabindex')
      }

      // Required
      if (isRequired) {
        if (item === focusableElement) {
          item.required = true
        } else {
          item.required = false
          if (item instanceof HTMLElement) {
            item.dataset.required = ''
          }
        }
      }
    }
  }
}
