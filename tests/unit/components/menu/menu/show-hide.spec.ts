import { test, nextFrame, oneEvent } from '@pawel-up/lupa/testing'
import sinon from 'sinon'
import { basicFixture } from '../../../../fixtures/md/menu/menu.js'

test('should show menu', async ({ assert }) => {
  const element = await basicFixture()
  const showSpy = sinon.spy(element, 'showPopover')

  element.show()
  await nextFrame()

  assert.isTrue(element.open)
  assert.equal(element.getAttribute('aria-expanded'), 'true')
  assert.equal(element.tabIndex, 0)
  assert.isTrue(showSpy.calledOnce)
})

test('should hide menu', async ({ assert }) => {
  const element = await basicFixture()
  const hideSpy = sinon.spy(element, 'hidePopover')

  element.show()
  await nextFrame()
  element.hide()
  await nextFrame()

  assert.isFalse(element.open)
  assert.equal(element.getAttribute('aria-expanded'), 'false')
  assert.equal(element.tabIndex, -1)
  assert.isTrue(hideSpy.calledOnce)
})

test('should dispatch open event when shown', async ({ assert }) => {
  const element = await basicFixture()

  setTimeout(() => element.show())
  const event = await oneEvent(element, 'open')

  assert.instanceOf(event, CustomEvent)
  assert.isFalse(event.bubbles, 'Event should not bubble')
  assert.isFalse(event.composed, 'Event should not be composed')
})

test('should dispatch close event when hidden', async ({ assert }) => {
  const element = await basicFixture()
  element.show()
  await nextFrame()

  setTimeout(() => element.hide())
  const event = await oneEvent(element, 'close')

  assert.instanceOf(event, CustomEvent)
  assert.isFalse(event.bubbles, 'Event should not bubble')
  assert.isFalse(event.composed, 'Event should not be composed')
})
