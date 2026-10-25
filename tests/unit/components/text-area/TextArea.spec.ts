import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { UiTextAreaElement } from '../../../../src/components/text-area/ui-text-area.js'

import '../../../../src/components/text-area/ui-text-area.js'

test.group('TextArea', () => {
  async function basicFixture(): Promise<UiTextAreaElement> {
    return fixture(html`<ui-text-area label="Description"></ui-text-area>`) as Promise<UiTextAreaElement>
  }

  async function valueFixture(): Promise<UiTextAreaElement> {
    return fixture(
      html`<ui-text-area label="Description" value="Hello World"></ui-text-area>`
    ) as Promise<UiTextAreaElement>
  }

  test('has default empty value', async ({ assert }) => {
    const el = await basicFixture()
    assert.equal(el.value, '')
  }).tags(['@md', '@text-area'])

  test('sets initial value via markup', async ({ assert }) => {
    const el = await valueFixture()
    assert.equal(el.value, 'Hello World')
    const textarea = el.shadowRoot?.querySelector('textarea')
    assert.isNotNull(textarea)
    assert.equal(textarea?.value, 'Hello World')
  }).tags(['@md', '@text-area'])

  test('maps rows, cols, and wrap attributes to the native textarea', async ({ assert }) => {
    const el = (await fixture(html`<ui-text-area rows="5" cols="40" wrap="hard"></ui-text-area>`)) as UiTextAreaElement
    const textarea = el.shadowRoot?.querySelector('textarea')
    assert.isNotNull(textarea)
    assert.equal(textarea?.getAttribute('rows'), '5')
    assert.equal(textarea?.getAttribute('cols'), '40')
    assert.equal(textarea?.getAttribute('wrap'), 'hard')

    el.rows = 10
    el.cols = 50
    el.wrap = 'soft'
    await nextFrame()
    assert.equal(textarea?.getAttribute('rows'), '10')
    assert.equal(textarea?.getAttribute('cols'), '50')
    assert.equal(textarea?.getAttribute('wrap'), 'soft')
  }).tags(['@md', '@text-area'])

  test('manages disabled state', async ({ assert }) => {
    const el = await basicFixture()
    assert.isFalse(el.disabled)
    const textarea = el.shadowRoot?.querySelector('textarea')
    assert.isFalse(textarea?.disabled)

    el.disabled = true
    await nextFrame()
    assert.isTrue(el.disabled)
    assert.isTrue(textarea?.disabled)
    assert.equal(el.getAttribute('aria-disabled'), 'true')

    el.disabled = false
    await nextFrame()
    assert.isFalse(el.disabled)
    assert.isFalse(textarea?.disabled)
    assert.isFalse(el.hasAttribute('aria-disabled'))
  }).tags(['@md', '@text-area'])

  test('flushes programmatic setters set before rendering (selectionStart/End)', async ({ assert }) => {
    const el = document.createElement('ui-text-area') as UiTextAreaElement
    el.value = 'Hello world text area'
    el.selectionStart = 6
    el.selectionEnd = 11

    const container = (await fixture(html`<div></div>`)) as HTMLElement
    container.appendChild(el)
    await nextFrame()
    await el.updateComplete

    assert.equal(el.selectionStart, 6)
    assert.equal(el.selectionEnd, 11)
  }).tags(['@md', '@text-area'])

  test('handles invalid/validation state', async ({ assert }) => {
    const el = (await fixture(html`<ui-text-area required value=""></ui-text-area>`)) as UiTextAreaElement
    assert.isUndefined(el.invalid)

    // Trigger validity check
    const isValid = el.checkValidity()
    assert.isFalse(isValid)
    assert.isTrue(el.invalid)
  }).tags(['@md', '@text-area'])

  test('does not submit the form on Enter keypress in textarea', async ({ assert }) => {
    const form = (await fixture(html`
      <form>
        <ui-text-area name="notes" value="First line"></ui-text-area>
      </form>
    `)) as HTMLFormElement

    const el = form.querySelector('ui-text-area') as UiTextAreaElement
    assert.isNotNull(el)

    let submitted = false
    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      submitted = true
    })

    const textarea = el.shadowRoot?.querySelector('textarea')
    textarea?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))

    assert.isFalse(submitted, 'textarea does not implicitly submit on Enter')
  }).tags(['@md', '@text-area', '@forms'])

  test('supports masked mode with visibility toggle and -webkit-text-security', async ({ assert }) => {
    const el = (await fixture(
      html`<ui-text-area masked label="Notes" value="sensitive text"></ui-text-area>`
    )) as UiTextAreaElement
    assert.isTrue(el.masked)
    assert.isTrue(el.hasAttribute('masked'))

    const textarea = el.shadowRoot?.querySelector('textarea')
    const toggle = el.shadowRoot?.querySelector('[part~="visibility-toggle"]') as HTMLElement
    assert.isNotNull(textarea)
    assert.isNotNull(toggle)
    assert.equal(textarea?.style.getPropertyValue('-webkit-text-security'), 'disc')
    assert.equal(toggle.getAttribute('aria-label'), 'Show text')

    let eventFired = false
    el.addEventListener('visibilitychange', () => {
      eventFired = true
    })

    toggle.click()
    await nextFrame()
    await el.updateComplete

    assert.isTrue(eventFired)
    assert.isTrue(el.isPasswordVisible)
    assert.equal(textarea?.style.getPropertyValue('-webkit-text-security'), 'none')
    assert.equal(toggle.getAttribute('aria-label'), 'Hide text')

    toggle.click()
    await nextFrame()
    await el.updateComplete

    assert.isFalse(el.isPasswordVisible)
    assert.equal(textarea?.style.getPropertyValue('-webkit-text-security'), 'disc')
    assert.equal(toggle.getAttribute('aria-label'), 'Show text')
  }).tags(['@md', '@text-area', '@masked'])

  test('suppresses visibility toggle button on textarea when noVisibilityToggle is true', async ({ assert }) => {
    const el = (await fixture(
      html`<ui-text-area masked noVisibilityToggle label="Notes"></ui-text-area>`
    )) as UiTextAreaElement

    assert.isTrue(el.noVisibilityToggle)
    assert.isNull(el.shadowRoot?.querySelector('[part~="visibility-toggle"]'))
  }).tags(['@md', '@text-area', '@masked'])

  test('is accessible with label', async ({ assert }) => {
    const el = await basicFixture()
    await assert.isAccessible(el)
  }).tags(['@md', '@text-area', '@a11y'])

  test('is accessible with aria-label', async ({ assert }) => {
    const el = await fixture(html`<ui-text-area aria-label="Comments"></ui-text-area>`)
    await assert.isAccessible(el)
  }).tags(['@md', '@text-area', '@a11y'])

  test('is accessible when populated and required', async ({ assert }) => {
    const el = await fixture(
      html`<ui-text-area
        label="Bio"
        value="Developer"
        required
        supportingText="Max 200 chars"
        maxLength="200"
      ></ui-text-area>`
    )
    await assert.isAccessible(el)
  }).tags(['@md', '@text-area', '@a11y'])

  test('is accessible when disabled', async ({ assert }) => {
    const el = await fixture(html`<ui-text-area label="Bio" value="Developer" disabled></ui-text-area>`)
    await assert.isAccessible(el)
  }).tags(['@md', '@text-area', '@a11y'])

  test('is accessible when invalid', async ({ assert }) => {
    const el = await fixture(html`<ui-text-area label="Bio" invalid invalidText="Bio is required"></ui-text-area>`)
    await assert.isAccessible(el)
  }).tags(['@md', '@text-area', '@a11y'])

  test('is accessible in masked mode', async ({ assert }) => {
    const el = await fixture(html`<ui-text-area label="Secret Notes" masked value="secret"></ui-text-area>`)
    await assert.isAccessible(el)
  }).tags(['@md', '@text-area', '@a11y'])
})
