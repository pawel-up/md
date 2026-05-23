import { fixture, html, test } from '@pawel-up/lupa/testing'
import CircularProgress from '../../../../src/components/progress/internals/CircularProgress.js'
import '../../../../src/components/progress/ui-circular-progress.js'

async function basicFixture(): Promise<CircularProgress> {
  return fixture(html`<ui-circular-progress></ui-circular-progress>`)
}

async function determinateFixture(): Promise<CircularProgress> {
  return fixture(html`<ui-circular-progress value="50" max="100"></ui-circular-progress>`)
}

async function indeterminateFixture(): Promise<CircularProgress> {
  return fixture(html`<ui-circular-progress indeterminate></ui-circular-progress>`)
}

async function fourColorFixture(): Promise<CircularProgress> {
  return fixture(html`<ui-circular-progress indeterminate fourcolor></ui-circular-progress>`)
}

async function disabledFixture(): Promise<CircularProgress> {
  return fixture(html`<ui-circular-progress disabled value="30"></ui-circular-progress>`)
}

async function customRangeFixture(): Promise<CircularProgress> {
  return fixture(html`<ui-circular-progress min="10" max="200" value="100"></ui-circular-progress>`)
}

// Accessibility-compliant fixtures for accessibility testing
async function accessibleBasicFixture(): Promise<CircularProgress> {
  return fixture(html`<ui-circular-progress aria-label="Loading progress"></ui-circular-progress>`)
}

async function accessibleDeterminateFixture(): Promise<CircularProgress> {
  return fixture(html`<ui-circular-progress value="50" max="100" aria-label="Upload progress"></ui-circular-progress>`)
}

async function accessibleIndeterminateFixture(): Promise<CircularProgress> {
  return fixture(html`<ui-circular-progress indeterminate aria-label="Processing"></ui-circular-progress>`)
}

async function accessibleFourColorFixture(): Promise<CircularProgress> {
  return fixture(
    html`<ui-circular-progress indeterminate fourcolor aria-label="Loading with colors"></ui-circular-progress>`
  )
}

async function accessibleDisabledFixture(): Promise<CircularProgress> {
  return fixture(html`<ui-circular-progress disabled value="30" aria-label="Completed task"></ui-circular-progress>`)
}

test.group('Basic Properties', (group) => {
  let progress: CircularProgress

  group.each.setup(async () => {
    progress = await basicFixture()
  })

  test('sets default values', ({ assert }) => {
    assert.equal(progress.min, 0, 'default min should be 0')
    assert.equal(progress.max, 100, 'default max should be 100')
    assert.equal(progress.value, 0, 'default value should be 0')
    assert.equal(progress.fourColor, false, 'default fourColor should be false')
    assert.equal(progress.disabled, false, 'default disabled should be false')
    assert.isUndefined(progress.indeterminate, 'default indeterminate should be undefined')
  })

  test('sets and gets value property', async ({ assert }) => {
    progress.value = 50
    await progress.updateComplete
    assert.equal(progress.value, 50, 'value should be set to 50')
  })

  test('sets and gets max property', async ({ assert }) => {
    progress.max = 200
    await progress.updateComplete
    assert.equal(progress.max, 200, 'max should be set to 200')
  })

  test('sets and gets min property', async ({ assert }) => {
    progress.min = 10
    await progress.updateComplete
    assert.equal(progress.min, 10, 'min should be set to 10')
  })

  test('sets and gets fourColor property', async ({ assert }) => {
    progress.fourColor = true
    await progress.updateComplete
    assert.equal(progress.fourColor, true, 'fourColor should be set to true')
  })

  test('sets and gets disabled property', async ({ assert }) => {
    progress.disabled = true
    await progress.updateComplete
    assert.equal(progress.disabled, true, 'disabled should be set to true')
  })

  test('sets and gets indeterminate property', async ({ assert }) => {
    progress.indeterminate = true
    await progress.updateComplete
    assert.equal(progress.indeterminate, true, 'indeterminate should be set to true')
  })
})

test.group('Value Validation and Clamping', (group) => {
  let progress: CircularProgress

  group.each.setup(async () => {
    progress = await customRangeFixture()
  })

  test('clamps value to max', async ({ assert }) => {
    progress.value = 250
    await progress.updateComplete
    assert.equal(progress.value, progress.max, 'value should be clamped to max')
  })

  test('clamps value to min', async ({ assert }) => {
    progress.value = 5
    await progress.updateComplete
    assert.equal(progress.value, progress.min, 'value should be clamped to min')
  })

  test('handles step values correctly', async ({ assert }) => {
    progress.step = 10
    progress.value = 25
    await progress.updateComplete
    assert.equal(progress.value, 30, 'value should be stepped to nearest step value')
  })

  test('calculates ratio correctly', async ({ assert }) => {
    progress.min = 0
    progress.max = 100
    progress.value = 25
    await progress.updateComplete
    assert.equal(progress.ratio, 25, 'ratio should be 25% for value 25/100')
  })

  test('handles zero denominator in ratio calculation', async ({ assert }) => {
    progress.min = 50
    progress.max = 50
    progress.value = 50
    await progress.updateComplete
    assert.equal(progress.ratio, 0, 'ratio should be 0 when min equals max')
  })
})

test.group('Determinate State', (group) => {
  let progress: CircularProgress

  group.each.setup(async () => {
    progress = await determinateFixture()
  })

  test('renders SVG container for determinate progress', async ({ assert }) => {
    const svg = progress.shadowRoot?.querySelector('svg')
    assert.exists(svg, 'should render SVG element')
    assert.equal(svg?.getAttribute('viewBox'), '0 0 4800 4800', 'should have correct viewBox')
  })

  test('renders track and active track circles', async ({ assert }) => {
    const track = progress.shadowRoot?.querySelector('.track')
    const activeTrack = progress.shadowRoot?.querySelector('.active-track')

    assert.exists(track, 'should render track circle')
    assert.exists(activeTrack, 'should render active track circle')
    assert.equal(track?.getAttribute('pathLength'), '100', 'track should have pathLength 100')
    assert.equal(activeTrack?.getAttribute('pathLength'), '100', 'active track should have pathLength 100')
  })

  test('calculates correct stroke-dashoffset for progress value', async ({ assert }) => {
    const activeTrack = progress.shadowRoot?.querySelector('.active-track')
    const expectedOffset = (1 - progress.value / progress.max) * 100
    assert.equal(
      activeTrack?.getAttribute('stroke-dashoffset'),
      String(expectedOffset),
      'should calculate correct dashoffset'
    )
  })

  test('updates stroke-dashoffset when value changes', async ({ assert }) => {
    progress.value = 75
    await progress.updateComplete

    const activeTrack = progress.shadowRoot?.querySelector('.active-track')
    const expectedOffset = (1 - 75 / 100) * 100
    assert.equal(
      activeTrack?.getAttribute('stroke-dashoffset'),
      String(expectedOffset),
      'should update dashoffset when value changes'
    )
  })
})

test.group('Indeterminate State', (group) => {
  let progress: CircularProgress

  group.each.setup(async () => {
    progress = await indeterminateFixture()
  })

  test('renders spinner container for indeterminate progress', async ({ assert }) => {
    const spinner = progress.shadowRoot?.querySelector('.spinner')
    assert.exists(spinner, 'should render spinner element')
  })

  test('renders left and right containers', async ({ assert }) => {
    const left = progress.shadowRoot?.querySelector('.left')
    const right = progress.shadowRoot?.querySelector('.right')

    assert.exists(left, 'should render left container')
    assert.exists(right, 'should render right container')
  })

  test('renders circle elements for animation', async ({ assert }) => {
    const circles = progress.shadowRoot?.querySelectorAll('.circle')
    assert.equal(circles?.length, 2, 'should render 2 circle elements')
  })

  test('does not render SVG elements in indeterminate mode', async ({ assert }) => {
    const svg = progress.shadowRoot?.querySelector('svg')
    assert.isNull(svg, 'should not render SVG in indeterminate mode')
  })
})

test.group('Four Color Animation', (group) => {
  let progress: CircularProgress

  group.each.setup(async () => {
    progress = await fourColorFixture()
  })

  test('applies fourcolor attribute when fourColor is true', async ({ assert }) => {
    assert.isTrue(progress.hasAttribute('fourcolor'), 'should have fourcolor attribute')
  })

  test('removes fourcolor attribute when fourColor is false', async ({ assert }) => {
    progress.fourColor = false
    await progress.updateComplete
    assert.isFalse(progress.hasAttribute('fourcolor'), 'should not have fourcolor attribute')
  })
})

test.group('ARIA Attributes', (group) => {
  let progress: CircularProgress

  group.each.setup(async () => {
    progress = await basicFixture()
  })

  test('has correct role attribute', ({ assert }) => {
    assert.equal(progress.getAttribute('role'), 'progressbar', 'should have progressbar role')
  })

  test('sets aria-valuemin attribute', async ({ assert }) => {
    progress.min = 10
    await progress.updateComplete
    assert.equal(progress.getAttribute('aria-valuemin'), '10', 'should set aria-valuemin')
  })

  test('sets aria-valuemax attribute', async ({ assert }) => {
    progress.max = 200
    await progress.updateComplete
    assert.equal(progress.getAttribute('aria-valuemax'), '200', 'should set aria-valuemax')
  })

  test('sets aria-valuenow for determinate progress', async ({ assert }) => {
    progress.value = 50
    await progress.updateComplete
    assert.equal(progress.getAttribute('aria-valuenow'), '50', 'should set aria-valuenow for determinate')
  })

  test('removes aria-valuenow for indeterminate progress', async ({ assert }) => {
    progress.indeterminate = true
    await progress.updateComplete
    assert.isNull(progress.getAttribute('aria-valuenow'), 'should remove aria-valuenow for indeterminate')
  })

  test('updates aria attributes when switching between states', async ({ assert }) => {
    // Start determinate
    progress.value = 30
    await progress.updateComplete
    assert.equal(progress.getAttribute('aria-valuenow'), '30', 'should have aria-valuenow initially')

    // Switch to indeterminate
    progress.indeterminate = true
    await progress.updateComplete
    assert.isNull(progress.getAttribute('aria-valuenow'), 'should remove aria-valuenow when indeterminate')

    // Switch back to determinate
    progress.indeterminate = false
    await progress.updateComplete
    assert.equal(progress.getAttribute('aria-valuenow'), '30', 'should restore aria-valuenow when determinate')
  })
})

test.group('Accessibility Testing', () => {
  test('should be accessible in basic state', async ({ assert }) => {
    const progress = await accessibleBasicFixture()
    await assert.isAccessible(progress)
  })

  test('should be accessible in determinate state', async ({ assert }) => {
    const progress = await accessibleDeterminateFixture()
    await assert.isAccessible(progress)
  })

  test('should be accessible in indeterminate state', async ({ assert }) => {
    const progress = await accessibleIndeterminateFixture()
    await assert.isAccessible(progress)
  })

  test('should be accessible with four colors', async ({ assert }) => {
    const progress = await accessibleFourColorFixture()
    await assert.isAccessible(progress)
  })

  test('should be accessible when disabled', async ({ assert }) => {
    const progress = await accessibleDisabledFixture()
    await assert.isAccessible(progress)
  })
})

test.group('Events', (group) => {
  let progress: CircularProgress

  group.each.setup(async () => {
    progress = await basicFixture()
  })

  test('dispatches ratiochange event when value changes', async ({ assert }) => {
    let eventFired = false
    progress.addEventListener('ratiochange', () => {
      eventFired = true
    })

    progress.value = 50
    await progress.updateComplete

    assert.isTrue(eventFired, 'should dispatch ratiochange event')
  })

  test('dispatches ratiochange event when max changes', async ({ assert }) => {
    let eventFired = false
    progress.value = 50 // Set initial value
    await progress.updateComplete

    progress.addEventListener('ratiochange', () => {
      eventFired = true
    })

    progress.max = 200
    await progress.updateComplete

    assert.isTrue(eventFired, 'should dispatch ratiochange event when max changes')
  })

  test('dispatches ratiochange event when min changes', async ({ assert }) => {
    let eventFired = false
    progress.value = 50 // Set initial value
    await progress.updateComplete

    progress.addEventListener('ratiochange', () => {
      eventFired = true
    })

    progress.min = 10
    await progress.updateComplete

    assert.isTrue(eventFired, 'should dispatch ratiochange event when min changes')
  })
})

test.group('CSS Custom Properties Support', (group) => {
  let progress: CircularProgress

  group.each.setup(async () => {
    progress = await basicFixture()
  })

  test('allows size customization via CSS custom property', async ({ assert }) => {
    progress.style.setProperty('--ui-circular-progress-size', '64px')
    await progress.updateComplete

    const computedStyle = getComputedStyle(progress)
    assert.include(computedStyle.getPropertyValue('--_size'), '64px', 'should use custom size')
  })

  test('supports color customization', async ({ assert }) => {
    progress.style.setProperty('--ui-circular-progress-active-indicator-color', 'red')
    await progress.updateComplete

    const computedStyle = getComputedStyle(progress)
    assert.include(computedStyle.getPropertyValue('--_active-indicator-color'), 'red', 'should use custom color')
  })
})

test.group('Edge Cases', (group) => {
  let progress: CircularProgress

  group.each.setup(async () => {
    progress = await basicFixture()
  })

  test('handles NaN values gracefully', async ({ assert }) => {
    progress.value = NaN
    await progress.updateComplete
    assert.equal(progress.value, 0, 'should handle NaN value gracefully')
  })

  test('handles negative step values', async ({ assert }) => {
    progress.step = -5
    progress.value = 10
    await progress.updateComplete
    assert.equal(progress.value, 10, 'should handle negative step values')
  })

  test('handles very small step values', async ({ assert }) => {
    progress.step = 0.1
    progress.value = 0.15
    await progress.updateComplete
    assert.equal(progress.value, 0.1, 'should handle small step values correctly')
  })

  test('maintains correct ratio when min is not zero', async ({ assert }) => {
    progress.min = 20
    progress.max = 80
    progress.value = 50
    await progress.updateComplete

    const expectedRatio = ((50 - 20) / (80 - 20)) * 100
    assert.equal(progress.ratio, expectedRatio, 'should calculate ratio correctly with non-zero min')
  })
})

test.group('Disabled State', (group) => {
  let progress: CircularProgress

  group.each.setup(async () => {
    progress = await disabledFixture()
  })

  test('reflects disabled attribute', ({ assert }) => {
    assert.isTrue(progress.hasAttribute('disabled'), 'should have disabled attribute')
    assert.isTrue(progress.disabled, 'disabled property should be true')
  })

  test('can be enabled programmatically', async ({ assert }) => {
    progress.disabled = false
    await progress.updateComplete

    assert.isFalse(progress.hasAttribute('disabled'), 'should not have disabled attribute')
    assert.isFalse(progress.disabled, 'disabled property should be false')
  })
})

test.group('Performance Considerations', (group) => {
  let progress: CircularProgress

  group.each.setup(async () => {
    progress = await basicFixture()
  })

  test('uses contain: strict for performance', ({ assert }) => {
    const computedStyle = getComputedStyle(progress)
    assert.equal(computedStyle.contain, 'strict', 'should use contain: strict')
  })

  test('uses content-visibility: auto', ({ assert }) => {
    const computedStyle = getComputedStyle(progress)
    assert.equal(computedStyle.contentVisibility, 'auto', 'should use content-visibility: auto')
  })
})
