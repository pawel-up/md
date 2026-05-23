import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import UiProgress from '../../../../src/components/progress/internals/UiProgress.js'
import '../../../../src/components/progress/ui-progress.js'

async function basicFixture(): Promise<UiProgress> {
  return fixture(html`<ui-progress></ui-progress>`)
}

async function transitingFixture(): Promise<UiProgress> {
  return fixture(html`<ui-progress class="transiting"></ui-progress>`)
}

test.group('basic', (group) => {
  let progress: UiProgress
  group.each.setup(async () => {
    progress = await basicFixture()
  })

  test('sets the default values', ({ assert }) => {
    assert.equal(progress.min, 0)
    assert.equal(progress.max, 100)
    assert.equal(progress.value, 0)
  })

  test('set the value', async ({ assert }) => {
    progress.value = 50
    await nextFrame()
    assert.equal(progress.value, 50)
    // test clamp value
    progress.value = 60.1
    await nextFrame()
    assert.equal(progress.value, 60)
  })

  test('set the max', async ({ assert }) => {
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

  test('sets the secondary ratio', async ({ assert }) => {
    progress.max = 10
    progress.secondaryProgress = 5
    await nextFrame()
    assert.equal(progress.secondaryRatio, 50)
  })

  test('set the min', async ({ assert }) => {
    progress.min = 10
    progress.max = 50
    progress.value = 30
    await nextFrame()
    assert.equal(progress.ratio, 50)
    progress.value = 0
    await nextFrame()
    assert.equal(progress.value, progress.min)
  })

  test('set the step', async ({ assert }) => {
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

  test('has a "aria-valuenow" attribute when `indeterminate` is true.', async ({ assert }) => {
    progress.min = 0
    progress.max = 10
    progress.value = 5.1
    await nextFrame()
    assert.ok(progress.hasAttribute('aria-valuenow'))

    progress.indeterminate = true
    await nextFrame()
    assert.notOk(progress.hasAttribute('aria-valuenow'))

    progress.indeterminate = false
    await nextFrame()
    assert.ok(progress.hasAttribute('aria-valuenow'))
  })
})

test.group('transiting class', (group) => {
  let progress: UiProgress
  group.each.setup(async () => {
    progress = await transitingFixture()
  })

  test('progress bars', ({ assert }) => {
    const primary = progress.shadowRoot!.querySelector('.primary') as HTMLElement
    const secondary = progress.shadowRoot!.querySelector('.secondary') as HTMLElement
    const stylesForPrimaryProgress = window.getComputedStyle(primary)
    const stylesForSecondaryProgress = window.getComputedStyle(secondary)
    let transitionProp = stylesForPrimaryProgress['transitionProperty'] as string

    assert.equal(transitionProp, 'transform')
    assert.equal(stylesForPrimaryProgress['transitionDuration'], '0.23s')
    transitionProp = stylesForSecondaryProgress['transitionProperty']
    assert.equal(transitionProp, 'transform')
    assert.equal(stylesForSecondaryProgress['transitionDuration'], '0.23s')
  })
})
