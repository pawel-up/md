<script setup lang="ts">
import { ref } from 'vue'
import '../../src/components/button/ui-button.ts'
import '../../src/components/button/ui-button-group.ts'
import '../../src/components/icons/ui-icon.ts'

const size = ref('s')
const shape = ref('round')
const color = ref('filled')
</script>

<template>
  <section class="demo-section">
    <h2 class="title-large">Configuration</h2>
    <div class="md-select outlined">
      <label for="size">Size</label>
      <select class="md-select" id="size" v-model="size" name="size">
        <button>
          <selectedcontent></selectedcontent>
        </button>
        <option value="xs">Extra small</option>
        <option value="s">Small</option>
        <option value="m">Medium</option>
        <option value="l">Large</option>
        <option value="xl">Extra large</option>
      </select>
    </div>
    <div class="md-select outlined">
      <label for="shape">Shape</label>
      <select id="shape" v-model="shape" name="shape">
        <button>
          <selectedcontent></selectedcontent>
        </button>
        <option value="round">Round</option>
        <option value="square">Square</option>
      </select>
    </div>
    <div class="md-select outlined">
      <label for="color">Color</label>
      <select id="color" v-model="color" name="color">
        <button>
          <selectedcontent></selectedcontent>
        </button>
        <option value="elevated">Elevated</option>
        <option value="filled">Filled</option>
        <option value="outlined">Outlined</option>
        <option value="text">Text</option>
        <option value="tonal">Tonal</option>
      </select>
    </div>
  </section>

  <section :class="['demo-section', size]">
    <h2 class="display-large">Anatomy</h2>
    <div class="frame">
      <div class="demo-row">
        <ui-button-group :size="size">
          <ui-button color="tonal"><ui-icon slot="icon" icon="edit"></ui-icon></ui-button>
          <ui-button color="tonal"><ui-icon slot="icon" icon="edit"></ui-icon></ui-button>
          <ui-button color="tonal"><ui-icon slot="icon" icon="edit"></ui-icon>Three</ui-button>
          <ui-button color="tonal"><ui-icon slot="icon" icon="edit"></ui-icon></ui-button>
          <ui-button color="tonal"><ui-icon slot="icon" icon="edit"></ui-icon></ui-button>
        </ui-button-group>
      </div>
      <div class="demo-row">
        <ui-button-group type="connected" :size="size">
          <ui-button color="filled"><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
          <ui-button color="filled"><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
          <ui-button color="filled"><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
          <ui-button color="filled"><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
          <ui-button color="filled"><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
        </ui-button-group>
      </div>
    </div>

    <section :class="['demo-section', size]">
      <h2 class="display-large">States</h2>
      <h3 class="headline-medium">Connected button group</h3>

      <div class="frame">
        <h4 class="title-medium">Multi selection</h4>
        <div class="demo-row">
          <ui-button-group type="connected" :size="size" multiple>
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
          </ui-button-group>
        </div>

        <h4 class="title-medium">Single selection</h4>
        <div class="demo-row">
          <ui-button-group type="connected" :size="size">
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
          </ui-button-group>
        </div>
      </div>
    </section>

    <section :class="['demo-section', size]">
      <h3 class="headline-medium">Standard button group</h3>

      <div class="frame">
        <h4 class="title-medium">Multi selection</h4>
        <div class="demo-row">
          <ui-button-group type="standard" :size="size" multiple>
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
          </ui-button-group>
        </div>

        <h4 class="title-medium">Single selection</h4>
        <div class="demo-row">
          <ui-button-group type="standard" :size="size">
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
            <ui-button :color="color" toggle><ui-icon slot="icon" icon="edit"></ui-icon>Label</ui-button>
          </ui-button-group>
        </div>
      </div>
    </section>
  </section>
</template>
