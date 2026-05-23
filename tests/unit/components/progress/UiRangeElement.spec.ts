import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import { customElement } from 'lit/decorators.js'
import { UiRange } from '../../../../src/components/progress/internals/Range.js'

@customElement('ui-range-element')
class TestElement extends UiRange {
  disabled = false
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-range-element': TestElement
  }
}

test.group('property setters', (group) => {
  async function basicFixture(): Promise<TestElement> {
    return fixture(html`<ui-range-element></ui-range-element>`)
  }

  let progress: TestElement
  group.each.setup(async () => {
    progress = await basicFixture()
  })

  test('sets default values', ({ assert }) => {
    assert.equal(progress.min, 0)
    assert.equal(progress.max, 100)
    assert.equal(progress.value, 0)
  })

  test('sets the value', async ({ assert }) => {
    progress.value = 50
    await nextFrame()
    assert.equal(progress.value, 50)
    // test clamp value
    progress.value = 60.1
    await nextFrame()
    assert.equal(progress.value, 60)
  })

  test('sets the max', async ({ assert }) => {
    progress.max = 10
    progress.value = 11
    await nextFrame()
    assert.equal(progress.value, progress.max)
  })

  test('sets the ratio', async ({ assert }) => {
    progress.max = 10
    progress.value = 5
    await nextFrame()
    assert.equal(progress.ratio, 50)
  })

  test('sets the min', async ({ assert }) => {
    progress.min = 10
    progress.max = 50
    progress.value = 30
    await nextFrame()
    assert.equal(progress.ratio, 50)
    progress.value = 0
    await nextFrame()
    assert.equal(progress.value, progress.min)
  })

  test('sets the step', async ({ assert }) => {
    progress.min = 0
    progress.max = 10
    progress.value = 5.1
    await nextFrame()
    assert.equal(progress.value, 5)
    progress.step = 0.1
    progress.value = 5.1
    await nextFrame()
    assert.equal(progress.value, 5.1)
  })

  test('sets a large step', async ({ assert }) => {
    progress.min = 0
    progress.max = 2625
    progress.step = 875
    progress.value = 875
    await nextFrame()
    assert.equal(progress.value, 875)
  })

  test('sets the step with min', async ({ assert }) => {
    progress.min = -0.9
    progress.max = 1.1
    progress.step = 0.5
    progress.value = -0.5
    await nextFrame()
    assert.equal(progress.value, -0.4)
    progress.value = 0.7
    await nextFrame()
    assert.equal(progress.value, 0.6)
  })

  test('respects odd values', async ({ assert }) => {
    progress.min = 1
    progress.max = 7
    progress.step = 2
    progress.value = 3
    await nextFrame()
    assert.equal(progress.value, 3)

    progress.value += progress.step
    await nextFrame()
    assert.equal(progress.value, 5)

    progress.value += progress.step
    await nextFrame()
    assert.equal(progress.value, 7)
  })

  test('rounds up negative values', async ({ assert }) => {
    progress.min = -10
    progress.max = 10
    progress.step = 0.1
    progress.value = -8.4252
    await nextFrame()
    assert.equal(progress.value, -8.4)
  })

  test('round up positive values', async ({ assert }) => {
    progress.min = 10
    progress.max = 100
    progress.step = 0.25
    progress.value = 19.34567
    await nextFrame()
    assert.equal(progress.value, 19.25)
  })
})

test.group('Attribute setters', () => {
  async function integerValueFixture(): Promise<TestElement> {
    return fixture(html`<ui-range-element value="50"></ui-range-element>`)
  }

  async function floatValueFixture(): Promise<TestElement> {
    return fixture(html`<ui-range-element value="60.1"></ui-range-element>`)
  }

  test('sets the integer value', async ({ assert }) => {
    const element = await integerValueFixture()
    assert.equal(element.value, 50)
  })

  test('sets the float', async ({ assert }) => {
    const element = await floatValueFixture()
    assert.equal(element.value, 60)
  })
})
