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

test('should constrain menu width and reset min-width when overflowing the viewport', async ({ assert }) => {
  const element = await basicFixture()

  const originalInnerWidth = window.innerWidth
  Object.defineProperty(window, 'innerWidth', { value: 1000, configurable: true })

  // Mock box to overflow right edge: left = 600, width = 500 (menuRight = 1100 > 1000)
  // availableWidth = 1000 - 600 = 400px
  // maxWidth = Math.max(180, 400 - 20) = 380px
  const stub = sinon.stub(element, 'getBoundingClientRect').returns(new DOMRect(600, 100, 500, 300))

  element.positionMenu()

  assert.equal(element.style.maxWidth, '380px')
  assert.equal(element.style.minWidth, '0px')

  // Clear properties
  element.style.removeProperty('max-width')
  element.style.removeProperty('min-width')
  stub.restore()

  // Mock box to overflow left edge: left = -50, width = 250, right = 200 (menuRight = 200 <= 1000)
  // availableWidth = box.right = 200px
  // maxWidth = Math.max(180, 200 - 20) = 180px
  const stubLeft = sinon.stub(element, 'getBoundingClientRect').returns(new DOMRect(-50, 100, 250, 300))

  element.positionMenu()

  assert.equal(element.style.maxWidth, '180px')
  assert.equal(element.style.minWidth, '0px')

  stubLeft.restore()
  Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, configurable: true })
})
