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

  test('sets the secondary ratio from a string value', async ({ assert }) => {
    progress.max = 10
    // @ts-expect-error Testing string assignment as passed by frameworks like Vue
    progress.secondaryProgress = '5'
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

test.group('wavy and thick variants', () => {
  test('renders wavy determinate variant', async ({ assert }) => {
    const el = await fixture<UiProgress>(html`<ui-progress wavy value="50" max="100"></ui-progress>`)
    const wavyContainer = el.shadowRoot?.querySelector('.wavy-container')
    const wavyActive = el.shadowRoot?.querySelector('.wavy-active')
    const wavyPath = el.shadowRoot?.querySelector('.wavy-path')
    const wavyTrack = el.shadowRoot?.querySelector('.wavy-track')
    const stopDot = el.shadowRoot?.querySelector('.stop-dot')

    assert.ok(wavyContainer, 'wavy container should be rendered')
    assert.ok(wavyActive, 'wavy active element should be rendered')
    assert.ok(wavyPath, 'wavy path should be rendered')
    assert.ok(wavyTrack, 'wavy track should be rendered')
    assert.ok(stopDot, 'stop dot should be rendered')
    assert.equal((wavyActive as HTMLElement)?.style.width, '50%')
  })

  test('renders wavy indeterminate variant with dual-segment track', async ({ assert }) => {
    const el = await fixture<UiProgress>(html`<ui-progress wavy indeterminate></ui-progress>`)
    const wavyActive = el.shadowRoot?.querySelector('.wavy-active.indeterminate')
    const secondaryWave = el.shadowRoot?.querySelector('.wavy-active.indeterminate.secondary-wave')
    const fullTrack = el.shadowRoot?.querySelector('.wavy-track.full-track')
    assert.ok(wavyActive, 'primary wavy indeterminate element should be rendered')
    assert.ok(secondaryWave, 'secondary wavy indeterminate element should be rendered')
    assert.ok(fullTrack, 'full track should be rendered in indeterminate mode')
  })

  test('renders thick wavy variant with 8px stroke', async ({ assert }) => {
    const el = await fixture<UiProgress>(html`<ui-progress wavy thick value="30"></ui-progress>`)
    const container = el.shadowRoot?.querySelector('.wavy-container.thick')
    const path = el.shadowRoot?.querySelector('.wavy-path')
    assert.ok(container, 'container should have thick class')
    assert.equal((path as SVGElement)?.style.strokeWidth, '8px')
  })

  test('hides stop dot when hide-stop-indicator is present', async ({ assert }) => {
    const el = await fixture<UiProgress>(html`<ui-progress wavy hide-stop-indicator value="50"></ui-progress>`)
    const stopDot = el.shadowRoot?.querySelector('.stop-dot')
    assert.notOk(stopDot, 'stop dot should not be rendered when hide-stop-indicator is true')
  })

  test('renders flat complete line at 100% progress', async ({ assert }) => {
    const el = await fixture<UiProgress>(html`<ui-progress wavy value="100"></ui-progress>`)
    const completeLine = el.shadowRoot?.querySelector('.complete-line')
    const stopDot = el.shadowRoot?.querySelector('.stop-dot')
    assert.ok(completeLine, 'complete-line should be rendered at 100%')
    assert.notOk(stopDot, 'stop dot should not be rendered when complete')
  })

  test('scales stop dot to 8px in thick variant', async ({ assert }) => {
    const el = await fixture<UiProgress>(html`<ui-progress wavy thick value="50"></ui-progress>`)
    const stopDot = el.shadowRoot?.querySelector('.stop-dot') as HTMLElement
    assert.ok(stopDot, 'stop dot should be rendered')
    const styles = getComputedStyle(stopDot)
    assert.equal(styles.width, '8px')
    assert.equal(styles.height, '8px')
  })
})
