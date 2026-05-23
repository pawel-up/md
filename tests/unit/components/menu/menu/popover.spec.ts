import { test, nextFrame } from '@pawel-up/lupa/testing'
import sinon from 'sinon'
import type Menu from '../../../../../src/components/menu/internal/Menu.js'
import { basicFixture, withTriggerFixture } from '../../../../fixtures/md/menu/menu.js'

test('should toggle popover state', async ({ assert }) => {
  const element = await basicFixture()
  const superToggleSpy = sinon.spy(Object.getPrototypeOf(Object.getPrototypeOf(element)), 'togglePopover')

  const result = element.togglePopover()
  await nextFrame()

  assert.isTrue(element.open)
  assert.equal(element.getAttribute('aria-expanded'), 'true')
  assert.equal(element.tabIndex, 0)
  assert.isTrue(superToggleSpy.calledOnce)
  assert.isTrue(result)
})

test('should handle beforetoggle event', async ({ assert }) => {
  const element = await basicFixture()
  element.show()
  await nextFrame()

  // Simulate beforetoggle event as if popover was closed externally
  const toggleEvent = Object.assign(new Event('beforetoggle'), {
    newState: 'closed',
  }) as ToggleEvent

  element.dispatchEvent(toggleEvent)
  await nextFrame()

  assert.isFalse(element.open)
})

test('should work with popovertarget attribute', async ({ assert }) => {
  const container = await withTriggerFixture()
  const trigger = container.querySelector('#trigger') as HTMLElement
  const menu = container.querySelector('#menu') as Menu

  assert.equal(trigger.getAttribute('popovertarget'), 'menu')
  assert.equal(menu.id, 'menu')

  // Test that clicking trigger opens menu
  trigger.click()
  await nextFrame()

  assert.isTrue(menu.open)
})
