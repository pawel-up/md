import { fixture, html, test } from '@pawel-up/lupa/testing'
import { UiButtonElement } from '../../../../src/components/button/ui-button.js'

import '../../../../src/components/button/ui-button.js'

test.group('Destructive button', () => {
  async function basicFixture(): Promise<UiButtonElement> {
    return fixture(html`<ui-button color="filled">Label</ui-button>`)
  }

  async function destructiveFixture(): Promise<UiButtonElement> {
    return fixture(html`<ui-button color="filled" destructive>Label</ui-button>`)
  }

  test('is not destructive by default', async ({ assert }) => {
    const button = await basicFixture()
    assert.isFalse(button.destructive)
  }).tags(['@md', '@button', '@destructive'])

  test('is destructive via the markup', async ({ assert }) => {
    const button = await destructiveFixture()
    assert.isTrue(button.destructive)
  }).tags(['@md', '@button', '@destructive'])

  test('reflects property changes to attribute', async ({ assert }) => {
    const button = await basicFixture()
    button.destructive = true
    await button.updateComplete
    assert.isTrue(button.hasAttribute('destructive'))
  }).tags(['@md', '@button', '@destructive'])

  test('reflects attribute changes to property', async ({ assert }) => {
    const button = await basicFixture()
    button.setAttribute('destructive', '')
    await button.updateComplete
    assert.isTrue(button.destructive)
  }).tags(['@md', '@button', '@destructive'])
})
