import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { UiRadioElement } from '../../../../src/components/radio/ui-radio.js'

import '../../../../src/components/radio/ui-radio.js'

test.group('Radio', () => {
  async function basicFixture(): Promise<HTMLDivElement> {
    return fixture(html`
      <div>
        <ui-radio name="group1" value="1" id="radio1"></ui-radio>
        <ui-radio name="group1" value="2" id="radio2"></ui-radio>
        <ui-radio name="group1" value="3" id="radio3"></ui-radio>
      </div>
    `)
  }

  async function checkedFixture(): Promise<HTMLDivElement> {
    return fixture(html`
      <div>
        <ui-radio name="group1" value="1" id="radio1"></ui-radio>
        <ui-radio name="group1" value="2" id="radio2" checked></ui-radio>
        <ui-radio name="group1" value="3" id="radio3"></ui-radio>
      </div>
    `)
  }

  test('only the first enabled radio has tabindex="0" when none are checked', async ({ assert }) => {
    const container = await basicFixture()
    const r1 = container.querySelector('#radio1') as UiRadioElement
    const r2 = container.querySelector('#radio2') as UiRadioElement
    const r3 = container.querySelector('#radio3') as UiRadioElement

    assert.equal(r1.getAttribute('tabindex'), '0')
    assert.isFalse(r2.hasAttribute('tabindex'))
    assert.isFalse(r3.hasAttribute('tabindex'))
  }).tags(['@md', '@radio'])

  test('only the checked radio has tabindex="0"', async ({ assert }) => {
    const container = await checkedFixture()
    const r1 = container.querySelector('#radio1') as UiRadioElement
    const r2 = container.querySelector('#radio2') as UiRadioElement
    const r3 = container.querySelector('#radio3') as UiRadioElement

    assert.isFalse(r1.hasAttribute('tabindex'))
    assert.equal(r2.getAttribute('tabindex'), '0')
    assert.isFalse(r3.hasAttribute('tabindex'))
  }).tags(['@md', '@radio'])

  test('selection is mutually exclusive within a group', async ({ assert }) => {
    const container = await basicFixture()
    const r1 = container.querySelector('#radio1') as UiRadioElement
    const r2 = container.querySelector('#radio2') as UiRadioElement

    r1.click()
    await nextFrame()
    assert.isTrue(r1.checked)

    r2.click()
    await nextFrame()
    assert.isFalse(r1.checked)
    assert.isTrue(r2.checked)
  }).tags(['@md', '@radio'])

  test('handles ArrowRight keydown to select next radio', async ({ assert }) => {
    const container = await checkedFixture()
    const r2 = container.querySelector('#radio2') as UiRadioElement
    const r3 = container.querySelector('#radio3') as UiRadioElement

    const event = new KeyboardEvent('keydown', { code: 'ArrowRight' })
    r2.handleKeyDown(event)
    await nextFrame()

    assert.isFalse(r2.checked)
    assert.isTrue(r3.checked)
  }).tags(['@md', '@radio'])

  test('dynamically adjusts tabindex when a radio is disabled', async ({ assert }) => {
    const container = await basicFixture()
    const r1 = container.querySelector('#radio1') as UiRadioElement
    const r2 = container.querySelector('#radio2') as UiRadioElement

    // Initially r1 is focusable since none is checked
    assert.equal(r1.getAttribute('tabindex'), '0')

    // Disable r1
    r1.disabled = true
    await nextFrame()

    // r2 should become focusable since r1 is disabled
    assert.isFalse(r1.hasAttribute('tabindex'))
    assert.equal(r2.getAttribute('tabindex'), '0')
  }).tags(['@md', '@radio'])

  test('dynamically adjusts groups when element name is changed', async ({ assert }) => {
    const container = await basicFixture()
    const r1 = container.querySelector('#radio1') as UiRadioElement
    const r2 = container.querySelector('#radio2') as UiRadioElement
    const r3 = container.querySelector('#radio3') as UiRadioElement

    // Initially: r1 has tabindex="0", r2 and r3 do not
    assert.equal(r1.getAttribute('tabindex'), '0')

    // Change r1's name to a different group
    r1.name = 'group2'
    await nextFrame()

    // Now group1 has [r2, r3], so r2 (first enabled in group1) should get tabindex="0"
    // group2 has [r1], so r1 should get tabindex="0"
    assert.equal(r1.getAttribute('tabindex'), '0')
    assert.equal(r2.getAttribute('tabindex'), '0')
    assert.isFalse(r3.hasAttribute('tabindex'))
  }).tags(['@md', '@radio'])
})
