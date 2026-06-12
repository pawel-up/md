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
})
