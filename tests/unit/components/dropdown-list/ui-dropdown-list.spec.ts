import { test, fixture, html, nextFrame } from '@pawel-up/lupa/testing'
import '../../../../src/components/dropdown-list/ui-dropdown-list.js'
import '../../../../src/components/list/ui-list.js'
import '../../../../src/components/list/ui-list-item.js'
import '../../../../src/components/button/ui-button.js'
import { UiDropdownListElement } from '../../../../src/components/dropdown-list/ui-dropdown-list.js'
import { UiListElement } from '../../../../src/components/list/ui-list.js'
import { UiListItemElement } from '../../../../src/components/list/ui-list-item.js'
import { OverlayStackManager } from '../../../../src/controllers/OverlayStackManager.js'

test.group('UiDropdownList - Keyboard Interaction and Disabled Elements', () => {
  test('keyboard trigger auto-focuses first enabled item when first item is disabled', async ({ assert }) => {
    const el = await fixture<UiDropdownListElement>(html`
      <ui-dropdown-list>
        <ui-button id="trigger">Open</ui-button>
        <ui-list slot="dropdown" role="menu">
          <ui-list-item role="menuitem" disabled id="item1">Disabled Item 1</ui-list-item>
          <ui-list-item role="menuitem" id="item2">Enabled Item 2</ui-list-item>
          <ui-list-item role="menuitem" id="item3">Enabled Item 3</ui-list-item>
        </ui-list>
      </ui-dropdown-list>
    `)
    await el.updateComplete
    await nextFrame()

    const trigger = el.querySelector('#trigger') as HTMLElement
    const list = el.querySelector('ui-list') as UiListElement
    const item1 = el.querySelector('#item1') as UiListItemElement
    const item2 = el.querySelector('#item2') as UiListItemElement

    // Trigger open via ArrowDown keyboard event on trigger
    const arrowDown = new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', bubbles: true })
    trigger.dispatchEvent(arrowDown)
    await el.updateComplete
    await nextFrame()

    assert.isTrue(el.open, 'dropdown should be open')
    assert.equal(list.activeListItem?.id, 'item2', 'first enabled item should be active')
    assert.equal(item2.getAttribute('tabindex'), '0', 'enabled item 2 should have tabindex 0')
    assert.notEqual(item1.getAttribute('tabindex'), '0', 'disabled item 1 should not have active tabindex 0')
    assert.isFalse(item1.isActive(), 'disabled item 1 should not be active')
  })

  test('keyboard navigation is not trapped and can move to subsequent items', async ({ assert }) => {
    const el = await fixture<UiDropdownListElement>(html`
      <ui-dropdown-list>
        <ui-button id="trigger">Open</ui-button>
        <ui-list slot="dropdown" role="menu">
          <ui-list-item role="menuitem" disabled id="item1">Disabled Item 1</ui-list-item>
          <ui-list-item role="menuitem" id="item2">Enabled Item 2</ui-list-item>
          <ui-list-item role="menuitem" id="item3">Enabled Item 3</ui-list-item>
        </ui-list>
      </ui-dropdown-list>
    `)
    await el.updateComplete
    await nextFrame()

    const trigger = el.querySelector('#trigger') as HTMLElement
    const list = el.querySelector('ui-list') as UiListElement

    // Open dropdown
    const enter = new KeyboardEvent('keydown', { code: 'Enter', key: 'Enter', bubbles: true })
    trigger.dispatchEvent(enter)
    await el.updateComplete
    await nextFrame()

    assert.equal(list.activeListItem?.id, 'item2')

    // Press ArrowDown to navigate to next enabled item
    const navDown = new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', bubbles: true })
    list.dispatchEvent(navDown)
    await nextFrame()

    assert.equal(list.activeListItem?.id, 'item3', 'ArrowDown should move to item 3')
  })

  test('selecting an item via keyboard restores focus to the trigger', async ({ assert }) => {
    const el = await fixture<UiDropdownListElement>(html`
      <ui-dropdown-list>
        <ui-button id="trigger">Open</ui-button>
        <ui-list slot="dropdown" role="menu">
          <ui-list-item role="menuitem" id="item1">Item 1</ui-list-item>
          <ui-list-item role="menuitem" id="item2">Item 2</ui-list-item>
        </ui-list>
      </ui-dropdown-list>
    `)
    await el.updateComplete
    await nextFrame()

    const trigger = el.querySelector('#trigger') as HTMLElement
    const list = el.querySelector('ui-list') as UiListElement

    // Open dropdown
    const enter = new KeyboardEvent('keydown', { code: 'Enter', key: 'Enter', bubbles: true })
    trigger.dispatchEvent(enter)
    await el.updateComplete
    await nextFrame()

    assert.equal(list.activeListItem?.id, 'item1')

    // Press Enter to select item1
    const selectEnter = new KeyboardEvent('keydown', { code: 'Enter', key: 'Enter', bubbles: true })
    list.activeListItem!.dispatchEvent(selectEnter)
    await el.updateComplete
    await nextFrame()

    assert.isFalse(el.open, 'dropdown should close after selection')
    assert.equal(document.activeElement, trigger, 'focus should be restored to the trigger')
  })

  test('restores focus to trigger after another dropdown has previously opened', async ({ assert }) => {
    const container = await fixture<HTMLElement>(html`
      <div>
        <ui-dropdown-list id="dd1">
          <ui-button id="btn1">Button 1</ui-button>
          <ui-list slot="dropdown" role="menu">
            <ui-list-item role="menuitem" id="item1_1">Item 1.1</ui-list-item>
          </ui-list>
        </ui-dropdown-list>

        <ui-dropdown-list id="dd2">
          <ui-button id="btn2">Button 2</ui-button>
          <ui-list slot="dropdown" role="menu">
            <ui-list-item role="menuitem" id="item2_1">Item 2.1</ui-list-item>
          </ui-list>
        </ui-dropdown-list>
      </div>
    `)
    await nextFrame()

    const dd1 = container.querySelector('#dd1') as UiDropdownListElement
    const dd2 = container.querySelector('#dd2') as UiDropdownListElement
    const btn1 = container.querySelector('#btn1') as HTMLElement
    const btn2 = container.querySelector('#btn2') as HTMLElement
    const list2 = dd2.querySelector('ui-list') as UiListElement

    // Open dropdown 1 first
    btn1.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', key: 'Enter', bubbles: true }))
    await dd1.updateComplete
    await nextFrame()
    assert.isTrue(dd1.open)

    // Close dropdown 1
    dd1.close()
    await dd1.updateComplete
    await nextFrame()
    assert.isFalse(dd1.open)

    // Now open dropdown 2
    btn2.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', key: 'Enter', bubbles: true }))
    await dd2.updateComplete
    await nextFrame()
    assert.isTrue(dd2.open)

    // Select item in dropdown 2 with Enter
    const selectEnter = new KeyboardEvent('keydown', { code: 'Enter', key: 'Enter', bubbles: true })
    list2.activeListItem!.dispatchEvent(selectEnter)
    await dd2.updateComplete
    await nextFrame()

    assert.isFalse(dd2.open, 'dropdown 2 should be closed')
    assert.equal(document.activeElement, btn2, 'focus should be restored to button 2')
  })

  test('opening dropdown when all items are disabled does not focus any item', async ({ assert }) => {
    const el = await fixture<UiDropdownListElement>(html`
      <ui-dropdown-list>
        <ui-button id="trigger">Open</ui-button>
        <ui-list slot="dropdown" role="menu">
          <ui-list-item role="menuitem" disabled id="item1">Disabled Item 1</ui-list-item>
          <ui-list-item role="menuitem" disabled id="item2">Disabled Item 2</ui-list-item>
        </ui-list>
      </ui-dropdown-list>
    `)
    await el.updateComplete
    await nextFrame()

    const trigger = el.querySelector('#trigger') as HTMLElement
    const list = el.querySelector('ui-list') as UiListElement

    const arrowDown = new KeyboardEvent('keydown', { code: 'ArrowDown', key: 'ArrowDown', bubbles: true })
    trigger.dispatchEvent(arrowDown)
    await el.updateComplete
    await nextFrame()

    assert.isTrue(el.open)
    assert.isNull(list.activeListItem, 'no active item should be set when all items are disabled')
  })

  test('re-opening dropdown does not restore focus to a disabled item', async ({ assert }) => {
    const el = await fixture<UiDropdownListElement>(html`
      <ui-dropdown-list>
        <ui-button id="trigger">Open</ui-button>
        <ui-list slot="dropdown" role="menu">
          <ui-list-item role="menuitem" id="item1">Item 1</ui-list-item>
          <ui-list-item role="menuitem" id="item2">Item 2</ui-list-item>
        </ui-list>
      </ui-dropdown-list>
    `)
    await el.updateComplete
    await nextFrame()

    const trigger = el.querySelector('#trigger') as HTMLElement
    const list = el.querySelector('ui-list') as UiListElement
    const item1 = el.querySelector('#item1') as UiListItemElement

    // Open dropdown
    const enter = new KeyboardEvent('keydown', { code: 'Enter', key: 'Enter', bubbles: true })
    trigger.dispatchEvent(enter)
    await el.updateComplete
    await nextFrame()

    assert.equal(list.activeListItem?.id, 'item1')

    // Close dropdown
    el.close()
    await el.updateComplete
    await nextFrame()

    // Disable item 1 while closed
    item1.disabled = true
    await item1.updateComplete
    await nextFrame()

    // Reopen dropdown
    trigger.dispatchEvent(enter)
    await el.updateComplete
    await nextFrame()

    // Should focus item 2 (the first enabled item), NOT item 1
    assert.equal(list.activeListItem?.id, 'item2', 'should skip newly disabled item 1')
  })
})

test.group('UiDropdownList - OverlayController Integration', (group) => {
  group.each.teardown(() => {
    OverlayStackManager.getInstance().reset()
  })

  test('dismisses on Escape key', async ({ assert }) => {
    const el = await fixture<UiDropdownListElement>(html`
      <ui-dropdown-list>
        <ui-button id="trigger">Open</ui-button>
        <ui-list slot="dropdown" role="menu">
          <ui-list-item role="menuitem">Item 1</ui-list-item>
        </ui-list>
      </ui-dropdown-list>
    `)
    el.open = true
    await el.updateComplete

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await el.updateComplete

    assert.isFalse(el.open, 'dropdown should be closed on Escape')
  })

  test('dismisses on outside pointerdown', async ({ assert }) => {
    const el = await fixture<UiDropdownListElement>(html`
      <ui-dropdown-list>
        <ui-button id="trigger">Open</ui-button>
        <ui-list slot="dropdown" role="menu">
          <ui-list-item role="menuitem">Item 1</ui-list-item>
        </ui-list>
      </ui-dropdown-list>
    `)
    el.open = true
    await el.updateComplete

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }))
    await el.updateComplete

    assert.isFalse(el.open, 'dropdown should close on outside click')
  })

  test('respects closeOnOutsideClick=false', async ({ assert }) => {
    const el = await fixture<UiDropdownListElement>(html`
      <ui-dropdown-list .closeOnOutsideClick=${false}>
        <ui-button id="trigger">Open</ui-button>
        <ui-list slot="dropdown" role="menu">
          <ui-list-item role="menuitem">Item 1</ui-list-item>
        </ui-list>
      </ui-dropdown-list>
    `)
    el.open = true
    await el.updateComplete

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }))
    await el.updateComplete

    assert.isTrue(el.open, 'dropdown should remain open when closeOnOutsideClick is false')
  })

  test('prevents closing when beforeClose returns false', async ({ assert }) => {
    const el = await fixture<UiDropdownListElement>(html`
      <ui-dropdown-list>
        <ui-button id="trigger">Open</ui-button>
        <ui-list slot="dropdown" role="menu">
          <ui-list-item role="menuitem">Item 1</ui-list-item>
        </ui-list>
      </ui-dropdown-list>
    `)
    el.open = true
    el.beforeClose = () => false
    await el.updateComplete

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await el.updateComplete

    assert.isTrue(el.open, 'dropdown should remain open when beforeClose returns false')
  })

  test('prevents closing when closing event is canceled', async ({ assert }) => {
    const el = await fixture<UiDropdownListElement>(html`
      <ui-dropdown-list>
        <ui-button id="trigger">Open</ui-button>
        <ui-list slot="dropdown" role="menu">
          <ui-list-item role="menuitem">Item 1</ui-list-item>
        </ui-list>
      </ui-dropdown-list>
    `)
    el.open = true
    el.addEventListener('closing', (e) => {
      e.preventDefault()
    })
    await el.updateComplete

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await el.updateComplete

    assert.isTrue(el.open, 'dropdown should remain open when closing event is defaultPrevented')
  })

  test('close() dispatches close event and respects beforeClose', async ({ assert }) => {
    const el = await fixture<UiDropdownListElement>(html`
      <ui-dropdown-list>
        <ui-button id="trigger">Open</ui-button>
        <ui-list slot="dropdown" role="menu">
          <ui-list-item role="menuitem">Item 1</ui-list-item>
        </ui-list>
      </ui-dropdown-list>
    `)
    el.open = true
    await el.updateComplete

    el.beforeClose = () => false
    el.close()
    await el.updateComplete
    assert.isTrue(el.open, 'should not close when beforeClose returns false')

    el.beforeClose = undefined
    let closeReason: string | undefined
    el.addEventListener('close', (e: Event) => {
      const customEvent = e as CustomEvent<{ reason: string }>
      closeReason = customEvent.detail.reason
    })
    el.close()
    await el.updateComplete
    assert.isFalse(el.open)
    assert.equal(closeReason, 'programmatic')
  })

  test('item selection closes and dispatches close event with reason confirm', async ({ assert }) => {
    const el = await fixture<UiDropdownListElement>(html`
      <ui-dropdown-list>
        <ui-button id="trigger">Open</ui-button>
        <ui-list slot="dropdown" role="menu">
          <ui-list-item role="menuitem" id="item1">Item 1</ui-list-item>
        </ui-list>
      </ui-dropdown-list>
    `)
    el.open = true
    await el.updateComplete

    let closeReason: string | undefined
    el.addEventListener('close', (e: Event) => {
      const customEvent = e as CustomEvent<{ reason: string }>
      closeReason = customEvent.detail.reason
    })

    const item = el.querySelector('#item1') as HTMLElement
    item.click()
    await el.updateComplete

    assert.isFalse(el.open)
    assert.equal(closeReason, 'confirm')
  })
})
