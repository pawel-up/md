import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { UiSegmentedButtonElement } from '../../../../src/components/segmented-button/ui-segmented-button.js'
import { UiSegmentedButtonSetElement } from '../../../../src/components/segmented-button/ui-segmented-button-set.js'
import sinon from 'sinon'

import '../../../../src/components/segmented-button/ui-segmented-button.js'
import '../../../../src/components/segmented-button/ui-segmented-button-set.js'

test.group('SegmentedButton', () => {
  async function buttonFixture(): Promise<UiSegmentedButtonElement> {
    return fixture(html`<ui-segmented-button>Option 1</ui-segmented-button>`) as Promise<UiSegmentedButtonElement>
  }

  test('has default property values', async ({ assert }) => {
    const btn = await buttonFixture()
    assert.isFalse(btn.selected)
    assert.isFalse(btn.disabled)
    assert.equal(btn.getAttribute('role'), 'button')
    assert.equal(btn.getAttribute('tabindex'), '0')
  }).tags(['@md', '@segmented-button'])

  test('reflects selected state to class and mark', async ({ assert }) => {
    const btn = await buttonFixture()
    const surface = btn.shadowRoot?.querySelector('.surface')
    assert.isNotNull(surface)
    assert.isFalse(surface?.classList.contains('selected'))

    btn.selected = true
    await nextFrame()
    assert.isTrue(surface?.classList.contains('selected'))

    const checkmark = btn.shadowRoot?.querySelector('.check-mark')
    assert.isNotNull(checkmark)
    assert.isTrue(checkmark?.classList.contains('checked'))
  }).tags(['@md', '@segmented-button'])

  test('dispatches trigger event when endPress is called', async ({ assert }) => {
    const btn = await buttonFixture()
    const triggerSpy = sinon.spy()
    btn.addEventListener('trigger', triggerSpy)

    btn.endPress({ cancelled: false })
    await nextFrame()
    assert.isTrue(triggerSpy.calledOnce)
  }).tags(['@md', '@segmented-button'])

  test('does not dispatch trigger event when endPress is cancelled', async ({ assert }) => {
    const btn = await buttonFixture()
    const triggerSpy = sinon.spy()
    btn.addEventListener('trigger', triggerSpy)

    btn.endPress({ cancelled: true })
    await nextFrame()
    assert.isFalse(triggerSpy.called)
  }).tags(['@md', '@segmented-button'])
})

test.group('SegmentedButtonSet', () => {
  async function singleSelectFixture(): Promise<UiSegmentedButtonSetElement> {
    return fixture(html`
      <ui-segmented-button-set>
        <ui-segmented-button id="btn1">Item 1</ui-segmented-button>
        <ui-segmented-button id="btn2">Item 2</ui-segmented-button>
        <ui-segmented-button id="btn3">Item 3</ui-segmented-button>
      </ui-segmented-button-set>
    `) as Promise<UiSegmentedButtonSetElement>
  }

  async function multiSelectFixture(): Promise<UiSegmentedButtonSetElement> {
    return fixture(html`
      <ui-segmented-button-set multiselect>
        <ui-segmented-button id="btn1">Item 1</ui-segmented-button>
        <ui-segmented-button id="btn2">Item 2</ui-segmented-button>
        <ui-segmented-button id="btn3">Item 3</ui-segmented-button>
      </ui-segmented-button-set>
    `) as Promise<UiSegmentedButtonSetElement>
  }

  test('has default property values and roles', async ({ assert }) => {
    const set = await singleSelectFixture()
    assert.isFalse(set.multiselect)
    assert.equal(set.getAttribute('role'), 'group')
  }).tags(['@md', '@segmented-button'])

  test('identifies buttons in slot', async ({ assert }) => {
    const set = await singleSelectFixture()
    assert.equal(set.buttons.length, 3)
  }).tags(['@md', '@segmented-button'])

  test('manages button selection programmatically in single-select', async ({ assert }) => {
    const set = await singleSelectFixture()

    // Select button 1
    set.setButtonSelected(0, true)
    assert.isTrue(set.isButtonSelected(0))
    assert.isFalse(set.isButtonSelected(1))
    assert.isFalse(set.isButtonSelected(2))

    // Select button 2 - should deselect button 1
    set.setButtonSelected(1, true)
    assert.isFalse(set.isButtonSelected(0))
    assert.isTrue(set.isButtonSelected(1))
    assert.isFalse(set.isButtonSelected(2))

    // Single-select buttons cannot be deselected directly
    set.setButtonSelected(1, false)
    assert.isTrue(set.isButtonSelected(1))
  }).tags(['@md', '@segmented-button'])

  test('manages button selection programmatically in multi-select', async ({ assert }) => {
    const set = await multiSelectFixture()

    // Select button 1 and 2
    set.setButtonSelected(0, true)
    set.setButtonSelected(1, true)
    assert.isTrue(set.isButtonSelected(0))
    assert.isTrue(set.isButtonSelected(1))
    assert.isFalse(set.isButtonSelected(2))

    // Multi-select buttons can be deselected directly
    set.setButtonSelected(1, false)
    assert.isTrue(set.isButtonSelected(0))
    assert.isFalse(set.isButtonSelected(1))
  }).tags(['@md', '@segmented-button'])

  test('dispatches select event and toggles on trigger event in single-select', async ({ assert }) => {
    const set = await singleSelectFixture()
    const selectSpy = sinon.spy()
    set.addEventListener('select', selectSpy)

    const btn2 = set.querySelector('#btn2') as UiSegmentedButtonElement
    btn2.dispatchEvent(new Event('trigger', { bubbles: true, composed: true }))
    await nextFrame()

    assert.isTrue(btn2.selected)
    assert.isTrue(selectSpy.calledOnce)
    assert.equal(selectSpy.firstCall.args[0].detail.index, 1)
    assert.isTrue(selectSpy.firstCall.args[0].detail.selected)
  }).tags(['@md', '@segmented-button'])

  test('dispatches select event and toggles on trigger event in multi-select', async ({ assert }) => {
    const set = await multiSelectFixture()
    const selectSpy = sinon.spy()
    set.addEventListener('select', selectSpy)

    const btn1 = set.querySelector('#btn1') as UiSegmentedButtonElement

    // Select btn1
    btn1.dispatchEvent(new Event('trigger', { bubbles: true, composed: true }))
    await nextFrame()
    assert.isTrue(btn1.selected)
    assert.isTrue(selectSpy.calledOnce)
    assert.isTrue(selectSpy.firstCall.args[0].detail.selected)

    // Deselect btn1
    btn1.dispatchEvent(new Event('trigger', { bubbles: true, composed: true }))
    await nextFrame()
    assert.isFalse(btn1.selected)
    assert.isTrue(selectSpy.calledTwice)
    assert.isFalse(selectSpy.secondCall.args[0].detail.selected)
  }).tags(['@md', '@segmented-button'])

  test('manages button disabled state programmatically', async ({ assert }) => {
    const set = await singleSelectFixture()
    assert.isFalse(set.isButtonDisabled(0))

    set.setButtonDisabled(0, true)
    assert.isTrue(set.isButtonDisabled(0))

    // Setting selection on disabled button should be ignored
    set.setButtonSelected(0, true)
    assert.isFalse(set.isButtonSelected(0))
  }).tags(['@md', '@segmented-button'])
})
