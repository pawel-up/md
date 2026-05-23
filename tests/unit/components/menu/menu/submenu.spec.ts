import { test, nextFrame } from '@pawel-up/lupa/testing'
import sinon from 'sinon'
import type UiMenuItem from '../../../../../src/components/menu/internal/MenuItem.js'
import { submenuFixture } from '../../../../fixtures/md/menu/menu.js'
import UiSubMenu from '../../../../../src/components/menu/internal/SubMenu.js'

test('should handle submenu behavior through keyboard navigation', async ({ assert }) => {
  const element = await submenuFixture()
  const menuItem = element.querySelector('#file-item') as UiMenuItem

  element.show()
  await nextFrame()

  // Set active item and trigger submenu open via keyboard
  element.activeListItem = menuItem
  const rightArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' })
  element.dispatchEvent(rightArrowEvent)

  // Check that submenu was opened
  await nextFrame()
  // The submenu should be set as active
  assert.isNotNull(element.activeSubMenu)
})

test('should handle submenu closing through keyboard navigation', async ({ assert }) => {
  const element = await submenuFixture()
  const submenu = element.querySelector('#file-submenu') as UiSubMenu

  element.show()
  await nextFrame()

  // Set active submenu
  element.setActiveSubMenu(submenu)

  // Close via keyboard
  const leftArrowEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
  element.dispatchEvent(leftArrowEvent)

  assert.isNull(element.activeSubMenu)
})

test('should close active submenu', async ({ assert }) => {
  const element = await submenuFixture()
  const submenu = element.querySelector('#file-submenu') as UiSubMenu
  const hideSpy = sinon.spy(submenu, 'hide')

  element.setActiveSubMenu(submenu)
  element.closeSubMenu()

  assert.isTrue(hideSpy.calledOnce)
  assert.isNull(element.activeSubMenu)
})

test('should set active submenu and add event listener', async ({ assert }) => {
  const element = await submenuFixture()
  const submenu = element.querySelector('#file-submenu') as UiSubMenu
  const addListenerSpy = sinon.spy(submenu, 'addEventListener')

  element.setActiveSubMenu(submenu)

  assert.equal(element.activeSubMenu, submenu)
  assert.isTrue(addListenerSpy.calledWith('select'))
})

test('should handle submenu selection', async ({ assert }) => {
  const element = await submenuFixture()
  const submenu = element.querySelector('#file-submenu') as UiSubMenu
  let selectionHandled = false

  // Listen for selection on the main menu
  element.addEventListener('select', () => {
    selectionHandled = true
  })

  element.setActiveSubMenu(submenu)

  // Simulate submenu selection
  const selectEvent = new CustomEvent('select', {
    detail: { item: submenu.querySelector('ui-menu-item'), index: 0 },
  })
  submenu.dispatchEvent(selectEvent)

  assert.isTrue(selectionHandled)
})
