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
</script>

<template>
  <h1>UI Select</h1>
  <p>A Material Design 3 select component that behaves like an outlined text field with dropdown.</p>

  <section>
    <h2>Basic Select</h2>
    <p>Select a fruit from the list:</p>
    <ui-select id="basic-select" @change="handleBasicSelectChange" label="Select a fruit">
      <ui-option value="apple" selected>Apple</ui-option>
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
      <ui-option value="carol" disabled>
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
    <ui-select id="disabled-select" disabled>
      <ui-option value="option1">Option 1</ui-option>
      <ui-option value="option2">Option 2</ui-option>
      <ui-option value="option3">Option 3</ui-option>
    </ui-select>
  </section>

  <section>
    <h2>Select without Selection Icon</h2>
    <p>Select without the check icon:</p>
    <ui-select id="no-icon-select" @change="handleNoIconSelectChange" style="width: 100%;">
      <ui-option value="red">Red</ui-option>
      <ui-option value="green">Green</ui-option>
      <ui-option value="blue">Blue</ui-option>
      <ui-option value="yellow">Yellow</ui-option>
    </ui-select>
    <p>Selected: <span id="no-icon-result">None</span></p>
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
    <div
      style="margin-top: 1rem; padding: 1rem; background: var(--md-sys-color-surface-variant); border-radius: 8px;"
    >
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
      <ui-option value="second" disabled>Second Option (Disabled)</ui-option>
      <ui-option value="third">Third Option</ui-option>
      <ui-option value="fourth" disabled>Fourth Option (Disabled)</ui-option>
      <ui-option value="fifth" disabled>Fifth Option (Disabled)</ui-option>
      <ui-option value="sixth">Sixth Option</ui-option>
      <ui-option value="seventh">Seventh Option</ui-option>
      <ui-option value="eighth" disabled>Eighth Option (Disabled)</ui-option>
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
</template>
