import { fixture, html, nextFrame, test } from '@pawel-up/lupa/testing'
import sinon from 'sinon'

import DateTime from '../../../../src/components/date/internals/DateTime.js'
import '../../../../src/components/date/ui-date-time.js'

async function basicFixture(): Promise<DateTime> {
  return fixture(html` <ui-date-time locales="en-US" time-zone="UTC" date="2010-12-10T11:05:45.000Z"></ui-date-time>`)
}

async function longWeekdayFixture(): Promise<DateTime> {
  return fixture(
    html` <ui-date-time locales="en-US" time-zone="UTC" date="2010-12-10T11:05:45.000Z" weekday="long"></ui-date-time>`
  )
}

async function longMonthFixture(): Promise<DateTime> {
  return fixture(
    html` <ui-date-time locales="en-US" time-zone="UTC" date="2010-12-10T11:05:45.000Z" month="long"></ui-date-time>`
  )
}

async function numericYearFixture(): Promise<DateTime> {
  return fixture(
    html` <ui-date-time locales="en-US" time-zone="UTC" date="2010-12-10T11:05:45.000Z" year="numeric"></ui-date-time>`
  )
}

async function numericDayFixture(): Promise<DateTime> {
  return fixture(
    html` <ui-date-time locales="en-US" time-zone="UTC" date="2010-12-10T11:05:45.000Z" day="numeric"></ui-date-time>`
  )
}

async function numericHourFixture(): Promise<DateTime> {
  return fixture(
    html` <ui-date-time locales="en-US" time-zone="UTC" date="2010-12-10T11:05:45.000Z" hour="numeric"></ui-date-time>`
  )
}

async function numericMinuteFixture(): Promise<DateTime> {
  return fixture(
    html` <ui-date-time
      locales="en-US"
      time-zone="UTC"
      date="2010-12-10T11:05:45.000Z"
      minute="numeric"
    ></ui-date-time>`
  )
}

async function numericSecondFixture(): Promise<DateTime> {
  return fixture(
    html` <ui-date-time
      locales="en-US"
      time-zone="UTC"
      date="2010-12-10T11:05:45.000Z"
      second="numeric"
    ></ui-date-time>`
  )
}

async function emptyFixture(): Promise<DateTime> {
  return fixture(html`<ui-date-time></ui-date-time>`)
}

async function deutscheFixture(): Promise<DateTime> {
  return fixture(html` <ui-date-time locales="de-DE" time-zone="UTC" date="2010-12-10T11:05:45.000Z"></ui-date-time>`)
}

async function itempropFixture(): Promise<DateTime> {
  return fixture(html` <ui-date-time itemprop="title" date="2010-12-10T11:05:45.000Z"></ui-date-time>`)
}

const EDGE_IS_STILL_SO_BAD = /\u200E/g
function normalizeString(str: string): string {
  return str.replace(EDGE_IS_STILL_SO_BAD, '')
}
const hasSupport = typeof Intl !== 'undefined'

test.group('DateTime: Basics', () => {
  test('Renders date string value', async ({ assert }) => {
    // Can't check date format at this point since it may vary depending
    // on the locale settings.
    const element = await basicFixture()
    await nextFrame()
    const txt = element._getTimeNode().innerHTML
    assert.typeOf(txt, 'string')
  }).tags(['@date-time'])

  test('Should compute ISO time', async ({ assert }) => {
    const element = await basicFixture()
    await nextFrame()
    assert.equal(element._getTimeNode().getAttribute('datetime'), '2010-12-10T11:05:45.000Z')
  }).tags(['@date-time'])

  test('Should set weekday', async ({ assert }) => {
    if (hasSupport) {
      const element = await longWeekdayFixture()
      await nextFrame()
      const txt = element._getTimeNode().innerHTML
      assert.equal(normalizeString(txt), 'Friday')
    }
  }).tags(['@date-time'])

  test('Sets year', async ({ assert }) => {
    if (hasSupport) {
      const element = await numericYearFixture()
      const txt = element._getTimeNode().innerHTML
      assert.equal(normalizeString(txt), '2010')
    }
  }).tags(['@date-time'])

  test('Should set month', async ({ assert }) => {
    if (hasSupport) {
      const element = await longMonthFixture()
      const txt = element._getTimeNode().innerHTML
      assert.equal(normalizeString(txt), 'December')
    }
  }).tags(['@date-time'])

  test('Should set day', async ({ assert }) => {
    if (hasSupport) {
      const element = await numericDayFixture()
      const txt = element._getTimeNode().innerHTML
      assert.equal(normalizeString(txt), '10')
    }
  }).tags(['@date-time'])

  test('Should set hour', async ({ assert }) => {
    if (hasSupport) {
      const element = await numericHourFixture()
      const txt = element._getTimeNode().innerHTML
      assert.include(normalizeString(txt), '11')
    }
  }).tags(['@date-time'])

  test('Sets minute', async ({ assert }) => {
    if (hasSupport) {
      const element = await numericMinuteFixture()
      const txt = element._getTimeNode().innerHTML
      assert.equal(normalizeString(txt), '5')
    }
  }).tags(['@date-time'])

  test('Sets minute', async ({ assert }) => {
    if (hasSupport) {
      const element = await numericSecondFixture()
      const txt = element._getTimeNode().innerHTML
      assert.equal(normalizeString(txt), '45')
    }
  }).tags(['@date-time'])
})

test.group('DateTime: Attributes settings', (group) => {
  let element: DateTime
  group.each.setup(async () => {
    element = await emptyFixture()
  })

  test(`Calls _updateLabel() when "{attr}" attribute changes`)
    .with([
      { attr: 'locales' },
      { attr: 'date' },
      { attr: 'year' },
      { attr: 'month' },
      { attr: 'day' },
      { attr: 'hour' },
      { attr: 'minute' },
      { attr: 'second' },
      { attr: 'weekday', value: 'short' },
      { attr: 'time-zone-name', value: 'short' },
      { attr: 'era', value: 'narrow' },
      { attr: 'time-zone', value: 'UTC' },
      { attr: 'hour12', value: true },
    ])
    .run(({ assert }, { attr, value = 'numeric' }) => {
      const spy = sinon.spy(element, '_updateLabel')
      // @ts-expect-error for testing
      element.setAttribute(attr, value)
      assert.isTrue(spy.called)
    })
    .tags(['@date-time'])

  test(`Updates property value when "{attr}" attribute changes`)
    .with([
      { attr: 'locales' },
      { attr: 'date' },
      { attr: 'year' },
      { attr: 'month' },
      { attr: 'day' },
      { attr: 'hour' },
      { attr: 'minute' },
      { attr: 'second' },
      { attr: 'weekday', value: 'short' },
      { attr: 'time-zone-name', value: 'short', zone: 'timeZoneName' },
      { attr: 'era', value: 'narrow' },
      { attr: 'time-zone', value: 'UTC', zone: 'timeZone' },
      { attr: 'hour12', value: true },
    ])
    .run(({ assert }, { attr, value = 'numeric', zone }) => {
      const prop = zone || attr
      const val = value || 'numeric'
      // @ts-expect-error for testing
      element.setAttribute(attr, val)
      if (prop === 'hour12') {
        assert.isTrue(element[prop])
      } else {
        // @ts-expect-error for testing
        assert.equal(element[prop], value)
      }
    })
    .tags(['@date-time'])
})

test.group('DateTime: Properties changed', (group) => {
  let element: DateTime
  group.each.setup(async () => {
    element = await emptyFixture()
  })

  test(`Calls _updateLabel() when "{attr}" property changes`)
    .with([
      { attr: 'locales' },
      { attr: 'date' },
      { attr: 'year' },
      { attr: 'month' },
      { attr: 'day' },
      { attr: 'hour' },
      { attr: 'minute' },
      { attr: 'second' },
      { attr: 'weekday', value: 'short' },
      { attr: 'time-zone-name', value: 'short', zone: 'timeZoneName' },
      { attr: 'era', value: 'narrow' },
      { attr: 'time-zone', value: 'UTC', zone: 'timeZone' },
      { attr: 'hour12', value: true },
    ])
    .run(({ assert }, { attr, value = 'numeric', zone }) => {
      const val = value || 'numeric'
      const prop = zone || attr
      const spy = sinon.spy(element, '_updateLabel')
      // @ts-expect-error for testing
      element[prop] = val
      assert.isTrue(spy.called)
    })
    .tags(['@date-time'])

  test(`Updates attribute value when "{attr}" property changes`)
    .with([
      { attr: 'locales', value: 'numeric' },
      { attr: 'date', value: 'numeric' },
      { attr: 'year', value: 'numeric' },
      { attr: 'month', value: 'numeric' },
      { attr: 'day', value: 'numeric' },
      { attr: 'hour', value: 'numeric' },
      { attr: 'minute', value: 'numeric' },
      { attr: 'second', value: 'numeric' },
      { attr: 'weekday', value: 'short' },
      { attr: 'time-zone-name', value: 'short', propName: 'timeZoneName' },
      { attr: 'era', value: 'narrow' },
      { attr: 'time-zone', value: 'UTC', propName: 'timeZone' },
    ])
    .run(({ assert }, { attr, value, propName }) => {
      const prop = propName || attr
      // @ts-expect-error for testing
      element[prop] = value
      assert.isTrue(element.hasAttribute(attr), 'Has corresponding attribute')
    })
    .tags(['@date-time'])
})

test.group('DateTime: getIntlOptions()', (group) => {
  let element: DateTime
  group.each.setup(async () => {
    element = await emptyFixture()
  })

  test(`Adds "{attr}" property`)
    .with([
      { attr: 'year', value: 'numeric' },
      { attr: 'month', value: 'numeric' },
      { attr: 'day', value: 'numeric' },
      { attr: 'hour', value: 'numeric' },
      { attr: 'minute', value: 'numeric' },
      { attr: 'second', value: 'numeric' },
      { attr: 'weekday', value: 'short' },
      { attr: 'time-zone-name', value: 'short', propName: 'timeZoneName' },
      { attr: 'era', value: 'narrow' },
      { attr: 'time-zone', value: 'UTC', propName: 'timeZone' },
      { attr: 'hour12', value: true },
    ])
    .run(({ assert }, { attr, value = 'numeric', propName }) => {
      const prop = propName || attr
      const val = value || 'numeric'
      // @ts-expect-error for testing
      element[prop] = val
      const result = element._getIntlOptions()
      if (prop === 'hour12') {
        assert.isTrue(result[prop])
      } else {
        // @ts-expect-error for testing
        assert.equal(result[prop], value)
      }
    })
    .tags(['@date-time'])
})

test.group('DateTime: _updateLabel()', () => {
  let element: DateTime

  test('Does nothing when not in the DOM', async ({ assert }) => {
    element = await basicFixture()
    const parent = element.parentElement!
    parent.removeChild(element)
    const time = element._getTimeNode()
    element.shadowRoot!.removeChild(time)
    element.day = 'numeric'
    const node = element.shadowRoot!.querySelector('time')
    assert.notOk(node)
  }).tags(['@date-time'])

  test('Sets "datetime" attribiute on <time>', async ({ assert }) => {
    element = await basicFixture()
    const time = element._getTimeNode()
    assert.equal(time.getAttribute('datetime'), '2010-12-10T11:05:45.000Z')
  }).tags(['@date-time'])

  test('Sets text content on <time>', async ({ assert }) => {
    element = await basicFixture()
    const time = element._getTimeNode()
    assert.equal(time.innerText.trim().toLowerCase(), '12/10/2010')
  }).tags(['@date-time'])

  test('Uses different locale', async ({ assert }) => {
    element = await deutscheFixture()
    const time = element._getTimeNode()
    assert.equal(time.innerText.trim().toLowerCase(), '10.12.2010')
  }).tags(['@date-time'])
})

test.group('DateTime: itemprop attribute', () => {
  let element: DateTime

  test('Copies itemprop attribute to <time> element', async ({ assert }) => {
    element = await itempropFixture()
    assert.equal(element._getTimeNode().getAttribute('itemprop'), 'title')
  }).tags(['@date-time'])

  test('Removes itemprop attribute from this element', async ({ assert }) => {
    element = await itempropFixture()
    assert.equal(element.getAttribute('itemprop'), null)
  }).tags(['@date-time'])

  test('Ignores the change when attribute is already set', async ({ assert }) => {
    element = await itempropFixture()
    const spy = sinon.spy(element, '_getTimeNode')
    element.itemprop = 'title'
    // Getter uses `_getTimeNode` to read attribute.
    // This should happen only once in this case.
    assert.isTrue(spy.calledOnce)
  }).tags(['@date-time'])
})
