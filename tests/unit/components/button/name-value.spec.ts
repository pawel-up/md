import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { UiButtonElement } from '../../../../src/components/button/ui-button.js'

import '../../../../src/components/button/ui-button.js'

test.group('Value and Name', () => {
  async function basicFixture(): Promise<UiButtonElement> {
    return fixture(html`<ui-button color="filled">Label</ui-button>`)
  }

  test('sets the value', async ({ assert }) => {
    const button = await basicFixture()
    button.value = 'test'
    assert.equal(button.value, 'test')
  }).tags(['@md', '@button'])

  test('sets the name', async ({ assert }) => {
    const button = await basicFixture()
    button.name = 'test'
    assert.equal(button.name, 'test')
  }).tags(['@md', '@button'])

  test('sets the form value', async ({ assert }) => {
    const button = await basicFixture()
    button.value = 'test'
    await nextFrame()
    assert.equal(button.value, 'test')
  }).tags(['@md', '@button'])
})
