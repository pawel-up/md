import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { UiFilledTextFieldElement } from '../../../../src/components/text-field/ui-filled-text-field.js'

import '../../../../src/components/text-field/ui-filled-text-field.js'

test.group('TextField', () => {
  async function basicFixture(): Promise<UiFilledTextFieldElement> {
    return fixture(html`<ui-filled-text-field label="Name"></ui-filled-text-field>`)
  }

  async function valueFixture(): Promise<UiFilledTextFieldElement> {
    return fixture(html`<ui-filled-text-field label="Name" value="Alice"></ui-filled-text-field>`)
  }

  test('has default empty value', async ({ assert }) => {
    const field = await basicFixture()
    assert.equal(field.value, '')
  }).tags(['@md', '@text-field'])

  test('sets initial value via markup', async ({ assert }) => {
    const field = await valueFixture()
    assert.equal(field.value, 'Alice')
  }).tags(['@md', '@text-field'])

  test('flushes programmatic setters set before rendering (selectionStart/End)', async ({ assert }) => {
    // Instantiate element programmatically without appending to DOM yet
    const field = document.createElement('ui-filled-text-field') as UiFilledTextFieldElement
    field.value = 'Hello World'
    field.selectionStart = 3
    field.selectionEnd = 8

    // Append to document/render
    const container = await fixture(html`<div></div>`)
    container.appendChild(field)
    await nextFrame()
    await field.updateComplete

    // Verify properties are correctly flushed to native input element
    assert.equal(field.selectionStart, 3)
    assert.equal(field.selectionEnd, 8)
  }).tags(['@md', '@text-field'])

  test('manages disabled state and tabindex', async ({ assert }) => {
    const field = await basicFixture()
    assert.isFalse(field.disabled)

    field.disabled = true
    await nextFrame()
    assert.isTrue(field.disabled)
    assert.equal(field.getAttribute('aria-disabled'), 'true')

    field.disabled = false
    await nextFrame()
    assert.isFalse(field.disabled)
    assert.isFalse(field.hasAttribute('aria-disabled'))
  }).tags(['@md', '@text-field'])
})
