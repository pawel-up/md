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

test('should add correct positioning classes for animation direction', async ({ assert }) => {
  const element = await basicFixture()

  const originalInnerHeight = window.innerHeight
  Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true })

  // Case 1: Menu in upper half (e.g. top = 100 < 500) -> should be positioned below anchor -> menu-positioned-below
  const stubUpper = sinon.stub(element, 'getBoundingClientRect').returns(new DOMRect(100, 100, 200, 300))
  element.positionMenu()
  assert.isTrue(element.classList.contains('menu-positioned-below'))
  assert.isFalse(element.classList.contains('menu-positioned-above'))
  stubUpper.restore()

  // Case 2: Menu in lower half (e.g. top = 600 >= 500) -> should be positioned above anchor -> menu-positioned-above
  const stubLower = sinon.stub(element, 'getBoundingClientRect').returns(new DOMRect(100, 600, 200, 300))
  element.positionMenu()
  assert.isTrue(element.classList.contains('menu-positioned-above'))
  assert.isFalse(element.classList.contains('menu-positioned-below'))
  stubLower.restore()

  Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight, configurable: true })
})
