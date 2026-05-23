<script setup lang="ts">
import { ref } from 'vue'
import '../../src/components/icon-button/ui-icon-button.js'
import '../../src/components/icons/ui-icon.js'

const size = ref('s')
const shape = ref('round')
const width = ref('default')

const clickHandler = (e: Event) => {
  const button = e.target as HTMLElement
  console.log(`A ${button.localName} button was clicked.`)
}

const activeHandler = (e: Event) => {
  const button = e.target as any
  console.log(`A ${button.localName} button was ${button.selected ? 'activated' : 'deactivated'}`)
}

const handleSizeChange = (e: Event) => {
  const select = e.target as HTMLSelectElement
  size.value = select.value
}

const handleShapeChange = (e: Event) => {
  const select = e.target as HTMLSelectElement
  shape.value = select.value
}

const handleWidthChange = (e: Event) => {
  const select = e.target as HTMLSelectElement
  width.value = select.value
}
</script>

<template>
  <div class="demo-page">
    <section class="demo-section">
      <h2 class="title-large">Configuration</h2>
      <div class="md-select outlined">
        <label for="size">Size</label>
        <select class="md-select" id="size" @change="handleSizeChange" :value="size">
          <option value="xs">Extra small</option>
          <option value="s">Small</option>
          <option value="m">Medium</option>
          <option value="l">Large</option>
          <option value="xl">Extra large</option>
        </select>
      </div>
      <div class="md-select outlined">
        <label for="shape">Shape</label>
        <select id="shape" @change="handleShapeChange" :value="shape">
          <option value="round">Round</option>
          <option value="square">Square</option>
        </select>
      </div>
      <div class="md-select outlined">
        <label for="width">Width</label>
        <select id="width" @change="handleWidthChange" :value="width">
          <option value="default">Default</option>
          <option value="narrow">Narrow</option>
          <option value="wide">Wide</option>
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
        <ui-icon-button color="filled" :size="size" :shape="shape" :width="width"><ui-icon icon="settings"></ui-icon></ui-icon-button>
        <ui-icon-button color="filled" :size="size" :shape="shape" :width="width" toggle><ui-icon icon="settings"></ui-icon></ui-icon-button>
        <ui-icon-button color="filled" :size="size" :shape="shape" :width="width" toggle selected><ui-icon icon="settings"></ui-icon></ui-icon-button>
        <span class="legend-marker">B</span>
        <ui-icon-button color="tonal" :size="size" :shape="shape" :width="width"><ui-icon icon="settings"></ui-icon></ui-icon-button>
        <ui-icon-button color="tonal" :size="size" :shape="shape" :width="width" toggle><ui-icon icon="settings"></ui-icon></ui-icon-button>
        <ui-icon-button color="tonal" :size="size" :shape="shape" :width="width" toggle selected><ui-icon icon="settings"></ui-icon></ui-icon-button>
        <span class="legend-marker">C</span>
        <ui-icon-button color="outlined" :size="size" :shape="shape" :width="width"><ui-icon icon="settings"></ui-icon></ui-icon-button>
        <ui-icon-button color="outlined" :size="size" :shape="shape" :width="width" toggle><ui-icon icon="settings"></ui-icon></ui-icon-button>
        <ui-icon-button color="outlined" :size="size" :shape="shape" :width="width" toggle selected><ui-icon icon="settings"></ui-icon></ui-icon-button>
        <span class="legend-marker">D</span>
        <ui-icon-button :size="size" :shape="shape" :width="width"><ui-icon icon="settings"></ui-icon></ui-icon-button>
        <ui-icon-button :size="size" :shape="shape" :width="width" toggle><ui-icon icon="settings"></ui-icon></ui-icon-button>
        <ui-icon-button :size="size" :shape="shape" :width="width" toggle selected><ui-icon icon="settings"></ui-icon></ui-icon-button>
      </div>
      <p class="body-medium">A. Filled, B. Tonal, C. Outlined, D. Standard</p>
      <ol class="decimal body-medium">
        <li>Default</li>
        <li>Toggle: unselected</li>
        <li>Toggle: selected</li>
      </ol>
    </section>
  </div>
</template>
