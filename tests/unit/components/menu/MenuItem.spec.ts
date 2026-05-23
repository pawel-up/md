import { test, fixture, html, nextFrame, oneEvent } from '@pawel-up/lupa/testing'
import sinon from 'sinon'
import UiMenuItem from '../../../../src/components/menu/internal/MenuItem.js'
import UiSubMenu from '../../../../src/components/menu/internal/SubMenu.js'

import '../../../../src/components/menu/ui-menu.js'
import '../../../../src/components/menu/ui-menu-item.js'
import '../../../../src/components/menu/ui-sub-menu.js'
import '../../../../src/components/icons/ui-icon.js'

async function basicFixture(): Promise<UiMenuItem> {
  return fixture(html`<ui-menu-item>Test Item</ui-menu-item>`)
}

async function selectedFixture(): Promise<UiMenuItem> {
  return fixture(html`<ui-menu-item selected>Selected Item</ui-menu-item>`)
}

async function withValueFixture(): Promise<UiMenuItem> {
  return fixture(html`<ui-menu-item value="test-value">Item with Value</ui-menu-item>`)
}

async function withSelectionIconFixture(): Promise<UiMenuItem> {
  return fixture(html`<ui-menu-item selected showSelectionIcon>Item with Selection Icon</ui-menu-item>`)
}

async function withSubmenuFixture(): Promise<HTMLElement> {
  return fixture(html`
    <div>
      <ui-menu-item id="parent-item" submenu="test-submenu">
        <span slot="start"><ui-icon>folder</ui-icon></span>
        <span>Parent Item</span>
      </ui-menu-item>
      <ui-sub-menu id="test-submenu" anchor="parent-item">
        <ui-menu-item>Child Item 1</ui-menu-item>
        <ui-menu-item>Child Item 2</ui-menu-item>
      </ui-sub-menu>
    </div>
  `)
}

async function disabledFixture(): Promise<UiMenuItem> {
  return fixture(html`<ui-menu-item disabled>Disabled Item</ui-menu-item>`)
}

async function withSlotsFixture(): Promise<UiMenuItem> {
  return fixture(html`
    <ui-menu-item>
      <span slot="start"><ui-icon>add</ui-icon></span>
      <span>Main Content</span>
      <span slot="end"><ui-icon>arrow_right</ui-icon></span>
      <span slot="end-text">Ctrl+N</span>
    </ui-menu-item>
  `)
}

test.group('Basic functionality', () => {
  test('should create menu item element', async ({ assert }) => {
    const element = await basicFixture()
    assert.instanceOf(element, UiMenuItem)
    assert.equal(element.tagName.toLowerCase(), 'ui-menu-item')
  })

  test('should set correct ARIA attributes', async ({ assert }) => {
    const element = await basicFixture()
    assert.equal(element.getAttribute('role'), 'menuitem')
  })

  test('should generate ID if not present', async ({ assert }) => {
    const element = await basicFixture()
    assert.isString(element.id)
    assert.isTrue(element.id.length > 0)
  })

  test('should preserve existing ID', async ({ assert }) => {
    const element: UiMenuItem = await fixture(html`<ui-menu-item id="custom-id">Test</ui-menu-item>`)
    assert.equal(element.id, 'custom-id')
  })
})

test.group('Submenu functionality', () => {
  test('should detect submenu presence', async ({ assert }) => {
    const container = await withSubmenuFixture()
    const menuItem = container.querySelector('#parent-item') as UiMenuItem
    await nextFrame()

    assert.isTrue(menuItem.hasSubMenu)
    assert.equal(menuItem.submenu, 'test-submenu')
  })

  test('should get submenu element reference', async ({ assert }) => {
    const container = await withSubmenuFixture()
    const menuItem = container.querySelector('#parent-item') as UiMenuItem
    const submenu = container.querySelector('#test-submenu') as UiSubMenu
    await nextFrame()

    assert.equal(menuItem.subMenuElement, submenu)
  })

  test('should open submenu', async ({ assert }) => {
    const container = await withSubmenuFixture()
    const menuItem = container.querySelector('#parent-item') as UiMenuItem
    const submenu = container.querySelector('#test-submenu') as UiSubMenu
    const showSpy = sinon.spy(submenu, 'show')
    await nextFrame()

    menuItem.openSubMenu()
    await nextFrame()

    assert.isTrue(showSpy.calledOnce)
    assert.equal(menuItem.getAttribute('aria-expanded'), 'true')
  })

  test('should close submenu', async ({ assert }) => {
    const container = await withSubmenuFixture()
    const menuItem = container.querySelector('#parent-item') as UiMenuItem
    const submenu = container.querySelector('#test-submenu') as UiSubMenu
    const hideSpy = sinon.spy(submenu, 'hide')
    await nextFrame()

    menuItem.openSubMenu()
    await nextFrame()
    menuItem.closeSubMenu()
    await nextFrame()

    assert.isTrue(hideSpy.calledOnce)
    assert.equal(menuItem.getAttribute('aria-expanded'), 'false')
  })

  test('should toggle submenu', async ({ assert }) => {
    const container = await withSubmenuFixture()
    const menuItem = container.querySelector('#parent-item') as UiMenuItem
    const submenu = container.querySelector('#test-submenu') as UiSubMenu
    const showSpy = sinon.spy(submenu, 'show')
    const hideSpy = sinon.spy(submenu, 'hide')
    await nextFrame()

    menuItem.toggleSubMenu()
    await nextFrame()
    assert.isTrue(showSpy.calledOnce)

    menuItem.toggleSubMenu()
    await nextFrame()
    assert.isTrue(hideSpy.calledOnce)
  })

  test('should dispatch submenu-open event', async ({ assert }) => {
    const container = await withSubmenuFixture()
    const menuItem = container.querySelector('#parent-item') as UiMenuItem
    await nextFrame()

    setTimeout(() => menuItem.openSubMenu())
    const event = (await oneEvent(menuItem, 'submenu-open')) as CustomEvent<{ subMenu: UiSubMenu }>

    assert.instanceOf(event, CustomEvent)
    assert.isFalse(event.bubbles)
    assert.isTrue(event.composed)
    assert.isNotNull(event.detail.subMenu)
  })
})

test.group('Click handling', () => {
  test('should handle click on regular menu item', async ({ assert }) => {
    const element = await basicFixture()
    const clickSpy = sinon.spy()
    element.addEventListener('click', clickSpy)

    element.click()
    await nextFrame()

    assert.isTrue(clickSpy.calledOnce)
  })

  test('should prevent default on submenu item click', async ({ assert }) => {
    const container = await withSubmenuFixture()
    const menuItem = container.querySelector('#parent-item') as UiMenuItem
    await nextFrame()

    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    let defaultPrevented = false
    let propagationStopped = false

    // Override preventDefault and stopPropagation to check if they were called
    const originalPreventDefault = event.preventDefault
    const originalStopPropagation = event.stopPropagation

    event.preventDefault = () => {
      defaultPrevented = true
      originalPreventDefault.call(event)
    }

    event.stopPropagation = () => {
      propagationStopped = true
      originalStopPropagation.call(event)
    }

    menuItem.dispatchEvent(event)

    assert.isTrue(defaultPrevented)
    assert.isTrue(propagationStopped)
  })
})

test.group('Mouse interaction', () => {
  test('should open submenu on mouse enter', async ({ assert }) => {
    const container = await withSubmenuFixture()
    const menuItem = container.querySelector('#parent-item') as UiMenuItem
    const openSpy = sinon.spy(menuItem, 'openSubMenu')
    await nextFrame()

    const event = new MouseEvent('mouseenter')
    menuItem.dispatchEvent(event)

    assert.isTrue(openSpy.calledOnce)
  })

  test('should not open submenu on mouse enter if no submenu', async ({ assert }) => {
    const element = await basicFixture()
    const openSpy = sinon.spy(element, 'openSubMenu')

    const event = new MouseEvent('mouseenter')
    element.dispatchEvent(event)

    assert.isFalse(openSpy.called)
  })
})

test.group('Accessibility', () => {
  test('should set aria-haspopup for items with submenu', async ({ assert }) => {
    const container = await withSubmenuFixture()
    const menuItem = container.querySelector('#parent-item') as UiMenuItem
    await nextFrame()

    assert.equal(menuItem.getAttribute('aria-haspopup'), 'true')
    assert.equal(menuItem.getAttribute('aria-expanded'), 'false')
  })

  test('should not set aria-haspopup for items without submenu', async ({ assert }) => {
    const element = await basicFixture()
    await nextFrame()

    assert.isNull(element.getAttribute('aria-haspopup'))
    assert.isNull(element.getAttribute('aria-expanded'))
  })

  test('should update aria-expanded when submenu opens/closes', async ({ assert }) => {
    const container = await withSubmenuFixture()
    const menuItem = container.querySelector('#parent-item') as UiMenuItem
    await nextFrame()

    assert.equal(menuItem.getAttribute('aria-expanded'), 'false')

    menuItem.openSubMenu()
    await nextFrame()
    assert.equal(menuItem.getAttribute('aria-expanded'), 'true')

    menuItem.closeSubMenu()
    await nextFrame()
    assert.equal(menuItem.getAttribute('aria-expanded'), 'false')
  })
})

test.group('Disabled state', () => {
  test('should handle disabled attribute', async ({ assert }) => {
    const element = await disabledFixture()
    await nextFrame()

    assert.isTrue(element.disabled)
    assert.isTrue(element.hasAttribute('disabled'))
  })

  test('should reflect disabled property to attribute', async ({ assert }) => {
    const element = await basicFixture()

    element.disabled = true
    await nextFrame()
    assert.equal(element.getAttribute('disabled'), '')

    element.disabled = false
    await nextFrame()
    assert.isFalse(element.hasAttribute('disabled'))
  })
})

test.group('Slots', () => {
  test('should render content in slots', async ({ assert }) => {
    const element = await withSlotsFixture()
    await nextFrame()

    const startSlot = element.shadowRoot!.querySelector('slot[name="start"]')
    const endSlot = element.shadowRoot!.querySelector('slot[name="end"]')
    const endTextSlot = element.shadowRoot!.querySelector('slot[name="end-text"]')

    assert.isNotNull(startSlot)
    assert.isNotNull(endSlot)
    assert.isNotNull(endTextSlot)
  })

  test('should show arrow icon for items with submenu', async ({ assert }) => {
    const container = await withSubmenuFixture()
    const menuItem = container.querySelector('#parent-item') as UiMenuItem
    await nextFrame()

    const arrow = menuItem.shadowRoot!.querySelector('.menu-item-arrow')
    assert.isNotNull(arrow)
    assert.equal(arrow!.textContent, 'arrow_right')
  })

  test('should not show arrow icon for items without submenu', async ({ assert }) => {
    const element = await basicFixture()
    await nextFrame()

    const arrow = element.shadowRoot!.querySelector('.menu-item-arrow')
    assert.isNull(arrow)
  })
})

test.group('Edge cases', () => {
  test('should handle missing submenu element gracefully', async ({ assert }) => {
    const element: UiMenuItem = await fixture(html`<ui-menu-item submenu="nonexistent">Test</ui-menu-item>`)
    await nextFrame()

    assert.isFalse(element.hasSubMenu)
    assert.isNull(element.subMenuElement)

    // Should not throw
    element.openSubMenu()
    element.closeSubMenu()
    element.toggleSubMenu()
  })

  test('should handle multiple submenu property changes', async ({ assert }) => {
    const element = await basicFixture()

    element.submenu = 'test1'
    await nextFrame()

    element.submenu = 'test2'
    await nextFrame()

    element.submenu = undefined
    await nextFrame()

    // Should not throw or cause issues
    assert.isUndefined(element.submenu)
  })
})

test.group('Rendering', () => {
  test('should render with correct CSS classes', async ({ assert }) => {
    const element = await basicFixture()
    await nextFrame()

    const surface = element.shadowRoot!.querySelector('.surface')
    assert.isNotNull(surface)
    assert.isTrue(surface!.classList.contains('menu-item'))
  })

  test('should render focus ring and ripple', async ({ assert }) => {
    const element = await basicFixture()
    await nextFrame()

    const focusRing = element.shadowRoot!.querySelector('ui-focus-ring')
    const ripple = element.shadowRoot!.querySelector('ui-ripple')

    assert.isNotNull(focusRing)
    assert.isNotNull(ripple)
  })
})

test.group('Selection functionality', () => {
  test('should have selected property with default value false', async ({ assert }) => {
    const element = await basicFixture()
    assert.isFalse(element.selected)
  })

  test('should set selected property from attribute', async ({ assert }) => {
    const element = await selectedFixture()
    assert.isTrue(element.selected)
  })

  test('should reflect selected property to attribute', async ({ assert }) => {
    const element = await basicFixture()

    element.selected = true
    await nextFrame()
    assert.isTrue(element.hasAttribute('selected'))

    element.selected = false
    await nextFrame()
    assert.isFalse(element.hasAttribute('selected'))
  })

  test('should update CSS classes when selected changes', async ({ assert }) => {
    const element = await basicFixture()

    element.selected = true
    await nextFrame()
    assert.isTrue(element.classList.contains('select'))

    element.selected = false
    await nextFrame()
    assert.isFalse(element.classList.contains('select'))
  })

  test('should update aria-selected when selected changes', async ({ assert }) => {
    const element = await basicFixture()

    element.selected = true
    await nextFrame()
    assert.equal(element.getAttribute('aria-selected'), 'true')

    element.selected = false
    await nextFrame()
    assert.equal(element.getAttribute('aria-selected'), 'false')
  })

  test('should initialize selection state on connection', async ({ assert }) => {
    const element = await selectedFixture()
    await nextFrame()

    assert.isTrue(element.classList.contains('select'))
    assert.equal(element.getAttribute('aria-selected'), 'true')
  })

  test('should update selection state when selected property changes', async ({ assert }) => {
    const element = await basicFixture()
    const updateSelectionStateSpy = sinon.spy(
      element as UiMenuItem & { updateSelectionState: () => void },
      'updateSelectionState'
    )

    element.selected = true
    await nextFrame()

    assert.isTrue(updateSelectionStateSpy.calledOnce)
  })
})

test.group('Value property', () => {
  test('should have value property with default undefined', async ({ assert }) => {
    const element = await basicFixture()
    assert.isUndefined(element.value)
  })

  test('should set value property from attribute', async ({ assert }) => {
    const element = await withValueFixture()
    assert.equal(element.value, 'test-value')
  })

  test('should update value property dynamically', async ({ assert }) => {
    const element = await basicFixture()

    element.value = 'new-value'
    await element.updateComplete
    assert.equal(element.value, 'new-value')
    assert.equal(element.getAttribute('value'), 'new-value')
  })
})

test.group('Selection icon functionality', () => {
  test('should have showSelectionIcon property with default value false', async ({ assert }) => {
    const element = await basicFixture()
    assert.isFalse(element.showSelectionIcon)
  })

  test('should set showSelectionIcon property from attribute', async ({ assert }) => {
    const element = await withSelectionIconFixture()
    assert.isTrue(element.showSelectionIcon)
  })

  test('should show check icon when selected and showSelectionIcon is true', async ({ assert }) => {
    const element = await withSelectionIconFixture()
    await nextFrame()

    const checkIcon = element.shadowRoot!.querySelector('.selection-check')
    assert.isNotNull(checkIcon)
    assert.equal(checkIcon!.textContent, 'check')
  })

  test('should not show check icon when not selected', async ({ assert }) => {
    const element: UiMenuItem = await fixture(html`<ui-menu-item showSelectionIcon>Not Selected Item</ui-menu-item>`)
    await nextFrame()

    const checkIcon = element.shadowRoot!.querySelector('.selection-check')
    assert.isNull(checkIcon)
  })

  test('should not show check icon when selected but showSelectionIcon is false', async ({ assert }) => {
    const element = await selectedFixture()
    await nextFrame()

    const checkIcon = element.shadowRoot!.querySelector('.selection-check')
    assert.isNull(checkIcon)
  })

  test('should toggle check icon visibility when selection changes', async ({ assert }) => {
    const element: UiMenuItem = await fixture(html`<ui-menu-item showSelectionIcon>Toggle Item</ui-menu-item>`)
    await nextFrame()

    // Initially not selected, no icon
    let checkIcon = element.shadowRoot!.querySelector('.selection-check')
    assert.isNull(checkIcon)

    // Select the item
    element.selected = true
    await nextFrame()
    checkIcon = element.shadowRoot!.querySelector('.selection-check')
    assert.isNotNull(checkIcon)

    // Deselect the item
    element.selected = false
    await nextFrame()
    checkIcon = element.shadowRoot!.querySelector('.selection-check')
    assert.isNull(checkIcon)
  })
})

test.group('Selection events', () => {
  test('should not dispatch select event when regular menu item is clicked', async ({ assert }) => {
    const element = await basicFixture()
    const selectSpy = sinon.spy()
    element.addEventListener('select', selectSpy)

    element.click()
    await nextFrame()

    assert.isFalse(selectSpy.called)
  })

  test('should not dispatch select event when submenu item is clicked', async ({ assert }) => {
    const container = await withSubmenuFixture()
    const menuItem = container.querySelector('#parent-item') as UiMenuItem
    await nextFrame()

    const selectSpy = sinon.spy()
    menuItem.addEventListener('select', selectSpy)

    menuItem.click()
    await nextFrame()

    assert.isFalse(selectSpy.called)
  })

  test('should bubble up select event from sub-menu selections', async ({ assert }) => {
    const element = await basicFixture()
    const selectSpy = sinon.spy()
    element.addEventListener('select', selectSpy)

    // Simulate a sub-menu selection event
    const subMenuEvent = new CustomEvent('select', {
      detail: { item: element, index: 0 },
      bubbles: true,
      composed: true,
    })

    element['handleSubMenuSelect'](subMenuEvent)

    assert.isTrue(selectSpy.calledOnce)
    const dispatchedEvent = selectSpy.args[0][0] as CustomEvent
    assert.equal(dispatchedEvent.detail.item, element)
    assert.equal(dispatchedEvent.detail.index, 0)
    assert.isFalse(dispatchedEvent.bubbles)
    assert.isTrue(dispatchedEvent.composed)
  })
})

test.group('Accessibility for selection', () => {
  test('should always have aria-selected attribute', async ({ assert }) => {
    const element = await basicFixture()
    await nextFrame()

    assert.isNotNull(element.getAttribute('aria-selected'))
  })

  test('should have aria-selected="false" by default', async ({ assert }) => {
    const element = await basicFixture()
    await nextFrame()

    assert.equal(element.getAttribute('aria-selected'), 'false')
  })

  test('should have aria-selected="true" when selected', async ({ assert }) => {
    const element = await selectedFixture()
    await nextFrame()

    assert.equal(element.getAttribute('aria-selected'), 'true')
  })

  test('should maintain proper aria-selected state when toggling selection', async ({ assert }) => {
    const element = await basicFixture()
    await nextFrame()

    // Initially false
    assert.equal(element.getAttribute('aria-selected'), 'false')

    // Select
    element.selected = true
    await nextFrame()
    assert.equal(element.getAttribute('aria-selected'), 'true')

    // Deselect
    element.selected = false
    await nextFrame()
    assert.equal(element.getAttribute('aria-selected'), 'false')
  })
})

test.group('Selection state interaction with other properties', () => {
  test('should maintain selection state when disabled', async ({ assert }) => {
    const element = await selectedFixture()

    element.disabled = true
    await nextFrame()

    assert.isTrue(element.selected)
    assert.equal(element.getAttribute('aria-selected'), 'true')
    assert.isTrue(element.classList.contains('select'))
  })

  test('should preserve value when selection changes', async ({ assert }) => {
    const element = await withValueFixture()

    element.selected = true
    await nextFrame()

    assert.equal(element.value, 'test-value')
  })

  test('should work with complex attribute combinations', async ({ assert }) => {
    const element: UiMenuItem = await fixture(html`
      <ui-menu-item selected showSelectionIcon value="complex-item" disabled> Complex Item </ui-menu-item>
    `)
    await nextFrame()

    assert.isTrue(element.selected)
    assert.isTrue(element.showSelectionIcon)
    assert.equal(element.value, 'complex-item')
    assert.isTrue(element.disabled)
    assert.equal(element.getAttribute('aria-selected'), 'true')
    assert.isTrue(element.classList.contains('select'))

    const checkIcon = element.shadowRoot!.querySelector('.selection-check')
    assert.isNotNull(checkIcon)
  })
})
