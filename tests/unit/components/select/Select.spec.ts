import { fixture, html, nextFrame, oneEvent, test } from '@pawel-up/lupa/testing'
import sinon from 'sinon'
import UiSelect from '../../../../src/components/select/internals/Select.js'
import UiOption from '../../../../src/components/select/internals/Option.js'
import type { UiSelectChangeEvent } from '../../../../src/components/select/internals/Select.js'

import '../../../../src/components/select/ui-select.js'
import '../../../../src/components/select/ui-option.js'
import '../../../../src/components/icons/ui-icon.js'

async function basicFixture(): Promise<UiSelect> {
  return fixture(html`
    <ui-select label="Select an option">
      <ui-option value="apple">Apple</ui-option>
      <ui-option value="banana">Banana</ui-option>
      <ui-option value="cherry">Cherry</ui-option>
    </ui-select>
  `)
}

async function withValueFixture(): Promise<UiSelect> {
  return fixture(html`
    <ui-select label="Select an option" value="banana">
      <ui-option value="apple">Apple</ui-option>
      <ui-option value="banana">Banana</ui-option>
      <ui-option value="cherry">Cherry</ui-option>
    </ui-select>
  `)
}

async function requiredFixture(): Promise<UiSelect> {
  return fixture(html`
    <ui-select label="Required field" required>
      <ui-option value="apple">Apple</ui-option>
      <ui-option value="banana">Banana</ui-option>
    </ui-select>
  `)
}

async function disabledFixture(): Promise<UiSelect> {
  return fixture(html`
    <ui-select label="Disabled select" disabled>
      <ui-option value="apple">Apple</ui-option>
      <ui-option value="banana">Banana</ui-option>
    </ui-select>
  `)
}

async function formFixture(): Promise<HTMLFormElement> {
  return fixture(html`
    <form>
      <input name="text" value="test" />
      <ui-select name="fruit" label="Select fruit">
        <ui-option value="apple">Apple</ui-option>
        <ui-option value="banana">Banana</ui-option>
      </ui-select>
    </form>
  `)
}

async function invalidFixture(): Promise<UiSelect> {
  return fixture(html`
    <ui-select label="Invalid select" invalid invalidText="This field is required">
      <ui-option value="apple">Apple</ui-option>
      <ui-option value="banana">Banana</ui-option>
    </ui-select>
  `)
}

async function emptyFixture(): Promise<UiSelect> {
  return fixture(html`<ui-select label="Empty select"></ui-select>`)
}

async function selectedAttributeFixture(): Promise<UiSelect> {
  return fixture(html`
    <ui-select label="Select with pre-selected option">
      <ui-option value="apple">Apple</ui-option>
      <ui-option value="banana" selected>Banana</ui-option>
      <ui-option value="cherry">Cherry</ui-option>
    </ui-select>
  `)
}

async function multipleSelectedFixture(): Promise<UiSelect> {
  return fixture(html`
    <ui-select label="Select with multiple selected">
      <ui-option value="apple" selected>Apple</ui-option>
      <ui-option value="banana" selected>Banana</ui-option>
      <ui-option value="cherry">Cherry</ui-option>
    </ui-select>
  `)
}

async function selectedWithValueFixture(): Promise<UiSelect> {
  return fixture(html`
    <ui-select label="Select with both value and selected" value="cherry">
      <ui-option value="apple">Apple</ui-option>
      <ui-option value="banana" selected>Banana</ui-option>
      <ui-option value="cherry">Cherry</ui-option>
    </ui-select>
  `)
}

async function dynamicOptionsFixture(): Promise<UiSelect> {
  return fixture(html` <ui-select label="Dynamic options"> </ui-select> `)
}

test.group('Basic functionality', () => {
  test('should create select element', async ({ assert }) => {
    const element = await basicFixture()
    assert.instanceOf(element, UiSelect)
    assert.equal(element.tagName.toLowerCase(), 'ui-select')
  })

  test('has formAssociated set', async ({ assert }) => {
    assert.isTrue(UiSelect.formAssociated)
  })

  test('should have correct default properties', async ({ assert }) => {
    const element = await basicFixture()
    assert.isUndefined(element.value)
    assert.isUndefined(element.name)
    assert.equal(element.label, 'Select an option')
    assert.isFalse(element.required)
    assert.isUndefined(element.invalid)
    assert.isUndefined(element.invalidText)
    assert.isFalse(element.disabled)
    assert.isFalse(element.open)
    assert.isNull(element.selectedItem)
    assert.equal(element.renderValue, '')
  })

  test('should set correct ARIA attributes', async ({ assert }) => {
    const element = await basicFixture()
    assert.equal(element.getAttribute('role'), 'combobox')
    assert.equal(element.getAttribute('aria-haspopup'), 'listbox')
    assert.equal(element.getAttribute('aria-controls'), 'menu')
    assert.equal(element.getAttribute('aria-label'), 'Select an option')
    assert.equal(element.tabIndex, 0)
  })

  test('should not have tabindex when disabled', async ({ assert }) => {
    const element = await disabledFixture()
    assert.equal(element.tabIndex, -1)
  })
})

test.group('Value and selection', () => {
  test('should set value and select corresponding option', async ({ assert }) => {
    const element = await basicFixture()
    element.value = 'banana'
    await element.updateComplete
    // We need it here because the observer also awaits updateComplete
    await nextFrame()

    assert.equal(element.value, 'banana')
    assert.isNotNull(element.selectedItem)
    assert.equal(element.selectedItem!.value, 'banana')
    assert.equal(element.renderValue, 'Banana')
  })

  test('should initialize with preselected value', async ({ assert }) => {
    const element = await withValueFixture()
    await element.updateComplete

    assert.equal(element.value, 'banana')
    assert.isNotNull(element.selectedItem)
    assert.equal(element.selectedItem!.value, 'banana')
    assert.equal(element.renderValue, 'Banana')
  })

  test('should handle invalid value gracefully', async ({ assert }) => {
    const element = await basicFixture()
    element.value = 'nonexistent'
    await element.updateComplete

    assert.equal(element.value, 'nonexistent')
    assert.isNull(element.selectedItem)
    assert.equal(element.renderValue, '')
  })

  test('should clear selection when value is undefined', async ({ assert }) => {
    const element = await withValueFixture()
    await element.updateComplete

    element.value = undefined
    await element.updateComplete
    // We need it here because the observer also awaits updateComplete
    await nextFrame()

    assert.isUndefined(element.value, 'the value should be undefined')
    assert.isNull(element.selectedItem, 'selected item should be null')
    assert.equal(element.renderValue, '')
  })

  test('should discover selected attribute on options', async ({ assert }) => {
    const element = await selectedAttributeFixture()
    await element.updateComplete

    assert.equal(element.value, 'banana')
    assert.isNotNull(element.selectedItem)
    assert.equal(element.selectedItem!.value, 'banana')
    assert.equal(element.renderValue, 'Banana')
  })

  test('should handle multiple selected options by selecting the first one', async ({ assert }) => {
    const element = await multipleSelectedFixture()
    await element.updateComplete
    await nextFrame()

    // When multiple options have selected attribute, only the first one should be selected
    assert.equal(element.value, 'apple')
    assert.isNotNull(element.selectedItem)
    assert.equal(element.selectedItem!.value, 'apple') // First selected item
    assert.equal(element.renderValue, 'Apple') // Display value should match the first selected item
  })

  test('should prioritize value over selected attribute', async ({ assert }) => {
    const element = await selectedWithValueFixture()
    await element.updateComplete

    assert.equal(element.value, 'cherry')
    assert.isNotNull(element.selectedItem)
    assert.equal(element.selectedItem!.value, 'cherry')
    assert.equal(element.renderValue, 'Cherry')
  })

  test('should update value when options change dynamically', async ({ assert }) => {
    const element = await dynamicOptionsFixture()
    await element.updateComplete

    // Initially, there are no options, so value should be undefined
    assert.isUndefined(element.value)

    // Add options dynamically
    element.innerHTML = `
      <ui-option value="apple">Apple</ui-option>
      <ui-option value="banana" selected>Banana</ui-option>
      <ui-option value="cherry">Cherry</ui-option>
    `
    await element.updateComplete
    await nextFrame()

    // The value should now reflect the selected option
    assert.equal(element.value, 'banana')
    assert.isNotNull(element.selectedItem)
    assert.equal(element.selectedItem!.value, 'banana')
    assert.equal(element.renderValue, 'Banana')
  })

  test('should display label immediately when option is added and value is set at the same time', async ({
    assert,
  }) => {
    const element = await basicFixture()
    await element.updateComplete

    const newOption = document.createElement('ui-option') as UiOption
    newOption.value = 'opt-id-123'
    newOption.textContent = 'Dragon Fruit'

    element.value = 'opt-id-123'
    element.appendChild(newOption)

    await element.updateComplete

    assert.equal(element.value, 'opt-id-123')
    assert.equal(element.renderValue, 'Dragon Fruit')
    const input = element.shadowRoot?.querySelector('ui-outlined-text-field')
    assert.isNotNull(input)
    assert.equal(input?.value, 'Dragon Fruit')
  })

  test('should update selected option and renderValue when matching option is slotted in asynchronously', async ({
    assert,
  }) => {
    const element = await dynamicOptionsFixture()
    element.value = 'opt-async'
    await element.updateComplete

    assert.equal(element.value, 'opt-async')
    assert.isNull(element.selectedItem)
    assert.equal(element.renderValue, '')

    const opt = document.createElement('ui-option') as UiOption
    opt.value = 'opt-async'
    opt.textContent = 'Async Option'
    element.appendChild(opt)

    await element.updateComplete
    await nextFrame()

    assert.isNotNull(element.selectedItem)
    assert.equal(element.renderValue, 'Async Option')
    const input = element.shadowRoot?.querySelector('ui-outlined-text-field')
    assert.isNotNull(input)
    assert.equal(input?.value, 'Async Option')
  })

  test('should update renderValue when option text changes dynamically', async ({ assert }) => {
    const element = await basicFixture()
    element.value = 'apple'
    await element.updateComplete

    assert.equal(element.renderValue, 'Apple')

    const appleOption = element.querySelector('ui-option[value="apple"]') as UiOption
    appleOption.textContent = 'Green Apple'

    await appleOption.updateComplete
    await element.updateComplete
    await nextFrame()

    assert.equal(element.renderValue, 'Green Apple')
    const input = element.shadowRoot?.querySelector('ui-outlined-text-field')
    assert.isNotNull(input)
    assert.equal(input?.value, 'Green Apple')
  })

  test('should update selection when option value changes dynamically', async ({ assert }) => {
    const element = await basicFixture()
    element.value = 'apple'
    await element.updateComplete

    assert.isNotNull(element.selectedItem)

    const appleOption = element.querySelector('ui-option[value="apple"]') as UiOption
    appleOption.value = 'green-apple'

    await appleOption.updateComplete
    await element.updateComplete
    await nextFrame()

    assert.isNull(element.selectedItem)
  })

  test('labelchange and valuechange events do not propagate beyond ui-select', async ({ assert }) => {
    const parent = document.createElement('div')
    const select = document.createElement('ui-select') as UiSelect
    const option = document.createElement('ui-option') as UiOption
    option.value = 'initial'
    option.textContent = 'Initial Label'
    select.appendChild(option)
    parent.appendChild(select)
    document.body.appendChild(parent)

    await select.updateComplete
    await option.updateComplete

    let parentReceivedLabelChange = false
    let parentReceivedValueChange = false

    parent.addEventListener('labelchange', () => {
      parentReceivedLabelChange = true
    })
    parent.addEventListener('valuechange', () => {
      parentReceivedValueChange = true
    })

    option.textContent = 'Updated Label'
    await option.updateComplete
    await nextFrame()

    option.value = 'updated'
    await option.updateComplete
    await nextFrame()

    assert.isFalse(parentReceivedLabelChange)
    assert.isFalse(parentReceivedValueChange)

    parent.remove()
  })

  test('should not dispatch valuechange on initial render', async ({ assert }) => {
    let dispatched = false
    const option = document.createElement('ui-option') as UiOption
    option.addEventListener('valuechange', () => {
      dispatched = true
    })
    option.value = 'initial'
    option.textContent = 'Initial'
    document.body.appendChild(option)
    await option.updateComplete

    assert.isFalse(dispatched)

    option.value = 'changed'
    await option.updateComplete

    assert.isTrue(dispatched)
    option.remove()
  })

  test('should update select and form value when option without value has label changed', async ({ assert }) => {
    const element = await fixture<UiSelect>(html`
      <ui-select label="Select fruit">
        <ui-option>Apple</ui-option>
        <ui-option>Banana</ui-option>
      </ui-select>
    `)
    element.value = 'Apple'
    await element.updateComplete

    assert.equal(element.value, 'Apple')
    assert.equal(element.renderValue, 'Apple')
    assert.isNotNull(element.selectedItem)

    const appleOption = element.querySelector('ui-option') as UiOption
    appleOption.textContent = 'Green Apple'

    await appleOption.updateComplete
    await element.updateComplete
    await nextFrame()

    assert.equal(element.value, 'Green Apple')
    assert.equal(element.renderValue, 'Green Apple')
    assert.equal(element.selectedItem, appleOption)
    const input = element.shadowRoot?.querySelector('ui-outlined-text-field')
    assert.isNotNull(input)
    assert.equal(input?.value, 'Green Apple')
  })

  test('should update form value when option without explicit value has its label changed', async ({ assert }) => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <ui-select name="fruit" label="Select fruit">
          <ui-option>Apple</ui-option>
          <ui-option>Banana</ui-option>
        </ui-select>
      </form>
    `)
    const select = form.querySelector('ui-select') as UiSelect
    select.value = 'Apple'
    await select.updateComplete

    let formData = new FormData(form)
    assert.equal(formData.get('fruit'), 'Apple')

    const appleOption = select.querySelector('ui-option') as UiOption
    appleOption.textContent = 'Green Apple'

    await appleOption.updateComplete
    await select.updateComplete
    await nextFrame()

    formData = new FormData(form)
    assert.equal(formData.get('fruit'), 'Green Apple')
  })
})

test.group('Form integration', () => {
  test('should have no form when not in form', async ({ assert }) => {
    const element = await basicFixture()
    assert.isNull(element.form)
  })

  test('should have form when in a form', async ({ assert }) => {
    const form = await formFixture()
    const select = form.querySelector('ui-select')!
    assert.ok(select.form, 'has a form')
    assert.isTrue(select.form === form, 'has the parent form')
  })

  test('should participate in form submission', async ({ assert }) => {
    const form = await formFixture()
    const select = form.querySelector('ui-select')!
    select.value = 'apple'
    await select.updateComplete

    const formData = new FormData(form)
    assert.equal(formData.get('fruit'), 'apple')
  })

  test('should update form value on selection change', async ({ assert }) => {
    const form = await formFixture()
    const select = form.querySelector('ui-select')!

    // Simulate selection of 'banana'
    const bananaOption = select.querySelector('ui-option[value="banana"]') as UiOption
    select['handleSelect'](new CustomEvent('select', { detail: { item: bananaOption } }))
    await select.updateComplete

    const formData = new FormData(form)
    assert.equal(formData.get('fruit'), 'banana', 'Form data should be "banana" after selection')
  })

  test('should clear form value when value is set to undefined', async ({ assert }) => {
    const form = await formFixture()
    const select = form.querySelector('ui-select')!
    select.value = 'apple'
    await select.updateComplete

    let formData = new FormData(form)
    assert.equal(formData.get('fruit'), 'apple', 'Form data should be "apple" initially')

    select.value = undefined
    await select.updateComplete

    formData = new FormData(form)
    assert.isNull(formData.get('fruit'), 'Form data should be null after clearing value')
  })

  test('should not submit when no value selected', async ({ assert }) => {
    const form = await formFixture()
    const formData = new FormData(form)
    assert.isNull(formData.get('fruit'))
  })

  test('should reset value on form reset', async ({ assert }) => {
    const form = await formFixture()
    const select = form.querySelector('ui-select')!
    select.value = 'apple'
    await select.updateComplete

    select.formResetCallback()
    await select.updateComplete

    assert.isUndefined(select.value)
    const formData = new FormData(form)
    assert.isNull(formData.get('fruit'), 'Form data should be null after reset')
  })

  test('should restore state', async ({ assert }) => {
    const element = await basicFixture()
    element.formStateRestoreCallback('cherry')
    await element.updateComplete

    assert.equal(element.value, 'cherry')
    assert.equal(element.selectedItem?.value, 'cherry')

    element.formStateRestoreCallback(null)
    await element.updateComplete

    assert.isUndefined(element.value)
  })

  test('should set initial form value when an option has selected attribute in HTML', async ({ assert }) => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <ui-select name="fruit" label="Select fruit">
          <ui-option value="apple">Apple</ui-option>
          <ui-option value="banana" selected>Banana</ui-option>
        </ui-select>
      </form>
    `)
    const select = form.querySelector('ui-select')!
    await select.updateComplete

    const formData = new FormData(form)
    assert.equal(formData.get('fruit'), 'banana', 'Initial form value should be set from pre-selected option')
  })

  test('should fallback to option text content when option lacks explicit value attribute', async ({ assert }) => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <ui-select name="fruit" label="Select fruit">
          <ui-option>Apple</ui-option>
          <ui-option>Banana</ui-option>
        </ui-select>
      </form>
    `)
    const select = form.querySelector('ui-select')!
    await select.updateComplete

    const option = select.querySelector('ui-option') as UiOption
    select['handleSelect'](new CustomEvent('select', { detail: { item: option } }))
    await select.updateComplete

    assert.equal(select.value, 'Apple')
    const formData = new FormData(form)
    assert.equal(
      formData.get('fruit'),
      'Apple',
      'Form value should use option renderValue when value attribute is omitted'
    )
  })
})

test.group('Validation', () => {
  test('should be valid by default', async ({ assert }) => {
    const element = await basicFixture()
    assert.isTrue(element.checkValidity())
    assert.isTrue(element.validity.valid)
    assert.equal(element.validationMessage, '')
  })

  test('should be invalid when required and no value', async ({ assert }) => {
    const element = await requiredFixture()
    element.validate()
    await element.updateComplete

    assert.isFalse(element.checkValidity())
    assert.isFalse(element.validity.valid)
    assert.isTrue(element.validity.valueMissing)
    assert.equal(element.validationMessage, 'Please select an item.')
    assert.isTrue(element.invalid)
    assert.equal(element.invalidText, 'Please select an item.')
  })

  test('should be valid when required and has value', async ({ assert }) => {
    const element = await requiredFixture()
    element.value = 'apple'
    await element.updateComplete

    assert.isTrue(element.checkValidity())
    assert.isTrue(element.validity.valid)
    assert.equal(element.validationMessage, '')
    assert.isFalse(element.invalid)
  })

  test('should clear invalid state and valueMissing when selection is made', async ({ assert }) => {
    const element = await requiredFixture()
    element.validate()
    await element.updateComplete

    assert.isTrue(element.invalid, 'Should initially be invalid')
    assert.isTrue(element.validity.valueMissing, 'Should initially have valueMissing')

    // Simulate user selecting an option
    const option = element.querySelector('ui-option[value="apple"]') as UiOption
    element['handleSelect'](new CustomEvent('select', { detail: { item: option } }))
    await element.updateComplete

    assert.isFalse(element.invalid, 'Should clear invalid state after selection')
    assert.isFalse(element.validity.valueMissing, 'Should clear valueMissing after selection')
    assert.isTrue(element.checkValidity(), 'checkValidity should return true after selection')
    assert.isTrue(element.validity.valid, 'validity.valid should be true after selection')
  })

  test('should display invalid state', async ({ assert }) => {
    const element = await invalidFixture()
    assert.isTrue(element.invalid)
    assert.equal(element.invalidText, 'This field is required')
  })
})

test.group('Keyboard interaction', () => {
  test('should open dropdown on Enter key', async ({ assert }) => {
    const element = await basicFixture()
    assert.isFalse(element.open)

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    await nextFrame()

    assert.isTrue(element.open)
  })

  test('should open dropdown on ArrowDown key', async ({ assert }) => {
    const element = await basicFixture()
    assert.isFalse(element.open)

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    await nextFrame()

    assert.isTrue(element.open)
  })

  test('should open dropdown on ArrowUp key', async ({ assert }) => {
    const element = await basicFixture()
    assert.isFalse(element.open)

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
    await nextFrame()

    assert.isTrue(element.open)
  })

  test('should close dropdown on Escape key', async ({ assert }) => {
    const element = await basicFixture()
    element.open = true
    await element.updateComplete

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextFrame()

    assert.isFalse(element.open)
  })

  test('should not respond to keyboard when disabled', async ({ assert }) => {
    const element = await disabledFixture()
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    await nextFrame()

    assert.isFalse(element.open)
  })

  test('should handle Tab key when menu is open', async ({ assert }) => {
    const element = await basicFixture()
    element.open = true
    await element.updateComplete

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))
    await element.updateComplete

    assert.isFalse(element.open)
  })
})

test.group('Disabled option navigation', () => {
  function disabledOptionsFixture(): Promise<UiSelect> {
    return fixture<UiSelect>(html`
      <ui-select>
        <ui-option value="first">First Option</ui-option>
        <ui-option value="second" disabled>Second Option (Disabled)</ui-option>
        <ui-option value="third">Third Option</ui-option>
        <ui-option value="fourth" disabled>Fourth Option (Disabled)</ui-option>
        <ui-option value="fifth">Fifth Option</ui-option>
      </ui-select>
    `)
  }

  test('should skip disabled options when navigating with arrow keys', async ({ assert }) => {
    const element = await disabledOptionsFixture()
    element.open = true
    await element.updateComplete

    const firstOption = element.querySelector('ui-option[value="first"]') as UiOption
    const thirdOption = element.querySelector('ui-option[value="third"]') as UiOption

    // Start with first option focused
    firstOption.focus()
    // Navigate down - should skip disabled "second" option and go to "third"
    element.focusNextMenuItem()

    assert.isTrue(thirdOption.matches(':focus'), 'Third option should be focused after navigating down from first')
  })

  test('should skip disabled options when navigating backwards', async ({ assert }) => {
    const element = await disabledOptionsFixture()
    element.open = true
    await element.updateComplete

    const thirdOption = element.querySelector('ui-option[value="third"]') as UiOption
    const firstOption = element.querySelector('ui-option[value="first"]') as UiOption

    // Start with third option focused
    thirdOption.focus()

    // Navigate up - should skip disabled "second" option and go to "first"
    element.focusPreviousMenuItem()

    assert.isTrue(firstOption.matches(':focus'), 'First option should be focused after navigating up from third')
  })

  test('should find first selectable option correctly', async ({ assert }) => {
    const allDisabledButLastFixture = () => html`
      <ui-select>
        <ui-option value="first" disabled>First Option (Disabled)</ui-option>
        <ui-option value="second" disabled>Second Option (Disabled)</ui-option>
        <ui-option value="third">Third Option</ui-option>
      </ui-select>
    `

    const element = (await fixture(allDisabledButLastFixture())) as UiSelect
    const thirdOption = element.querySelector('ui-option[value="third"]') as UiOption

    const firstSelectable = element.getFirstSelectableOption()
    assert.equal(firstSelectable, thirdOption)
  })

  test('should find last selectable option correctly', async ({ assert }) => {
    const allDisabledButFirstFixture = () => html`
      <ui-select>
        <ui-option value="first">First Option</ui-option>
        <ui-option value="second" disabled>Second Option (Disabled)</ui-option>
        <ui-option value="third" disabled>Third Option (Disabled)</ui-option>
      </ui-select>
    `

    const element = (await fixture(allDisabledButFirstFixture())) as UiSelect
    const firstOption = element.querySelector('ui-option[value="first"]') as UiOption

    const lastSelectable = element.getLastSelectableOption()
    assert.equal(lastSelectable, firstOption)
  })

  test('should focus first selectable option when opening menu', async ({ assert }) => {
    const element = await disabledOptionsFixture()
    const firstOption = element.querySelector('ui-option[value="first"]') as UiOption

    // Open the menu
    element.open = true
    await element.updateComplete

    // Should focus on first selectable option
    assert.isTrue(firstOption.matches(':focus'), 'First option should be focused after opening menu')
  })
})

test.group('Mouse interaction', () => {
  test('should open dropdown on click', async ({ assert }) => {
    const element = await basicFixture()
    assert.isFalse(element.open)

    element.click()
    await nextFrame()

    assert.isTrue(element.open)
  })

  test('should not respond to click when disabled', async ({ assert }) => {
    const element = await disabledFixture()
    element.click()
    await nextFrame()

    assert.isFalse(element.open)
  })

  test('should close on blur when focus leaves component', async ({ assert }) => {
    const element = await basicFixture()
    element.open = true
    await element.updateComplete

    // Simulate blur event with no related target (focus leaving completely)
    element.dispatchEvent(new FocusEvent('blur', { relatedTarget: null }))
    await nextFrame()

    assert.isFalse(element.open)
  })

  test('should not close on blur when focus moves to menu', async ({ assert }) => {
    const element = await basicFixture()
    element.open = true
    await element.updateComplete

    const menu = element.shadowRoot!.querySelector('.menu')!
    // Simulate blur event with menu as related target
    element.dispatchEvent(new FocusEvent('blur', { relatedTarget: menu as HTMLElement }))
    await nextFrame()

    assert.isTrue(element.open)
  })
})

test.group('Selection events', () => {
  test('should dispatch change event when selection changes', async ({ assert }) => {
    const element = await basicFixture()
    element.open = true
    await element.updateComplete

    const changePromise = oneEvent(element, 'change')

    // Simulate option selection
    const option = element.querySelector('ui-option[value="apple"]') as UiOption
    element['handleSelect'](new CustomEvent('select', { detail: { item: option } }))

    const changeEvent = (await changePromise) as CustomEvent<UiSelectChangeEvent>
    assert.equal(changeEvent.detail.value, 'apple')
    assert.equal(changeEvent.detail.item, option)
    assert.isFalse(changeEvent.bubbles, 'change event should not bubble')
    assert.isFalse(changeEvent.composed, 'change event should not be composed')
    assert.isFalse(element.open, 'element should be closed after selection')
  })

  test('should dispatch open event when opening', async ({ assert }) => {
    const element = await basicFixture()
    await element.updateComplete

    const openPromise = oneEvent(element, 'open')
    element.open = true
    await element.updateComplete

    const openEvent = await openPromise
    assert.isFalse(openEvent.bubbles, 'open event should not bubble')
    assert.isFalse(openEvent.composed, 'open event should not be composed')
  })

  test('should dispatch close event when closing', async ({ assert }) => {
    const element = await basicFixture()
    element.open = true
    await element.updateComplete

    const closePromise = oneEvent(element, 'close')
    element.open = false
    await element.updateComplete

    const closeEvent = await closePromise
    assert.isFalse(closeEvent.bubbles, 'close event should not bubble')
    assert.isFalse(closeEvent.composed, 'close event should not be composed')
  })
})

test.group('Menu integration', () => {
  test('should highlight selected item when menu opens', async ({ assert }) => {
    const element = await withValueFixture()
    await element.updateComplete

    // Check that menu shows popover when opened
    element.open = true
    await element.updateComplete

    const menu = element.shadowRoot!.querySelector('ui-menu')!
    assert.isTrue(menu.matches(':popover-open'))
  })

  test('should highlight first item when no selection and menu opens', async ({ assert }) => {
    const element = await basicFixture()
    await element.updateComplete

    // Check that menu opens correctly
    element.open = true
    await element.updateComplete

    const menu = element.shadowRoot!.querySelector('ui-menu')!
    assert.isTrue(menu.matches(':popover-open'))
  })

  test('should handle menu close event', async ({ assert }) => {
    const element = await basicFixture()
    element.open = true
    await element.updateComplete

    element['handleMenuClose']()
    assert.isFalse(element.open)
  })
})

test.group('Accessibility', () => {
  test('should update aria-expanded when opening/closing', async ({ assert }) => {
    const element = await basicFixture()
    await element.updateComplete

    element.open = true
    await element.updateComplete
    assert.equal(element.getAttribute('aria-expanded'), 'true')

    element.open = false
    await element.updateComplete
    assert.equal(element.getAttribute('aria-expanded'), 'false')
  })

  test('should set aria-label from label property', async ({ assert }) => {
    const element = await basicFixture()
    element.label = 'Test label'
    await element.updateComplete

    assert.equal(element.getAttribute('aria-label'), 'Test label')
  })

  test('should remove aria-label when label is cleared', async ({ assert }) => {
    const element = await basicFixture()
    element.label = undefined
    await element.updateComplete

    assert.isFalse(element.hasAttribute('aria-label'))
  })
})

test.group('Edge cases', () => {
  test('should handle empty option list', async ({ assert }) => {
    const element = await emptyFixture()
    element.value = 'nonexistent'
    await element.updateComplete

    assert.equal(element.value, 'nonexistent')
    assert.isNull(element.selectedItem)
    assert.equal(element.renderValue, '')
  })

  test('should handle setting open before menu is rendered', async ({ assert }) => {
    const element = await basicFixture()
    await element.updateComplete

    // This should not throw an error even with timing issues
    element.open = true
    await element.updateComplete

    assert.isTrue(element.open)

    element.open = false
    await element.updateComplete

    assert.isFalse(element.open)
  })

  test('should maintain focus during interaction', async ({ assert }) => {
    const element = await basicFixture()
    await element.updateComplete

    // Open the menu first
    element.open = true
    await element.updateComplete

    const focusSpy = sinon.spy(element, 'focus')

    // Simulate selection - this should close the menu and return focus
    const option = element.querySelector('ui-option[value="apple"]') as UiOption
    element['handleSelect'](new CustomEvent('select', { detail: { item: option } }))

    // Element should now be closed
    assert.isFalse(element.open)

    // Wait for handleOpenChange to complete
    await element.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 0)) // Allow async operations

    assert.isTrue(focusSpy.called)
  })

  test('should handle selection with prevented event', async ({ assert }) => {
    const element = await basicFixture()
    element.open = true
    await element.updateComplete

    const event = new CustomEvent('select', {
      detail: { item: element.querySelector('ui-option') as UiOption },
    })
    const stopPropagationSpy = sinon.spy(event, 'stopPropagation')

    element['handleSelect'](event)
    assert.isTrue(stopPropagationSpy.called)
  })
})

test.group('Rendering', () => {
  test('should render with correct classes', async ({ assert }) => {
    const element = await basicFixture()
    await element.updateComplete

    const container = element.shadowRoot!.querySelector('.ui-select')!
    assert.isTrue(container.classList.contains('ui-select'))
    assert.isFalse(container.classList.contains('open'))
    assert.isFalse(container.classList.contains('disabled'))
  })

  test('should render with open class when open', async ({ assert }) => {
    const element = await basicFixture()
    element.open = true
    await element.updateComplete

    const container = element.shadowRoot!.querySelector('.ui-select')!
    assert.isTrue(container.classList.contains('open'))
  })

  test('should render with disabled class when disabled', async ({ assert }) => {
    const element = await disabledFixture()
    await element.updateComplete

    const container = element.shadowRoot!.querySelector('.ui-select')!
    assert.isTrue(container.classList.contains('disabled'))
  })

  test('should render focus ring', async ({ assert }) => {
    const element = await basicFixture()
    await element.updateComplete

    const focusRing = element.shadowRoot!.querySelector('ui-focus-ring')!
    assert.isNotNull(focusRing)
    assert.equal(focusRing.getAttribute('part'), 'focus-ring')
  })

  test('should render text field with correct properties', async ({ assert }) => {
    const element = await withValueFixture()
    await element.updateComplete

    const textField = element.shadowRoot!.querySelector('ui-outlined-text-field')!
    assert.equal(textField.label, 'Select an option')
    // The text field should show the render value of the selected option
    assert.equal(textField.value, element.renderValue)
    assert.isTrue(textField.hasAttribute('readonly'))
    assert.equal(textField.tabIndex, -1)
    assert.isTrue(textField.hasAttribute('inert'))
    assert.equal(textField.getAttribute('aria-hidden'), 'true')
  })

  test('should render dropdown icon', async ({ assert }) => {
    const element = await basicFixture()
    await element.updateComplete

    const icon = element.shadowRoot!.querySelector('ui-icon[slot="suffix"]')!
    assert.equal(icon.textContent!.trim(), 'arrow_drop_down')
  })

  test('should render menu with correct attributes', async ({ assert }) => {
    const element = await basicFixture()
    await element.updateComplete

    const menu = element.shadowRoot!.querySelector('ui-menu')!
    assert.equal(menu.id, 'menu')
    assert.equal(menu.getAttribute('popover'), 'auto')
    assert.equal(menu.getAttribute('selector'), 'ui-option')
  })

  test('should slot options correctly', async ({ assert }) => {
    const element = await basicFixture()
    await element.updateComplete

    const options = element.querySelectorAll('ui-option')
    assert.equal(options.length, 3)
    assert.equal(options[0].value, 'apple')
    assert.equal(options[1].value, 'banana')
    assert.equal(options[2].value, 'cherry')
  })
})

test.group('Selected attribute discovery', () => {
  test('should discover and set value from selected attribute on initialization', async ({ assert }) => {
    const element = await selectedAttributeFixture()
    await element.updateComplete
    await nextFrame()

    assert.equal(element.value, 'banana', 'value should be set from selected option')
    assert.isNotNull(element.selectedItem, 'selected item should not be null')
    assert.equal(element.selectedItem!.value, 'banana', 'selected item should be the banana option')
    assert.equal(element.renderValue, 'Banana', 'render value should match selected option')
  })

  test('should handle case with no selected options', async ({ assert }) => {
    const element = await basicFixture()
    await element.updateComplete
    await nextFrame()

    assert.isUndefined(element.value, 'value should be undefined when no options are selected')
    assert.isNull(element.selectedItem, 'selected item should be null when no options are selected')
    assert.equal(element.renderValue, '', 'render value should be empty when no options are selected')
  })

  test('should select the first option when multiple options have selected attribute', async ({ assert }) => {
    const element = await multipleSelectedFixture()
    await element.updateComplete
    await nextFrame()

    assert.equal(element.value, 'apple', 'should select the first option with selected attribute')
    assert.isNotNull(element.selectedItem, 'selected item should not be null')
    assert.equal(element.selectedItem!.value, 'apple', 'selected item should be the first selected option')
    assert.equal(element.renderValue, 'Apple', 'render value should match first selected option')
  })

  test('should prioritize explicit value property over selected attribute', async ({ assert }) => {
    const element = await selectedWithValueFixture()
    await element.updateComplete
    await nextFrame()

    assert.equal(element.value, 'cherry', 'value property should take precedence')
    assert.isNotNull(element.selectedItem, 'selected item should not be null')
    assert.equal(element.selectedItem!.value, 'cherry', 'selected item should match value property')
    assert.equal(element.renderValue, 'Cherry', 'render value should match value property')
  })

  test('should clear selection when value is explicitly set to undefined', async ({ assert }) => {
    const element = await selectedAttributeFixture()
    await element.updateComplete
    await nextFrame()

    // First, verify it's initialized correctly
    assert.equal(element.value, 'banana')

    // Now clear the value
    element.value = undefined
    await element.updateComplete
    await nextFrame()

    assert.isUndefined(element.value, 'should clear value when set to undefined')
    assert.isNull(element.selectedItem, 'selected item should be null when value is set to undefined')
    assert.equal(element.renderValue, '', 'render value should be empty when value is set to undefined')
  })

  test('should handle dynamically added options with selected attribute', async ({ assert }) => {
    const element = await dynamicOptionsFixture()
    await element.updateComplete
    await nextFrame()

    // Initially no options
    assert.isUndefined(element.value)
    assert.isNull(element.selectedItem)

    // Add options dynamically
    element.innerHTML = `
      <ui-option value="apple">Apple</ui-option>
      <ui-option value="banana" selected>Banana</ui-option>
      <ui-option value="cherry">Cherry</ui-option>
    `

    await element.updateComplete
    await nextFrame()

    assert.equal(element.value, 'banana', 'should discover selected option from dynamically added content')
    assert.isNotNull(element.selectedItem, 'selected item should not be null')
    assert.equal(
      (element.selectedItem as UiOption)!.value,
      'banana',
      'selected item should be the dynamically added selected option'
    )
  })

  test('should update when selected attribute is added to existing option', async ({ assert }) => {
    const element = await basicFixture()
    await element.updateComplete
    await nextFrame()

    // Initially no selection
    assert.isUndefined(element.value)
    assert.isNull(element.selectedItem)

    // Add selected attribute to an option
    const bananaOption = element.querySelector('ui-option[value="banana"]') as UiOption
    bananaOption.selected = true

    // Trigger setCurrentOption manually since we changed the DOM
    await (element as UiSelect & { setCurrentOption(): Promise<void> }).setCurrentOption()
    await element.updateComplete
    await nextFrame()

    assert.equal(element.value, 'banana', 'should discover newly selected option')
    assert.isNotNull(element.selectedItem, 'selected item should not be null')
    assert.equal(
      (element.selectedItem as UiOption)!.value,
      'banana',
      'selected item should be the newly selected option'
    )
  })

  test('should clear selection when selected attribute is removed from all options', async ({ assert }) => {
    const element = await selectedAttributeFixture()
    await element.updateComplete
    await nextFrame()

    // Initially has selection
    assert.equal(element.value, 'banana')

    // Remove selected attribute
    const bananaOption = element.querySelector('ui-option[value="banana"]') as UiOption
    bananaOption.selected = false

    // Clear the value to trigger rediscovery
    element.value = undefined
    await element.updateComplete
    await nextFrame()

    assert.isUndefined(element.value, 'value should be undefined when no options are selected')
    assert.isNull(element.selectedItem, 'selected item should be null when no options are selected')
    assert.equal(element.renderValue, '', 'render value should be empty when no options are selected')
  })
})

test.group('Type-ahead search', () => {
  test('should select matching option on type-ahead when menu is closed', async ({ assert }) => {
    const element = await basicFixture()
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }))
    await element.updateComplete

    assert.equal(element.value, 'banana')
    assert.equal(element.renderValue, 'Banana')
  })

  test('should focus matching option on type-ahead when menu is open', async ({ assert }) => {
    const element = await basicFixture()
    element.open = true
    await element.updateComplete

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }))
    await element.updateComplete

    const cherryOption = element.querySelector('ui-option[value="cherry"]') as UiOption
    assert.isTrue(cherryOption.matches(':focus'), 'Cherry option should be focused on type-ahead')
  })

  test('should accumulate characters for multi-character type-ahead search', async ({ assert }) => {
    const element = await basicFixture()
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }))
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'h' }))
    await element.updateComplete

    assert.equal(element.value, 'cherry')
  })

  test('should reset type-ahead buffer after timeout', async ({ assert }) => {
    const element = await basicFixture()
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    await element.updateComplete
    assert.equal(element.value, 'apple')

    // Wait for type-ahead timer to expire
    await new Promise((resolve) => setTimeout(resolve, 1100))

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }))
    await element.updateComplete
    assert.equal(element.value, 'banana')
  })

  test('should ignore disabled options during type-ahead', async ({ assert }) => {
    const element = await fixture<UiSelect>(html`
      <ui-select>
        <ui-option value="apple">Apple</ui-option>
        <ui-option value="banana" disabled>Banana</ui-option>
        <ui-option value="blueberry">Blueberry</ui-option>
      </ui-select>
    `)
    await element.updateComplete

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }))
    await element.updateComplete

    assert.equal(element.value, 'blueberry', 'should match next non-disabled option starting with b')
  })
})

test.group('Keyboard navigation details', () => {
  test('should select focused option on Enter key when menu is open', async ({ assert }) => {
    const element = await basicFixture()
    element.open = true
    await element.updateComplete

    const bananaOption = element.querySelector('ui-option[value="banana"]') as UiOption
    bananaOption.focus()

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    await element.updateComplete

    assert.equal(element.value, 'banana')
    assert.isFalse(element.open)
  })

  test('should select focused option on Space key when menu is open', async ({ assert }) => {
    const element = await basicFixture()
    element.open = true
    await element.updateComplete

    const cherryOption = element.querySelector('ui-option[value="cherry"]') as UiOption
    cherryOption.focus()

    element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
    await element.updateComplete

    assert.equal(element.value, 'cherry')
    assert.isFalse(element.open)
  })

  test('should focus first option on Home key when menu is open', async ({ assert }) => {
    const element = await basicFixture()
    element.open = true
    await element.updateComplete

    const cherryOption = element.querySelector('ui-option[value="cherry"]') as UiOption
    cherryOption.focus()

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }))
    await element.updateComplete

    const appleOption = element.querySelector('ui-option[value="apple"]') as UiOption
    assert.isTrue(appleOption.matches(':focus'))
  })

  test('should focus last option on End key when menu is open', async ({ assert }) => {
    const element = await basicFixture()
    element.open = true
    await element.updateComplete

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }))
    await element.updateComplete

    const cherryOption = element.querySelector('ui-option[value="cherry"]') as UiOption
    assert.isTrue(cherryOption.matches(':focus'))
  })
})

test.group('Form-associated standards and dynamic toggles', () => {
  test('should report correct willValidate property', async ({ assert }) => {
    const element = await basicFixture()
    assert.isTrue(element.willValidate)

    element.disabled = true
    await element.updateComplete
    assert.isFalse(element.willValidate)
  })

  test('should handle explicit empty string value in form submission', async ({ assert }) => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <ui-select name="choice" value="">
          <ui-option value="">None</ui-option>
          <ui-option value="apple">Apple</ui-option>
        </ui-select>
      </form>
    `)
    const select = form.querySelector('ui-select')!
    await select.updateComplete

    const formData = new FormData(form)
    assert.equal(formData.get('choice'), '')
  })

  test('should update validity when required property is toggled dynamically', async ({ assert }) => {
    const element = await basicFixture()
    assert.isTrue(element.checkValidity())

    element.required = true
    element.validate()
    await element.updateComplete
    assert.isFalse(element.checkValidity())
    assert.isTrue(element.invalid)

    element.required = false
    element.validate()
    await element.updateComplete
    assert.isTrue(element.checkValidity())
    assert.isFalse(element.invalid)
  })

  test('should handle all options disabled gracefully', async ({ assert }) => {
    const element = await fixture<UiSelect>(html`
      <ui-select>
        <ui-option value="a" disabled>A</ui-option>
        <ui-option value="b" disabled>B</ui-option>
      </ui-select>
    `)
    await element.updateComplete

    assert.isNull(element.getFirstSelectableOption())
    assert.isNull(element.getLastSelectableOption())
  })

  test('should skip hidden options during navigation', async ({ assert }) => {
    const element = await fixture<UiSelect>(html`
      <ui-select>
        <ui-option value="a">A</ui-option>
        <ui-option value="b" hidden>B</ui-option>
        <ui-option value="c">C</ui-option>
      </ui-select>
    `)
    element.open = true
    await element.updateComplete

    const optionA = element.querySelector('ui-option[value="a"]') as UiOption
    optionA.focus()

    element.focusNextMenuItem()
    await element.updateComplete

    const optionC = element.querySelector('ui-option[value="c"]') as UiOption
    assert.isTrue(optionC.matches(':focus'), 'Should skip hidden option B and focus C')
  })

  test('should re-validate required field on form reset', async ({ assert }) => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <ui-select name="choice" required value="apple">
          <ui-option value="apple">Apple</ui-option>
        </ui-select>
      </form>
    `)
    const select = form.querySelector('ui-select')!
    await select.updateComplete

    assert.isTrue(select.checkValidity())

    select.formResetCallback()
    select.validate()
    await select.updateComplete

    assert.isUndefined(select.value)
    assert.isFalse(select.checkValidity())
    assert.isTrue(select.invalid)
  })
})

test.group('Overlay management and dismissal guards', () => {
  test('dismisses select dropdown on Escape key', async ({ assert }) => {
    const element = await basicFixture()
    element.open = true
    await element.updateComplete

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true, cancelable: true })
    )
    await element.updateComplete

    assert.isFalse(element.open, 'select should close on Escape')
  })

  test('respects closeOnEscape=false', async ({ assert }) => {
    const element = await basicFixture()
    element.closeOnEscape = false
    element.open = true
    await element.updateComplete

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true, cancelable: true })
    )
    await element.updateComplete

    assert.isTrue(element.open, 'select should remain open when closeOnEscape is false')
  })

  test('dismisses select dropdown on outside pointerdown', async ({ assert }) => {
    const element = await basicFixture()
    element.open = true
    await element.updateComplete

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }))
    await element.updateComplete

    assert.isFalse(element.open, 'select should close on outside pointerdown')
  })

  test('respects closeOnOutsideClick=false', async ({ assert }) => {
    const element = await basicFixture()
    element.closeOnOutsideClick = false
    element.open = true
    await element.updateComplete

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }))
    await element.updateComplete

    assert.isTrue(element.open, 'select should remain open when closeOnOutsideClick is false')
  })

  test('prevents dismissal via beforeClose callback returning false', async ({ assert }) => {
    const element = await basicFixture()
    element.beforeClose = () => false
    element.open = true
    await element.updateComplete

    void element.close()
    await element.updateComplete

    assert.isTrue(element.open, 'select should remain open when beforeClose returns false')
  })

  test('prevents dismissal via async beforeClose callback', async ({ assert }) => {
    const element = await basicFixture()
    element.beforeClose = async () => {
      await Promise.resolve()
      return false
    }
    element.open = true
    await element.updateComplete

    const closed = await element.close()
    await element.updateComplete

    assert.isFalse(closed)
    assert.isTrue(element.open, 'select should remain open when async beforeClose resolves to false')
  })

  test('prevents dismissal via cancelable closing event', async ({ assert }) => {
    const element = await basicFixture()
    let closingFired = false
    element.addEventListener('closing', (e: Event) => {
      closingFired = true
      e.preventDefault()
    })
    element.open = true
    await element.updateComplete

    void element.close()
    await element.updateComplete

    assert.isTrue(closingFired)
    assert.isTrue(element.open, 'select should remain open when closing event is prevented')
  })

  test('does not steal focus back when closed via outside blur', async ({ assert }) => {
    const element = await basicFixture()
    element.open = true
    await element.updateComplete

    const externalInput = document.createElement('input')
    document.body.appendChild(externalInput)
    externalInput.focus()

    element.dispatchEvent(new FocusEvent('blur', { relatedTarget: externalInput }))
    await element.updateComplete

    assert.isFalse(element.open)
    assert.equal(document.activeElement, externalInput, 'focus should remain on external element')
    externalInput.remove()
  })
})

test.group('Option shape and interaction styling', () => {
  test('should use slight roundiness (4px) in default unselected state', async ({ assert }) => {
    const select = await basicFixture()
    const option = select.querySelector('ui-option') as UiOption
    await option.updateComplete

    const surface = option.shadowRoot!.querySelector('.surface') as HTMLElement
    const surfaceRadius = window.getComputedStyle(surface).borderRadius
    assert.equal(surfaceRadius, '4px')
  })

  test('should use more roundiness (12px) in selected state', async ({ assert }) => {
    const select = await selectedAttributeFixture()
    const selectedOption = select.querySelector('ui-option[selected]') as UiOption
    await selectedOption.updateComplete

    const surface = selectedOption.shadowRoot!.querySelector('.surface') as HTMLElement
    const surfaceRadius = window.getComputedStyle(surface).borderRadius
    assert.equal(surfaceRadius, '12px')
  })

  test('should maintain identical margin to container border in both default and selected states', async ({
    assert,
  }) => {
    const select = await selectedAttributeFixture()
    const defaultOption = select.querySelector('ui-option:not([selected])') as UiOption
    const selectedOption = select.querySelector('ui-option[selected]') as UiOption
    await defaultOption.updateComplete
    await selectedOption.updateComplete

    const surface = defaultOption.shadowRoot!.querySelector('.surface') as HTMLElement
    const selectedSurface = selectedOption.shadowRoot!.querySelector('.surface') as HTMLElement

    const defaultMarginLeft = window.getComputedStyle(surface).marginLeft
    const defaultMarginRight = window.getComputedStyle(surface).marginRight
    const selectedMarginLeft = window.getComputedStyle(selectedSurface).marginLeft
    const selectedMarginRight = window.getComputedStyle(selectedSurface).marginRight

    assert.equal(defaultMarginLeft, '6px')
    assert.equal(defaultMarginRight, '6px')
    assert.equal(selectedMarginLeft, defaultMarginLeft)
    assert.equal(selectedMarginRight, defaultMarginRight)
  })

  test('should have 48px height matching MD3 menu item density height', async ({ assert }) => {
    const select = await basicFixture()
    const option = select.querySelector('ui-option') as UiOption
    await option.updateComplete

    const surface = option.shadowRoot!.querySelector('.surface') as HTMLElement
    const height = window.getComputedStyle(surface).height
    assert.equal(height, '48px')
  })
})

test.group('Density and variant propagation', () => {
  test('should propagate density from select to child options and menu', async ({ assert }) => {
    const select: UiSelect = await fixture(html`
      <ui-select label="Fruit" density="-2">
        <ui-option value="apple">Apple</ui-option>
        <ui-option value="banana">Banana</ui-option>
      </ui-select>
    `)
    await select.updateComplete

    const options = Array.from(select.querySelectorAll<UiOption>('ui-option'))
    for (const option of options) {
      assert.equal(option.density, '-2')
      assert.equal(option.getAttribute('density'), '-2')
    }

    assert.equal(select.menu.density, '-2')
  })

  test('should propagate variant from select to child options and menu', async ({ assert }) => {
    const select: UiSelect = await fixture(html`
      <ui-select label="Fruit" variant="vibrant">
        <ui-option value="apple">Apple</ui-option>
        <ui-option value="banana">Banana</ui-option>
      </ui-select>
    `)
    await select.updateComplete

    const options = Array.from(select.querySelectorAll<UiOption>('ui-option'))
    for (const option of options) {
      assert.equal(option.variant, 'vibrant')
      assert.equal(option.getAttribute('variant'), 'vibrant')
    }

    assert.equal(select.menu.variant, 'vibrant')
  })

  test('should default density to "0" and variant to "standard"', async ({ assert }) => {
    const select = await basicFixture()
    assert.equal(select.density, '0')
    assert.equal(select.variant, 'standard')
    assert.equal(select.menu.density, '0')
    assert.equal(select.menu.variant, 'standard')

    const options = Array.from(select.querySelectorAll<UiOption>('ui-option'))
    for (const option of options) {
      assert.equal(option.density, '0')
      assert.equal(option.variant, 'standard')
    }
  })

  test('should dynamically propagate density changes to child options and menu', async ({ assert }) => {
    const select: UiSelect = await fixture(html`
      <ui-select label="Fruit">
        <ui-option value="apple">Apple</ui-option>
        <ui-option value="banana">Banana</ui-option>
      </ui-select>
    `)
    await select.updateComplete

    select.density = '-1'
    await select.updateComplete

    const options = Array.from(select.querySelectorAll<UiOption>('ui-option'))
    for (const option of options) {
      assert.equal(option.density, '-1')
      assert.equal(option.getAttribute('density'), '-1')
    }
    assert.equal(select.menu.density, '-1')
  })

  test('should dynamically propagate variant changes to child options and menu', async ({ assert }) => {
    const select: UiSelect = await fixture(html`
      <ui-select label="Fruit">
        <ui-option value="apple">Apple</ui-option>
        <ui-option value="banana">Banana</ui-option>
      </ui-select>
    `)
    await select.updateComplete

    select.variant = 'vibrant'
    await select.updateComplete

    const options = Array.from(select.querySelectorAll<UiOption>('ui-option'))
    for (const option of options) {
      assert.equal(option.variant, 'vibrant')
      assert.equal(option.getAttribute('variant'), 'vibrant')
    }
    assert.equal(select.menu.variant, 'vibrant')
  })

  test('should propagate density and variant to dynamically added options', async ({ assert }) => {
    const select: UiSelect = await fixture(html`
      <ui-select label="Fruit" density="-2" variant="vibrant">
        <ui-option value="apple">Apple</ui-option>
      </ui-select>
    `)
    await select.updateComplete

    const newOption = document.createElement('ui-option') as UiOption
    newOption.value = 'cherry'
    newOption.textContent = 'Cherry'
    select.appendChild(newOption)
    await nextFrame()
    await select.updateComplete
    await newOption.updateComplete

    assert.equal(newOption.density, '-2')
    assert.equal(newOption.variant, 'vibrant')
  })

  test('should harmonize supporting text colors in vibrant variant', async ({ assert }) => {
    const select: UiSelect = await fixture(html`
      <ui-select label="Fruit" variant="vibrant">
        <ui-option value="apple" selected>
          Apple
          <span slot="supporting-text">Selected Fruit</span>
        </ui-option>
        <ui-option value="banana">
          Banana
          <span slot="supporting-text">Unselected Fruit</span>
        </ui-option>
      </ui-select>
    `)
    await select.updateComplete

    const apple = select.querySelector('ui-option[value="apple"]') as UiOption
    const banana = select.querySelector('ui-option[value="banana"]') as UiOption
    await apple.updateComplete
    await banana.updateComplete

    const appleSupporting = apple.shadowRoot!.querySelector('.supporting-text') as HTMLElement
    const appleSurface = apple.shadowRoot!.querySelector('.surface') as HTMLElement
    const bananaSupporting = banana.shadowRoot!.querySelector('.supporting-text') as HTMLElement
    const bananaSurface = banana.shadowRoot!.querySelector('.surface') as HTMLElement

    const appleSupportingColor = window.getComputedStyle(appleSupporting).color
    const appleSurfaceColor = window.getComputedStyle(appleSurface).color
    const bananaSupportingColor = window.getComputedStyle(bananaSupporting).color
    const bananaSurfaceColor = window.getComputedStyle(bananaSurface).color

    assert.equal(appleSupportingColor, appleSurfaceColor)
    assert.equal(bananaSupportingColor, bananaSurfaceColor)
    assert.notEqual(appleSupportingColor, bananaSupportingColor)
  })

  test('should scale two-line option height according to density scale', async ({ assert }) => {
    const densities: { density: '0' | '-1' | '-2' | '-3'; expected: string }[] = [
      { density: '0', expected: '72px' },
      { density: '-1', expected: '68px' },
      { density: '-2', expected: '64px' },
      { density: '-3', expected: '60px' },
    ]

    for (const { density, expected } of densities) {
      const select: UiSelect = await fixture(html`
        <ui-select label="Email" density="${density}">
          <ui-option value="user" lines="two">
            User Name
            <span slot="supporting-text">user@example.com</span>
          </ui-option>
        </ui-select>
      `)
      await select.updateComplete

      const option = select.querySelector('ui-option') as UiOption
      await option.updateComplete

      const surface = option.shadowRoot!.querySelector('.surface') as HTMLElement
      const height = window.getComputedStyle(surface).height
      assert.equal(height, expected, `two-line option height at density ${density} should be ${expected}`)
    }
  })

  test('should scale three-line option height according to density scale', async ({ assert }) => {
    const densities: { density: '0' | '-1' | '-2' | '-3'; expected: string }[] = [
      { density: '0', expected: '88px' },
      { density: '-1', expected: '84px' },
      { density: '-2', expected: '80px' },
      { density: '-3', expected: '76px' },
    ]

    for (const { density, expected } of densities) {
      const select: UiSelect = await fixture(html`
        <ui-select label="Article" density="${density}">
          <ui-option value="article" lines="three">
            Article Title
            <span slot="supporting-text">Extended summary description goes here across multiple lines</span>
          </ui-option>
        </ui-select>
      `)
      await select.updateComplete

      const option = select.querySelector('ui-option') as UiOption
      await option.updateComplete

      const surface = option.shadowRoot!.querySelector('.surface') as HTMLElement
      const height = window.getComputedStyle(surface).height
      assert.equal(height, expected, `three-line option height at density ${density} should be ${expected}`)
    }
  })
})
