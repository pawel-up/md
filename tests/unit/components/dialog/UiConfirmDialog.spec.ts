import { test, fixture, html } from '@pawel-up/lupa/testing'
import '../../../../src/components/dialog/ui-confirm-dialog.js'
import type UiConfirmDialog from '../../../../src/components/dialog/internals/ConfirmDialog.js'

test.group('UiConfirmDialog', () => {
  async function basicFixture(): Promise<UiConfirmDialog> {
    return fixture(html`<ui-confirm-dialog></ui-confirm-dialog>`)
  }

  async function customLabelsFixture(): Promise<UiConfirmDialog> {
    return fixture(html`<ui-confirm-dialog confirmLabel="Delete" dismissLabel="Keep"></ui-confirm-dialog>`)
  }

  async function withContentFixture(): Promise<UiConfirmDialog> {
    return fixture(html`
      <ui-confirm-dialog>
        <span slot="title">Confirm Action</span>
        <p>Are you sure you want to proceed?</p>
      </ui-confirm-dialog>
    `)
  }

  async function destructiveFixture(): Promise<UiConfirmDialog> {
    return fixture(html`<ui-confirm-dialog destructive></ui-confirm-dialog>`)
  }

  test('renders with default labels', async ({ assert }) => {
    const element = await basicFixture()
    assert.equal(element.confirmLabel, 'Confirm')
    assert.equal(element.dismissLabel, 'Cancel')
  })

  test('renders with custom labels', async ({ assert }) => {
    const element = await customLabelsFixture()
    assert.equal(element.confirmLabel, 'Delete')
    assert.equal(element.dismissLabel, 'Keep')
  })

  test('is modal by default', async ({ assert }) => {
    const element = await basicFixture()
    assert.isTrue(element.modal)
  })

  test('renders buttons with correct values', async ({ assert }) => {
    const element = await basicFixture()
    await element.updateComplete

    const dismissButton = element.shadowRoot!.querySelector('ui-button[value="dismiss"]')
    const confirmButton = element.shadowRoot!.querySelector('ui-button[value="confirm"]')

    assert.ok(dismissButton, 'has dismiss button')
    assert.ok(confirmButton, 'has confirm button')
    assert.equal(dismissButton!.textContent!.trim(), 'Cancel')
    assert.equal(confirmButton!.textContent!.trim(), 'Confirm')
  })

  test('renders title slot', async ({ assert }) => {
    const element = await withContentFixture()
    await element.updateComplete

    const titleSlot = element.shadowRoot!.querySelector('slot[name="title"]')
    assert.ok(titleSlot, 'has title slot')
  })

  test('renders body slot', async ({ assert }) => {
    const element = await withContentFixture()
    await element.updateComplete

    const bodySlot = element.shadowRoot!.querySelector('slot:not([name])')
    assert.ok(bodySlot, 'has body slot')
  })

  test('uses filled button for confirm action', async ({ assert }) => {
    const element = await basicFixture()
    await element.updateComplete

    const confirmButton = element.shadowRoot!.querySelector('ui-button[value="confirm"]')
    assert.equal(confirmButton!.getAttribute('color'), 'filled')
  })

  test('uses text button for dismiss action', async ({ assert }) => {
    const element = await basicFixture()
    await element.updateComplete

    const dismissButton = element.shadowRoot!.querySelector('ui-button[value="dismiss"]')
    assert.equal(dismissButton!.getAttribute('color'), 'text')
  })

  test('renders as destructive dialog', async ({ assert }) => {
    const element = await destructiveFixture()
    await element.updateComplete

    const confirmButton = element.shadowRoot!.querySelector('ui-button[value="confirm"]')
    assert.ok(confirmButton?.hasAttribute('destructive'), 'confirm button has destructive attribute')
  })

  test('renders confirm button with destructive styling', async ({ assert }) => {
    const element = await destructiveFixture()
    await element.updateComplete

    const confirmButton = element.shadowRoot!.querySelector('ui-button[value="confirm"]')
    assert.equal(confirmButton!.getAttribute('color'), 'filled')
    assert.ok(confirmButton!.hasAttribute('destructive'), 'has destructive attribute for styling')
  })

  test('is not destructive by default', async ({ assert }) => {
    const element = await basicFixture()
    assert.isFalse(element.destructive)
  })

  test('can be set to destructive', async ({ assert }) => {
    const element = await destructiveFixture()
    assert.isTrue(element.destructive)
  })

  test('applies destructive attribute to confirm button when destructive is true', async ({ assert }) => {
    const element = await destructiveFixture()
    await element.updateComplete

    const confirmButton = element.shadowRoot!.querySelector('ui-button[value="confirm"]')
    assert.isTrue(confirmButton!.hasAttribute('destructive'))
  })

  test('does not apply destructive attribute when destructive is false', async ({ assert }) => {
    const element = await basicFixture()
    await element.updateComplete

    const confirmButton = element.shadowRoot!.querySelector('ui-button[value="confirm"]')
    assert.isFalse(confirmButton!.hasAttribute('destructive'))
  })
})
