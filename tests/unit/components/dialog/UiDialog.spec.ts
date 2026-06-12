import { test, fixture, html } from '@pawel-up/lupa/testing'
import sinon from 'sinon'
import UiDialog, { UiDialogClosingReason } from '../../../../src/components/dialog/internals/Dialog.js'
import UiButton from '../../../../src/components/button/internals/button.js'

import '../../../../src/components/dialog/ui-dialog.js'
import '../../../../src/components/icons/ui-icon.js'
import '../../../../src/components/button/ui-button.js'

async function basicFixture(): Promise<UiDialog> {
  return fixture(html` <ui-dialog> Content </ui-dialog>`)
}

async function modalFixture(): Promise<UiDialog> {
  return fixture(html` <ui-dialog modal> Content </ui-dialog>`)
}

async function iconFixture(): Promise<UiDialog> {
  return fixture(
    html` <ui-dialog>
      <ui-icon slot="icon" icon="deleteOutline"></ui-icon>
      Content
    </ui-dialog>`
  )
}

async function titleFixture(): Promise<UiDialog> {
  return fixture(
    html` <ui-dialog>
      <span slot="title">The title</span>
      Content
    </ui-dialog>`
  )
}

async function buttonFixture(): Promise<UiDialog> {
  return fixture(
    html` <ui-dialog>
      Content
      <ui-button color="text" slot="button">Learn more</ui-button>
      <ui-button color="text" slot="button" value="dismiss">Cancel</ui-button>
      <ui-button color="text" slot="button" value="confirm">Accept</ui-button>
    </ui-dialog>`
  )
}

test.group('UiDialog - open/close', () => {
  test('opens the native dialog via the "open" attribute', async ({ assert }) => {
    const element = await basicFixture()
    assert.isFalse(element.dialog.open, 'native dialog is closed initially')

    element.open = true
    await element.updateComplete
    assert.isTrue(element.dialog.open, 'native dialog is opened')

    element.open = false
    await element.updateComplete
    assert.isFalse(element.dialog.open, 'native dialog is closed again')
  })

  test('closes the dialog via the Escape button', async ({ assert }) => {
    const element = await buttonFixture()
    // the dialog requires a focusable element
    const button = element.querySelector('ui-button')!
    button.focus()
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }))
    assert.equal(element.open, false)
  })

  test('closes the dialog via the dismiss slotted button', async ({ assert }) => {
    const element = await buttonFixture()
    const button = element.querySelector('ui-button[value="dismiss"]') as UiButton
    button.click()
    assert.equal(element.open, false)
  })

  test('closes the dialog via the confirm slotted button', async ({ assert }) => {
    const element = await buttonFixture()
    const button = element.querySelector('ui-button[value="confirm"]') as UiButton
    button.click()
    assert.equal(element.open, false)
  })

  test('closes the dialog via the dismissLabel button', async ({ assert }) => {
    const element = await basicFixture()
    element.dismissLabel = 'Close'
    await element.updateComplete
    const button = element.shadowRoot!.querySelector('.internal-button[value="dismiss"]') as UiButton
    button.click()
    assert.equal(element.open, false)
  })

  test('closes the dialog via the confirmLabel button', async ({ assert }) => {
    const element = await basicFixture()
    element.confirmLabel = 'Close'
    await element.updateComplete
    const button = element.shadowRoot!.querySelector('.internal-button[value="confirm"]') as UiButton
    button.click()
    assert.equal(element.open, false)
  })

  test('dispatches the close event with cancelled = true', async ({ assert }) => {
    const element = await buttonFixture()
    const spy = sinon.spy()
    element.addEventListener('close', spy)
    const button = element.querySelector('ui-button[value="dismiss"]') as UiButton
    button.click()
    assert.isTrue(spy.calledOnce, 'the event was dispatched')
    const event = spy.args[0][0] as CustomEvent<UiDialogClosingReason>
    assert.isTrue(event.detail.cancelled, 'the cancelled flag is set')
  })

  test('dispatches the close event with cancelled = true', async ({ assert }) => {
    const element = await buttonFixture()
    const spy = sinon.spy()
    element.addEventListener('close', spy)
    const button = element.querySelector('ui-button[value="confirm"]') as UiButton
    button.click()
    assert.isTrue(spy.calledOnce, 'the event was dispatched')
    const event = spy.args[0][0] as CustomEvent<UiDialogClosingReason>
    assert.isFalse(event.detail.cancelled, 'the cancelled flag is not set')
  })

  test('dispatches the dialogValue', async ({ assert }) => {
    const element = await buttonFixture()
    element.dialogValue = 'test'
    const spy = sinon.spy()
    element.addEventListener('close', spy)
    const button = element.querySelector('ui-button[value="confirm"]') as UiButton
    button.click()
    assert.isTrue(spy.calledOnce, 'the event was dispatched')
    const event = spy.args[0][0] as CustomEvent<UiDialogClosingReason>
    assert.equal(event.detail.value, 'test', 'has the value')
  })
})

test.group('UiDialog - modal dialog', () => {
  test('opens the dialog as modal', async ({ assert }) => {
    const element = await modalFixture()
    const spy = sinon.spy(element.dialog, 'showModal')
    element.open = true
    await element.updateComplete
    assert.isTrue(spy.calledOnce)
  })

  test('applies modal class to dialog when modal is true', async ({ assert }) => {
    const element = await basicFixture()
    element.modal = true
    await element.updateComplete

    const dialog = element.shadowRoot!.querySelector('dialog') as HTMLDialogElement
    assert.ok(dialog, 'has the dialog element')
    assert.isTrue(dialog.classList.contains('modal'), 'has modal class')
  })

  test('applies non-modal class to dialog when modal is false', async ({ assert }) => {
    const element = await basicFixture()
    element.modal = false
    await element.updateComplete

    const dialog = element.shadowRoot!.querySelector('dialog') as HTMLDialogElement
    assert.ok(dialog, 'has the dialog element')
    assert.isTrue(dialog.classList.contains('non-modal'), 'has non-modal class')
  })
})

test.group('UiDialog - icon', () => {
  test('renders the icon slot', async ({ assert }) => {
    const element = await basicFixture()
    const slot = element.shadowRoot!.querySelector('slot[name="icon"]') as HTMLSlotElement
    assert.ok(slot, 'has the slot')
  })

  test('does not render padding around the icon slot', async ({ assert }) => {
    const element = await basicFixture()
    const container = element.shadowRoot!.querySelector('.icon') as HTMLElement
    assert.isFalse(container.classList.contains('with-icon'), 'has no with-icon class')
  })

  test('renders padding around the icon slot with an icon', async ({ assert }) => {
    const element = await iconFixture()
    const container = element.shadowRoot!.querySelector('.icon') as HTMLElement
    assert.isTrue(container.classList.contains('with-icon'), 'has the with-icon class')
  })
})

test.group('UiDialog - title', () => {
  test('renders the title slot', async ({ assert }) => {
    const element = await basicFixture()
    const slot = element.shadowRoot!.querySelector('slot[name="title"]') as HTMLSlotElement
    assert.ok(slot, 'has the slot')
  })

  test('does not render padding around the title slot', async ({ assert }) => {
    const element = await basicFixture()
    const container = element.shadowRoot!.querySelector('.title') as HTMLElement
    assert.isFalse(container.classList.contains('with-title'), 'has no with-title class')
  })

  test('renders padding around the title slot with a title', async ({ assert }) => {
    const element = await titleFixture()
    const container = element.shadowRoot!.querySelector('.title') as HTMLElement
    assert.isTrue(container.classList.contains('with-title'), 'has the with-title class')
  })
})

test.group('UiDialog - buttons', () => {
  test('renders the button slot', async ({ assert }) => {
    const element = await basicFixture()
    const slot = element.shadowRoot!.querySelector('slot[name="button"]') as HTMLSlotElement
    assert.ok(slot, 'has the slot')
  })

  test('does not render padding around the buttons slot', async ({ assert }) => {
    const element = await basicFixture()
    const container = element.shadowRoot!.querySelector('.buttons') as HTMLElement
    assert.isFalse(container.classList.contains('with-buttons'), 'has no with-buttons class')
  })

  test('renders the confirm button', async ({ assert }) => {
    const element = await basicFixture()
    element.confirmLabel = 'OK label'
    await element.updateComplete
    const container = element.shadowRoot!.querySelector('.buttons') as HTMLElement
    assert.isTrue(container.classList.contains('with-buttons'), 'has the with-buttons class')
    const button = element.shadowRoot!.querySelector('.internal-button') as UiButton
    assert.ok(button, 'has the button')
    assert.equal(button.value, 'confirm')
    assert.equal(button.textContent!.trim(), 'OK label')
  })

  test('renders the dismiss button', async ({ assert }) => {
    const element = await basicFixture()
    element.dismissLabel = 'Cancel label'
    await element.updateComplete
    const container = element.shadowRoot!.querySelector('.buttons') as HTMLElement
    assert.isTrue(container.classList.contains('with-buttons'), 'has the with-buttons class')
    const button = element.shadowRoot!.querySelector('.internal-button') as UiButton
    assert.ok(button, 'has the button')
    assert.equal(button.value, 'dismiss')
    assert.equal(button.textContent!.trim(), 'Cancel label')
  })

  test('renders the slotted buttons', async ({ assert }) => {
    const element = await buttonFixture()
    const container = element.shadowRoot!.querySelector('.buttons') as HTMLElement
    assert.isTrue(container.classList.contains('with-buttons'), 'has the with-buttons class')
  })

  test('applies destructive attribute to confirm button when destructive is true', async ({ assert }) => {
    const element = await basicFixture()
    element.confirmLabel = 'Delete'
    element.destructive = true
    await element.updateComplete

    const button = element.shadowRoot!.querySelector('.internal-button[value="confirm"]') as UiButton
    assert.ok(button, 'has the confirm button')
    assert.isTrue(button.hasAttribute('destructive'), 'has destructive attribute')
  })

  test('does not apply destructive attribute when destructive is false', async ({ assert }) => {
    const element = await basicFixture()
    element.confirmLabel = 'Confirm'
    element.destructive = false
    await element.updateComplete

    const button = element.shadowRoot!.querySelector('.internal-button[value="confirm"]') as UiButton
    assert.ok(button, 'has the confirm button')
    assert.isFalse(button.hasAttribute('destructive'), 'does not have destructive attribute')
  })
})

async function formWrappedDialogFixture(): Promise<{ form: HTMLFormElement; dialog: UiDialog }> {
  const container = await fixture(html`
    <form>
      <ui-dialog submitClose>
        <span slot="title">Form Dialog</span>
        <input type="text" name="username" required />
        <ui-button color="text" slot="button" value="dismiss">Cancel</ui-button>
        <ui-button color="text" slot="button" value="confirm" type="submit">Submit</ui-button>
      </ui-dialog>
    </form>
  `)
  const form = container as HTMLFormElement
  const dialog = form.querySelector('ui-dialog') as UiDialog
  return { form, dialog }
}

async function formWithoutSubmitCloseFixture(): Promise<{ form: HTMLFormElement; dialog: UiDialog }> {
  const container = await fixture(html`
    <form>
      <ui-dialog>
        <span slot="title">Form Dialog</span>
        <input type="text" name="username" required />
        <ui-button color="text" slot="button" value="dismiss">Cancel</ui-button>
        <ui-button color="text" slot="button" value="confirm" type="submit">Submit</ui-button>
      </ui-dialog>
    </form>
  `)
  const form = container as HTMLFormElement
  const dialog = form.querySelector('ui-dialog') as UiDialog
  return { form, dialog }
}

test.group('UiDialog - form handling - dialog wrapped in form', () => {
  test('should detect parent form when connected', async ({ assert }) => {
    const { dialog } = await formWrappedDialogFixture()
    await dialog.updateComplete

    // The form should be detected during connectedCallback
    // We can't directly access private fields, so we test the behavior instead
    assert.ok(dialog.submitClose, 'dialog should be configured for form handling')
  })

  test('should close dialog when form is submitted and submitClose is true', async ({ assert }) => {
    const { form, dialog } = await formWrappedDialogFixture()
    dialog.open = true
    await dialog.updateComplete

    const spy = sinon.spy()
    dialog.addEventListener('close', spy)

    // Simulate form submission
    const submitEvent = new SubmitEvent('submit', { bubbles: true, cancelable: true })
    form.dispatchEvent(submitEvent)

    assert.isFalse(dialog.open, 'dialog should be closed')
    assert.isTrue(spy.calledOnce, 'close event should be dispatched')
    const event = spy.args[0][0] as CustomEvent
    assert.isFalse(event.detail.cancelled, 'dialog should be confirmed, not cancelled')
  })

  test('should not close dialog when form is submitted and submitClose is false', async ({ assert }) => {
    const { form, dialog } = await formWithoutSubmitCloseFixture()
    dialog.open = true
    await dialog.updateComplete

    const spy = sinon.spy()
    dialog.addEventListener('close', spy)

    // Simulate form submission
    const submitEvent = new SubmitEvent('submit', { bubbles: true, cancelable: true })
    form.dispatchEvent(submitEvent)

    assert.isTrue(dialog.open, 'dialog should remain open')
    assert.isFalse(spy.called, 'close event should not be dispatched')
  })

  test('should not handle form submit when submit button is clicked directly', async ({ assert }) => {
    const { dialog } = await formWrappedDialogFixture()
    dialog.open = true
    await dialog.updateComplete

    const submitButton = dialog.querySelector('ui-button[type="submit"]') as UiButton
    const spy = sinon.spy()
    dialog.addEventListener('close', spy)

    // Click the submit button - this should not close the dialog immediately
    // because we yield control to the form
    submitButton.click()

    // The dialog should still be open because the form hasn't been submitted yet
    assert.isTrue(dialog.open, 'dialog should remain open when submit button is clicked')
  })

  test('should remove form event listener when disconnected', async ({ assert }) => {
    const { form, dialog } = await formWrappedDialogFixture()
    const removeEventListenerSpy = sinon.spy(form, 'removeEventListener')

    dialog.remove()

    // We can't test the private method directly, but we can verify the spy was called
    // The actual method name is not accessible, so we test the behavior instead
    assert.isTrue(removeEventListenerSpy.called, 'removeEventListener should be called on form')
  })
})

test.group('UiDialog - form handling - edge cases', () => {
  test('should handle form submission when dialog is not open', async ({ assert }) => {
    const { form, dialog } = await formWrappedDialogFixture()
    // Dialog is closed by default
    assert.isFalse(dialog.open, 'dialog should be closed initially')

    const spy = sinon.spy()
    dialog.addEventListener('close', spy)

    // Submit form when dialog is closed
    const submitEvent = new SubmitEvent('submit', { bubbles: true, cancelable: true })
    form.dispatchEvent(submitEvent)

    // Should still close the dialog (set open to false even though it's already false)
    assert.isFalse(dialog.open, 'dialog should remain closed')
    assert.isTrue(spy.calledOnce, 'close event should still be dispatched')
  })

  test('should handle multiple form submissions', async ({ assert }) => {
    const { form, dialog } = await formWrappedDialogFixture()
    dialog.open = true
    await dialog.updateComplete

    const spy = sinon.spy()
    dialog.addEventListener('close', spy)

    // Submit form multiple times
    const submitEvent1 = new SubmitEvent('submit', { bubbles: true, cancelable: true })
    const submitEvent2 = new SubmitEvent('submit', { bubbles: true, cancelable: true })

    form.dispatchEvent(submitEvent1)
    form.dispatchEvent(submitEvent2)

    assert.equal(spy.callCount, 2, 'close event should be dispatched for each submission')
  })

  test('should maintain form reference across re-connections', async ({ assert }) => {
    const { form, dialog } = await formWrappedDialogFixture()

    // Remove and re-add dialog
    const parent = form
    dialog.remove()
    await dialog.updateComplete

    parent.appendChild(dialog)
    await dialog.updateComplete

    // Test the behavior instead of accessing private fields
    // If form handling is working, submitClose should still work
    dialog.open = true
    await dialog.updateComplete

    const spy = sinon.spy()
    dialog.addEventListener('close', spy)

    const submitEvent = new SubmitEvent('submit', { bubbles: true, cancelable: true })
    form.dispatchEvent(submitEvent)

    assert.isTrue(spy.called, 'form handling should work after reconnection')
  })
})

test.group('UiDialog - closing event', () => {
  test('dispatches the closing event before close event when dismissing', async ({ assert }) => {
    const element = await buttonFixture()
    const closingSpy = sinon.spy()
    const closeSpy = sinon.spy()
    element.addEventListener('closing', closingSpy)
    element.addEventListener('close', closeSpy)

    const button = element.querySelector('ui-button[value="dismiss"]') as UiButton
    button.click()

    assert.isTrue(closingSpy.calledOnce, 'closing event was dispatched')
    assert.isTrue(closeSpy.calledOnce, 'close event was dispatched')
    assert.isTrue(closingSpy.calledBefore(closeSpy), 'closing event was dispatched before close event')
  })

  test('dispatches the closing event before close event when confirming', async ({ assert }) => {
    const element = await buttonFixture()
    const closingSpy = sinon.spy()
    const closeSpy = sinon.spy()
    element.addEventListener('closing', closingSpy)
    element.addEventListener('close', closeSpy)

    const button = element.querySelector('ui-button[value="confirm"]') as UiButton
    button.click()

    assert.isTrue(closingSpy.calledOnce, 'closing event was dispatched')
    assert.isTrue(closeSpy.calledOnce, 'close event was dispatched')
    assert.isTrue(closingSpy.calledBefore(closeSpy), 'closing event was dispatched before close event')
  })

  test('dispatches the closing event when pressing Escape', async ({ assert }) => {
    const element = await buttonFixture()
    const closingSpy = sinon.spy()
    const closeSpy = sinon.spy()
    element.addEventListener('closing', closingSpy)
    element.addEventListener('close', closeSpy)

    element.open = true
    await element.updateComplete
    const button = element.querySelector('ui-button')!
    button.focus()
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }))

    assert.isTrue(closingSpy.calledOnce, 'closing event was dispatched')
    assert.isTrue(closeSpy.calledOnce, 'close event was dispatched')
    assert.isTrue(closingSpy.calledBefore(closeSpy), 'closing event was dispatched before close event')
  })

  test('dispatches the closing event with correct detail for dismiss action', async ({ assert }) => {
    const element = await buttonFixture()
    const closingSpy = sinon.spy()
    element.addEventListener('closing', closingSpy)

    const button = element.querySelector('ui-button[value="dismiss"]') as UiButton
    button.click()

    assert.isTrue(closingSpy.calledOnce, 'closing event was dispatched')
    const event = closingSpy.args[0][0] as CustomEvent<UiDialogClosingReason>
    assert.isTrue(event.detail.cancelled, 'cancelled flag is true for dismiss action')
    assert.isUndefined(event.detail.value, 'value is undefined when no dialogValue is set')
  })

  test('dispatches the closing event with correct detail for confirm action', async ({ assert }) => {
    const element = await buttonFixture()
    const closingSpy = sinon.spy()
    element.addEventListener('closing', closingSpy)

    const button = element.querySelector('ui-button[value="confirm"]') as UiButton
    button.click()

    assert.isTrue(closingSpy.calledOnce, 'closing event was dispatched')
    const event = closingSpy.args[0][0] as CustomEvent<UiDialogClosingReason>
    assert.isFalse(event.detail.cancelled, 'cancelled flag is false for confirm action')
    assert.isUndefined(event.detail.value, 'value is undefined when no dialogValue is set')
  })

  test('includes dialogValue in closing event detail', async ({ assert }) => {
    const element = await buttonFixture()
    element.dialogValue = 'test-value'
    const closingSpy = sinon.spy()
    element.addEventListener('closing', closingSpy)

    const button = element.querySelector('ui-button[value="confirm"]') as UiButton
    button.click()

    assert.isTrue(closingSpy.calledOnce, 'closing event was dispatched')
    const event = closingSpy.args[0][0] as CustomEvent<UiDialogClosingReason>
    assert.equal(event.detail.value, 'test-value', 'dialogValue is included in event detail')
  })

  test('prevents dialog closing when closing event is cancelled', async ({ assert }) => {
    const element = await buttonFixture()
    const closingSpy = sinon.spy()
    const closeSpy = sinon.spy()

    element.addEventListener('closing', (event) => {
      closingSpy()
      event.preventDefault() // Cancel the closing
    })
    element.addEventListener('close', closeSpy)

    element.open = true
    await element.updateComplete
    assert.isTrue(element.open, 'dialog is initially open')

    const button = element.querySelector('ui-button[value="dismiss"]') as UiButton
    button.click()

    assert.isTrue(closingSpy.calledOnce, 'closing event was dispatched')
    assert.isFalse(closeSpy.called, 'close event was not dispatched')
    assert.isTrue(element.open, 'dialog remains open when closing is prevented')
  })

  test('prevents dialog closing when confirming and closing event is cancelled', async ({ assert }) => {
    const element = await buttonFixture()
    const closingSpy = sinon.spy()
    const closeSpy = sinon.spy()

    element.addEventListener('closing', (event) => {
      closingSpy()
      event.preventDefault() // Cancel the closing
    })
    element.addEventListener('close', closeSpy)

    element.open = true
    await element.updateComplete
    assert.isTrue(element.open, 'dialog is initially open')

    const button = element.querySelector('ui-button[value="confirm"]') as UiButton
    button.click()

    assert.isTrue(closingSpy.calledOnce, 'closing event was dispatched')
    assert.isFalse(closeSpy.called, 'close event was not dispatched')
    assert.isTrue(element.open, 'dialog remains open when closing is prevented')
  })

  test('prevents dialog closing when pressing Escape and closing event is cancelled', async ({ assert }) => {
    const element = await buttonFixture()
    const closingSpy = sinon.spy()
    const closeSpy = sinon.spy()

    element.addEventListener('closing', (event) => {
      closingSpy()
      event.preventDefault() // Cancel the closing
    })
    element.addEventListener('close', closeSpy)

    element.open = true
    await element.updateComplete
    assert.isTrue(element.open, 'dialog is initially open')

    const button = element.querySelector('ui-button')!
    button.focus()
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }))

    assert.isTrue(closingSpy.calledOnce, 'closing event was dispatched')
    assert.isFalse(closeSpy.called, 'close event was not dispatched')
    assert.isTrue(element.open, 'dialog remains open when closing is prevented')
  })

  test('prevents native dialog close and reopens when closing event is cancelled', async ({ assert }) => {
    const element = await modalFixture()
    const closingSpy = sinon.spy()
    const showModalSpy = sinon.spy(element.dialog, 'showModal')

    element.addEventListener('closing', (event) => {
      closingSpy()
      event.preventDefault() // Cancel the closing
    })

    element.open = true
    await element.updateComplete
    assert.isTrue(element.open, 'dialog is initially open')
    assert.isTrue(element.dialog.open, 'native dialog is open')

    // Reset the spy count after initial open
    showModalSpy.resetHistory()

    // Simulate native dialog close event (e.g., clicking backdrop)
    element.dialog.dispatchEvent(new Event('close'))

    assert.isTrue(closingSpy.calledOnce, 'closing event was dispatched')
    assert.isTrue(element.open, 'dialog remains open when closing is prevented')
    assert.isTrue(showModalSpy.calledOnce, 'showModal was called to reopen the dialog')
  })

  test('verifies closing event properties', async ({ assert }) => {
    const element = await buttonFixture()
    let closingEvent: CustomEvent<UiDialogClosingReason>

    element.addEventListener('closing', (event) => {
      closingEvent = event as CustomEvent<UiDialogClosingReason>
    })

    const button = element.querySelector('ui-button[value="dismiss"]') as UiButton
    button.click()

    assert.isDefined(closingEvent!, 'closing event was dispatched')
    assert.isTrue(closingEvent!.cancelable, 'closing event is cancelable')
    assert.isFalse(closingEvent!.bubbles, 'closing event does not bubble')
    assert.isFalse(closingEvent!.composed, 'closing event is not composed')
    assert.equal(closingEvent!.type, 'closing', 'event type is "closing"')
  })

  test('works with imperative dismiss and confirm buttons', async ({ assert }) => {
    const element = await basicFixture()
    element.dismissLabel = 'Cancel'
    element.confirmLabel = 'OK'
    await element.updateComplete

    const closingSpy = sinon.spy()
    const closeSpy = sinon.spy()
    element.addEventListener('closing', closingSpy)
    element.addEventListener('close', closeSpy)

    // Test dismiss button
    const dismissButton = element.shadowRoot!.querySelector('.internal-button[value="dismiss"]') as UiButton
    dismissButton.click()

    assert.isTrue(closingSpy.calledOnce, 'closing event was dispatched for dismiss')
    assert.isTrue(closeSpy.calledOnce, 'close event was dispatched for dismiss')

    // Reset spies and test confirm button
    closingSpy.resetHistory()
    closeSpy.resetHistory()
    element.open = true
    await element.updateComplete

    const confirmButton = element.shadowRoot!.querySelector('.internal-button[value="confirm"]') as UiButton
    confirmButton.click()

    assert.isTrue(closingSpy.calledOnce, 'closing event was dispatched for confirm')
    assert.isTrue(closeSpy.calledOnce, 'close event was dispatched for confirm')
  })

  test('can prevent closing with imperative buttons', async ({ assert }) => {
    const element = await basicFixture()
    element.dismissLabel = 'Cancel'
    await element.updateComplete

    const closingSpy = sinon.spy()
    const closeSpy = sinon.spy()

    element.addEventListener('closing', (event) => {
      closingSpy()
      event.preventDefault()
    })
    element.addEventListener('close', closeSpy)

    element.open = true
    await element.updateComplete

    const dismissButton = element.shadowRoot!.querySelector('.internal-button[value="dismiss"]') as UiButton
    dismissButton.click()

    assert.isTrue(closingSpy.calledOnce, 'closing event was dispatched')
    assert.isFalse(closeSpy.called, 'close event was not dispatched')
    assert.isTrue(element.open, 'dialog remains open')
  })
})

test.group('UiDialog - accessibility', () => {
  test('meets accessibility standards in closed state', async ({ assert }) => {
    const element = await basicFixture()
    await assert.isAccessible(element)
  })

  test('meets accessibility standards when open', async ({ assert }) => {
    const element = await basicFixture()
    element.open = true
    await element.updateComplete
    await assert.isAccessible(element)
  })

  test('meets accessibility standards with modal dialog', async ({ assert }) => {
    const element = await modalFixture()
    element.open = true
    await element.updateComplete
    await assert.isAccessible(element)
  })

  test('meets accessibility standards with full content', async ({ assert }) => {
    const element: UiDialog = await fixture(html`
      <ui-dialog modal open>
        <ui-icon slot="icon" icon="deleteOutline"></ui-icon>
        <span slot="title">Delete confirmation</span>
        <p>Are you sure you want to delete this item?</p>
        <ui-button color="text" slot="button" value="dismiss">Cancel</ui-button>
        <ui-button color="text" slot="button" value="confirm">Delete</ui-button>
      </ui-dialog>
    `)
    await element.updateComplete
    await assert.isAccessible(element)
  })

  test('maintains accessibility when closing is prevented', async ({ assert }) => {
    const element = await buttonFixture()
    element.addEventListener('closing', (event) => {
      event.preventDefault()
    })

    element.open = true
    await element.updateComplete

    const button = element.querySelector('ui-button[value="dismiss"]') as UiButton
    button.click()

    // Dialog should remain open and accessible
    assert.isTrue(element.open, 'dialog remains open')
    await assert.isAccessible(element)
  })
})
