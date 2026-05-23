import { test, fixture, html, nextFrame, oneEvent } from '@pawel-up/lupa/testing'
import sinon from 'sinon'
import type Menu from '../../../../../src/components/menu/internal/Menu.js'
import type UiMenuItem from '../../../../../src/components/menu/internal/MenuItem.js'
import { basicFixture, selectionFixture } from '../../../../fixtures/md/menu/menu.js'

test.group('selectedItem getter', () => {
  test('should return null when no item is selected', async ({ assert }) => {
    const element = await basicFixture()
    await nextFrame()

    assert.isNull(element.selectedItem)
  })

  test('should return the selected menu item', async ({ assert }) => {
    const element = await selectionFixture()
    await nextFrame()

    const selectedItem = element.selectedItem
    const item2 = element.querySelector('#item2') as UiMenuItem

    assert.isNotNull(selectedItem)
    assert.equal(selectedItem, item2)
    assert.isTrue(selectedItem!.selected)
  })

  test('should return the first selected item when multiple items are selected', async ({ assert }) => {
    const element = await selectionFixture()
    const item1 = element.querySelector('#item1') as UiMenuItem
    const item3 = element.querySelector('#item3') as UiMenuItem
    await nextFrame()

    // Manually set multiple items as selected
    item1.selected = true
    item3.selected = true
    await nextFrame()

    const selectedItem = element.selectedItem
    assert.equal(selectedItem, item1)
  })
})

test.group('setSelectedItem method', () => {
  test('should select a menu item and clear previous selection', async ({ assert }) => {
    const element = await selectionFixture()
    const item1 = element.querySelector('#item1') as UiMenuItem
    const item2 = element.querySelector('#item2') as UiMenuItem
    await nextFrame()

    // Initially item2 is selected
    assert.isTrue(item2.selected)
    assert.isFalse(item1.selected)

    // Select item1
    element.setSelectedItem(item1)
    await nextFrame()

    assert.isTrue(item1.selected)
    assert.isFalse(item2.selected)
    assert.equal(element.selectedItem, item1)
  })

  test('should clear all selections when passed null', async ({ assert }) => {
    const element = await selectionFixture()
    const item2 = element.querySelector('#item2') as UiMenuItem
    await nextFrame()

    // Initially item2 is selected
    assert.isTrue(item2.selected)

    // Clear selection
    element.setSelectedItem(null)
    await nextFrame()

    assert.isFalse(item2.selected)
    assert.isNull(element.selectedItem)
  })

  test('should handle selecting disabled items', async ({ assert }) => {
    const element = await selectionFixture()
    const item4 = element.querySelector('#item4') as UiMenuItem
    await nextFrame()

    // Should be able to select disabled items programmatically
    element.setSelectedItem(item4)
    await nextFrame()

    assert.isTrue(item4.selected)
    assert.equal(element.selectedItem, item4)
  })

  test('should not throw when selecting an item not in the menu', async ({ assert }) => {
    const element = await selectionFixture()
    const externalItem: UiMenuItem = await fixture(html`<ui-menu-item>External Item</ui-menu-item>`)
    await nextFrame()

    // Should not throw
    element.setSelectedItem(externalItem)

    // External item should be selected but not affect the menu's selectedItem
    assert.isTrue(externalItem.selected)
    // The menu should return null since the external item is not in assignedMenuItems
    assert.isNull(element.selectedItem)
  })
})

test.group('Selection clearing functionality', () => {
  test('should clear selection from all menu items when setting null', async ({ assert }) => {
    const element = await selectionFixture()
    const item1 = element.querySelector('#item1') as UiMenuItem
    const item2 = element.querySelector('#item2') as UiMenuItem
    const item3 = element.querySelector('#item3') as UiMenuItem
    await nextFrame()

    // Set multiple items as selected
    item1.selected = true
    item3.selected = true
    await nextFrame()

    // Initially item2 is selected from fixture, now item1 and item3 are also selected
    assert.isTrue(item1.selected)
    assert.isTrue(item2.selected)
    assert.isTrue(item3.selected)

    // Clear all selections using the public method
    element.setSelectedItem(null)
    await nextFrame()

    assert.isFalse(item1.selected)
    assert.isFalse(item2.selected)
    assert.isFalse(item3.selected)
    assert.isNull(element.selectedItem)
  })

  test('should clear previous selection when selecting new item', async ({ assert }) => {
    const element = await selectionFixture()
    const item1 = element.querySelector('#item1') as UiMenuItem
    const item2 = element.querySelector('#item2') as UiMenuItem
    const item3 = element.querySelector('#item3') as UiMenuItem
    await nextFrame()

    // Set multiple items as selected manually
    item1.selected = true
    item3.selected = true
    await nextFrame()

    // Select item2 - this should clear all other selections
    element.setSelectedItem(item2)
    await nextFrame()

    assert.isFalse(item1.selected)
    assert.isTrue(item2.selected)
    assert.isFalse(item3.selected)
    assert.equal(element.selectedItem, item2)
  })

  test('should clear selection when notifySelect is called with MenuItem', async ({ assert }) => {
    const element = await selectionFixture()
    const item1 = element.querySelector('#item1') as UiMenuItem
    const item2 = element.querySelector('#item2') as UiMenuItem
    const item3 = element.querySelector('#item3') as UiMenuItem
    element.selectOnActivate = true // Enable selection on activate
    await nextFrame()

    element.show()
    await nextFrame()

    // Set multiple items as selected manually
    item1.selected = true
    item3.selected = true
    await nextFrame()

    // Initially item2 is selected from fixture, now all items are selected
    assert.isTrue(item1.selected)
    assert.isTrue(item2.selected)
    assert.isTrue(item3.selected)

    // Call notifySelect on item1 - should clear all other selections
    element.notifySelect(item1, 0)

    assert.isTrue(item1.selected) // This one should remain selected
    assert.isFalse(item2.selected) // These should be cleared
    assert.isFalse(item3.selected)
  })

  test('should handle empty menu items', async ({ assert }) => {
    const element: Menu = await fixture(html`<ui-menu></ui-menu>`)
    await nextFrame()

    // Should not throw - test by setting and clearing selection
    element.setSelectedItem(null)
    assert.isNull(element.selectedItem)
  })
})

test.group('notifySelect method', () => {
  test('should select menu item and hide menu when selectOnActivate is enabled', async ({ assert }) => {
    const element = await selectionFixture()
    const item1 = element.querySelector('#item1') as UiMenuItem
    const item2 = element.querySelector('#item2') as UiMenuItem
    element.selectOnActivate = true // Enable selection on activate
    await nextFrame()

    const hideSpy = sinon.spy(element, 'hide')
    element.show()
    await nextFrame()

    // Initially item2 is selected
    assert.isTrue(item2.selected)
    assert.isFalse(item1.selected)

    // Notify selection of item1
    const result = element.notifySelect(item1, 0)

    assert.isFalse(result) // Should return false (event not canceled)
    assert.isTrue(item1.selected)
    assert.isFalse(item2.selected) // Previous selection should be cleared
    assert.isTrue(hideSpy.calledOnce)
  })

  test('should handle non-MenuItem selection', async ({ assert }) => {
    const element = await selectionFixture()
    const nonMenuItem = document.createElement('div') as unknown as UiMenuItem
    await nextFrame()

    const hideSpy = sinon.spy(element, 'hide')
    element.show()
    await nextFrame()

    // Should not throw and should still hide menu
    // When item is not found in items array, notifySelect returns false
    const result = element.notifySelect(nonMenuItem, 0)

    assert.isFalse(result) // Returns false when item not found in items
    assert.isTrue(hideSpy.calledOnce)
  })

  test('should dispatch select event through parent class', async ({ assert }) => {
    const element = await selectionFixture()
    const item1 = element.querySelector('#item1') as UiMenuItem
    await nextFrame()

    element.show()
    await nextFrame()

    setTimeout(() => element.notifySelect(item1, 0))
    const event = await oneEvent(element, 'select')

    assert.instanceOf(event, CustomEvent)
    assert.equal((event as CustomEvent).detail.item, item1)
    assert.equal((event as CustomEvent).detail.index, 0)
  })

  test('should return true when select event is canceled', async ({ assert }) => {
    const element = await selectionFixture()
    const item1 = element.querySelector('#item1') as UiMenuItem
    await nextFrame()

    element.show()
    await nextFrame()

    // Add event listener that cancels the event
    element.addEventListener('select', (e) => {
      e.preventDefault()
    })

    const result = element.notifySelect(item1, 0)

    assert.isTrue(result) // Should return true when event is canceled
    assert.isTrue(item1.selected) // Item should still be selected in Menu
  })

  test('should clear selection from all items before selecting new one', async ({ assert }) => {
    const element = await selectionFixture()
    const item1 = element.querySelector('#item1') as UiMenuItem
    const item2 = element.querySelector('#item2') as UiMenuItem
    const item3 = element.querySelector('#item3') as UiMenuItem
    await nextFrame()

    // Manually set multiple items as selected
    item1.selected = true
    item3.selected = true
    await nextFrame()

    element.show()
    await nextFrame()

    // Notify selection of item2
    element.notifySelect(item2, 1)

    // Only item2 should be selected
    assert.isFalse(item1.selected)
    assert.isTrue(item2.selected)
    assert.isFalse(item3.selected)
  })
})

test.group('Selection integration with keyboard navigation', () => {
  test('should maintain selection state when navigating with arrow keys', async ({ assert }) => {
    const element = await selectionFixture()
    const item2 = element.querySelector('#item2') as UiMenuItem
    await nextFrame()

    element.show()
    await nextFrame()

    // Initially item2 is selected
    assert.isTrue(item2.selected)

    // Navigate with arrow keys (should not affect selection)
    const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' })
    element.dispatchEvent(downEvent)
    await nextFrame()

    // Selection should remain unchanged
    assert.isTrue(item2.selected)
  })
})

test.group('Selection state preservation', () => {
  test('should preserve selection when menu is hidden and shown again (default behavior)', async ({ assert }) => {
    const element = await selectionFixture()
    const item2 = element.querySelector('#item2') as UiMenuItem
    await nextFrame()

    // Initially item2 is selected
    assert.isTrue(item2.selected)
    assert.equal(element.selectedItem, item2)

    // Show and hide menu
    element.show()
    await nextFrame()
    element.hide()
    await nextFrame()

    // Selection should be preserved by default (no automatic clearing)
    assert.isTrue(item2.selected)
    assert.equal(element.selectedItem, item2)
  })
})

test.group('Selection behavior', () => {
  test('should have selectOnActivate set to false by default', async ({ assert }) => {
    const element = await basicFixture()
    assert.isFalse(element.selectOnActivate)
  })

  test('should not select menu items when activated by default', async ({ assert }) => {
    const element = await selectionFixture()
    element.selectOnActivate = false // Ensure default behavior
    const item1 = element.querySelector('#item1') as UiMenuItem
    const item2 = element.querySelector('#item2') as UiMenuItem
    await nextFrame()

    // Initially item2 is selected from fixture
    assert.isTrue(item2.selected)
    assert.isFalse(item1.selected)

    // Show menu and select item1
    element.show()
    await nextFrame()
    element.notifySelect(item1, 0)
    await nextFrame()

    // Selection should not be made because selectOnActivate is false (default)
    assert.isFalse(item1.selected)
    assert.isTrue(item2.selected) // Original selection should remain
  })

  test('should select menu items when selectOnActivate is true', async ({ assert }) => {
    const element = await selectionFixture()
    const item1 = element.querySelector('#item1') as UiMenuItem
    const item2 = element.querySelector('#item2') as UiMenuItem
    element.selectOnActivate = true
    await nextFrame()

    // Initially item2 is selected from fixture
    assert.isTrue(item2.selected)
    assert.isFalse(item1.selected)

    // Show menu and select item1
    element.show()
    await nextFrame()
    element.notifySelect(item1, 0)
    await nextFrame()

    // Selection should be made because selectOnActivate is true
    assert.isTrue(item1.selected)
    assert.isFalse(item2.selected) // Previous selection should be cleared
  })

  test('should support setting selectOnActivate via attribute', async ({ assert }) => {
    const element: Menu = await fixture(html`
      <ui-menu .selectOnActivate=${true}>
        <ui-menu-item>Item 1</ui-menu-item>
        <ui-menu-item>Item 2</ui-menu-item>
      </ui-menu>
    `)
    await nextFrame()

    assert.isTrue(element.selectOnActivate)

    const item1 = element.querySelector('ui-menu-item') as UiMenuItem
    assert.isFalse(item1.selected)

    // Show menu and select item
    element.show()
    await nextFrame()
    element.notifySelect(item1, 0)
    await nextFrame()

    // Selection should be made due to attribute setting
    assert.isTrue(item1.selected)
  })

  test('should preserve existing selection state when menu is hidden and shown again', async ({ assert }) => {
    const element = await selectionFixture()
    const item2 = element.querySelector('#item2') as UiMenuItem
    await nextFrame()

    // Initially item2 is selected
    assert.isTrue(item2.selected)
    assert.equal(element.selectedItem, item2)

    // Show and hide menu
    element.show()
    await nextFrame()
    element.hide()
    await nextFrame()

    // Selection should be preserved (no automatic clearing)
    assert.isTrue(item2.selected)
    assert.equal(element.selectedItem, item2)
  })
})
