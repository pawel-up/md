<template>
  <div class="demo">
    <section class="demo-section">
      <h2 class="title-large">Configuration</h2>
      <div class="md-select outlined">
        <label for="size">Size</label>
        <select id="size" v-model="size" class="md-select">
          <option value="xs">Extra small</option>
          <option value="s">Small</option>
          <option value="m">Medium</option>
          <option value="l">Large</option>
          <option value="xl">Extra large</option>
        </select>
      </div>
      <div class="md-select outlined">
        <label for="shape">Shape</label>
        <select id="shape" v-model="shape" class="md-select">
          <option value="round">Round</option>
          <option value="square">Square</option>
        </select>
      </div>
    </section>

    <section :class="['demo-section', size]">
      <h2 class="display-large">Color</h2>
      <div class="color-grid">
        <span>&nbsp;</span>
        <span class="legend-marker">1</span>
        <span class="legend-marker">2</span>
        <span class="legend-marker">3</span>
        
        <span class="legend-marker">A</span>
        <ui-button color="elevated" :size="size" :shape="shape"><ui-icon slot="icon" icon="edit"></ui-icon>elevated button</ui-button>
        <ui-button color="elevated" :size="size" :shape="shape" toggle><ui-icon slot="icon" icon="edit"></ui-icon>elevated unselected</ui-button>
        <ui-button color="elevated" :size="size" :shape="shape" toggle selected><ui-icon slot="icon" icon="edit"></ui-icon>elevated selected</ui-button>
        
        <span class="legend-marker">B</span>
        <ui-button color="filled" :size="size" :shape="shape"><ui-icon slot="icon" icon="edit"></ui-icon>filled button</ui-button>
        <ui-button color="filled" :size="size" :shape="shape" toggle><ui-icon slot="icon" icon="edit"></ui-icon>filled unselected</ui-button>
        <ui-button color="filled" :size="size" :shape="shape" toggle selected><ui-icon slot="icon" icon="edit"></ui-icon>filled selected</ui-button>
        
        <span class="legend-marker">C</span>
        <ui-button color="tonal" :size="size" :shape="shape"><ui-icon slot="icon" icon="edit"></ui-icon>tonal button</ui-button>
        <ui-button color="tonal" :size="size" :shape="shape" toggle><ui-icon slot="icon" icon="edit"></ui-icon>tonal unselected</ui-button>
        <ui-button color="tonal" :size="size" :shape="shape" toggle selected><ui-icon slot="icon" icon="edit"></ui-icon>tonal selected</ui-button>
        
        <span class="legend-marker">D</span>
        <ui-button color="outlined" :size="size" :shape="shape"><ui-icon slot="icon" icon="edit"></ui-icon>outlined button</ui-button>
        <ui-button color="outlined" :size="size" :shape="shape" toggle><ui-icon slot="icon" icon="edit"></ui-icon>outlined unselected</ui-button>
        <ui-button color="outlined" :size="size" :shape="shape" toggle selected><ui-icon slot="icon" icon="edit"></ui-icon>outlined selected</ui-button>
        
        <span class="legend-marker">E</span>
        <ui-button color="text" :size="size" :shape="shape"><ui-icon slot="icon" icon="edit"></ui-icon>text button</ui-button>
        <span></span>
        <span></span>
      </div>
      <p class="body-medium">A. Elevated, B. Filled, C. Tonal, D. Outlined, E. Text</p>
      <ol class="decimal body-medium">
        <li>Default</li>
        <li>Toggle: unselected</li>
        <li>Toggle: selected</li>
      </ol>
    </section>

    <!-- States sections -->
    <template v-for="type in ['elevated', 'filled', 'tonal', 'outlined']" :key="type">
      <section :class="['demo-section', size]">
        <h3 class="headline-medium">{{ type }} button states</h3>

        <div class="state-grid">
          <span>&nbsp;</span>
          <span class="legend-marker">1</span>
          <span class="legend-marker">2</span>
          <span class="legend-marker">3</span>
          
          <span class="legend-marker">A</span>
          <ui-button :color="type" :size="size" :shape="shape">enabled</ui-button>
          <ui-button :color="type" :size="size" :shape="shape" toggle>enabled</ui-button>
          <ui-button :color="type" :size="size" :shape="shape" toggle selected>enabled</ui-button>
          
          <span class="legend-marker">B</span>
          <ui-button :color="type" :size="size" :shape="shape" disabled>disabled</ui-button>
          <ui-button :color="type" :size="size" :shape="shape" toggle disabled>disabled</ui-button>
          <ui-button :color="type" :size="size" :shape="shape" toggle selected disabled>disabled</ui-button>
        </div>
        <p class="body-medium">A. Enabled, B. Disabled</p>
        <ol class="decimal body-medium">
          <li>Default</li>
          <li>Toggle: unselected</li>
          <li>Toggle: selected</li>
        </ol>
      </section>
    </template>

    <section :class="['demo-section', size]">
      <h3 class="headline-medium">Text button states</h3>

      <div class="state-grid">
        <span>&nbsp;</span>
        <span class="legend-marker">1</span>
        <span></span>
        <span></span>
        
        <span class="legend-marker">A</span>
        <ui-button color="text" :size="size" :shape="shape">enabled</ui-button>
        <span></span>
        <span></span>
        
        <span class="legend-marker">B</span>
        <ui-button color="text" :size="size" :shape="shape" disabled>disabled</ui-button>
        <span></span>
        <span></span>
      </div>
      <p class="body-medium">A. Enabled, B. Disabled</p>
      <ol class="decimal body-medium">
        <li>Default</li>
      </ol>
    </section>

    <section :class="['demo-section', size]">
      <h2 class="display-large">A submit button within a form</h2>
      <div class="frame">
        <form method="GET" action="#" @submit="submitHandler">
          <label for="formInput">An input</label>
          <input type="text" id="formInput" required name="input" />
          <label for="checkboxInput">A checkbox</label>
          <input type="checkbox" id="checkboxInput" name="flag" />
          <br/><br/>
          <ui-button name="submit" value="on" type="submit">Submit</ui-button>
        </form>
      </div>
    </section>

    <section :class="['demo-section', size]">
      <h2 class="display-large">A submit button outside a form</h2>
      <div class="frame">
        <form method="GET" action="#" @submit="submitHandler" id="myForm">
          <label for="formInput2">An input</label>
          <input type="text" id="formInput2" required name="input" />
          <label for="checkboxInput2">A checkbox</label>
          <input type="checkbox" id="checkboxInput2" name="flag" />
        </form>
        <div style="margin-top: 16px;">
          <ui-button name="submit" value="on" type="submit" form="myForm">Submit</ui-button>
        </div>
      </div>
    </section>

    <section :class="['demo-section', size]">
      <h2 class="display-large">Buttons in a dialog</h2>
      <div class="frame">
        <ui-button @click="openDialog">Open dialog</ui-button>
      </div>
      <!-- Note: lit property bindings are used with .prop in vue or just bound directly if custom elements support attrs -->
      <ui-dialog :open="dialogOpened" @close="dialogClosed" modal>
        <span slot="title">Dialog with a form</span>
        <form method="GET" action="#" @submit="submitHandler" id="dialogForm">
          <label for="formInput3">An input</label>
          <input type="text" id="formInput3" required name="input" />
          <label for="checkboxInput3">A checkbox</label>
          <input type="checkbox" id="checkboxInput3" name="flag" />
        </form>
        <ui-button color="text" slot="button" value="dismiss" @click="dialogClosed">Dismiss</ui-button>
        <ui-button color="text" slot="button" name="submit" value="confirm" type="submit" form="dialogForm">Submit</ui-button>
      </ui-dialog>
    </section>

    <output v-if="formValues">
      <code><pre>{{ formValues }}</pre></code>
    </output>

  </div>
</template>

<script setup lang="ts">
import '../../src/components/button/ui-button.ts'
import '../../src/components/icons/ui-icon.ts'
import '../../src/components/dialog/ui-dialog.ts'
import '../../src/components/text-field/ui-outlined-text-field.ts'
import '../../src/components/text-field/ui-filled-text-field.ts'

import { ref } from 'vue'

const size = ref('s')
const shape = ref('round')
const dialogOpened = ref(false)
const formValues = ref('')

const submitHandler = (e: SubmitEvent) => {
  e.preventDefault()
  const form = e.target as HTMLFormElement
  const values = Array.from(new FormData(form))
  const serialized = new URLSearchParams(values as unknown as [string, string][]).toString()
  formValues.value = serialized
  dialogOpened.value = false
}

const openDialog = () => {
  dialogOpened.value = true
}

const dialogClosed = () => {
  dialogOpened.value = false
}
</script>
