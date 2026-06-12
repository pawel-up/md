import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { UiTextAreaElement } from '../../../../src/components/text-area/ui-text-area.js'

import '../../../../src/components/text-area/ui-text-area.js'

test.group('TextArea', () => {
  async function basicFixture(): Promise<UiTextAreaElement> {
    return fixture(html`<ui-text-area label="Description"></ui-text-area>`) as Promise<UiTextAreaElement>
  }

  async function valueFixture(): Promise<UiTextAreaElement> {
    return fixture(
      html`<ui-text-area label="Description" value="Hello World"></ui-text-area>`
    ) as Promise<UiTextAreaElement>
  }

  test('has default empty value', async ({ assert }) => {
    const el = await basicFixture()
    assert.equal(el.value, '')
  }).tags(['@md', '@text-area'])

  test('sets initial value via markup', async ({ assert }) => {
    const el = await valueFixture()
    assert.equal(el.value, 'Hello World')
    const textarea = el.shadowRoot?.querySelector('textarea')
    assert.isNotNull(textarea)
    assert.equal(textarea?.value, 'Hello World')
  }).tags(['@md', '@text-area'])

  test('maps rows, cols, and wrap attributes to the native textarea', async ({ assert }) => {
    const el = (await fixture(html`<ui-text-area rows="5" cols="40" wrap="hard"></ui-text-area>`)) as UiTextAreaElement
    const textarea = el.shadowRoot?.querySelector('textarea')
    assert.isNotNull(textarea)
    assert.equal(textarea?.getAttribute('rows'), '5')
    assert.equal(textarea?.getAttribute('cols'), '40')
    assert.equal(textarea?.getAttribute('wrap'), 'hard')

    el.rows = 10
    el.cols = 50
    el.wrap = 'soft'
    await nextFrame()
    assert.equal(textarea?.getAttribute('rows'), '10')
    assert.equal(textarea?.getAttribute('cols'), '50')
    assert.equal(textarea?.getAttribute('wrap'), 'soft')
  }).tags(['@md', '@text-area'])

  test('manages disabled state', async ({ assert }) => {
    const el = await basicFixture()
    assert.isFalse(el.disabled)
    const textarea = el.shadowRoot?.querySelector('textarea')
    assert.isFalse(textarea?.disabled)

    el.disabled = true
    await nextFrame()
    assert.isTrue(el.disabled)
    assert.isTrue(textarea?.disabled)
    assert.equal(el.getAttribute('aria-disabled'), 'true')

    el.disabled = false
    await nextFrame()
    assert.isFalse(el.disabled)
    assert.isFalse(textarea?.disabled)
    assert.isFalse(el.hasAttribute('aria-disabled'))
  }).tags(['@md', '@text-area'])

  test('flushes programmatic setters set before rendering (selectionStart/End)', async ({ assert }) => {
    const el = document.createElement('ui-text-area') as UiTextAreaElement
    el.value = 'Hello world text area'
    el.selectionStart = 6
    el.selectionEnd = 11

    const container = (await fixture(html`<div></div>`)) as HTMLElement
    container.appendChild(el)
    await nextFrame()
    await el.updateComplete

    assert.equal(el.selectionStart, 6)
    assert.equal(el.selectionEnd, 11)
  }).tags(['@md', '@text-area'])

  test('handles invalid/validation state', async ({ assert }) => {
    const el = (await fixture(html`<ui-text-area required value=""></ui-text-area>`)) as UiTextAreaElement
    assert.isUndefined(el.invalid)

    // Trigger validity check
    const isValid = el.checkValidity()
    assert.isFalse(isValid)
    assert.isTrue(el.invalid)
  }).tags(['@md', '@text-area'])
})
