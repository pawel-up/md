import { fixture, html, test } from '@pawel-up/lupa/testing'
import { query } from '@pawel-up/lupa/commands'
import { UiButtonElement } from '../../../../src/components/button/ui-button.js'

import '../../../../src/components/button/ui-button.js'

test.group('Form button', () => {
  async function basicFixture(): Promise<UiButtonElement> {
    return fixture(html`<ui-button color="filled">Label</ui-button>`)
  }

  async function formFixture(): Promise<HTMLFormElement> {
    return fixture(
      html`<form>
        <input name="text" value="abc" />
        <ui-button color="filled">Label</ui-button>
      </form>`
    )
  }

  async function submitFormFixture(): Promise<HTMLFormElement> {
    return fixture(
      html`<form>
        <input name="text" value="abc" />
        <ui-button color="filled" name="button" value="ok" type="submit">Label</ui-button>
      </form>`
    )
  }

  test('has formAssociated set', async ({ assert }) => {
    assert.isTrue(UiButtonElement.formAssociated)
  }).tags(['@md', '@button', '@forms'])

  test('has no form when not in form', async ({ assert }) => {
    const button = await basicFixture()
    assert.isNull(button.form)
  }).tags(['@md', '@button', '@forms'])

  test('has form when in a form', async ({ assert }) => {
    const form = await formFixture()
    const button = form.querySelector('ui-button')!
    assert.ok(button.form, 'has a form')
    assert.isTrue(button.form === form, 'has the parent form')
  }).tags(['@md', '@button', '@forms'])

  test('does not trigger submit when not "submit"', async ({ assert }) => {
    const form = await formFixture()
    const button = form.querySelector('ui-button')!
    let event: Event | undefined
    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      event = e
    })
    button.click()
    assert.notOk(event)
  }).tags(['@md', '@button', '@forms'])

  test('removes the native "button" after submitting', async ({ assert }) => {
    const form = await submitFormFixture()
    const button = form.querySelector('ui-button')!
    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
    })
    button.click()
    const nativeButton = form.querySelector('button')
    assert.notOk(nativeButton)
  }).tags(['@md', '@button', '@forms'])

  test('registers the form values', async ({ assert }) => {
    const form = await submitFormFixture()
    const button = form.querySelector('ui-button')!
    assert.isTrue(form.elements[1] === button, 'the form has the button')
  }).tags(['@md', '@button', '@forms'])

  test('submits the form when clicking on the button', async ({ assert }) => {
    const form = await submitFormFixture()
    const button = form.querySelector('ui-button')!
    let event: SubmitEvent | undefined
    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      event = e
    })
    button.click()
    assert.ok(event, 'has the event')
    const submitter = event!.submitter as UiButtonElement
    assert.equal(submitter.value, 'ok', 'submitter has the value')
    assert.equal(submitter.name, 'button', 'submitter has the name')
  }).tags(['@md', '@button', '@forms'])

  test('submits the form with Space bar', async ({ assert }) => {
    const form = await submitFormFixture()
    let event: SubmitEvent | undefined
    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      event = e
    })
    await query({ css: 'ui-button' }).press('Space')
    assert.ok(event)
  }).tags(['@md', '@button', '@forms'])

  test('submits the form with Enter', async ({ assert }) => {
    const form = await submitFormFixture()
    let event: SubmitEvent | undefined
    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      event = e
    })
    await query({ css: 'ui-button' }).press('Enter')
    assert.ok(event)
  }).tags(['@md', '@button', '@forms'])
})
