import { test } from '@pawel-up/lupa/testing'
import { basicFixture } from '../../../../fixtures/md/menu/menu.js'

test('should handle slot content changes', async ({ assert }) => {
  const element = await basicFixture()

  // Add a new menu item
  const newItem = document.createElement('ui-menu-item')
  newItem.textContent = 'New Item'
  element.appendChild(newItem)

  // Simulate slot change
  const slot = element.shadowRoot!.querySelector('slot')!
  slot.dispatchEvent(new Event('slotchange'))

  // Verify the new item is now part of the menu
  const menuItems = element.querySelectorAll('ui-menu-item')
  assert.equal(menuItems.length, 4) // 3 original + 1 new
})
