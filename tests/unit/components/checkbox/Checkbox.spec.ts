import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { UiCheckboxElement } from '../../../../src/components/checkbox/ui-checkbox.js'

import '../../../../src/components/checkbox/ui-checkbox.js'

test.group('Checkbox', () => {
  async function basicFixture(): Promise<UiCheckboxElement> {
    return fixture(html`<ui-checkbox></ui-checkbox>`)
  }

  async function checkedFixture(): Promise<UiCheckboxElement> {
    return fixture(html`<ui-checkbox checked></ui-checkbox>`)
  }

  async function requiredFixture(): Promise<UiCheckboxElement> {
    return fixture(html`<ui-checkbox required></ui-checkbox>`)
  }

  async function formFixture(): Promise<HTMLFormElement> {
    return fixture(html`
      <form>
        <ui-checkbox name="agree" value="yes" checked></ui-checkbox>
        <button type="submit">Submit</button>
      </form>
    `)
  }

  test('is not checked by default', async ({ assert }) => {
    const checkbox = await basicFixture()
    assert.isFalse(checkbox.checked)
    assert.equal(checkbox.value, 'on')
  }).tags(['@md', '@checkbox'])

  test('is checked via attribute', async ({ assert }) => {
    const checkbox = await checkedFixture()
    assert.isTrue(checkbox.checked)
  }).tags(['@md', '@checkbox'])

  test('toggles check state on click', async ({ assert }) => {
    const checkbox = await basicFixture()
    checkbox.click()
    await nextFrame()
    assert.isTrue(checkbox.checked)

    checkbox.click()
    await nextFrame()
    assert.isFalse(checkbox.checked)
  }).tags(['@md', '@checkbox'])

  test('sets disabled and updates tabindex', async ({ assert }) => {
    const checkbox = await basicFixture()
    assert.equal(checkbox.getAttribute('tabindex'), '0')

    checkbox.disabled = true
    await nextFrame()
    assert.isFalse(checkbox.hasAttribute('tabindex'))
    assert.equal(checkbox.getAttribute('aria-disabled'), 'true')

    checkbox.disabled = false
    await nextFrame()
    assert.equal(checkbox.getAttribute('tabindex'), '0')
    assert.isFalse(checkbox.hasAttribute('aria-disabled'))
  }).tags(['@md', '@checkbox'])

  test('validates required state', async ({ assert }) => {
    const checkbox = await requiredFixture()
    assert.isFalse(checkbox.checkValidity())

    checkbox.checked = true
    await nextFrame()
    assert.isTrue(checkbox.checkValidity())
  }).tags(['@md', '@checkbox'])

  test('integrates with form data', async ({ assert }) => {
    const form = await formFixture()
    const formData = new FormData(form)
    assert.equal(formData.get('agree'), 'yes')
  }).tags(['@md', '@checkbox'])

  test('activates ripple hover state on pointerenter and pointerleave', async ({ assert }) => {
    const checkbox = await basicFixture()
    const ripple = checkbox.shadowRoot?.querySelector('ui-ripple')
    assert.isNotNull(ripple)
    if (!ripple) return

    checkbox.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse', bubbles: true }))
    await nextFrame()

    const rippleSurface = ripple.shadowRoot?.querySelector('.surface')
    assert.isNotNull(rippleSurface)
    if (!rippleSurface) return

    assert.isTrue(rippleSurface.classList.contains('hovered'))
    assert.equal(window.getComputedStyle(ripple).visibility, 'visible')

    checkbox.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse', bubbles: true }))
    await nextFrame()

    assert.isFalse(rippleSurface.classList.contains('hovered'))
  }).tags(['@md', '@checkbox'])
})
