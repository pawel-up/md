import { fixture, html, test } from '@pawel-up/lupa/testing'
import { UiButtonElement } from '../../../../src/components/button/ui-button.js'

import '../../../../src/components/button/ui-button.js'
import '../../../../src/components/icons/ui-icon.js'

test.group('a11y', () => {
  async function basicFixture(): Promise<UiButtonElement> {
    return fixture(html`<ui-button color="filled">Label</ui-button>`)
  }

  async function disabledFixture(): Promise<UiButtonElement> {
    return fixture(html`<ui-button color="filled" disabled>Label</ui-button>`)
  }

  async function tabindexFixture(): Promise<UiButtonElement> {
    return fixture(html`<ui-button color="filled" tabindex="1">Label</ui-button>`)
  }

  async function toggleFixture(): Promise<UiButtonElement> {
    return fixture(
      html`<ui-button color="filled" toggle>
        <ui-icon slot="icon" icon="add"></ui-icon>
        Label
      </ui-button>`
    )
  }

  async function toggleSelectedFixture(): Promise<UiButtonElement> {
    return fixture(
      html`<ui-button color="filled" toggle selected>
        <ui-icon slot="icon" icon="add"></ui-icon>
        Label
      </ui-button>`
    )
  }

  test('is accessible when in a default state', async ({ assert }) => {
    const button = await basicFixture()
    await assert.isAccessible(button)
  }).tags(['@md', '@button', '@a11y'])

  test('is accessible when in the disabled state', async ({ assert }) => {
    const button = await disabledFixture()
    await assert.isAccessible(button)
  }).tags(['@md', '@button', '@a11y'])

  test('sets the role', async ({ assert }) => {
    const button = await basicFixture()
    assert.equal(button.getAttribute('role'), 'button')
  }).tags(['@md', '@button', '@a11y'])

  test('sets the tabindex', async ({ assert }) => {
    const button = await basicFixture()
    assert.equal(button.getAttribute('tabindex'), '0')
  }).tags(['@md', '@button', '@a11y'])

  test('respects the existing tabindex', async ({ assert }) => {
    const button = await tabindexFixture()
    assert.equal(button.getAttribute('tabindex'), '1')
  }).tags(['@md', '@button', '@a11y'])

  test('is accessible when not selected', async ({ assert }) => {
    const button = await toggleFixture()
    await assert.isAccessible(button)
  }).tags(['@md', '@button', '@a11y'])

  test('is accessible when selected', async ({ assert }) => {
    const button = await toggleSelectedFixture()
    await assert.isAccessible(button)
  }).tags(['@md', '@button', '@a11y'])
})
