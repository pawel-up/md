import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import sinon from 'sinon'
import type UiCollapse from '../../../../src/components/collapse/internals/Collapse.js'
import '../../../../src/components/collapse/ui-collapse.js'

test.group('UiCollapse: Flex layout', (group) => {
  async function basicFixture(): Promise<UiCollapse> {
    return fixture(
      html` <div id="container" style="height: 200px; display: flex;">
        <ui-collapse id="collapse" open style="flex: 1 0 auto">
          <div style="height:100px;">Lorem ipsum</div>
        </ui-collapse>
      </div>`
    )
  }

  let container: HTMLElement
  let collapse: UiCollapse
  let collapseHeight: string

  group.each.setup(async () => {
    container = await basicFixture()
    collapse = container.querySelector('ui-collapse')!
    collapseHeight = getComputedStyle(collapse).height
  })

  test('default opened height', ({ assert }) => {
    assert.equal(collapse.style.height, '')
  }).tags(['@collapse', '@flex-layout'])

  test('set opened to false triggers animation', ({ assert }, done) => {
    collapse.open = false
    // Animation got enabled.
    collapse.addEventListener('transitionend', () => {
      // Animation disabled.
      assert.equal(collapse.style.transitionDuration, '0s')
      done()
    })
  })
    // .skip(true)
    .waitForDone()
    .tags(['@collapse', '@flex-layout'])

  test('noAnimation disables animations', async ({ assert }) => {
    collapse.noAnimation = true
    // trying to animate the size update
    collapse.open = false
    await collapse.updateComplete
    // Animation immediately disabled.
    assert.equal(collapse.style.maxHeight, '0px')
  }).tags(['@collapse', '@flex-layout'])

  test('set opened to false, then to true', ({ assert }, done) => {
    // this listener will be triggered twice (every time `opened` changes)
    collapse.addEventListener('transitionend', () => {
      if (collapse.open) {
        // Check finalSize after animation is done.
        assert.equal(collapse.style.maxHeight, '')
        done()
      } else {
        // Check if size is still 0px.
        assert.equal(collapse.style.maxHeight, '0px')
        // Trigger 2nd toggle.
        collapse.toggle()
        // Size should be immediately set.
        assert.equal(collapse.style.maxHeight, collapseHeight)
      }
    })
    // Trigger 1st toggle.
    collapse.open = false
    // Size should be immediately set.
    assert.equal(collapse.style.maxHeight, '0px')
  })
    .skip(true)
    .waitForDone()
    .tags(['@collapse', '@flex-layout'])

  test('opened changes trigger resize', async ({ assert }) => {
    const spy = sinon.stub()
    collapse.addEventListener('resize', spy)
    // No animations for faster test.
    collapse.noAnimation = true
    collapse.open = false
    await collapse.updateComplete
    assert.isTrue(spy.calledOnce, 'resize was fired')
  }).tags(['@collapse', '@flex-layout'])

  test('overflow is hidden while animating', ({ assert }, done) => {
    collapse.addEventListener('transitionend', () => {
      // Should still be hidden.
      assert.equal(getComputedStyle(collapse).overflow, 'hidden')
      done()
    })
    assert.equal(getComputedStyle(collapse).overflow, 'visible')
    collapse.open = false
    // Immediately updated style.
    assert.equal(getComputedStyle(collapse).overflow, 'hidden')
  })
    .skip(true)
    .waitForDone()
    .tags(['@collapse', '@flex-layout'])

  test('toggle horizontal updates size', async ({ assert }) => {
    collapse.horizontal = false
    await nextFrame()
    assert.equal(collapse.style.width, '')
    assert.equal(collapse.style.maxHeight, '')
    assert.equal(collapse.style.transitionProperty, 'max-height')

    collapse.horizontal = true
    await nextFrame()
    assert.equal(collapse.style.maxWidth, '')
    assert.equal(collapse.style.height, '')
    assert.equal(collapse.style.transitionProperty, 'max-width')
  }).tags(['@collapse', '@flex-layout'])
})
