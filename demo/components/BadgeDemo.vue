<script setup lang="ts">
import { ref, computed } from 'vue'
import '../../src/components/badge/ui-badge.js'
import '../../src/components/icons/ui-icon.js'
import '../../src/components/icon-button/ui-icon-button.js'
import '../../src/components/button/ui-button.js'

const count = ref<number | ''>(5)
const max = ref<number | undefined>(99)
const isDot = ref<boolean>(false)
const isAttached = ref<boolean>(true)
const selectedTheme = ref<'error' | 'primary' | 'tertiary'>('error')

const formattedCount = computed(() => {
  if (count.value === '') return ''
  const num = Number(count.value)
  if (max.value !== undefined && !Number.isNaN(num) && num > max.value) {
    return `${max.value}+`
  }
  return String(count.value)
})

const increment = (amount: number): void => {
  const current = typeof count.value === 'number' ? count.value : 0
  count.value = current + amount
}

const decrement = (): void => {
  const current = typeof count.value === 'number' ? count.value : 0
  count.value = Math.max(0, current - 1)
}

const clearCount = (): void => {
  count.value = ''
}
</script>

<template>
  <div class="demo-page">
    <!-- Interactive Playground -->
    <section class="demo-section">
      <h2 class="title-large">Interactive Playground</h2>
      <p>Configure and test badge behaviors dynamically using slotted content.</p>

      <div class="controls-row">
        <div class="control-group">
          <label class="control-label">Count / Value</label>
          <div class="button-row">
            <button class="action-btn" @click="decrement">-1</button>
            <span class="value-display">{{ count === '' ? '(empty)' : count }}</span>
            <button class="action-btn" @click="increment(1)">+1</button>
            <button class="action-btn" @click="increment(10)">+10</button>
            <button class="action-btn" @click="clearCount">Dot (empty)</button>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label" for="max-select">Author Overflow Formatting</label>
          <select
            id="max-select"
            class="md-select"
            :value="max ?? 'none'"
            @change="(e) => {
              const val = (e.target as HTMLSelectElement).value
              max = val === 'none' ? undefined : Number(val)
            }"
          >
            <option value="none">No max format</option>
            <option value="9">Format over 9 as 9+</option>
            <option value="99">Format over 99 as 99+</option>
            <option value="999">Format over 999 as 999+</option>
          </select>
        </div>

        <div class="control-group toggle-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="isDot" />
            Force Dot
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="isAttached" />
            Attach to Icon
          </label>
        </div>
      </div>

      <div class="preview-box">
        <div class="anchor-target" v-if="isAttached">
          <ui-icon>mail</ui-icon>
          <ui-badge
            attached
            :dot="isDot"
            :class="`theme-${selectedTheme}`"
          >{{ formattedCount }}</ui-badge>
        </div>
        <div class="standalone-target" v-else>
          <span>Standalone: </span>
          <ui-badge
            :dot="isDot"
            :class="`theme-${selectedTheme}`"
          >{{ formattedCount }}</ui-badge>
        </div>
      </div>
    </section>

    <!-- Small Badge (Dot Indicator) -->
    <section class="demo-section">
      <h2 class="title-large">Small Badge (Dot Indicator)</h2>
      <p>
        The small badge is a 6dp × 6dp dot with a 3dp corner radius. It is rendered when the badge has no slotted content,
        or when the <code>dot</code> attribute is explicitly set.
      </p>

      <div class="demo-row items-row">
        <div class="item-card">
          <div class="icon-anchor">
            <ui-icon>notifications</ui-icon>
            <ui-badge attached></ui-badge>
          </div>
          <span class="caption">On Notification Icon</span>
        </div>

        <div class="item-card">
          <div class="icon-anchor">
            <ui-icon>chat_bubble</ui-icon>
            <ui-badge attached dot>5</ui-badge>
          </div>
          <span class="caption">Force Dot Attribute</span>
        </div>

        <div class="item-card">
          <div class="inline-item">
            <span>Status indicator:</span>
            <ui-badge></ui-badge>
          </div>
          <span class="caption">Standalone Inline</span>
        </div>
      </div>
    </section>

    <!-- Large Badge (Counts & Values) -->
    <section class="demo-section">
      <h2 class="title-large">Large Badge (Numeric Counts)</h2>
      <p>
        Large badges have a 16dp height and 8dp corner radius. Single-digit badges render as a 16×16dp circle, while
        multi-digit badges expand horizontally with 4dp padding. Content is supplied directly through slots.
      </p>

      <div class="demo-row items-row">
        <div class="item-card">
          <ui-badge>1</ui-badge>
          <span class="caption">1 Digit (16×16dp circle)</span>
        </div>

        <div class="item-card">
          <ui-badge>8</ui-badge>
          <span class="caption">1 Digit (Centered)</span>
        </div>

        <div class="item-card">
          <ui-badge>24</ui-badge>
          <span class="caption">2 Digits (Pill + 4dp pad)</span>
        </div>

        <div class="item-card">
          <ui-badge>128</ui-badge>
          <span class="caption">3 Digits</span>
        </div>

        <div class="item-card">
          <ui-badge>99+</ui-badge>
          <span class="caption">Author Overflow (99+)</span>
        </div>

        <div class="item-card">
          <ui-badge>999+</ui-badge>
          <span class="caption">Author Overflow (999+)</span>
        </div>

        <div class="item-card">
          <ui-badge>NEW</ui-badge>
          <span class="caption">Text Label</span>
        </div>
      </div>
    </section>

    <!-- Attached on Controls -->
    <section class="demo-section">
      <h2 class="title-large">Attached on Controls & Buttons</h2>
      <p>Badges can be attached to standard action triggers and icon buttons via `attached`.</p>

      <div class="demo-row items-row">
        <div class="control-anchor">
          <ui-icon-button color="standard">
            <ui-icon>inbox</ui-icon>
          </ui-icon-button>
          <ui-badge attached>3</ui-badge>
        </div>

        <div class="control-anchor">
          <ui-icon-button color="tonal">
            <ui-icon>shopping_cart</ui-icon>
          </ui-icon-button>
          <ui-badge attached>12</ui-badge>
        </div>

        <div class="control-anchor">
          <ui-icon-button color="filled">
            <ui-icon>notifications</ui-icon>
          </ui-icon-button>
          <ui-badge attached></ui-badge>
        </div>

        <div class="control-anchor">
          <ui-button color="tonal">
            <ui-icon slot="icon">email</ui-icon>
            Messages
          </ui-button>
          <ui-badge attached style="--ui-badge-offset-x: -4px">99+</ui-badge>
        </div>
      </div>
    </section>

    <!-- Theming & Color Variations -->
    <section class="demo-section">
      <h2 class="title-large">Color Customization</h2>
      <p>Badges use the Error role by default, but can be customized with CSS custom properties.</p>

      <div class="demo-row items-row">
        <div class="item-card">
          <ui-badge>99+</ui-badge>
          <span class="caption">Error (Default M3)</span>
        </div>

        <div class="item-card">
          <ui-badge
            style="--ui-badge-color: var(--md-sys-color-primary); --ui-badge-label-color: var(--md-sys-color-on-primary);"
          >99+</ui-badge>
          <span class="caption">Primary Color</span>
        </div>

        <div class="item-card">
          <ui-badge
            style="--ui-badge-color: var(--md-sys-color-tertiary); --ui-badge-label-color: var(--md-sys-color-on-tertiary);"
          >99+</ui-badge>
          <span class="caption">Tertiary Color</span>
        </div>

        <div class="item-card">
          <ui-badge
            dot
            style="--ui-badge-color: var(--md-sys-color-primary);"
          ></ui-badge>
          <span class="caption">Primary Dot</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.demo-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 16px 0;
}

.demo-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-bottom: 1px solid var(--md-sys-color-outline-variant, #e0e0e0);
  padding-bottom: 24px;
}

.title-large {
  font-family: var(--md-sys-typescale-title-large-font, Roboto, sans-serif);
  font-size: var(--md-sys-typescale-title-large-size, 22px);
  margin: 0;
  color: var(--md-sys-color-on-surface, #1f1f1f);
}

.controls-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
  background: var(--md-sys-color-surface-container, #f3f3f3);
  padding: 16px;
  border-radius: 12px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--md-sys-color-on-surface-variant, #666);
}

.button-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--md-sys-color-outline, #ccc);
  background: var(--md-sys-color-surface, #fff);
  color: var(--md-sys-color-on-surface, #1f1f1f);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.action-btn:hover {
  background: var(--md-sys-color-surface-container-high, #e8e8e8);
}

.value-display {
  font-weight: 600;
  min-width: 40px;
  text-align: center;
}

.toggle-group {
  flex-direction: row;
  align-items: center;
  gap: 16px;
  margin-top: 18px;
}

.checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  cursor: pointer;
}

.preview-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: var(--md-sys-color-surface-container-low, #f8f8f8);
  border-radius: 16px;
  min-height: 100px;
}

.anchor-target {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
}

.anchor-target ui-icon {
  font-size: 32px;
  --md-icon-size: 32px;
}

.standalone-target {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
}

.items-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 32px;
}

.item-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 80px;
}

.icon-anchor {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.inline-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.caption {
  font-size: 12px;
  color: var(--md-sys-color-on-surface-variant, #666);
  text-align: center;
}

.control-anchor {
  position: relative;
  display: inline-flex;
}
</style>
