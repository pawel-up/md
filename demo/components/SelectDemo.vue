<script setup lang="ts">
import { ref } from 'vue'
import '../../src/components/select/ui-select.js'
import '../../src/components/select/ui-option.js'
import '../../src/components/button/ui-button.js'
import '../../src/components/icons/ui-icon.js'

const basicSelected = ref<string | undefined>(undefined)
const iconSelected = ref<string | undefined>(undefined)
const supportingSelected = ref<string | undefined>(undefined)
const noIconSelected = ref<string | undefined>(undefined)
const programmaticSelected = ref<string | undefined>(undefined)
const keyboardTestSelected = ref<string | undefined>(undefined)
const typeAheadSelected = ref<string | undefined>(undefined)

const interactiveDensity = ref<'0' | '-1' | '-2' | '-3'>('0')
const setDensity = (val: '0' | '-1' | '-2' | '-3') => {
  interactiveDensity.value = val
}

const interactiveVariant = ref<'standard' | 'vibrant'>('standard')
const toggleVariant = () => {
  interactiveVariant.value = interactiveVariant.value === 'standard' ? 'vibrant' : 'standard'
}

const handleBasicSelectChange = (e: Event) => {
  const { value } = (e as CustomEvent).detail
  basicSelected.value = value
  console.log(`Basic select changed: ${value}`)
  const resultElement = document.querySelector('#basic-result')
  if (resultElement) {
    resultElement.textContent = value || 'None'
  }
}

const handleIconSelectChange = (e: Event) => {
  const { value } = (e as CustomEvent).detail
  iconSelected.value = value
  console.log(`Icon select changed: ${value}`)
  const resultElement = document.querySelector('#icon-result')
  if (resultElement) {
    resultElement.textContent = value || 'None'
  }
}

const handleSupportingSelectChange = (e: Event) => {
  const { value } = (e as CustomEvent).detail
  supportingSelected.value = value
  console.log(`Supporting select changed: ${value}`)
  const resultElement = document.querySelector('#supporting-result')
  if (resultElement) {
    resultElement.textContent = value || 'None'
  }
}

const handleNoIconSelectChange = (e: Event) => {
  const { value } = (e as CustomEvent).detail
  noIconSelected.value = value
  console.log(`No icon select changed: ${value}`)
  const resultElement = document.querySelector('#no-icon-result')
  if (resultElement) {
    resultElement.textContent = value || 'None'
  }
}

const handleProgrammaticSelectChange = (e: Event) => {
  const { value } = (e as CustomEvent).detail
  programmaticSelected.value = value
  console.log(`Programmatic select changed: ${value}`)
  const resultElement = document.querySelector('#programmatic-result')
  if (resultElement) {
    resultElement.textContent = value || 'None'
  }
}

const handleKeyboardTestSelectChange = (e: Event) => {
  const { value } = (e as CustomEvent).detail
  keyboardTestSelected.value = value
  console.log(`Keyboard test select changed: ${value}`)
  const resultElement = document.querySelector('#keyboard-test-result')
  if (resultElement) {
    resultElement.textContent = value || 'None'
  }
}

const handleTypeAheadSelectChange = (e: Event) => {
  const { value } = (e as CustomEvent).detail
  typeAheadSelected.value = value
  console.log(`Type-ahead select changed: ${value}`)
  const resultElement = document.querySelector('#typeahead-result')
  if (resultElement) {
    resultElement.textContent = value || 'None'
  }
}

const setValueOne = () => {
  const select = document.querySelector('#programmatic-select') as HTMLElement & { value: string }
  if (select) {
    select.value = 'one'
  }
}

const setValueTwo = () => {
  const select = document.querySelector('#programmatic-select') as HTMLElement & { value: string }
  if (select) {
    select.value = 'two'
  }
}

const clearValue = () => {
  const select = document.querySelector('#programmatic-select') as HTMLElement & { value: string }
  if (select) {
    select.value = ''
  }
}

// Required Select Demo
const requiredSelected = ref<string | undefined>(undefined)
const requiredValidityStatus = ref<string>('Not validated yet')

const handleRequiredSelectChange = (e: Event) => {
  const { value } = (e as CustomEvent).detail
  requiredSelected.value = value
  updateRequiredStatus()
}

const updateRequiredStatus = () => {
  const select = document.querySelector('#required-select') as HTMLElement & {
    checkValidity(): boolean
    invalid: boolean | undefined
    invalidText: string | undefined
    validate(): void
  }
  if (select) {
    select.validate()
    requiredValidityStatus.value = `valid: ${select.checkValidity()}, invalid: ${select.invalid}, invalidText: "${select.invalidText || ''}"`
  }
}

const toggleRequired = () => {
  const select = document.querySelector('#required-select') as HTMLElement & { required: boolean }
  if (select) {
    select.required = !select.required
    updateRequiredStatus()
  }
}

const clearRequiredSelection = () => {
  const select = document.querySelector('#required-select') as HTMLElement & { value: string | undefined }
  if (select) {
    select.value = undefined
    updateRequiredStatus()
  }
}

// Form Integration Demo
const formResult = ref<string>('Form not submitted yet')

const handleFormSubmit = (e: Event) => {
  e.preventDefault()
  const form = e.target as HTMLFormElement
  const formData = new FormData(form)
  const entries: Record<string, string> = {}
  formData.forEach((val, key) => {
    entries[key] = val.toString()
  })
  formResult.value = JSON.stringify(entries, null, 2)
}

const handleFormReset = (e: Event) => {
  setTimeout(() => {
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const entries: Record<string, string> = {}
    formData.forEach((val, key) => {
      entries[key] = val.toString()
    })
    formResult.value = `Form Reset! Current FormData: ${JSON.stringify(entries)}`
  }, 50)
}
</script>

<template>
  <h1>UI Select</h1>
  <p>A Material Design 3 select component that behaves like an outlined text field with dropdown.</p>

  <section>
    <h2>Basic Select</h2>
    <p>Select a fruit from the list:</p>
    <ui-select id="basic-select" @change="handleBasicSelectChange" label="Select a fruit">
      <ui-option value="apple" selected="true">Apple</ui-option>
      <ui-option value="banana">Banana</ui-option>
      <ui-option value="cherry">Cherry</ui-option>
      <ui-option value="date">Date</ui-option>
      <ui-option value="elderberry">Elderberry</ui-option>
    </ui-select>
    <p>Selected: <span id="basic-result">None</span></p>
  </section>

  <section>
    <h2>Select with Icons</h2>
    <p>Select a country with icons:</p>
    <ui-select id="icon-select" @change="handleIconSelectChange" value="us" label="Select a country">
      <ui-option value="us">
        <ui-icon slot="start">🇺🇸</ui-icon>
        United States
        <span slot="overline">North America</span>
        <span slot="supporting-text">USA</span>
      </ui-option>
      <ui-option value="gb">
        <ui-icon slot="start">🇬🇧</ui-icon>
        United Kingdom
        <span slot="overline">Europe</span>
        <span slot="supporting-text">UK</span>
      </ui-option>
      <ui-option value="de">
        <ui-icon slot="start">🇩🇪</ui-icon>
        Germany
        <span slot="overline">Europe</span>
        <span slot="supporting-text">DE</span>
      </ui-option>
      <ui-option value="fr">
        <ui-icon slot="start">🇫🇷</ui-icon>
        France
        <span slot="overline">Europe</span>
        <span slot="supporting-text">FR</span>
      </ui-option>
      <ui-option value="jp">
        <ui-icon slot="start">🇯🇵</ui-icon>
        Japan
        <span slot="overline">Asia</span>
        <span slot="supporting-text">JP</span>
      </ui-option>
    </ui-select>
    <p>Selected: <span id="icon-result">None</span></p>
  </section>

  <section>
    <h2>Select with Supporting Text</h2>
    <p>Select a user with additional information:</p>
    <ui-select id="supporting-select" @change="handleSupportingSelectChange">
      <ui-option value="alice">
        Alice Johnson
        <span slot="supporting-text">alice@example.com</span>
      </ui-option>
      <ui-option value="bob">
        Bob Smith
        <span slot="supporting-text">bob@example.com</span>
      </ui-option>
      <ui-option value="carol" disabled="true">
        Carol Davis
        <span slot="supporting-text">carol@example.com</span>
      </ui-option>
      <ui-option value="dave">
        Dave Wilson
        <span slot="supporting-text">dave@example.com</span>
      </ui-option>
    </ui-select>
    <p>Selected: <span id="supporting-result">None</span></p>
  </section>

  <section>
    <h2>Disabled Select</h2>
    <p>This select is disabled:</p>
    <ui-select id="disabled-select" disabled="true">
      <ui-option value="option1">Option 1</ui-option>
      <ui-option value="option2">Option 2</ui-option>
      <ui-option value="option3">Option 3</ui-option>
    </ui-select>
  </section>

  <section>
    <h2>Select without Selection Icon</h2>
    <p>Select without the check icon:</p>
    <ui-select id="no-icon-select" @change="handleNoIconSelectChange" style="width: 100%">
      <ui-option value="red">Red</ui-option>
      <ui-option value="green">Green</ui-option>
      <ui-option value="blue">Blue</ui-option>
      <ui-option value="yellow">Yellow</ui-option>
    </ui-select>
    <p>Selected: <span id="no-icon-result">None</span></p>
  </section>

  <section>
    <h2>Density Variations</h2>
    <p>
      The Material Design 3 density scale adjusts the vertical height of dropdown options and menus:
      <code>0</code> (48px - default), <code>-1</code> (44px), <code>-2</code> (40px), and <code>-3</code> (36px).
      Setting <code>density</code> on <code>&lt;ui-select&gt;</code> automatically propagates to all child
      <code>&lt;ui-option&gt;</code> elements and the internal dropdown menu.
    </p>

    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      "
    >
      <div>
        <h4 style="margin: 0 0 0.5rem 0">Density 0 (48px - Default)</h4>
        <ui-select density="0" label="Density 0" value="apple" style="width: 100%">
          <ui-option value="apple">Apple</ui-option>
          <ui-option value="banana">Banana</ui-option>
          <ui-option value="cherry">Cherry</ui-option>
        </ui-select>
      </div>

      <div>
        <h4 style="margin: 0 0 0.5rem 0">Density -1 (44px)</h4>
        <ui-select density="-1" label="Density -1" value="apple" style="width: 100%">
          <ui-option value="apple">Apple</ui-option>
          <ui-option value="banana">Banana</ui-option>
          <ui-option value="cherry">Cherry</ui-option>
        </ui-select>
      </div>

      <div>
        <h4 style="margin: 0 0 0.5rem 0">Density -2 (40px)</h4>
        <ui-select density="-2" label="Density -2" value="apple" style="width: 100%">
          <ui-option value="apple">Apple</ui-option>
          <ui-option value="banana">Banana</ui-option>
          <ui-option value="cherry">Cherry</ui-option>
        </ui-select>
      </div>

      <div>
        <h4 style="margin: 0 0 0.5rem 0">Density -3 (36px)</h4>
        <ui-select density="-3" label="Density -3" value="apple" style="width: 100%">
          <ui-option value="apple">Apple</ui-option>
          <ui-option value="banana">Banana</ui-option>
          <ui-option value="cherry">Cherry</ui-option>
        </ui-select>
      </div>
    </div>

    <div style="padding: 1rem; background: var(--md-sys-color-surface-variant); border-radius: 8px">
      <h4 style="margin-top: 0">Interactive Density Playground</h4>
      <p>
        Current density: <strong>{{ interactiveDensity }}</strong>
      </p>
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap">
        <ui-button :color="interactiveDensity === '0' ? 'filled' : 'tonal'" @click="setDensity('0')">
          Density 0 (48px)
        </ui-button>
        <ui-button :color="interactiveDensity === '-1' ? 'filled' : 'tonal'" @click="setDensity('-1')">
          Density -1 (44px)
        </ui-button>
        <ui-button :color="interactiveDensity === '-2' ? 'filled' : 'tonal'" @click="setDensity('-2')">
          Density -2 (40px)
        </ui-button>
        <ui-button :color="interactiveDensity === '-3' ? 'filled' : 'tonal'" @click="setDensity('-3')">
          Density -3 (36px)
        </ui-button>
      </div>
      <ui-select
        :density="interactiveDensity"
        label="Dynamic Density Select"
        value="inbox"
        style="width: 100%; max-width: 320px"
      >
        <ui-option value="inbox">
          <ui-icon slot="start">inbox</ui-icon>
          Inbox
          <span slot="supporting-text">Primary folder</span>
        </ui-option>
        <ui-option value="sent">
          <ui-icon slot="start">send</ui-icon>
          Sent
          <span slot="supporting-text">Outbox messages</span>
        </ui-option>
        <ui-option value="archive">
          <ui-icon slot="start">archive</ui-icon>
          Archive
          <span slot="supporting-text">Saved records</span>
        </ui-option>
      </ui-select>
    </div>
  </section>

  <section>
    <h2>Color Variants (Standard & Vibrant)</h2>
    <p>Select supports Material Design 3 color mapping variants:</p>
    <ul>
      <li>
        <code>standard</code> (default): Surface container menu background with secondary-container selection indicator.
      </li>
      <li>
        <code>vibrant</code>: Tertiary container menu background with vibrant tertiary selection indicator for higher
        visual emphasis.
      </li>
    </ul>
    <p>
      Notice the Material 3 inset pill selection and hover styling: options feature a 6px lateral inset margin, 4px
      corner radius when unselected, and transition into a 12px rounded pill indicator when selected.
    </p>

    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      "
    >
      <div>
        <h4 style="margin: 0 0 0.5rem 0">Standard Variant</h4>
        <ui-select variant="standard" label="Standard Select" value="standard-opt" style="width: 100%">
          <ui-option value="standard-opt">
            <ui-icon slot="start">palette</ui-icon>
            Standard Option
            <span slot="supporting-text">Secondary container highlight</span>
          </ui-option>
          <ui-option value="other-opt">
            <ui-icon slot="start">brush</ui-icon>
            Second Option
            <span slot="supporting-text">Unselected item</span>
          </ui-option>
          <ui-option value="third-opt">
            <ui-icon slot="start">format_paint</ui-icon>
            Third Option
          </ui-option>
        </ui-select>
      </div>

      <div>
        <h4 style="margin: 0 0 0.5rem 0">Vibrant Variant</h4>
        <ui-select variant="vibrant" label="Vibrant Select" value="vibrant-opt" style="width: 100%">
          <ui-option value="vibrant-opt">
            <ui-icon slot="start">auto_awesome</ui-icon>
            Vibrant Option
            <span slot="supporting-text">Tertiary container highlight</span>
          </ui-option>
          <ui-option value="other-opt">
            <ui-icon slot="start">star</ui-icon>
            Second Option
            <span slot="supporting-text">Unselected item</span>
          </ui-option>
          <ui-option value="third-opt">
            <ui-icon slot="start">favorite</ui-icon>
            Third Option
          </ui-option>
        </ui-select>
      </div>
    </div>

    <div style="padding: 1rem; background: var(--md-sys-color-surface-variant); border-radius: 8px">
      <h4 style="margin-top: 0">Interactive Variant Playground</h4>
      <p>
        Current variant: <strong>{{ interactiveVariant }}</strong>
      </p>
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem">
        <ui-button color="filled" @click="toggleVariant">
          Switch to {{ interactiveVariant === 'standard' ? 'Vibrant' : 'Standard' }}
        </ui-button>
      </div>
      <ui-select
        :variant="interactiveVariant"
        label="Dynamic Variant Select"
        value="active"
        style="width: 100%; max-width: 320px"
      >
        <ui-option value="active">
          <ui-icon slot="start">check_circle</ui-icon>
          Active Item
          <span slot="supporting-text">Selected with dynamic variant</span>
        </ui-option>
        <ui-option value="pending">
          <ui-icon slot="start">schedule</ui-icon>
          Pending Item
          <span slot="supporting-text">Waiting on review</span>
        </ui-option>
        <ui-option value="completed">
          <ui-icon slot="start">done_all</ui-icon>
          Completed Item
          <span slot="supporting-text">Processed successfully</span>
        </ui-option>
      </ui-select>
    </div>
  </section>

  <section>
    <h2>Type-ahead Navigation Test</h2>
    <p>Test type-ahead functionality - start typing to jump to matching options:</p>
    <ui-select id="typeahead-test-select" @change="handleTypeAheadSelectChange" label="Type to search">
      <ui-option value="amsterdam">Amsterdam</ui-option>
      <ui-option value="berlin">Berlin</ui-option>
      <ui-option value="chicago">Chicago</ui-option>
      <ui-option value="denver">Denver</ui-option>
      <ui-option value="edinburgh">Edinburgh</ui-option>
      <ui-option value="florence">Florence</ui-option>
      <ui-option value="geneva">Geneva</ui-option>
      <ui-option value="helsinki">Helsinki</ui-option>
      <ui-option value="istanbul">Istanbul</ui-option>
      <ui-option value="jakarta">Jakarta</ui-option>
      <ui-option value="kyoto">Kyoto</ui-option>
      <ui-option value="london">London</ui-option>
      <ui-option value="madrid">Madrid</ui-option>
      <ui-option value="naples">Naples</ui-option>
      <ui-option value="oslo">Oslo</ui-option>
      <ui-option value="paris">Paris</ui-option>
      <ui-option value="quebec">Quebec</ui-option>
      <ui-option value="rome">Rome</ui-option>
      <ui-option value="stockholm">Stockholm</ui-option>
      <ui-option value="tokyo">Tokyo</ui-option>
      <ui-option value="utrecht">Utrecht</ui-option>
      <ui-option value="vienna">Vienna</ui-option>
      <ui-option value="warsaw">Warsaw</ui-option>
      <ui-option value="york">York</ui-option>
      <ui-option value="zurich">Zurich</ui-option>
    </ui-select>
    <p>Selected: <span id="typeahead-result">None</span></p>
    <div style="margin-top: 1rem; padding: 1rem; background: var(--md-sys-color-surface-variant); border-radius: 8px">
      <h4>Type-ahead Instructions:</h4>
      <ul>
        <li><strong>Single character:</strong> Type "a" to jump to Amsterdam, "b" to jump to Berlin, etc.</li>
        <li><strong>Multiple characters:</strong> Type "ch" to jump to Chicago, "st" to jump to Stockholm</li>
        <li><strong>Timeout reset:</strong> Wait ~1 second and the search resets (try "a" then wait, then "b")</li>
        <li><strong>When closed:</strong> Type-ahead will select the option directly</li>
        <li><strong>When open:</strong> Type-ahead will focus the matching option for keyboard selection</li>
      </ul>
    </div>
  </section>

  <section>
    <h2>Keyboard Navigation Test</h2>
    <p>Test keyboard navigation with disabled options (use arrow keys to navigate):</p>
    <ui-select id="keyboard-test-select" @change="handleKeyboardTestSelectChange" label="Test Navigation">
      <ui-option value="first">First Option</ui-option>
      <ui-option value="second" disabled="true">Second Option (Disabled)</ui-option>
      <ui-option value="third">Third Option</ui-option>
      <ui-option value="fourth" disabled="true">Fourth Option (Disabled)</ui-option>
      <ui-option value="fifth" disabled="true">Fifth Option (Disabled)</ui-option>
      <ui-option value="sixth">Sixth Option</ui-option>
      <ui-option value="seventh">Seventh Option</ui-option>
      <ui-option value="eighth" disabled="true">Eighth Option (Disabled)</ui-option>
      <ui-option value="ninth">Ninth Option</ui-option>
    </ui-select>
    <p>Selected: <span id="keyboard-test-result">None</span></p>
    <p><small>Try using arrow keys to navigate and notice that disabled options are skipped.</small></p>
  </section>

  <section>
    <h2>Programmatic Control</h2>
    <p>Control the select value programmatically:</p>
    <ui-select id="programmatic-select" @change="handleProgrammaticSelectChange">
      <ui-option value="one">One</ui-option>
      <ui-option value="two">Two</ui-option>
      <ui-option value="three">Three</ui-option>
      <ui-option value="four">Four</ui-option>
    </ui-select>
    <p>Selected: <span id="programmatic-result">None</span></p>
    <div class="button-group">
      <ui-button @click="setValueOne">Set to "One"</ui-button>
      <ui-button @click="setValueTwo">Set to "Two"</ui-button>
      <ui-button @click="clearValue">Clear</ui-button>
    </div>
  </section>

  <section>
    <h2>Required Select & Validation</h2>
    <p>Test validation reporting on a required select component:</p>
    <ui-select id="required-select" required="true" label="Required Fruit Choice" @change="handleRequiredSelectChange">
      <ui-option value="apple">Apple</ui-option>
      <ui-option value="banana">Banana</ui-option>
      <ui-option value="cherry">Cherry</ui-option>
    </ui-select>
    <p>Selected: {{ requiredSelected || 'None' }}</p>
    <p>
      Validity Status: <code>{{ requiredValidityStatus }}</code>
    </p>
    <div class="button-group" style="display: flex; gap: 0.5rem; margin-top: 0.5rem">
      <ui-button @click="updateRequiredStatus">Validate Field</ui-button>
      <ui-button @click="clearRequiredSelection">Clear Selection</ui-button>
      <ui-button @click="toggleRequired">Toggle Required</ui-button>
    </div>
  </section>

  <section>
    <h2>Form Integration & Submission</h2>
    <p>Test native HTML form integration, submission, and reset behavior:</p>
    <form
      @submit="handleFormSubmit"
      @reset="handleFormReset"
      style="display: flex; flex-direction: column; gap: 1rem; max-width: 400px"
    >
      <ui-select name="favColor" label="Favorite Color (Required)" required="true">
        <ui-option value="red">Red</ui-option>
        <ui-option value="green">Green</ui-option>
        <ui-option value="blue">Blue</ui-option>
      </ui-select>

      <ui-select name="category" label="Category (Pre-selected in HTML)">
        <ui-option value="tech">Technology</ui-option>
        <ui-option value="design" selected="true">Design</ui-option>
        <ui-option value="art">Art</ui-option>
      </ui-select>

      <ui-select name="noValueAttr" label="Option without value attribute">
        <ui-option>Alpha</ui-option>
        <ui-option>Beta</ui-option>
        <ui-option>Gamma</ui-option>
      </ui-select>

      <div class="button-group" style="display: flex; gap: 0.5rem; margin-top: 0.5rem">
        <ui-button type="submit">Submit Form</ui-button>
        <ui-button type="reset">Reset Form</ui-button>
      </div>
    </form>
    <div style="margin-top: 1rem; padding: 1rem; background: var(--md-sys-color-surface-variant); border-radius: 8px">
      <h4>Form Submission Result:</h4>
      <pre><code>{{ formResult }}</code></pre>
    </div>
  </section>
</template>
