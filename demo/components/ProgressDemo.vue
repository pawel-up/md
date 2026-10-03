<script setup lang="ts">
import { ref } from 'vue'
import '../../src/components/progress/ui-progress.js'
import '../../src/components/progress/ui-circular-progress.js'
import '../../src/components/button/ui-button.js'

const repeat = ref(0)
const maxRepeat = 5
const animating = ref(false)
const wavyProgressValue = ref(50)
const hideStopIndicator = ref(false)

const startProgress = () => {
  const progress = document.querySelector('ui-progress')
  const button = document.querySelector('ui-button')
  if (!progress || !button) return
  repeat.value = 0
  progress.value = progress.min
  progress.style.setProperty('--ui-progress-scale-duration', '0')
  button.disabled = true
  if (!animating.value) {
    nextProgress()
  }
}

const nextProgress = () => {
  const progress = document.querySelector('ui-progress')
  const button = document.querySelector('ui-button')
  if (!progress || !button) return
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

  <section class="demo-section">
    <h2 class="title-large">Wavy Progress (Material 3 Expressive)</h2>
    <div class="demo-row" style="margin-bottom: 16px; display: flex; gap: 24px; align-items: center;">
      <label style="display: flex; align-items: center; gap: 8px;">
        Value: <strong>{{ wavyProgressValue }}%</strong>
        <input type="range" min="0" max="100" v-model.number="wavyProgressValue" />
      </label>
      <label style="display: flex; align-items: center; gap: 6px;">
        <input type="checkbox" v-model="hideStopIndicator" />
        Hide stop indicator
      </label>
    </div>
    <div class="demo-row">
      <p>Standard 4dp (10dp height) - flattens at 100%</p>
      <ui-progress
        wavy
        :value="wavyProgressValue"
        max="100"
        :hide-stop-indicator="hideStopIndicator ? true : undefined"
        aria-label="Wavy progress 4dp"
      ></ui-progress>
    </div>
    <div class="demo-row">
      <p>Thick 8dp (14dp height) - flattens at 100%</p>
      <ui-progress
        wavy
        thick
        :value="wavyProgressValue"
        max="100"
        :hide-stop-indicator="hideStopIndicator ? true : undefined"
        aria-label="Wavy progress 8dp"
      ></ui-progress>
    </div>
    <div class="demo-row">
      <p>Indeterminate wavy (animated traveling segment on fixed track)</p>
      <ui-progress wavy indeterminate="true" aria-label="Wavy indeterminate progress"></ui-progress>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="title-large">Wavy Circular Progress (Material 3 Expressive)</h2>
    <div class="demo-row" style="display: flex; gap: 32px; align-items: center;">
      <div>
        <p>Standard 4dp (48dp)</p>
        <ui-circular-progress
          wavy
          :value="wavyProgressValue"
          max="100"
          aria-label="Wavy circular 4dp"
        ></ui-circular-progress>
      </div>
      <div>
        <p>Thick 8dp (52dp)</p>
        <ui-circular-progress
          wavy
          thick
          :value="wavyProgressValue"
          max="100"
          aria-label="Wavy circular 8dp"
        ></ui-circular-progress>
      </div>
      <div>
        <p>Indeterminate (rotating arc)</p>
        <ui-circular-progress wavy indeterminate="true" aria-label="Wavy circular indeterminate"></ui-circular-progress>
      </div>
    </div>
  </section>
</template>

<style>
  .slow {
    --ui-progress-indeterminate-cycle-duration: 6s;
    --ui-circular-progress-arc-duration: 3000ms;
  }

  .blue {
    --ui-progress-primary-progress-color: var(--md-sys-color-primary, #1976d2);
    --ui-progress-secondary-progress-color: var(--md-sys-color-secondary, #90caf9);
  }

  .red {
    --ui-progress-primary-progress-color: var(--md-sys-color-error, #ba1a1a);
  }

  .green {
    --ui-progress-primary-progress-color: var(--md-sys-color-tertiary, #386a20);
  }

  .demo-section.secondary ui-progress {
    --ui-progress-height: 12px;
    --ui-progress-track-color: var(--md-sys-color-surface-variant);
    --ui-progress-primary-progress-color: var(--md-sys-color-surface-variant);
    --ui-progress-secondary-progress-color: #4a4;
  }
</style>
