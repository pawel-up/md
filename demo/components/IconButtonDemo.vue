<script setup lang="ts">
import { ref } from 'vue'
import type { UiIconButtonElement } from '../../src/components/icon-button/ui-icon-button.js'
import '../../src/components/icon-button/ui-icon-button.js'
import '../../src/components/icons/ui-icon.js'

const size = ref<'xs' | 's' | 'm' | 'l' | 'xl'>('s')
const shape = ref<'round' | 'square'>('round')
const width = ref<'default' | 'narrow' | 'wide'>('default')

const clickHandler = (e: Event): void => {
  const button = e.target as HTMLElement
  console.log(`A ${button.localName} button was clicked.`)
}

const activeHandler = (e: Event): void => {
  const button = e.target as UiIconButtonElement
  console.log(`A ${button.localName} button was ${button.selected ? 'activated' : 'deactivated'}`)
}

const handleSizeChange = (e: Event): void => {
  const select = e.target as HTMLSelectElement
  size.value = select.value as 'xs' | 's' | 'm' | 'l' | 'xl'
}

const handleShapeChange = (e: Event): void => {
  const select = e.target as HTMLSelectElement
  shape.value = select.value as 'round' | 'square'
}

const handleWidthChange = (e: Event): void => {
  const select = e.target as HTMLSelectElement
  width.value = select.value as 'default' | 'narrow' | 'wide'
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
        <ui-icon-button color="elevated" :size="size" :shape="shape" :width="width" @click="clickHandler">
          <ui-icon icon="settings"></ui-icon>
        </ui-icon-button>
        <ui-icon-button color="elevated" :size="size" :shape="shape" :width="width" toggle="true" @toggle="activeHandler">
          <ui-icon icon="settings"></ui-icon>
        </ui-icon-button>
        <ui-icon-button color="elevated" :size="size" :shape="shape" :width="width" toggle="true" selected="true" @toggle="activeHandler">
          <ui-icon icon="settings"></ui-icon>
        </ui-icon-button>

        <span class="legend-marker">B</span>
        <ui-icon-button color="filled" :size="size" :shape="shape" :width="width" @click="clickHandler">
          <ui-icon icon="settings"></ui-icon>
        </ui-icon-button>
        <ui-icon-button color="filled" :size="size" :shape="shape" :width="width" toggle="true" @toggle="activeHandler">
          <ui-icon icon="settings"></ui-icon>
        </ui-icon-button>
        <ui-icon-button color="filled" :size="size" :shape="shape" :width="width" toggle="true" selected="true" @toggle="activeHandler">
          <ui-icon icon="settings"></ui-icon>
        </ui-icon-button>

        <span class="legend-marker">C</span>
        <ui-icon-button color="tonal" :size="size" :shape="shape" :width="width" @click="clickHandler">
          <ui-icon icon="settings"></ui-icon>
        </ui-icon-button>
        <ui-icon-button color="tonal" :size="size" :shape="shape" :width="width" toggle="true" @toggle="activeHandler">
          <ui-icon icon="settings"></ui-icon>
        </ui-icon-button>
        <ui-icon-button color="tonal" :size="size" :shape="shape" :width="width" toggle="true" selected="true" @toggle="activeHandler">
          <ui-icon icon="settings"></ui-icon>
        </ui-icon-button>

        <span class="legend-marker">D</span>
        <ui-icon-button color="outlined" :size="size" :shape="shape" :width="width" @click="clickHandler">
          <ui-icon icon="settings"></ui-icon>
        </ui-icon-button>
        <ui-icon-button color="outlined" :size="size" :shape="shape" :width="width" toggle="true" @toggle="activeHandler">
          <ui-icon icon="settings"></ui-icon>
        </ui-icon-button>
        <ui-icon-button color="outlined" :size="size" :shape="shape" :width="width" toggle="true" selected="true" @toggle="activeHandler">
          <ui-icon icon="settings"></ui-icon>
        </ui-icon-button>

        <span class="legend-marker">E</span>
        <ui-icon-button color="standard" :size="size" :shape="shape" :width="width" @click="clickHandler">
          <ui-icon icon="settings"></ui-icon>
        </ui-icon-button>
        <ui-icon-button color="standard" :size="size" :shape="shape" :width="width" toggle="true" @toggle="activeHandler">
          <ui-icon icon="settings"></ui-icon>
        </ui-icon-button>
        <ui-icon-button color="standard" :size="size" :shape="shape" :width="width" toggle="true" selected="true" @toggle="activeHandler">
          <ui-icon icon="settings"></ui-icon>
        </ui-icon-button>
      </div>
      <p class="body-medium">A. Elevated, B. Filled, C. Tonal, D. Outlined, E. Standard</p>
      <ol class="decimal body-medium">
        <li>Default</li>
        <li>Toggle: unselected</li>
        <li>Toggle: selected (morphs to opposite shape)</li>
      </ol>
    </section>

    <!-- States sections -->
    <template v-for="type in ['elevated', 'filled', 'tonal', 'outlined', 'standard']" :key="type">
      <section :class="['demo-section', size]">
        <h3 class="headline-medium">{{ type }} icon button states</h3>

        <div class="state-grid">
          <span>&nbsp;</span>
          <span class="legend-marker">1</span>
          <span class="legend-marker">2</span>
          <span class="legend-marker">3</span>

          <span class="legend-marker">A</span>
          <ui-icon-button :color="type" :size="size" :shape="shape" :width="width">
            <ui-icon icon="settings"></ui-icon>
          </ui-icon-button>
          <ui-icon-button :color="type" :size="size" :shape="shape" :width="width" toggle="true">
            <ui-icon icon="settings"></ui-icon>
          </ui-icon-button>
          <ui-icon-button :color="type" :size="size" :shape="shape" :width="width" toggle="true" selected="true">
            <ui-icon icon="settings"></ui-icon>
          </ui-icon-button>

          <span class="legend-marker">B</span>
          <ui-icon-button :color="type" :size="size" :shape="shape" :width="width" disabled="true">
            <ui-icon icon="settings"></ui-icon>
          </ui-icon-button>
          <ui-icon-button :color="type" :size="size" :shape="shape" :width="width" toggle="true" disabled="true">
            <ui-icon icon="settings"></ui-icon>
          </ui-icon-button>
          <ui-icon-button :color="type" :size="size" :shape="shape" :width="width" toggle="true" selected="true" disabled="true">
            <ui-icon icon="settings"></ui-icon>
          </ui-icon-button>
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
      <h3 class="headline-medium">Custom selected slot icon</h3>
      <p class="body-medium">Provides distinct icons for unselected and selected toggle states:</p>
      <div style="display: flex; gap: 16px; align-items: center; margin-top: 12px;">
        <ui-icon-button color="filled" toggle="true" :size="size" :shape="shape" :width="width">
          <ui-icon icon="bookmark_border"></ui-icon>
          <ui-icon slot="selected" icon="bookmark"></ui-icon>
        </ui-icon-button>
        <ui-icon-button color="tonal" toggle="true" :size="size" :shape="shape" :width="width">
          <ui-icon icon="favorite_border"></ui-icon>
          <ui-icon slot="selected" icon="favorite"></ui-icon>
        </ui-icon-button>
        <ui-icon-button color="standard" toggle="true" :size="size" :shape="shape" :width="width">
          <ui-icon icon="visibility"></ui-icon>
          <ui-icon slot="selected" icon="visibility_off"></ui-icon>
        </ui-icon-button>
      </div>
    </section>
  </div>
</template>
