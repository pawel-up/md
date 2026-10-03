import { test, fixture, html } from '@pawel-up/lupa/testing'
import '../../../../src/components/date-picker/ui-date-picker-input.js'
import { UiDatePickerInput } from '../../../../src/components/date-picker/ui-date-picker-input.js'
import { OverlayStackManager } from '../../../../src/controllers/OverlayStackManager.js'

test.group('UiDatePickerInput - OverlayController Integration', (group) => {
  group.each.teardown(() => {
    OverlayStackManager.getInstance().reset()
  })

  test('supports open property and backwards-compatible isOpen alias', async ({ assert }) => {
    const el = await fixture<UiDatePickerInput>(html`<ui-date-picker-input label="Date"></ui-date-picker-input>`)
    assert.isFalse(el.open)
    assert.isFalse(el.isOpen)

    el.open = true
    await el.updateComplete
    assert.isTrue(el.isOpen)
    assert.ok(el.shadowRoot?.querySelector('.dropdown-container'))

    el.isOpen = false
    await el.updateComplete
    assert.isFalse(el.open)
    assert.isNull(el.shadowRoot?.querySelector('.dropdown-container'))
  })

  test('dismisses on Escape key', async ({ assert }) => {
    const el = await fixture<UiDatePickerInput>(html`<ui-date-picker-input open></ui-date-picker-input>`)
    await el.updateComplete
    assert.isTrue(el.open)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await el.updateComplete

    assert.isFalse(el.open)
  })

  test('dismisses on outside pointerdown', async ({ assert }) => {
    const el = await fixture<UiDatePickerInput>(html`<ui-date-picker-input open></ui-date-picker-input>`)
    await el.updateComplete

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }))
    await el.updateComplete

    assert.isFalse(el.open)
  })

  test('respects closeOnOutsideClick=false', async ({ assert }) => {
    const el = await fixture<UiDatePickerInput>(html`
      <ui-date-picker-input open .closeOnOutsideClick=${false}></ui-date-picker-input>
    `)
    await el.updateComplete

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }))
    await el.updateComplete

    assert.isTrue(el.open)
  })

  test('respects beforeClose callback on Escape', async ({ assert }) => {
    const el = await fixture<UiDatePickerInput>(html`<ui-date-picker-input open></ui-date-picker-input>`)
    await el.updateComplete
    el.beforeClose = () => false

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await el.updateComplete

    assert.isTrue(el.open)
  })

  test('respects beforeClose callback on outside pointerdown', async ({ assert }) => {
    const el = await fixture<UiDatePickerInput>(html`<ui-date-picker-input open></ui-date-picker-input>`)
    await el.updateComplete
    el.beforeClose = () => false

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }))
    await el.updateComplete

    assert.isTrue(el.open)
  })

  test('closes and dispatches close event on calendar date select', async ({ assert }) => {
    const el = await fixture<UiDatePickerInput>(html`<ui-date-picker-input open></ui-date-picker-input>`)
    await el.updateComplete

    let closeReason: string | undefined
    el.addEventListener('close', (e: Event) => {
      const customEvent = e as CustomEvent<{ reason: string }>
      closeReason = customEvent.detail.reason
    })

    const calendar = el.shadowRoot?.querySelector('ui-date-picker-calendar')
    assert.ok(calendar)

    const selectedDate = new Date(2026, 9, 15)
    calendar?.dispatchEvent(new CustomEvent('date-select', { detail: { date: selectedDate }, bubbles: true }))
    await el.updateComplete

    assert.isFalse(el.open)
    assert.equal(closeReason, 'confirm')
    assert.equal(el.value?.getTime(), selectedDate.getTime())
  })

  test('closes and dispatches close event on calendar cancel', async ({ assert }) => {
    const el = await fixture<UiDatePickerInput>(html`<ui-date-picker-input open></ui-date-picker-input>`)
    await el.updateComplete

    let closeReason: string | undefined
    el.addEventListener('close', (e: Event) => {
      const customEvent = e as CustomEvent<{ reason: string }>
      closeReason = customEvent.detail.reason
    })

    const calendar = el.shadowRoot?.querySelector('ui-date-picker-calendar')
    assert.ok(calendar)

    calendar?.dispatchEvent(new CustomEvent('date-cancel', { bubbles: true }))
    await el.updateComplete

    assert.isFalse(el.open)
    assert.equal(closeReason, 'close-button')
  })

  test('closes and dispatches close event when clicking text field while open', async ({ assert }) => {
    const el = await fixture<UiDatePickerInput>(html`<ui-date-picker-input open></ui-date-picker-input>`)
    await el.updateComplete

    let closeReason: string | undefined
    el.addEventListener('close', (e: Event) => {
      const customEvent = e as CustomEvent<{ reason: string }>
      closeReason = customEvent.detail.reason
    })

    const input = el.shadowRoot?.querySelector('ui-outlined-text-field') as HTMLElement
    assert.ok(input)
    input.click()
    await el.updateComplete

    assert.isFalse(el.open)
    assert.equal(closeReason, 'programmatic')
  })

  test('clicking text field while open respects beforeClose callback', async ({ assert }) => {
    const el = await fixture<UiDatePickerInput>(html`<ui-date-picker-input open></ui-date-picker-input>`)
    await el.updateComplete

    el.beforeClose = () => false

    const input = el.shadowRoot?.querySelector('ui-outlined-text-field') as HTMLElement
    assert.ok(input)
    input.click()
    await el.updateComplete

    assert.isTrue(el.open, 'remains open when beforeClose returns false')
  })

  test('close() method closes dropdown and dispatches close event', async ({ assert }) => {
    const el = await fixture<UiDatePickerInput>(html`<ui-date-picker-input open></ui-date-picker-input>`)
    await el.updateComplete

    el.beforeClose = () => false
    el.close()
    await el.updateComplete
    assert.isTrue(el.open, 'does not close when beforeClose returns false')

    el.beforeClose = undefined
    let closeReason: string | undefined
    el.addEventListener('close', (e: Event) => {
      const customEvent = e as CustomEvent<{ reason: string }>
      closeReason = customEvent.detail.reason
    })

    el.close()
    await el.updateComplete
    assert.isFalse(el.open)
    assert.equal(closeReason, 'programmatic')
  })

  test('respects closeOnEscape=false', async ({ assert }) => {
    const el = await fixture<UiDatePickerInput>(
      html`<ui-date-picker-input open .closeOnEscape=${false}></ui-date-picker-input>`
    )
    await el.updateComplete

    const input = el.shadowRoot?.querySelector('ui-outlined-text-field') as HTMLElement
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true, cancelable: true })
    )
    await el.updateComplete

    assert.isTrue(el.open, 'should remain open when closeOnEscape is false')
  })

  test('stops Escape key propagation and protects underlying overlay', async ({ assert }) => {
    const underlyingEl = await fixture<UiDatePickerInput>(html`<ui-date-picker-input open></ui-date-picker-input>`)
    await underlyingEl.updateComplete

    const el = await fixture<UiDatePickerInput>(html`<ui-date-picker-input open></ui-date-picker-input>`)
    await el.updateComplete

    const input = el.shadowRoot?.querySelector('ui-outlined-text-field') as HTMLElement
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true, cancelable: true })
    )
    await el.updateComplete
    await underlyingEl.updateComplete

    assert.isFalse(el.open, 'date picker should be closed on Escape')
    assert.isTrue(underlyingEl.open, 'underlying overlay should remain open')
  })
})
