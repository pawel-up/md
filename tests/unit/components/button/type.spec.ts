import { fixture, html, test } from '@pawel-up/lupa/testing'
import { UiButtonElement } from '../../../../src/components/button/ui-button.js'

import '../../../../src/components/button/ui-button.js'

test.group('Type', () => {
  async function basicFixture(): Promise<UiButtonElement> {
    return fixture(html`<ui-button color="filled">Label</ui-button>`)
  }

  test('sets the default type', async ({ assert }) => {
    const button = await basicFixture()
    assert.equal(button.type, 'button')
  }).tags(['@md', '@button'])

  test('sets the type', async ({ assert }) => {
    const button = await basicFixture()
    button.type = 'submit'
    assert.equal(button.type, 'submit')
  }).tags(['@md', '@button'])
})
