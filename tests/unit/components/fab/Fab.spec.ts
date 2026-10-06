import { fixture, html, test } from '@pawel-up/lupa/testing'
import { UiFabElement } from '../../../../src/components/fab/ui-fab.js'
import type { UiButtonElement } from '../../../../src/components/button/ui-button.js'
import { OverlayStackManager } from '../../../../src/controllers/OverlayStackManager.js'

import '../../../../src/components/fab/ui-fab.js'
import '../../../../src/components/button/ui-button.js'
import '../../../../src/components/icon-button/ui-icon-button.js'
import '../../../../src/components/icons/ui-icon.js'

test.group('Floating Action Button (FAB) Container', () => {
  test('renders with default placement and role', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
      </ui-fab>
    `)

    assert.equal(el.placement, 'bottom-end')
    assert.equal(el.getAttribute('placement'), 'bottom-end')
    assert.equal(el.getAttribute('role'), 'group')
    assert.isFalse(el.open)
    assert.isNotNull(el.trigger)
  }).tags(['@md', '@fab'])

  test('reflects placement attribute', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab placement="top-start">
        <ui-icon-button slot="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
      </ui-fab>
    `)

    assert.equal(el.placement, 'top-start')
    assert.equal(el.getAttribute('placement'), 'top-start')
  }).tags(['@md', '@fab'])

  test('identifies trigger in default slot or explicit slot', async ({ assert }) => {
    const defaultFab = await fixture<UiFabElement>(html`
      <ui-fab>
        <ui-icon-button id="default-btn">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
      </ui-fab>
    `)
    assert.equal(defaultFab.trigger?.id, 'default-btn')

    const explicitFab = await fixture<UiFabElement>(html`
      <ui-fab>
        <ui-icon-button slot="trigger" id="explicit-btn">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
      </ui-fab>
    `)
    assert.equal(explicitFab.trigger?.id, 'explicit-btn')
  }).tags(['@md', '@fab'])

  test('identifies menu items in slot="menu"', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
        <ui-button slot="menu" id="m2">Item 2</ui-button>
        <ui-button slot="menu" id="m3">Item 3</ui-button>
      </ui-fab>
    `)

    assert.isTrue(el.hasMenu)
    assert.equal(el.menuItems.length, 3)
    assert.equal(el.menuItems[0]?.id, 'm1')
    assert.equal(el.menuItems[1]?.id, 'm2')
    assert.equal(el.menuItems[2]?.id, 'm3')
  }).tags(['@md', '@fab'])

  test('updates trigger aria attributes when menu is present', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
      </ui-fab>
    `)

    const trigger = el.trigger
    assert.isNotNull(trigger)
    assert.equal(trigger?.getAttribute('aria-haspopup'), 'menu')
    assert.equal(trigger?.getAttribute('aria-expanded'), 'false')

    el.open = true
    await el.updateComplete

    assert.equal(trigger?.getAttribute('aria-expanded'), 'true')
  }).tags(['@md', '@fab', '@a11y'])

  test('toggles open state via show(), hide(), and toggle()', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
      </ui-fab>
    `)

    let openEvents = 0
    let closeEvents = 0
    let changeEvents = 0

    el.addEventListener('open', () => {
      openEvents += 1
    })
    el.addEventListener('close', () => {
      closeEvents += 1
    })
    el.addEventListener('change', () => {
      changeEvents += 1
    })

    el.show()
    await el.updateComplete
    assert.isTrue(el.open)
    assert.equal(openEvents, 1)
    assert.equal(changeEvents, 1)

    let closeBubbled = false
    el.parentElement?.addEventListener('close', () => {
      closeBubbled = true
    })

    el.hide()
    await el.updateComplete
    assert.isFalse(el.open)
    assert.equal(closeEvents, 1)
    assert.isFalse(closeBubbled)
    assert.equal(changeEvents, 2)

    el.open = false
    await el.updateComplete
    assert.isFalse(closeBubbled)

    el.toggle()
    await el.updateComplete
    assert.isTrue(el.open)
    assert.equal(openEvents, 2)
  }).tags(['@md', '@fab'])

  test('clicking trigger toggles open state', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
      </ui-fab>
    `)

    const trigger = el.trigger
    assert.isNotNull(trigger)

    trigger?.click()
    await el.updateComplete
    assert.isTrue(el.open)

    trigger?.click()
    await el.updateComplete
    assert.isFalse(el.open)
  }).tags(['@md', '@fab'])

  test('clicking menu item dispatches select event and closes menu', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
      </ui-fab>
    `)

    let selectedItem: HTMLElement | null = null
    el.addEventListener('select', (e: Event) => {
      const customEvent = e as CustomEvent<{ item: HTMLElement }>
      selectedItem = customEvent.detail.item
    })

    const m1 = el.querySelector<UiButtonElement>('#m1')
    assert.isNotNull(m1)

    m1?.click()
    await el.updateComplete

    assert.equal(selectedItem, m1)
    assert.isFalse(el.open)
  }).tags(['@md', '@fab'])

  test('sets upward stagger animation delays on menu items', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
        <ui-button slot="menu" id="m2">Item 2</ui-button>
        <ui-button slot="menu" id="m3">Item 3</ui-button>
      </ui-fab>
    `)

    const m1 = el.querySelector<UiButtonElement>('#m1')
    const m2 = el.querySelector<UiButtonElement>('#m2')
    const m3 = el.querySelector<UiButtonElement>('#m3')

    assert.isNotNull(m1)
    assert.isNotNull(m2)
    assert.isNotNull(m3)

    // m3 is closest to trigger (delay 0ms)
    // m2 is middle (delay 25ms)
    // m1 is top item (delay 50ms)
    assert.equal(m3?.style.getPropertyValue('--_item-delay'), '0ms')
    assert.equal(m2?.style.getPropertyValue('--_item-delay'), '25ms')
    assert.equal(m1?.style.getPropertyValue('--_item-delay'), '50ms')
  }).tags(['@md', '@fab'])

  test('maintains initial focus on close button (trigger) when menu opens', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
        <ui-button slot="menu" id="m2">Item 2</ui-button>
      </ui-fab>
    `)

    const trigger = el.trigger
    assert.isNotNull(trigger)

    trigger?.focus()
    el.open = true
    await el.updateComplete

    // Initial focus remains on the close button
    assert.equal(document.activeElement, trigger)
    assert.equal(trigger?.tabIndex, 0)

    const m1 = el.querySelector<UiButtonElement>('#m1')
    const m2 = el.querySelector<UiButtonElement>('#m2')
    assert.equal(m1?.tabIndex, -1)
    assert.equal(m2?.tabIndex, -1)
  }).tags(['@md', '@fab', '@a11y'])

  test('arrow keys navigate from close button to top menu item and downward', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
        <ui-button slot="menu" id="m2">Item 2</ui-button>
      </ui-fab>
    `)

    const trigger = el.trigger
    const m1 = el.querySelector<UiButtonElement>('#m1')
    const m2 = el.querySelector<UiButtonElement>('#m2')

    assert.isNotNull(trigger)
    assert.isNotNull(m1)
    assert.isNotNull(m2)

    trigger?.focus()
    assert.equal(document.activeElement, trigger)

    // ArrowDown from close button moves to TOP menu item (m1)
    trigger?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    assert.equal(document.activeElement, m1)
    assert.equal(m1?.tabIndex, 0)
    assert.equal(trigger?.tabIndex, -1)

    // ArrowDown from m1 moves to next item down (m2)
    m1?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    assert.equal(document.activeElement, m2)
    assert.equal(m2?.tabIndex, 0)
    assert.equal(m1?.tabIndex, -1)

    // ArrowDown from m2 (bottom item) wraps back to close button (trigger)
    m2?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    assert.equal(document.activeElement, trigger)
    assert.equal(trigger?.tabIndex, 0)
    assert.equal(m2?.tabIndex, -1)
  }).tags(['@md', '@fab', '@a11y'])

  test('arrow up navigates upward towards top item and wraps to close button', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
        <ui-button slot="menu" id="m2">Item 2</ui-button>
      </ui-fab>
    `)

    const trigger = el.trigger
    const m1 = el.querySelector<UiButtonElement>('#m1')
    const m2 = el.querySelector<UiButtonElement>('#m2')

    assert.isNotNull(trigger)
    assert.isNotNull(m1)
    assert.isNotNull(m2)

    trigger?.focus()

    // ArrowUp from close button moves to bottom-most menu item directly above it (m2)
    trigger?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    assert.equal(document.activeElement, m2)
    assert.equal(m2?.tabIndex, 0)

    // ArrowUp from m2 moves to m1
    m2?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    assert.equal(document.activeElement, m1)
    assert.equal(m1?.tabIndex, 0)

    // ArrowUp from m1 (top item) wraps back to close button
    m1?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    assert.equal(document.activeElement, trigger)
    assert.equal(trigger?.tabIndex, 0)
  }).tags(['@md', '@fab', '@a11y'])

  test('skips disabled menu items during arrow navigation', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
        <ui-button slot="menu" id="m2" disabled>Item 2</ui-button>
        <ui-button slot="menu" id="m3">Item 3</ui-button>
      </ui-fab>
    `)

    const trigger = el.trigger
    const m1 = el.querySelector<UiButtonElement>('#m1')
    const m3 = el.querySelector<UiButtonElement>('#m3')

    assert.isNotNull(trigger)
    assert.isNotNull(m1)
    assert.isNotNull(m3)

    trigger?.focus()

    // ArrowDown moves to m1
    trigger?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    assert.equal(document.activeElement, m1)

    // ArrowDown from m1 skips disabled m2 and lands on m3
    m1?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    assert.equal(document.activeElement, m3)
  }).tags(['@md', '@fab', '@a11y'])

  test('Home and End jump to top item and close button', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
        <ui-button slot="menu" id="m2">Item 2</ui-button>
        <ui-button slot="menu" id="m3">Item 3</ui-button>
      </ui-fab>
    `)

    const trigger = el.trigger
    const m1 = el.querySelector<UiButtonElement>('#m1')
    const m3 = el.querySelector<UiButtonElement>('#m3')

    assert.isNotNull(trigger)
    assert.isNotNull(m1)
    assert.isNotNull(m3)

    m3?.focus()

    // Home jumps to top item (m1)
    m3?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    assert.equal(document.activeElement, m1)

    // End jumps to close button (trigger)
    m1?.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    assert.equal(document.activeElement, trigger)
  }).tags(['@md', '@fab', '@a11y'])

  test('Escape closes menu and restores focus to trigger', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
      </ui-fab>
    `)

    const trigger = el.trigger
    const m1 = el.querySelector<UiButtonElement>('#m1')

    assert.isNotNull(trigger)
    assert.isNotNull(m1)

    m1?.focus()
    m1?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await el.updateComplete

    assert.isFalse(el.open)
    assert.equal(document.activeElement, trigger)
  }).tags(['@md', '@fab', '@a11y'])

  test('Escape does not steal focus from menu item when closing is prevented', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open .beforeClose=${() => false}>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
      </ui-fab>
    `)

    const m1 = el.querySelector<UiButtonElement>('#m1')
    assert.isNotNull(m1)

    m1?.focus()
    assert.equal(document.activeElement, m1)

    m1?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await el.updateComplete

    assert.isTrue(el.open)
    assert.equal(document.activeElement, m1)
  }).tags(['@md', '@fab', '@a11y'])

  test('clicking outside closes open menu', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
      </ui-fab>
    `)

    assert.isTrue(el.open)

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await el.updateComplete

    assert.isFalse(el.open)
  }).tags(['@md', '@fab'])

  test('sets top-to-bottom stagger animation delays when placed at top edge', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab placement="top-start" open>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
        <ui-button slot="menu" id="m2">Item 2</ui-button>
        <ui-button slot="menu" id="m3">Item 3</ui-button>
      </ui-fab>
    `)

    const m1 = el.querySelector<UiButtonElement>('#m1')
    const m2 = el.querySelector<UiButtonElement>('#m2')
    const m3 = el.querySelector<UiButtonElement>('#m3')

    assert.isNotNull(m1)
    assert.isNotNull(m2)
    assert.isNotNull(m3)

    // For top placement:
    // m1 is closest to trigger at the top (delay 0ms)
    // m2 is middle (delay 25ms)
    // m3 is bottom item (delay 50ms)
    assert.equal(m1?.style.getPropertyValue('--_item-delay'), '0ms')
    assert.equal(m2?.style.getPropertyValue('--_item-delay'), '25ms')
    assert.equal(m3?.style.getPropertyValue('--_item-delay'), '50ms')
  }).tags(['@md', '@fab'])

  test('pressing Space on trigger opens and remains open on release', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
      </ui-fab>
    `)

    const trigger = el.trigger
    assert.isNotNull(trigger)

    trigger?.focus()

    // Space keydown & keyup on button triggers its native/component click
    trigger?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }))
    await el.updateComplete

    trigger?.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space', bubbles: true }))
    await el.updateComplete

    assert.isTrue(el.open)
  }).tags(['@md', '@fab'])

  test('pressing ArrowUp or ArrowDown on closed trigger opens menu', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
      </ui-fab>
    `)

    const trigger = el.trigger
    assert.isNotNull(trigger)

    trigger?.focus()
    trigger?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    await el.updateComplete

    assert.isTrue(el.open)

    el.open = false
    await el.updateComplete

    trigger?.focus()
    trigger?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await el.updateComplete

    assert.isTrue(el.open)
  }).tags(['@md', '@fab'])

  test('restores focus to trigger when menu closes while an item has focus', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
      </ui-fab>
    `)

    const trigger = el.trigger
    const m1 = el.querySelector<UiButtonElement>('#m1')

    assert.isNotNull(trigger)
    assert.isNotNull(m1)

    m1?.focus()
    assert.equal(document.activeElement, m1)

    el.hide()
    await el.updateComplete

    assert.isFalse(el.open)
    assert.equal(document.activeElement?.id, trigger?.id)
  }).tags(['@md', '@fab', '@a11y'])

  test('preserves developer-defined roles on slotted menu items', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1" role="menuitemcheckbox">Item 1</ui-button>
        <ui-button slot="menu" id="m2">Item 2</ui-button>
      </ui-fab>
    `)

    const m1 = el.querySelector<UiButtonElement>('#m1')
    const m2 = el.querySelector<UiButtonElement>('#m2')
    assert.isNotNull(m1)
    assert.isNotNull(m2)
    assert.equal(m1?.getAttribute('role'), 'menuitemcheckbox')
    // m2 retains its native role (button) without being mutated by the container
    assert.equal(m2?.getAttribute('role'), 'button')
  }).tags(['@md', '@fab', '@a11y'])

  test('does not toggle or open menu through UI interaction when trigger is disabled', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab>
        <ui-icon-button id="trigger" disabled>
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
      </ui-fab>
    `)

    const trigger = el.trigger
    assert.isNotNull(trigger)

    // User clicking disabled trigger does not open
    trigger?.click()
    await el.updateComplete
    assert.isFalse(el.open)

    // User pressing arrow keys on disabled trigger does not open
    trigger?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await el.updateComplete
    assert.isFalse(el.open)

    trigger?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    await el.updateComplete
    assert.isFalse(el.open)

    // Imperative show() method is allowed programmatically
    el.show()
    await el.updateComplete
    assert.isTrue(el.open)
  }).tags(['@md', '@fab', '@a11y'])

  test('ignores keyboard navigation when modifier keys are pressed', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
        <ui-button slot="menu" id="m2">Item 2</ui-button>
      </ui-fab>
    `)

    const trigger = el.trigger
    assert.isNotNull(trigger)

    trigger?.focus()
    assert.equal(document.activeElement, trigger)

    const altEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', altKey: true, bubbles: true })
    trigger?.dispatchEvent(altEvent)
    assert.equal(document.activeElement, trigger)
    assert.isFalse(altEvent.defaultPrevented)

    const ctrlEvent = new KeyboardEvent('keydown', { key: 'Home', ctrlKey: true, bubbles: true })
    trigger?.dispatchEvent(ctrlEvent)
    assert.equal(document.activeElement, trigger)
    assert.isFalse(ctrlEvent.defaultPrevented)

    const metaEvent = new KeyboardEvent('keydown', { key: 'End', metaKey: true, bubbles: true })
    trigger?.dispatchEvent(metaEvent)
    assert.equal(document.activeElement, trigger)
    assert.isFalse(metaEvent.defaultPrevented)
  }).tags(['@md', '@fab', '@a11y'])

  test('cleans up document pointerdown listener on disconnect', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open>
        <ui-icon-button id="trigger">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
      </ui-fab>
    `)

    assert.isTrue(el.open)

    // Remove from DOM
    el.parentElement?.removeChild(el)

    // Dispatching pointerdown on body should not throw or affect el
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    assert.isTrue(el.open)
  }).tags(['@md', '@fab'])

  test('programmatic open = true does not steal focus when document focus is outside', async ({ assert }) => {
    const container = await fixture<HTMLDivElement>(html`
      <div>
        <button id="external">External</button>
        <ui-fab id="fab">
          <ui-icon-button slot="trigger" id="trigger" aria-label="Add">
            <ui-icon>add</ui-icon>
          </ui-icon-button>
          <ui-button slot="menu" id="m1">Item 1</ui-button>
        </ui-fab>
      </div>
    `)
    const external = container.querySelector<HTMLButtonElement>('#external')
    const fab = container.querySelector<UiFabElement>('#fab')
    assert.isNotNull(external)
    assert.isNotNull(fab)

    external?.focus()
    assert.equal(document.activeElement, external)

    if (fab) {
      fab.open = true
      await fab.updateComplete
      assert.isTrue(fab.open)
    }

    assert.equal(document.activeElement, external)
  }).tags(['@md', '@fab', '@a11y'])

  test('does not focus trigger on initial render with open attribute when focus is outside', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open>
        <ui-icon-button slot="trigger" id="trigger" aria-label="Add">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
      </ui-fab>
    `)

    assert.isTrue(el.open)
    assert.notEqual(document.activeElement, el.trigger)
  }).tags(['@md', '@fab', '@a11y'])

  test('dynamically adding and removing menu items updates item delay and roving tabindex', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open>
        <ui-icon-button slot="trigger" id="trigger" aria-label="Add">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1">Item 1</ui-button>
      </ui-fab>
    `)

    assert.equal(el.menuItems.length, 1)

    const m2 = document.createElement('ui-button')
    m2.setAttribute('slot', 'menu')
    m2.id = 'm2'
    m2.textContent = 'Item 2'
    el.appendChild(m2)

    await el.updateComplete
    assert.equal(el.menuItems.length, 2)
    assert.isTrue(m2.style.getPropertyValue('--_item-delay').length > 0)
    assert.equal(m2.getAttribute('tabindex'), '-1')

    const m1 = el.querySelector('#m1')
    m1?.remove()

    await el.updateComplete
    assert.equal(el.menuItems.length, 1)
    assert.equal(el.menuItems[0]?.id, 'm2')
  }).tags(['@md', '@fab'])

  test('focus remains on trigger when opened while focused inside component', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab>
        <ui-icon-button slot="trigger" id="trigger" aria-label="Add">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" id="m1" role="menuitem">Item 1</ui-button>
      </ui-fab>
    `)
    const trigger = el.trigger
    assert.isNotNull(trigger)
    trigger?.focus()
    assert.equal(document.activeElement, trigger)

    el.open = true
    await el.updateComplete

    assert.equal(document.activeElement, trigger)
  }).tags(['@md', '@fab', '@a11y'])
})

test.group('Floating Action Button (FAB) - Accessibility', () => {
  test('is accessible in standalone mode', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab>
        <ui-icon-button slot="trigger" aria-label="Add item">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
      </ui-fab>
    `)
    await assert.isAccessible(el)
  }).tags(['@md', '@fab', '@a11y'])

  test('is accessible with closed menu', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab>
        <ui-icon-button slot="trigger" aria-label="Actions">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" role="menuitem">Item 1</ui-button>
        <ui-button slot="menu" role="menuitem">Item 2</ui-button>
      </ui-fab>
    `)
    await assert.isAccessible(el)
  }).tags(['@md', '@fab', '@a11y'])

  test('is accessible with open menu', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open>
        <ui-icon-button slot="trigger" aria-label="Actions">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" role="menuitem">Item 1</ui-button>
        <ui-button slot="menu" role="menuitem">Item 2</ui-button>
      </ui-fab>
    `)
    await assert.isAccessible(el)
  }).tags(['@md', '@fab', '@a11y'])

  test('is accessible with disabled trigger', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab>
        <ui-icon-button slot="trigger" aria-label="Actions" disabled>
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" role="menuitem">Item 1</ui-button>
      </ui-fab>
    `)
    await assert.isAccessible(el)
  }).tags(['@md', '@fab', '@a11y'])

  test('is accessible with disabled menu items', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open>
        <ui-icon-button slot="trigger" aria-label="Actions">
          <ui-icon>add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" role="menuitem" disabled>Item 1</ui-button>
        <ui-button slot="menu" role="menuitem">Item 2</ui-button>
      </ui-fab>
    `)
    await assert.isAccessible(el)
  }).tags(['@md', '@fab', '@a11y'])

  test('is accessible with varied ARIA menu item roles', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open>
        <ui-icon-button slot="trigger" aria-label="Actions">
          <ui-icon aria-hidden="true">add</ui-icon>
        </ui-icon-button>
        <ui-button slot="menu" role="menuitemcheckbox" aria-checked="true">Checkbox Item</ui-button>
        <ui-button slot="menu" role="menuitemradio" aria-checked="false">Radio Item</ui-button>
      </ui-fab>
    `)
    await assert.isAccessible(el)
  }).tags(['@md', '@fab', '@a11y'])
})

test.group('Floating Action Button (FAB) - OverlayController Integration', (group) => {
  const manager = OverlayStackManager.getInstance()

  group.each.teardown(() => {
    manager.reset()
  })

  test('registers and unregisters on OverlayStackManager when open changes', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab>
        <ui-icon-button slot="trigger" aria-label="Actions"><ui-icon>add</ui-icon></ui-icon-button>
        <ui-button slot="menu" role="menuitem">Item 1</ui-button>
      </ui-fab>
    `)

    assert.equal(manager.size, 0)

    el.open = true
    await el.updateComplete

    assert.equal(manager.size, 1)
    assert.isTrue(manager.top?.element === el)

    el.open = false
    await el.updateComplete

    assert.equal(manager.size, 0)
  }).tags(['@md', '@fab', '@overlay'])

  test('global Escape key closes menu even when focus is on document body', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open>
        <ui-icon-button slot="trigger" aria-label="Actions"><ui-icon>add</ui-icon></ui-icon-button>
        <ui-button slot="menu" role="menuitem">Item 1</ui-button>
      </ui-fab>
    `)

    assert.isTrue(el.open)
    document.body.focus()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await el.updateComplete

    assert.isFalse(el.open)
  }).tags(['@md', '@fab', '@overlay'])

  test('respects closeOnEscape = false', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open .closeOnEscape=${false}>
        <ui-icon-button slot="trigger" aria-label="Actions"><ui-icon>add</ui-icon></ui-icon-button>
        <ui-button slot="menu" role="menuitem">Item 1</ui-button>
      </ui-fab>
    `)

    assert.isTrue(el.open)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await el.updateComplete

    assert.isTrue(el.open)
  }).tags(['@md', '@fab', '@overlay'])

  test('respects closeOnOutsideClick = false', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open .closeOnOutsideClick=${false}>
        <ui-icon-button slot="trigger" aria-label="Actions"><ui-icon>add</ui-icon></ui-icon-button>
        <ui-button slot="menu" role="menuitem">Item 1</ui-button>
      </ui-fab>
    `)

    assert.isTrue(el.open)

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await el.updateComplete

    assert.isTrue(el.open)
  }).tags(['@md', '@fab', '@overlay'])

  test('beforeClose guard can prevent closing', async ({ assert }) => {
    let allowClose = false
    const el = await fixture<UiFabElement>(html`
      <ui-fab open .beforeClose=${() => allowClose}>
        <ui-icon-button slot="trigger" aria-label="Actions"><ui-icon>add</ui-icon></ui-icon-button>
        <ui-button slot="menu" role="menuitem">Item 1</ui-button>
      </ui-fab>
    `)

    assert.isTrue(el.open)

    void el.hide('escape')
    await el.updateComplete
    assert.isTrue(el.open)

    allowClose = true
    void el.hide('escape')
    await el.updateComplete
    assert.isFalse(el.open)
  }).tags(['@md', '@fab', '@overlay'])

  test('closing event is cancelable via preventDefault()', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab open>
        <ui-icon-button slot="trigger" aria-label="Actions"><ui-icon>add</ui-icon></ui-icon-button>
        <ui-button slot="menu" role="menuitem">Item 1</ui-button>
      </ui-fab>
    `)

    let cancelNext = true
    el.addEventListener('closing', (e: Event) => {
      if (cancelNext) {
        e.preventDefault()
      }
    })

    assert.isTrue(el.open)

    void el.hide('outside-click')
    await el.updateComplete
    assert.isTrue(el.open)

    cancelNext = false
    void el.hide('outside-click')
    await el.updateComplete
    assert.isFalse(el.open)
  }).tags(['@md', '@fab', '@overlay'])

  test('does not register single-action standalone FAB without menu on overlay stack', async ({ assert }) => {
    const el = await fixture<UiFabElement>(html`
      <ui-fab>
        <ui-icon-button slot="trigger" aria-label="Add item"><ui-icon>add</ui-icon></ui-icon-button>
      </ui-fab>
    `)

    assert.equal(manager.size, 0)
    assert.isFalse(el.hasMenu)
    assert.isFalse(el.open)
  }).tags(['@md', '@fab', '@overlay'])
})
