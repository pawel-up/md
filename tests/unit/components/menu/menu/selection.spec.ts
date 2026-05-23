import { test, nextFrame, oneEvent } from '@pawel-up/lupa/testing'
import sinon from 'sinon'
import { basicFixture } from '../../../../fixtures/md/menu/menu.js'
import type UiMenuItem from '../../../../../src/components/menu/internal/MenuItem.js'

test('should hide menu and notify selection', async ({ assert }) => {
  const element = await basicFixture()
  const menuItem = element.querySelector('ui-menu-item') as UiMenuItem
  const hideSpy = sinon.spy(element, 'hide')
  let selectionNotified = false

  // Listen for selection event instead of spying on protected method
  element.addEventListener('select', () => {
    selectionNotified = true
  })

  element.show()
  await nextFrame()

  element.notifySelect(menuItem, 0)

  assert.isTrue(hideSpy.calledOnce)
  assert.isTrue(selectionNotified)
  assert.isFalse(element.open)
})

test('should dispatch select event when menu item is selected', async ({ assert }) => {
  const element = await basicFixture()
  const menuItem = element.querySelector('ui-menu-item') as UiMenuItem

  element.show()
  await nextFrame()

  setTimeout(() => menuItem.click())
  const event = (await oneEvent(element, 'select')) as CustomEvent<{ item: UiMenuItem; index: number }>

  assert.instanceOf(event, CustomEvent)
  assert.equal(event.detail.item, menuItem)
  assert.equal(event.detail.index, 0)
})
