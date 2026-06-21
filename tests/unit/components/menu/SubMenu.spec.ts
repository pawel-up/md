import { test, fixture, html, nextFrame, oneEvent } from '@pawel-up/lupa/testing'
import sinon from 'sinon'
import UiSubMenu from '../../../../src/components/menu/internal/SubMenu.js'
import UiMenuItem from '../../../../src/components/menu/internal/MenuItem.js'
import Menu from '../../../../src/components/menu/internal/Menu.js'

import '../../../../src/components/menu/ui-menu.js'
import '../../../../src/components/menu/ui-menu-item.js'
import '../../../../src/components/menu/ui-sub-menu.js'
import '../../../../src/components/icons/ui-icon.js'

async function basicFixture(): Promise<UiSubMenu> {
  return fixture(html`
    <ui-sub-menu id="test-submenu">
      <ui-menu-item>Item 1</ui-menu-item>
      <ui-menu-item>Item 2</ui-menu-item>
      <ui-menu-item disabled>Item 3 (Disabled)</ui-menu-item>
    </ui-sub-menu>
  `)
}

async function withAnchorFixture(): Promise<HTMLElement> {
  return fixture(html`
    <div>
      <ui-menu-item id="anchor-item">Anchor Item</ui-menu-item>
      <ui-sub-menu id="test-submenu" anchor="anchor-item">
        <ui-menu-item>Submenu Item 1</ui-menu-item>
        <ui-menu-item>Submenu Item 2</ui-menu-item>
      </ui-sub-menu>
    </div>
  `)
}

async function withParentMenuFixture(): Promise<HTMLElement> {
  return fixture(html`
    <ui-menu id="parent-menu">
      <ui-menu-item id="trigger-item" submenu="child-submenu">
        <span>Parent Item</span>
      </ui-menu-item>

      <ui-sub-menu id="child-submenu" anchor="trigger-item">
        <ui-menu-item>Child Item 1</ui-menu-item>
        <ui-menu-item>Child Item 2</ui-menu-item>
      </ui-sub-menu>
    </ui-menu>
  `)
}

async function nestedSubmenuFixture(): Promise<HTMLElement> {
  return fixture(html`
    <ui-menu id="main-menu">
      <ui-menu-item id="level1-item" submenu="level1-submenu">Level 1</ui-menu-item>

      <ui-sub-menu id="level1-submenu" anchor="level1-item">
        <ui-menu-item id="level2-item" submenu="level2-submenu">Level 2</ui-menu-item>
        <ui-menu-item>Regular Item</ui-menu-item>

        <ui-sub-menu id="level2-submenu" anchor="level2-item">
          <ui-menu-item>Level 3 Item 1</ui-menu-item>
          <ui-menu-item>Level 3 Item 2</ui-menu-item>
        </ui-sub-menu>
      </ui-sub-menu>
    </ui-menu>
  `)
}

test.group('Basic functionality', () => {
  test('should create submenu element', async ({ assert }) => {
    const element = await basicFixture()
    assert.instanceOf(element, UiSubMenu)
    assert.equal(element.tagName.toLowerCase(), 'ui-sub-menu')
  })

  test('should inherit from Menu', async ({ assert }) => {
    const element = await basicFixture()
    assert.instanceOf(element, Menu)
  })

  test('should have correct default properties', async ({ assert }) => {
    const element = await basicFixture()
    assert.isFalse(element.open)
    assert.isFalse(element.disabled)
    assert.isNull(element.parentMenu)
    assert.isUndefined(element.anchor)
  })

  test('should set correct ARIA attributes', async ({ assert }) => {
    const element = await basicFixture()
    assert.equal(element.getAttribute('role'), 'menu')
    assert.equal(element.getAttribute('aria-label'), 'Submenu')
  })
})

test.group('Anchor functionality', () => {
  test('should get anchor element reference', async ({ assert }) => {
    const container = await withAnchorFixture()
    const submenu = container.querySelector('#test-submenu') as UiSubMenu
    const anchorItem = container.querySelector('#anchor-item') as UiMenuItem
    await nextFrame()

    assert.equal(submenu.menuItemAnchor, anchorItem)
  })

  test('should return null for invalid anchor', async ({ assert }) => {
    const submenu: UiSubMenu = await fixture(html`<ui-sub-menu anchor="nonexistent"></ui-sub-menu>`)
    await nextFrame()

    assert.isNull(submenu.menuItemAnchor)
  })

  test('should update anchor positioning', async ({ assert }) => {
    const container = await withAnchorFixture()
    const submenu = container.querySelector('#test-submenu') as UiSubMenu
    const anchorItem = container.querySelector('#anchor-item') as UiMenuItem
    await nextFrame()

    // This tests that the CSS positioning properties are set
    // The actual values depend on the CSS implementation
    assert.isNotNull(submenu.menuItemAnchor)
    assert.equal(submenu.menuItemAnchor, anchorItem)
  })
})

test.group('Show/Hide functionality', () => {
  test('should show submenu', async ({ assert }) => {
    const container = await withAnchorFixture()
    const submenu = container.querySelector('#test-submenu') as UiSubMenu
    const showSpy = sinon.spy(submenu, 'showPopover')
    await nextFrame()

    submenu.show()
    await nextFrame()

    assert.isTrue(submenu.open)
    assert.isTrue(showSpy.calledOnce)
  })

  test('should not show submenu without anchor', async ({ assert }) => {
    const element = await basicFixture()
    const showSpy = sinon.spy(element, 'showPopover')

    element.show()
    await nextFrame()

    assert.isFalse(element.open)
    assert.isFalse(showSpy.called)
  })

  test('should hide submenu', async ({ assert }) => {
    const container = await withAnchorFixture()
    const submenu = container.querySelector('#test-submenu') as UiSubMenu
    const hideSpy = sinon.spy(submenu, 'hidePopover')
    await nextFrame()

    submenu.show()
    await nextFrame()
    submenu.hide()
    await nextFrame()

    assert.isFalse(submenu.open)
    assert.isTrue(hideSpy.calledOnce)
  })

  test('should dispatch open event when shown', async ({ assert }) => {
    const container = await withAnchorFixture()
    const submenu = container.querySelector('#test-submenu') as UiSubMenu

    setTimeout(() => submenu.show())
    const event = await oneEvent(submenu, 'open')

    assert.instanceOf(event, CustomEvent)
    assert.isFalse(event.bubbles, 'the event does not bubble')
    assert.isFalse(event.composed, 'the event does not composed')
  })

  test('should dispatch close event when hidden', async ({ assert }) => {
    const container = await withAnchorFixture()
    const submenu = container.querySelector('#test-submenu') as UiSubMenu
    await nextFrame()

    submenu.show()
    await nextFrame()

    setTimeout(() => submenu.hide())
    const event = await oneEvent(submenu, 'close')

    assert.instanceOf(event, CustomEvent)
    assert.isFalse(event.bubbles, 'the event does not bubble')
    assert.isFalse(event.composed, 'the event does not composed')
  })
})

test.group('Parent menu integration', () => {
  test('should set parent menu', async ({ assert }) => {
    const container = await withParentMenuFixture()
    const parentMenu = container.querySelector('#parent-menu') as Menu
    const submenu = container.querySelector('#child-submenu') as UiSubMenu
    await nextFrame()

    submenu.setParentMenu(parentMenu)

    assert.equal(submenu.parentMenu, parentMenu)
  })

  test('should set parent menu reference', async ({ assert }) => {
    const container = await withParentMenuFixture()
    const parentMenu = container.querySelector('#parent-menu') as Menu
    const submenu = container.querySelector('#child-submenu') as UiSubMenu
    await nextFrame()

    // Test setting parent menu
    submenu.setParentMenu(parentMenu)
    assert.equal(submenu.parentMenu, parentMenu)
  })
})

test.group('Nested submenus', () => {
  test('should handle multiple levels of nesting', async ({ assert }) => {
    const container = await nestedSubmenuFixture()
    const level1Submenu = container.querySelector('#level1-submenu') as UiSubMenu
    const level2Submenu = container.querySelector('#level2-submenu') as UiSubMenu
    const level1Item = container.querySelector('#level1-item') as UiMenuItem
    const level2Item = container.querySelector('#level2-item') as UiMenuItem
    await nextFrame()

    // Verify the structure
    assert.equal(level1Submenu.anchor, 'level1-item')
    assert.equal(level2Submenu.anchor, 'level2-item')
    assert.equal(level1Submenu.menuItemAnchor, level1Item)
    assert.equal(level2Submenu.menuItemAnchor, level2Item)
  })

  test('should show nested submenus properly', async ({ assert }) => {
    const container = await nestedSubmenuFixture()
    const mainMenu = container.querySelector('#main-menu') as Menu
    const level1Submenu = container.querySelector('#level1-submenu') as UiSubMenu
    const level2Submenu = container.querySelector('#level2-submenu') as UiSubMenu
    await nextFrame()

    // Set up parent relationships
    level1Submenu.setParentMenu(mainMenu)
    level2Submenu.setParentMenu(level1Submenu)

    // Show level 1
    level1Submenu.show()
    await nextFrame()
    assert.isTrue(level1Submenu.open)

    // Show level 2
    level2Submenu.show()
    await nextFrame()
    assert.isTrue(level2Submenu.open)
  })
})

test.group('Keyboard navigation inheritance', () => {
  test('should inherit keyboard navigation from Menu', async ({ assert }) => {
    const container = await withAnchorFixture()
    const submenu = container.querySelector('#test-submenu') as UiSubMenu
    await nextFrame()

    submenu.show()
    await nextFrame()

    // Test that escape key closes submenu
    const hideSpy = sinon.spy(submenu, 'hide')
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    submenu.dispatchEvent(event)

    assert.isTrue(hideSpy.calledOnce)
  })

  test('should handle arrow key navigation', async ({ assert }) => {
    const container = await withAnchorFixture()
    const submenu = container.querySelector('#test-submenu') as UiSubMenu
    await nextFrame()

    submenu.show()
    await nextFrame()

    // Test arrow down navigation - check that it doesn't throw and menu stays open
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
    submenu.dispatchEvent(event)

    // The menu should still be open and functioning
    assert.isTrue(submenu.open)
    assert.isNotNull(submenu.querySelector('ui-menu-item'))
  })
})

test.group('Selection handling', () => {
  test('should hide submenu when item is selected', async ({ assert }) => {
    const container = await withAnchorFixture()
    const submenu = container.querySelector('#test-submenu') as UiSubMenu
    const menuItem = submenu.querySelector('ui-menu-item') as UiMenuItem
    await nextFrame()

    submenu.show()
    await nextFrame()
    assert.isTrue(submenu.open)

    // Click menu item - it should close the submenu
    menuItem.click()
    await nextFrame()

    assert.isFalse(submenu.open)
  })

  test('should dispatch select event', async ({ assert }) => {
    const container = await withAnchorFixture()
    const submenu = container.querySelector('#test-submenu') as UiSubMenu
    const menuItem = submenu.querySelector('ui-menu-item') as UiMenuItem
    await nextFrame()

    submenu.show()
    await nextFrame()

    setTimeout(() => menuItem.click())
    const event = (await oneEvent(submenu, 'select')) as CustomEvent<{ item: UiMenuItem; index: number }>

    assert.instanceOf(event, CustomEvent)
    assert.equal(event.detail.item, menuItem)
    assert.equal(event.detail.index, 0)
  })
})

test.group('Edge cases', () => {
  test('should handle anchor property changes', async ({ assert }) => {
    const container = await withAnchorFixture()
    const submenu = container.querySelector('#test-submenu') as UiSubMenu
    await nextFrame()

    // Change anchor
    submenu.anchor = 'new-anchor'
    await nextFrame()

    // Should not throw
    assert.equal(submenu.anchor, 'new-anchor')
    assert.isNull(submenu.menuItemAnchor) // Since 'new-anchor' doesn't exist
  })

  test('should handle missing parent menu gracefully', async ({ assert }) => {
    const element = await basicFixture()

    // Should not throw when no parent menu is set
    element.show()
    element.hide()

    assert.isNull(element.parentMenu)
  })

  test('should handle disabled state', async ({ assert }) => {
    const element = await basicFixture()

    element.disabled = true
    await nextFrame()

    assert.isTrue(element.disabled)
    assert.isTrue(element.hasAttribute('disabled'))
  })
})

test.group('CSS anchor positioning', () => {
  test('should set CSS anchor positioning properties', async ({ assert }) => {
    const container = await withAnchorFixture()
    const submenu = container.querySelector('#test-submenu') as UiSubMenu
    const anchorItem = container.querySelector('#anchor-item') as UiMenuItem
    await nextFrame()

    submenu.show()
    await nextFrame()

    // Check that CSS properties are set for anchor positioning
    // The exact values depend on the implementation
    const anchorStyle = anchorItem.style.getPropertyValue('anchor-name')
    const submenuStyle = submenu.style.getPropertyValue('position-anchor')

    // These should be set when the submenu is shown
    assert.isTrue(anchorStyle.includes('anchor-') || anchorStyle.length > 0)
    assert.isTrue(submenuStyle.includes('anchor-') || submenuStyle.length > 0)
  })
})

test.group('Rendering', () => {
  test('should render slot for submenu items', async ({ assert }) => {
    const element = await basicFixture()
    await nextFrame()

    const slot = element.shadowRoot!.querySelector('slot')
    assert.isNotNull(slot)

    const menuItems = element.querySelectorAll('ui-menu-item')
    assert.equal(menuItems.length, 3)
  })

  test('should render slot for submenu items', async ({ assert }) => {
    const element = await basicFixture()
    await nextFrame()

    const slot = element.shadowRoot!.querySelector('slot')
    assert.isNotNull(slot)

    const menuItems = element.querySelectorAll('ui-menu-item')
    assert.equal(menuItems.length, 3)
  })
})

test.group('Fallback positioning', () => {
  test('should compute correct fallback styles when CSS Anchor Positioning is not supported', async ({ assert }) => {
    const container = await withAnchorFixture()
    const submenu = container.querySelector('#test-submenu') as UiSubMenu
    const anchorItem = container.querySelector('#anchor-item') as UiMenuItem
    await nextFrame()

    // Simulate lack of CSS Anchor Positioning support
    const originalStyle = document.documentElement.style
    Object.defineProperty(document.documentElement, 'style', {
      get() {
        return {}
      },
      configurable: true,
    })

    const submenuRectStub = sinon.stub(submenu, 'getBoundingClientRect').returns(new DOMRect(0, 0, 200, 300))
    const anchorRectStub = sinon.stub(anchorItem, 'getBoundingClientRect').returns(new DOMRect(100, 150, 150, 48))

    submenu.positionMenu()

    // vertical: 'auto' & noOverlap: false -> align top of submenu to top of anchor (top = 150px)
    assert.equal(submenu.style.top, '150px')

    // horizontal: 'auto' & noOverlap: true -> align left of submenu to right of anchor (left = 100 + 150 = 250px)
    assert.equal(submenu.style.left, '250px')

    submenuRectStub.restore()
    anchorRectStub.restore()

    // Restore original style descriptor
    Object.defineProperty(document.documentElement, 'style', {
      value: originalStyle,
      configurable: true,
      writable: true,
    })
  })
})
