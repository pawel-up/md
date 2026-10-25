import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { UiSwitchElement } from '../../../../src/components/switch/ui-switch.js'

import '../../../../src/components/switch/ui-switch.js'

test.group('Switch', () => {
  async function basicFixture(): Promise<UiSwitchElement> {
    return fixture(html`<ui-switch></ui-switch>`)
  }

  async function checkedFixture(): Promise<UiSwitchElement> {
    return fixture(html`<ui-switch checked></ui-switch>`)
  }

  async function formFixture(): Promise<HTMLFormElement> {
    return fixture(html`
      <form>
        <ui-switch name="notifications" value="enabled" checked></ui-switch>
      </form>
    `)
  }

  test('is off by default', async ({ assert }) => {
    const sw = await basicFixture()
    assert.isFalse(sw.checked)
    assert.equal(sw.value, 'on')
  }).tags(['@md', '@switch'])

  test('is checked via attribute', async ({ assert }) => {
    const sw = await checkedFixture()
    assert.isTrue(sw.checked)
  }).tags(['@md', '@switch'])

  test('toggles check state on click', async ({ assert }) => {
    const sw = await basicFixture()
    sw.click()
    await nextFrame()
    assert.isTrue(sw.checked)

    sw.click()
    await nextFrame()
    assert.isFalse(sw.checked)
  }).tags(['@md', '@switch'])

  test('sets disabled and updates tabindex', async ({ assert }) => {
    const sw = await basicFixture()
    assert.equal(sw.getAttribute('tabindex'), '0')

    sw.disabled = true
    await nextFrame()
    assert.isFalse(sw.hasAttribute('tabindex'))

    sw.disabled = false
    await nextFrame()
    assert.equal(sw.getAttribute('tabindex'), '0')
  }).tags(['@md', '@switch'])

  test('integrates with form data', async ({ assert }) => {
    const form = await formFixture()
    const formData = new FormData(form)
    assert.equal(formData.get('notifications'), 'enabled')
  }).tags(['@md', '@switch'])

  test('is accessible with aria-label', async ({ assert }) => {
    const sw = await fixture(html`<ui-switch aria-label="Notifications"></ui-switch>`)
    await assert.isAccessible(sw)
  }).tags(['@md', '@switch', '@a11y'])

  test('is accessible with a for attribute', async ({ assert }) => {
    const sw = await fixture(html`<label for="sw">Notifications</label><ui-switch id="sw"></ui-switch>`)
    await assert.isAccessible(sw)
  }).tags(['@md', '@switch', '@a11y'])

  test('is accessible when surrounded by a label', async ({ assert }) => {
    const sw = await fixture(
      html`<label id="sw-lbl"><ui-switch aria-labelledby="sw-lbl"></ui-switch>Notifications</label>`
    )
    await assert.isAccessible(sw)
  }).tags(['@md', '@switch', '@a11y'])

  test('is accessible when checked', async ({ assert }) => {
    const sw = await fixture(html`<ui-switch aria-label="Notifications" checked></ui-switch>`)
    await assert.isAccessible(sw)
  }).tags(['@md', '@switch', '@a11y'])

  test('is accessible when required', async ({ assert }) => {
    const sw = await fixture(html`<ui-switch aria-label="Notifications" required></ui-switch>`)
    await assert.isAccessible(sw)
  }).tags(['@md', '@switch', '@a11y'])

  test('is accessible when disabled', async ({ assert }) => {
    const sw = await fixture(html`<ui-switch aria-label="Notifications" disabled></ui-switch>`)
    await assert.isAccessible(sw)
  }).tags(['@md', '@switch', '@a11y'])

  test('is accessible with icons', async ({ assert }) => {
    const sw = await fixture(html`<ui-switch aria-label="Notifications" onIcon offIcon checked></ui-switch>`)
    await assert.isAccessible(sw)
  }).tags(['@md', '@switch', '@a11y'])
})
