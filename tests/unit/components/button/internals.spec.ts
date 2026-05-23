import { fixture, html, test } from '@pawel-up/lupa/testing'
import { UiButtonElement } from '../../../../src/components/button/ui-button.js'

import '../../../../src/components/button/ui-button.js'

test.group('Internals', () => {
  async function basicFixture(): Promise<UiButtonElement> {
    return fixture(html`<ui-button color="filled">Label</ui-button>`)
  }

  test('has validity', async ({ assert }) => {
    const button = await basicFixture()
    assert.ok(button.validity)
  }).tags(['@md', '@button'])

  test('has empty validationMessage', async ({ assert }) => {
    const button = await basicFixture()
    assert.equal(button.validationMessage, '')
  }).tags(['@md', '@button'])

  test('has willValidate', async ({ assert }) => {
    const button = await basicFixture()
    assert.ok(button.willValidate)
  }).tags(['@md', '@button'])

  test('calls checkValidity', async ({ assert }) => {
    const button = await basicFixture()
    assert.isTrue(button.checkValidity())
  }).tags(['@md', '@button'])

  test('calls reportValidity', async ({ assert }) => {
    const button = await basicFixture()
    assert.isTrue(button.reportValidity())
  }).tags(['@md', '@button'])
})
