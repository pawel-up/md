import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { UiButtonElement } from '../../../../src/components/button/ui-button.js'

import '../../../../src/components/button/ui-button.js'

test.group('Disabled button', () => {
  async function basicFixture(): Promise<UiButtonElement> {
    return fixture(html`<ui-button color="filled">Label</ui-button>`)
  }

  async function disabledFormFixture(): Promise<HTMLFormElement> {
    return fixture(
      html`<form>
        <input name="text" value="abc" />
        <ui-button color="filled" name="button" value="ok" type="submit" disabled>Label</ui-button>
      </form>`
    )
  }

  async function disabledFixture(): Promise<UiButtonElement> {
    return fixture(html`<ui-button color="filled" disabled>Label</ui-button>`)
  }

  async function tabindexFixture(): Promise<UiButtonElement> {
    return fixture(html`<ui-button color="filled" tabindex="1">Label</ui-button>`)
  }

  test('is not disabled by default', async ({ assert }) => {
    const button = await basicFixture()
    assert.isFalse(button.disabled)
  }).tags(['@md', '@button', '@disabled'])

  test('has no aria-disabled by default', async ({ assert }) => {
    const button = await basicFixture()
    assert.isFalse(button.hasAttribute('aria-disabled'))
  }).tags(['@md', '@button', '@disabled'])

  test('is is disabled via the markup', async ({ assert }) => {
    const button = await disabledFixture()
    assert.isTrue(button.disabled)
  }).tags(['@md', '@button', '@disabled'])

  test('removes the tabindex', async ({ assert }) => {
    const button = await disabledFixture()
    assert.isFalse(button.hasAttribute('tabindex'))
  }).tags(['@md', '@button', '@disabled'])

  test('sets the aria-disabled attribute', async ({ assert }) => {
    const button = await disabledFixture()
    assert.equal(button.getAttribute('aria-disabled'), 'true')
  }).tags(['@md', '@button', '@disabled'])

  test('disables the button via property setter', async ({ assert }) => {
    const button = await basicFixture()
    button.disabled = true
    assert.equal(button.getAttribute('aria-disabled'), 'true')
    assert.isFalse(button.hasAttribute('tabindex'))
  }).tags(['@md', '@button', '@disabled'])

  test('restores the button from the disabled state', async ({ assert }) => {
    const button = await tabindexFixture()
    button.disabled = true
    await nextFrame()
    button.disabled = false
    await nextFrame()
    assert.equal(button.getAttribute('tabindex'), '1')
    assert.isFalse(button.hasAttribute('aria-disabled'))
  }).tags(['@md', '@button', '@disabled'])

  test('does not trigger submit when disabled', async ({ assert }) => {
    const form = await disabledFormFixture()
    const button = form.querySelector('ui-button')!
    let event: Event | undefined
    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      event = e
    })
    button.click()
    assert.notOk(event)
  }).tags(['@md', '@button', '@disabled'])
})
