import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { events } from '@pawel-up/lupa/commands'
import { UiFilledTextFieldElement } from '../../../../src/components/text-field/ui-filled-text-field.js'
import { UiOutlinedTextFieldElement } from '../../../../src/components/text-field/ui-outlined-text-field.js'
import type { UiButtonElement } from '../../../../src/components/button/ui-button.js'

import '../../../../src/components/text-field/ui-filled-text-field.js'
import '../../../../src/components/text-field/ui-outlined-text-field.js'
import '../../../../src/components/button/ui-button.js'

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

  test('submits the form on Enter keypress in single-line text field', async ({ assert }) => {
    const form = (await fixture(html`
      <form>
        <ui-outlined-text-field name="email" value="user@example.com"></ui-outlined-text-field>
      </form>
    `)) as HTMLFormElement

    const field = form.querySelector('ui-outlined-text-field')
    assert.isNotNull(field)

    let submitted = false
    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      submitted = true
    })

    const input = field?.shadowRoot?.querySelector('input')
    assert.isNotNull(input)
    if (input) {
      await events(input).keyboard.press('Enter')
    }
    assert.isTrue(submitted, 'form was submitted on Enter')
  }).tags(['@md', '@text-field', '@forms'])

  test('activates default ui-button[type="submit"] when pressing Enter', async ({ assert }) => {
    const form = (await fixture(html`
      <form>
        <ui-outlined-text-field name="search" value="query"></ui-outlined-text-field>
        <ui-button type="submit" name="submit-action" value="search-btn">Search</ui-button>
      </form>
    `)) as HTMLFormElement

    const field = form.querySelector('ui-outlined-text-field')
    const button = form.querySelector('ui-button') as UiButtonElement | null
    assert.isNotNull(field)
    assert.isNotNull(button)

    let submittedEvent: SubmitEvent | undefined
    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      submittedEvent = e
    })

    const input = field?.shadowRoot?.querySelector('input')
    assert.isNotNull(input)
    if (input) {
      await events(input).keyboard.press('Enter')
    }

    assert.isNotNull(submittedEvent, 'submit event fired')
    const submitter = submittedEvent?.submitter as UiButtonElement | HTMLButtonElement | undefined
    assert.equal(submitter?.value, 'search-btn')
  }).tags(['@md', '@text-field', '@forms'])

  test('does not submit the form on Enter when field is disabled', async ({ assert }) => {
    const form = (await fixture(html`
      <form>
        <ui-outlined-text-field name="email" value="user@example.com" disabled></ui-outlined-text-field>
      </form>
    `)) as HTMLFormElement

    const field = form.querySelector('ui-outlined-text-field')
    assert.isNotNull(field)

    let submitted = false
    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      submitted = true
    })

    const input = field?.shadowRoot?.querySelector('input')
    assert.isNotNull(input)
    if (input) {
      await events(input).keyboard.press('Enter')
    }

    assert.isFalse(submitted, 'form was not submitted when disabled')
  }).tags(['@md', '@text-field', '@forms'])

  test('does not submit the form on Enter when field is readOnly', async ({ assert }) => {
    const form = (await fixture(html`
      <form>
        <ui-outlined-text-field name="email" value="user@example.com" readonly></ui-outlined-text-field>
      </form>
    `)) as HTMLFormElement

    const field = form.querySelector('ui-outlined-text-field')
    assert.isNotNull(field)

    let submitted = false
    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      submitted = true
    })

    const input = field?.shadowRoot?.querySelector('input')
    assert.isNotNull(input)
    if (input) {
      await events(input).keyboard.press('Enter')
    }

    assert.isFalse(submitted, 'form was not submitted when readOnly')
  }).tags(['@md', '@text-field', '@forms'])

  test('does not submit the form when event.isComposing is true', async ({ assert }) => {
    const form = (await fixture(html`
      <form>
        <ui-outlined-text-field name="email" value="user@example.com"></ui-outlined-text-field>
      </form>
    `)) as HTMLFormElement

    const field = form.querySelector('ui-outlined-text-field')
    assert.isNotNull(field)

    let submitted = false
    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      submitted = true
    })

    const input = field?.shadowRoot?.querySelector('input')
    input?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true, cancelable: true })
    )

    assert.isFalse(submitted, 'form was not submitted during IME composition')
  }).tags(['@md', '@text-field', '@forms'])

  test('blocks submission and triggers constraint validation when required field is empty', async ({ assert }) => {
    const form = (await fixture(html`
      <form>
        <ui-outlined-text-field name="email" required value=""></ui-outlined-text-field>
      </form>
    `)) as HTMLFormElement

    const field = form.querySelector('ui-outlined-text-field') as UiOutlinedTextFieldElement
    assert.isNotNull(field)

    let submitted = false
    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      submitted = true
    })

    const input = field.shadowRoot?.querySelector('input')
    assert.isNotNull(input)
    if (input) {
      await events(input).keyboard.press('Enter')
    }

    assert.isFalse(submitted, 'form submission was blocked by constraint validation')
    assert.isTrue(field.invalid, 'field is marked invalid')
  }).tags(['@md', '@text-field', '@forms'])

  test('does not submit the form on Enter when default submit button is disabled', async ({ assert }) => {
    const form = (await fixture(html`
      <form>
        <ui-outlined-text-field name="search" value="query"></ui-outlined-text-field>
        <ui-button type="submit" disabled>Search</ui-button>
      </form>
    `)) as HTMLFormElement

    const field = form.querySelector('ui-outlined-text-field')
    assert.isNotNull(field)

    let submitted = false
    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      submitted = true
    })

    const input = field?.shadowRoot?.querySelector('input')
    assert.isNotNull(input)
    if (input) {
      await events(input).keyboard.press('Enter')
    }

    assert.isFalse(submitted, 'form was not submitted when default submit button is disabled')
  }).tags(['@md', '@text-field', '@forms'])

  test('submits the form on Enter when form has novalidate attribute even if field is empty', async ({ assert }) => {
    const form = (await fixture(html`
      <form novalidate>
        <ui-outlined-text-field name="email" required value=""></ui-outlined-text-field>
      </form>
    `)) as HTMLFormElement

    const field = form.querySelector('ui-outlined-text-field')
    assert.isNotNull(field)

    let submitted = false
    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      submitted = true
    })

    const input = field?.shadowRoot?.querySelector('input')
    assert.isNotNull(input)
    if (input) {
      await events(input).keyboard.press('Enter')
    }

    assert.isTrue(submitted, 'form submission proceeded because form has novalidate')
  }).tags(['@md', '@text-field', '@forms'])

  test('does not submit on Enter when form has multiple text fields and no submit button', async ({ assert }) => {
    const form = (await fixture(html`
      <form>
        <ui-outlined-text-field name="first" value="John"></ui-outlined-text-field>
        <ui-outlined-text-field name="last" value="Doe"></ui-outlined-text-field>
      </form>
    `)) as HTMLFormElement

    const field = form.querySelector('ui-outlined-text-field')
    assert.isNotNull(field)

    let submitted = false
    form.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      submitted = true
    })

    const input = field?.shadowRoot?.querySelector('input')
    assert.isNotNull(input)
    if (input) {
      await events(input).keyboard.press('Enter')
    }

    assert.isFalse(submitted, 'implicit submission suppressed for multi-control form without submit button')
  }).tags(['@md', '@text-field', '@forms'])

  test('activates external submit button associated via form attribute when pressing Enter', async ({ assert }) => {
    const container = (await fixture(html`
      <div>
        <form id="external-form">
          <ui-outlined-text-field name="query" value="search text"></ui-outlined-text-field>
        </form>
        <ui-button type="submit" form="external-form" name="action" value="external-btn">Submit</ui-button>
      </div>
    `)) as HTMLElement

    const form = container.querySelector('form')
    const field = container.querySelector('ui-outlined-text-field')
    const button = container.querySelector('ui-button') as UiButtonElement | null
    assert.isNotNull(form)
    assert.isNotNull(field)
    assert.isNotNull(button)

    let submittedEvent: SubmitEvent | undefined
    let submitter: HTMLButtonElement | UiButtonElement | null = null
    form?.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      submittedEvent = e
      submitter = e.submitter as HTMLButtonElement | UiButtonElement | null
    })

    const input = field?.shadowRoot?.querySelector('input')
    assert.isNotNull(input)
    if (input) {
      await events(input).keyboard.press('Enter')
    }

    assert.isNotNull(submittedEvent, 'submit event fired')
    assert.isNotNull(submitter, 'submitter was present during submit event')
    assert.equal((submitter as HTMLButtonElement | null)?.value, 'external-btn')
  }).tags(['@md', '@text-field', '@forms'])

  test('activates external submit button when form and button are inside a shadow root', async ({ assert }) => {
    const host = (await fixture(html`<div></div>`)) as HTMLDivElement
    const shadowRoot = host.attachShadow({ mode: 'open' })

    const container = document.createElement('div')
    container.innerHTML = `
      <form id="shadow-form">
        <ui-outlined-text-field name="query" value="shadow text"></ui-outlined-text-field>
      </form>
      <ui-button type="submit" form="shadow-form" name="action" value="shadow-btn">Submit</ui-button>
    `
    shadowRoot.appendChild(container)
    await nextFrame()

    const form = shadowRoot.querySelector('form')
    const field = shadowRoot.querySelector('ui-outlined-text-field')
    const button = shadowRoot.querySelector('ui-button') as UiButtonElement | null
    assert.isNotNull(form)
    assert.isNotNull(field)
    assert.isNotNull(button)

    let submittedEvent: SubmitEvent | undefined
    let submitter: HTMLButtonElement | UiButtonElement | null = null
    form?.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      submittedEvent = e
      submitter = e.submitter as HTMLButtonElement | UiButtonElement | null
    })

    const input = field?.shadowRoot?.querySelector('input')
    assert.isNotNull(input)
    if (input) {
      await events(input).keyboard.press('Enter')
    }

    assert.isNotNull(submittedEvent, 'submit event fired')
    assert.isNotNull(submitter, 'submitter was present during submit event')
    assert.equal((submitter as HTMLButtonElement | null)?.value, 'shadow-btn')
  }).tags(['@md', '@text-field', '@forms'])

  test('activates external submit button when it precedes in-form button in tree order', async ({ assert }) => {
    const container = (await fixture(html`
      <div>
        <ui-button type="submit" form="order-form-1" name="action" value="first-external">External First</ui-button>
        <form id="order-form-1">
          <ui-outlined-text-field name="query" value="search text"></ui-outlined-text-field>
          <ui-button type="submit" name="action" value="second-internal">Internal Second</ui-button>
        </form>
      </div>
    `)) as HTMLElement

    const form = container.querySelector('form')
    const field = container.querySelector('ui-outlined-text-field')
    assert.isNotNull(form)
    assert.isNotNull(field)

    let submittedEvent: SubmitEvent | undefined
    let submitter: HTMLButtonElement | UiButtonElement | null = null
    form?.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      submittedEvent = e
      submitter = e.submitter as HTMLButtonElement | UiButtonElement | null
    })

    const input = field?.shadowRoot?.querySelector('input')
    assert.isNotNull(input)
    if (input) {
      await events(input).keyboard.press('Enter')
    }

    assert.isNotNull(submittedEvent, 'submit event fired')
    assert.isNotNull(submitter, 'submitter was present during submit event')
    assert.equal((submitter as HTMLButtonElement | null)?.value, 'first-external')
  }).tags(['@md', '@text-field', '@forms'])

  test('activates in-form submit button when it precedes external button in tree order', async ({ assert }) => {
    const container = (await fixture(html`
      <div>
        <form id="order-form-2">
          <ui-button type="submit" name="action" value="first-internal">Internal First</ui-button>
          <ui-outlined-text-field name="query" value="search text"></ui-outlined-text-field>
        </form>
        <ui-button type="submit" form="order-form-2" name="action" value="second-external">External Second</ui-button>
      </div>
    `)) as HTMLElement

    const form = container.querySelector('form')
    const field = container.querySelector('ui-outlined-text-field')
    assert.isNotNull(form)
    assert.isNotNull(field)

    let submittedEvent: SubmitEvent | undefined
    let submitter: HTMLButtonElement | UiButtonElement | null = null
    form?.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault()
      submittedEvent = e
      submitter = e.submitter as HTMLButtonElement | UiButtonElement | null
    })

    const input = field?.shadowRoot?.querySelector('input')
    assert.isNotNull(input)
    if (input) {
      await events(input).keyboard.press('Enter')
    }

    assert.isNotNull(submittedEvent, 'submit event fired')
    assert.isNotNull(submitter, 'submitter was present during submit event')
    assert.equal((submitter as HTMLButtonElement | null)?.value, 'first-internal')
  }).tags(['@md', '@text-field', '@forms'])
})
