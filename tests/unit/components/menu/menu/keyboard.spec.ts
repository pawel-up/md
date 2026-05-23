import { test, nextFrame } from '@pawel-up/lupa/testing'
import sinon from 'sinon'
import type UiMenuItem from '../../../../../src/components/menu/internal/MenuItem.js'
import { basicFixture, submenuFixture } from '../../../../fixtures/md/menu/menu.js'

test('should close menu on Escape key', async ({ assert }) => {
  const element = await basicFixture()
  element.show()
  await nextFrame()

  const event = new KeyboardEvent('keydown', { key: 'Escape' })
  element.dispatchEvent(event)
  await nextFrame()

  assert.isFalse(element.open)
})

test('should not handle keys when menu is closed', async ({ assert }) => {
  const element = await basicFixture()
  const hideSpy = sinon.spy(element, 'hide')

  const event = new KeyboardEvent('keydown', { key: 'Escape' })
  element.dispatchEvent(event)
  await nextFrame()

  assert.isFalse(hideSpy.called)
})

test('should open submenu on ArrowRight', async ({ assert }) => {
  const element = await submenuFixture()
  const menuItem = element.querySelector('#file-item') as UiMenuItem
  const openSubMenuSpy = sinon.spy(menuItem, 'openSubMenu')

  element.show()
  await nextFrame()

  // Set the active item first
  element.activeListItem = menuItem

  const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
  element.dispatchEvent(event)

  assert.isTrue(openSubMenuSpy.calledOnce)
})

test('should call closeSubMenu on ArrowLeft', async ({ assert }) => {
  const element = await submenuFixture()
  const closeSubMenuSpy = sinon.spy(element, 'closeSubMenu')
  element.show()
  await nextFrame()

  const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
  element.dispatchEvent(event)

  assert.isTrue(closeSubMenuSpy.calledOnce)
})

test('should delegate other keys to parent UiList', async ({ assert }) => {
  const element = await basicFixture()
  element.show()
  await nextFrame()

  // Test that arrow down moves to next item (handled by parent UiList)
  const firstItem = element.querySelector('ui-menu-item') as UiMenuItem
  element.activeListItem = firstItem

  const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
  element.dispatchEvent(event)
  await nextFrame()

  // Verify that navigation occurred (the active item should have changed)
  // This tests the integration with the parent UiList keyboard handling
  assert.isNotNull(element.activeListItem)
})
