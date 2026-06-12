import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { UiIconButtonElement } from '../../../../src/components/icon-button/ui-icon-button.js'

import '../../../../src/components/icon-button/ui-icon-button.js'

test.group('IconButton', () => {
  async function basicFixture(): Promise<UiIconButtonElement> {
    return fixture(html`<ui-icon-button></ui-icon-button>`) as Promise<UiIconButtonElement>
  }

  test('has default property values', async ({ assert }) => {
    const btn = await basicFixture()
    assert.equal(btn.color, 'standard')
    assert.equal(btn.width, 'default')
    assert.isFalse(btn.disabled)
  }).tags(['@md', '@icon-button'])

  test('respects color and width attributes', async ({ assert }) => {
    const btn = (await fixture(
      html`<ui-icon-button color="filled" width="wide"></ui-icon-button>`
    )) as UiIconButtonElement
    assert.equal(btn.color, 'filled')
    assert.equal(btn.width, 'wide')
  }).tags(['@md', '@icon-button'])

  test('updates aria-disabled and tabindex when disabled', async ({ assert }) => {
    const btn = await basicFixture()
    assert.equal(btn.getAttribute('tabindex'), '0')

    btn.disabled = true
    await nextFrame()
    assert.isFalse(btn.hasAttribute('tabindex'))
    assert.equal(btn.getAttribute('aria-disabled'), 'true')

    btn.disabled = false
    await nextFrame()
    assert.equal(btn.getAttribute('tabindex'), '0')
    assert.isFalse(btn.hasAttribute('aria-disabled'))
  }).tags(['@md', '@icon-button'])

  test('toggles selection when toggle is enabled', async ({ assert }) => {
    const btn = (await fixture(html`<ui-icon-button toggle></ui-icon-button>`)) as UiIconButtonElement
    assert.isFalse(btn.selected)

    btn.click()
    await nextFrame()
    assert.isTrue(btn.selected)

    btn.click()
    await nextFrame()
    assert.isFalse(btn.selected)
  }).tags(['@md', '@icon-button'])
})
