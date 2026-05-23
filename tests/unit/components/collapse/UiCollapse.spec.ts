import { fixture, nextFrame, html, oneEvent, test } from '@pawel-up/lupa/testing'
import sinon from 'sinon'
import type UiCollapse from '../../../../src/components/collapse/internals/Collapse.js'
import '../../../../src/components/collapse/ui-collapse.js'

async function basicFixture(): Promise<UiCollapse> {
  return fixture(
    html`<ui-collapse open>
      <div style="height:100px;">Lorem ipsum</div>
    </ui-collapse>`
  )
}

async function emptyFixture(): Promise<UiCollapse> {
  return fixture(html`<ui-collapse open></ui-collapse>`)
}

async function horizontalFixture(): Promise<UiCollapse> {
  return fixture(
    html`<ui-collapse open horizontal>
      <div style="width:100px;">Lorem ipsum</div>
    </ui-collapse>`
  )
}

test.group('constructor', (group) => {
  let collapse: UiCollapse

  group.each.setup(async () => {
    collapse = await basicFixture()
  })

  test('open attribute', ({ assert }) => {
    assert.equal(collapse.open, true)
  })

  test('animated by default', ({ assert }) => {
    assert.notOk(collapse.noAnimation, '`noAnimation` is false')
  })

  test('not transitioning on attached', ({ assert }) => {
    assert.isFalse(collapse.transitioning, '`transitioning` is false')
  })

  test('horizontal attribute', ({ assert }) => {
    assert.equal(collapse.horizontal, false)
  })

  test('default opened height', ({ assert }) => {
    assert.equal(collapse.style.maxHeight, '')
  }).tags(['@collapse'])
})

test.group('#open', (group) => {
  let collapse: UiCollapse
  let collapseHeight: string

  group.each.setup(async () => {
    collapse = await basicFixture()
    collapseHeight = getComputedStyle(collapse).height
  })

  test('set open to false triggers animation', async ({ assert }) => {
    collapse.open = false
    await collapse.updateComplete
    // Animation got enabled.
    assert.notEqual(collapse.style.transitionDuration, '0s')
    assert.equal(collapse.transitioning, true, 'transitioning became true')
    await oneEvent(collapse, 'transitionend')
    assert.equal(collapse.style.transitionDuration, '0s')
    assert.equal(collapse.transitioning, false, 'transitioning became false')
  }).tags(['@collapse'])

  test('set open to false, then to true', async ({ assert }) => {
    // Trigger 1st toggle.
    collapse.open = false
    await oneEvent(collapse, 'transitionend')
    // Check if size is 0px.
    assert.equal(collapse.style.maxHeight, '0px')
    collapse.open = true
    await collapse.updateComplete
    assert.equal(collapse.style.maxHeight, collapseHeight)
    await oneEvent(collapse, 'transitionend')
    // Check finalSize after animation is done.
    assert.equal(collapse.style.height, '')
  }).tags(['@collapse'])

  test('open change trigger resize', async () => {
    // No animations for faster test.
    collapse.noAnimation = true
    collapse.open = false
    await oneEvent(collapse, 'resize')
  }).tags(['@collapse'])

  test('overflow is hidden while animating', async ({ assert }) => {
    assert.equal(getComputedStyle(collapse).overflow, 'visible')
    collapse.open = false
    await collapse.updateComplete
    assert.equal(getComputedStyle(collapse).overflow, 'hidden')
    await oneEvent(collapse, 'transitionend')
    // Should still be hidden.
    assert.equal(getComputedStyle(collapse).overflow, 'hidden')
  }).tags(['@collapse'])
})

test.group('#transitioning', (group) => {
  let collapse: UiCollapse

  group.each.setup(async () => {
    collapse = await basicFixture()
  })

  test('updates only during transitions between open/close states', async ({ assert }) => {
    const spy = sinon.spy()

    collapse.addEventListener('transitioning', spy)
    collapse.noAnimation = true
    assert.equal(spy.callCount, 0, 'transitioning not affected by noAnimation')
    collapse.horizontal = true
    await collapse.updateComplete
    assert.equal(spy.callCount, 1, 'transitioning affected by horizontal')
    collapse.open = false
    await collapse.updateComplete
    assert.equal(spy.callCount, 3, 'transitioning changed 3 times')
    assert.equal(collapse.transitioning, false, 'transitioning is false')
  }).tags(['@collapse'])
})

test.group('#noAnimation', (group) => {
  let collapse: UiCollapse

  group.each.setup(async () => {
    collapse = await basicFixture()
  })

  test('disables animations', async ({ assert }) => {
    collapse.noAnimation = true
    // trying to animate the size update
    collapse.open = false
    await collapse.updateComplete
    // Animation immediately disabled.
    assert.equal(collapse.style.maxHeight, '0px')
  }).tags(['@collapse'])
})

test.group('#horizontal', (group) => {
  let collapse: UiCollapse
  let collapseWidth: string

  group.each.setup(async () => {
    collapse = await horizontalFixture()
    collapseWidth = getComputedStyle(collapse).width
  })

  test('opened attribute', ({ assert }) => {
    assert.equal(collapse.open, true)
  }).tags(['@collapse'])

  test('horizontal attribute', ({ assert }) => {
    assert.equal(collapse.horizontal, true)
  }).tags(['@collapse'])

  test('default opened width', ({ assert }) => {
    assert.equal(collapse.style.width, '')
  }).tags(['@collapse'])

  test('set opened to false, then to true', async ({ assert }) => {
    // Trigger 1st toggle.
    collapse.open = false
    await collapse.updateComplete
    // Size should be immediately set.
    assert.equal(collapse.style.maxWidth, '0px', 'maxWidth is set')
    await oneEvent(collapse, 'transitionend')

    // Check if size is still 0px.
    assert.equal(collapse.style.maxWidth, '0px', 'maxWidth is still set')
    // Trigger 2nd toggle.
    collapse.open = true
    await collapse.updateComplete
    assert.equal(collapse.style.maxWidth, collapseWidth, 'maxWidth is set to the collapse width')

    await oneEvent(collapse, 'transitionend')
    assert.equal(collapse.style.width, '')
  }).tags(['@collapse'])
})

test.group('No content', (group) => {
  let collapse: UiCollapse

  group.each.setup(async () => {
    collapse = await emptyFixture()
  })

  test('empty&opened shows dynamically loaded content', async ({ assert }) => {
    await nextFrame()
    collapse.toggle()
    collapse.toggle()
    assert.equal(collapse.style.maxHeight, '')
  }).tags(['@collapse'])
})

test.group('a11y', (group) => {
  async function a11yFixture(): Promise<UiCollapse> {
    return fixture(
      html`<ui-collapse id="collapse" tabindex="0">
        <div>
          Forma temperiemque cornua sidera dissociata cornua recessit innabilis ligavit: solidumque coeptis nullus
          caelum sponte phoebe di regat mentisque tanta austro capacius amphitrite sui quin postquam semina fossae
          liquidum umor galeae coeptis caligine liberioris quin liquidum matutinis invasit posset: flexi glomeravit
          radiis certis invasit oppida postquam onerosior inclusum dominari opifex terris pace finxit quam aquae nunc
          sine altae auroram quam habentem homo totidemque scythiam in pondus ensis tegit caecoque poena lapidosos
          humanas coeperunt poena aetas totidem nec natura aethera locavit caelumque distinxit animalibus phoebe
          cingebant moderantum porrexerat terrae possedit sua sole diu summaque obliquis melioris orbem
        </div>
      </ui-collapse>`
    )
  }

  let collapse: UiCollapse

  group.each.setup(async () => {
    // Force focus on body at every test.
    document.body.focus()
    collapse = await a11yFixture()
  })

  test('aria attributes', ({ assert }) => {
    assert.equal(collapse.getAttribute('role'), 'group')
    assert.equal(collapse.getAttribute('aria-hidden'), 'true')
  }).tags(['@a11y', '@collapse'])

  test('set opened to true', async ({ assert }) => {
    collapse.open = true
    await collapse.updateComplete
    assert.equal(collapse.getAttribute('aria-hidden'), 'false')
  }).tags(['@a11y', '@collapse'])

  test('focus the collapse when opened', async ({ assert }) => {
    assert.notEqual(document.activeElement, collapse)
    collapse.open = true
    await collapse.updateComplete
    assert.equal(document.activeElement, collapse)
  }).tags(['@a11y', '@collapse'])

  test('passes automated tests when closed', async ({ assert }) => {
    await assert.isAccessible(collapse)
  }).tags(['@a11y', '@collapse'])
})
