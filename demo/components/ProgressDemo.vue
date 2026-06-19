<script setup lang="ts">
import { ref } from 'vue'
import '../../src/components/progress/ui-progress.js'
import '../../src/components/progress/ui-circular-progress.js'
import '../../src/components/button/ui-button.js'

const repeat = ref(0)
const maxRepeat = 5
const animating = ref(false)

const startProgress = () => {
  const progress = document.querySelector('ui-progress') as any
  const button = document.querySelector('ui-button') as any
  repeat.value = 0
  progress.value = progress.min
  progress.style.setProperty('--ui-progress-scale-duration', '0')
  button.disabled = true
  if (!animating.value) {
    nextProgress()
  }
}

const nextProgress = () => {
  const progress = document.querySelector('ui-progress') as any
  const button = document.querySelector('ui-button') as any
  animating.value = true
  if (progress.value < progress.max) {
    progress.value += progress.step || 1
  } else {
    repeat.value++
    if (repeat.value >= maxRepeat) {
      animating.value = false
      button.disabled = false
      return
    }
    progress.value = progress.min
  }
  requestAnimationFrame(nextProgress)
}
</script>

<template>
  <section class="demo-section">
    <h2 class="title-large">Imperative control</h2>
    <p>
      Once started, loops 5 times before stopping.
      <ui-button color="elevated" @click="startProgress" id="start">Start</ui-button>
    </p>
    <ui-progress id="progress" aria-label="Imperative control"></ui-progress>
  </section>

  <section class="demo-section">
    <h2 class="title-large">Indeterminate value</h2>
    <div class="demo-row">
      <ui-progress indeterminate="true" aria-label="indeterminate progress"></ui-progress>
    </div>
    <div class="demo-row">
      <ui-progress indeterminate="true" class="slow" aria-label="slow indeterminate progress"></ui-progress>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="title-large">Styling</h2>
    <div class="demo-row">
      <ui-progress
        value="40"
        secondaryProgress="80"
        class="blue"
        aria-label="Blue progress with a secondary progress"
      ></ui-progress>
    </div>
    <div class="demo-row">
      <ui-progress value="800" min="100" max="1000" class="red" aria-label="Red progress"></ui-progress>
    </div>
    <div class="demo-row">
      <ui-progress value="60" class="green" aria-label="green progress"></ui-progress>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="title-large">Disabled state</h2>
    <div class="demo-row">
      <ui-progress value="40" secondaryProgress="80" disabled="true" aria-label="Disabled progress"></ui-progress>
    </div>
    <div class="demo-row">
      <ui-progress indeterminate="true" disabled="true" aria-label="Disabled indeterminate progress"></ui-progress>
    </div>
  </section>

  <section class="demo-section secondary">
    <h2 class="title-large">Timeline</h2>
    <p>0 - 12 (Δ 12)</p>
    <ui-progress value="0" secondaryProgress="12" max="328" aria-label="Value 1"></ui-progress>
    <p>12 - 15 (Δ 3)</p>
    <ui-progress value="12" secondaryProgress="15" max="328" aria-label="Value 2"></ui-progress>
    <p>15 - 204 (Δ {{ 204 - 15 }})</p>
    <ui-progress value="15" secondaryProgress="204" max="328" aria-label="Value 3"></ui-progress>
    <p>204 - 254 (Δ {{ 254 - 204 }})</p>
    <ui-progress value="204" secondaryProgress="254" max="328" aria-label="Value 4"></ui-progress>
    <p>254 - 254 (Δ 0)</p>
    <ui-progress value="254" secondaryProgress="254" max="328" aria-label="Value 5"></ui-progress>
    <p>254 - 328 (Δ {{ 328 - 254 }})</p>
    <ui-progress value="254" secondaryProgress="328" max="328" aria-label="Value 6"></ui-progress>
  </section>

  <section class="demo-section">
    <h2 class="title-large">Circular Progress</h2>
    <div class="demo-row">
      <ui-circular-progress value="40" max="100" aria-label="Circular progress"></ui-circular-progress>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="title-large">Circular Indeterminate Progress</h2>
    <div class="demo-row">
      <ui-circular-progress indeterminate="true" aria-label="Circular indeterminate progress"></ui-circular-progress>
    </div>
  </section>
</template>
