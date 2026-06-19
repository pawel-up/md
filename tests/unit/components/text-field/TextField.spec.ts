import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { UiFilledTextFieldElement } from '../../../../src/components/text-field/ui-filled-text-field.js'
import { UiOutlinedTextFieldElement } from '../../../../src/components/text-field/ui-outlined-text-field.js'

import '../../../../src/components/text-field/ui-filled-text-field.js'
import '../../../../src/components/text-field/ui-outlined-text-field.js'

test.group('TextField', () => {
  async function basicFixture(): Promise<UiFilledTextFieldElement> {
    return fixture(
      html`<ui-filled-text-field label="Name"></ui-filled-text-field>`
    ) as Promise<UiFilledTextFieldElement>
  }

  async function valueFixture(): Promise<UiFilledTextFieldElement> {
    return fixture(
      html`<ui-filled-text-field label="Name" value="Alice"></ui-filled-text-field>`
    ) as Promise<UiFilledTextFieldElement>
  }

  async function outlinedFixture(): Promise<UiOutlinedTextFieldElement> {
    return fixture(
      html`<ui-outlined-text-field label="Outline Name"></ui-outlined-text-field>`
    ) as Promise<UiOutlinedTextFieldElement>
  }

  test('has default empty value', async ({ assert }) => {
    const field = await basicFixture()
    assert.equal(field.value, '')
  }).tags(['@md', '@text-field'])

  test('sets initial value via markup', async ({ assert }) => {
    const field = await valueFixture()
    assert.equal(field.value, 'Alice')
  }).tags(['@md', '@text-field'])

  test('flushes programmatic setters set before rendering (selectionStart/End)', async ({ assert }) => {
    // Instantiate element programmatically without appending to DOM yet
    const field = document.createElement('ui-filled-text-field') as UiFilledTextFieldElement
    field.value = 'Hello World'
    field.selectionStart = 3
    field.selectionEnd = 8

    // Append to document/render
    const container = (await fixture(html`<div></div>`)) as HTMLElement
    container.appendChild(field)
    await nextFrame()
    await field.updateComplete

    // Verify properties are correctly flushed to native input element
    assert.equal(field.selectionStart, 3)
    assert.equal(field.selectionEnd, 8)
  }).tags(['@md', '@text-field'])

  test('manages disabled state and tabindex', async ({ assert }) => {
    const field = await basicFixture()
    assert.isFalse(field.disabled)

    field.disabled = true
    await nextFrame()
    assert.isTrue(field.disabled)
    assert.equal(field.getAttribute('aria-disabled'), 'true')

    field.disabled = false
    await nextFrame()
    assert.isFalse(field.disabled)
    assert.isFalse(field.hasAttribute('aria-disabled'))
  }).tags(['@md', '@text-field'])

  test('renders outline structure and notch label for outlined variant', async ({ assert }) => {
    const field = await outlinedFixture()
    const outline = field.shadowRoot?.querySelector('.outline')
    assert.isNotNull(outline)

    const start = outline?.querySelector('.outline-start')
    const notch = outline?.querySelector('.outline-notch')
    const end = outline?.querySelector('.outline-end')
    assert.isNotNull(start)
    assert.isNotNull(notch)
    assert.isNotNull(end)

    const outlineLabel = notch?.querySelector('.outline-label')
    assert.isNotNull(outlineLabel)
    assert.equal(outlineLabel?.textContent?.trim(), 'Outline Name')
  }).tags(['@md', '@text-field'])

  test('collapses notch gap when noFloating is true and label is hidden', async ({ assert }) => {
    const field = (await fixture(
      html`<ui-outlined-text-field label="Outline Name" .noFloating="${true}" value="Alice"></ui-outlined-text-field>`
    )) as UiOutlinedTextFieldElement

    const surface = field.shadowRoot?.querySelector('.surface')
    const notch = field.shadowRoot?.querySelector('.outline-notch')
    assert.isNotNull(surface)
    assert.isNotNull(notch)

    assert.isTrue(surface?.classList.contains('labelHidden'))

    const styles = window.getComputedStyle(notch!)
    assert.equal(styles.paddingLeft, '0px')
    assert.equal(styles.paddingRight, '0px')
    assert.notEqual(styles.borderTopColor, 'rgba(0, 0, 0, 0)')
    assert.notEqual(styles.borderTopColor, 'transparent')
  }).tags(['@md', '@text-field'])

  test('appends asterisk to required label only if not already present', async ({ assert }) => {
    const field1 = (await fixture(
      html`<ui-outlined-text-field label="Name" required></ui-outlined-text-field>`
    )) as UiOutlinedTextFieldElement
    assert.equal((field1 as unknown as { renderLabelText(): string }).renderLabelText(), 'Name*')

    const field2 = (await fixture(
      html`<ui-outlined-text-field label="Name *" required></ui-outlined-text-field>`
    )) as UiOutlinedTextFieldElement
    assert.equal((field2 as unknown as { renderLabelText(): string }).renderLabelText(), 'Name *')

    const field3 = (await fixture(
      html`<ui-outlined-text-field label="* Name" required></ui-outlined-text-field>`
    )) as UiOutlinedTextFieldElement
    assert.equal((field3 as unknown as { renderLabelText(): string }).renderLabelText(), '* Name')
  }).tags(['@md', '@text-field'])
})
