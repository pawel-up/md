<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import '../../src/components/fab/ui-fab.js'
import '../../src/components/button/ui-button.js'
import '../../src/components/icon-button/ui-icon-button.js'
import '../../src/components/icons/ui-icon.js'

// Interactive Playground Configuration
const mode = ref<'single' | 'menu'>('menu')
const triggerType = ref<'icon' | 'button'>('icon')
const placement = ref<'inline' | 'bottom-end' | 'bottom-start' | 'top-start' | 'top-end'>('inline')
const triggerColor = ref<'elevated' | 'filled' | 'tonal' | 'outlined'>('elevated')
const itemCount = ref(3)

const isOpen = ref(false)

watch(mode, () => {
  isOpen.value = false
})

const eventLogs = ref<string[]>([])

const handleOpen = (): void => {
  isOpen.value = true
  eventLogs.value.unshift(`[${new Date().toLocaleTimeString()}] Event: 'open'`)
}

const handleClosing = (e: Event): void => {
  const customEvent = e as CustomEvent<{ reason?: string }>
  const reasonText = customEvent.detail?.reason ? ` (reason: '${customEvent.detail.reason}')` : ''
  eventLogs.value.unshift(`[${new Date().toLocaleTimeString()}] Event: 'closing'${reasonText}`)
}

const handleClose = (e: Event): void => {
  const customEvent = e as CustomEvent<{ reason?: string }>
  isOpen.value = false
  const reasonText = customEvent.detail?.reason ? ` (reason: '${customEvent.detail.reason}')` : ''
  eventLogs.value.unshift(`[${new Date().toLocaleTimeString()}] Event: 'close'${reasonText}`)
}

const handleChange = (e: Event): void => {
  const customEvent = e as CustomEvent<{ open: boolean }>
  isOpen.value = Boolean(customEvent.detail?.open)
  eventLogs.value.unshift(`[${new Date().toLocaleTimeString()}] Event: 'change' (open: ${customEvent.detail?.open})`)
}

const handleSelect = (e: Event): void => {
  const customEvent = e as CustomEvent<{ item: HTMLElement }>
  const text = customEvent.detail?.item?.textContent?.trim() || customEvent.detail?.item?.id || 'item'
  eventLogs.value.unshift(`[${new Date().toLocaleTimeString()}] Event: 'select' (item: "${text}")`)
}

const clearLogs = (): void => {
  eventLogs.value = []
}

// Available menu items for demo
const allItems = [
  { id: 'item-edit', icon: 'edit', label: 'Create document' },
  { id: 'item-share', icon: 'share', label: 'Share with team' },
  { id: 'item-fav', icon: 'favorite', label: 'Add to favorites' },
  { id: 'item-download', icon: 'fileDownload', label: 'Export file' },
  { id: 'item-key', icon: 'key', label: 'Manage access' },
]

const visibleItems = computed(() => allItems.slice(0, itemCount.value))

const generatedCode = computed(() => {
  if (mode.value === 'single') {
    const trigger =
      triggerType.value === 'icon'
        ? `  <ui-icon-button color="${triggerColor.value}" aria-label="Add item">\n    <ui-icon>add</ui-icon>\n  </ui-icon-button>`
        : `  <ui-button color="${triggerColor.value}">\n    <ui-icon slot="icon">add</ui-icon>\n    Create note\n  </ui-button>`
    return `<ui-fab placement="${placement.value}">\n${trigger}\n</ui-fab>`
  }

  const trigger =
    triggerType.value === 'icon'
      ? `  <!-- Developer switches icon or label using the change/open/close event -->\n  <ui-icon-button color="${triggerColor.value}" :aria-label="isOpen ? 'Close' : 'Actions'">\n    <ui-icon>{{ isOpen ? 'close' : 'add' }}</ui-icon>\n  </ui-icon-button>`
      : `  <!-- Developer switches icon or label using the change/open/close event -->\n  <ui-button color="${triggerColor.value}">\n    <ui-icon slot="icon">{{ isOpen ? 'close' : 'add' }}</ui-icon>\n    {{ isOpen ? 'Close' : 'Quick Actions' }}\n  </ui-button>`

  const menuMarkup = visibleItems.value
    .map(
      (item) =>
        `  <ui-button slot="menu" role="menuitem" color="elevated">\n    <ui-icon slot="icon">${item.icon}</ui-icon>\n    ${item.label}\n  </ui-button>`
    )
    .join('\n')

  return `<ui-fab placement="${placement.value}" @change="e => isOpen = e.detail.open">\n${trigger}\n\n${menuMarkup}\n</ui-fab>`
})
</script>

<template>
  <div class="demo fab-demo">
    <!-- Interactive Configurator Section -->
    <section class="demo-section">
      <h2 class="title-large">Interactive Playground</h2>
      <p class="body-medium">
        Configure the Floating Action Button below to test single action vs. menu modes, trigger types, placements, and animations.
        The trigger icon dynamically morphs between action and close via the component's <code>change</code> event.
      </p>

      <div class="controls-grid">
        <div class="md-select outlined">
          <label for="mode">Mode</label>
          <select id="mode" v-model="mode" class="md-select">
            <option value="single">Single action (no menu)</option>
            <option value="menu">FAB Menu</option>
          </select>
        </div>

        <div class="md-select outlined">
          <label for="triggerType">Trigger type</label>
          <select id="triggerType" v-model="triggerType" class="md-select">
            <option value="icon">Icon button</option>
            <option value="button">Regular button</option>
          </select>
        </div>

        <div class="md-select outlined">
          <label for="placement">Placement</label>
          <select id="placement" v-model="placement" class="md-select">
            <option value="inline">Inline (in frame)</option>
            <option value="bottom-end">Bottom End</option>
            <option value="bottom-start">Bottom Start</option>
            <option value="top-end">Top End</option>
            <option value="top-start">Top Start</option>
          </select>
        </div>

        <div class="md-select outlined">
          <label for="triggerColor">Trigger color</label>
          <select id="triggerColor" v-model="triggerColor" class="md-select">
            <option value="elevated">Elevated</option>
            <option value="filled">Filled</option>
            <option value="tonal">Tonal</option>
            <option value="outlined">Outlined</option>
          </select>
        </div>

        <div v-if="mode === 'menu'" class="md-select outlined">
          <label for="itemCount">Menu items (2–5)</label>
          <select id="itemCount" v-model.number="itemCount" class="md-select">
            <option :value="2">2 items</option>
            <option :value="3">3 items</option>
            <option :value="4">4 items</option>
            <option :value="5">5 items</option>
          </select>
        </div>
      </div>

      <!-- Preview Sandbox -->
      <div class="preview-card">
        <div class="preview-header">
          <span class="label-large">Live Preview (Click or press Space/Enter on trigger)</span>
        </div>

        <div class="preview-stage">
          <ui-fab
            :placement="placement"
            @open="handleOpen"
            @closing="handleClosing"
            @close="handleClose"
            @change="handleChange"
            @select="handleSelect"
          >
            <!-- Trigger: Icon Button -->
            <ui-icon-button
              v-if="triggerType === 'icon'"
              :color="triggerColor"
              :aria-label="isOpen && mode === 'menu' ? 'Close menu' : 'Quick actions'"
              size="m"
            >
              <ui-icon>{{ isOpen && mode === 'menu' ? 'close' : 'add' }}</ui-icon>
            </ui-icon-button>

            <!-- Trigger: Regular Button with Label -->
            <ui-button
              v-else
              :color="triggerColor"
              size="m"
            >
              <ui-icon slot="icon">{{ isOpen && mode === 'menu' ? 'close' : 'add' }}</ui-icon>
              {{ isOpen && mode === 'menu' ? 'Close' : 'Quick Actions' }}
            </ui-button>

            <!-- Menu Items -->
            <template v-if="mode === 'menu'">
              <ui-button
                v-for="item in visibleItems"
                :key="item.id"
                slot="menu"
                role="menuitem"
                color="tonal"
              >
                <ui-icon slot="icon">{{ item.icon }}</ui-icon>
                {{ item.label }}
              </ui-button>
            </template>
          </ui-fab>

          <span v-if="placement !== 'inline'" class="floating-badge">
            Floating on screen: {{ placement }}
          </span>
        </div>
      </div>

      <!-- Event Logs -->
      <div class="event-console">
        <div class="console-header">
          <span class="label-medium">Event Log</span>
          <button class="clear-btn" @click="clearLogs">Clear</button>
        </div>
        <div class="console-body">
          <div v-if="eventLogs.length === 0" class="console-empty">
            Interact with the FAB or menu items to see events.
          </div>
          <div v-for="(log, idx) in eventLogs" :key="idx" class="console-entry">
            {{ log }}
          </div>
        </div>
      </div>

      <!-- Generated Markup -->
      <div class="code-preview">
        <div class="code-header">Generated HTML & Usage</div>
        <pre><code>{{ generatedCode }}</code></pre>
      </div>
    </section>
  </div>
</template>

<style scoped>
.fab-demo {
  padding-bottom: 80px;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.preview-card {
  border: 1px solid var(--md-sys-color-outline-variant, #ccc);
  border-radius: 16px;
  background-color: var(--md-sys-color-surface-container-low, #f8f9fa);
  overflow: hidden;
  margin-bottom: 20px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: var(--md-sys-color-surface-container, #eef0f2);
  border-bottom: 1px solid var(--md-sys-color-outline-variant, #ccc);
}

.floating-badge {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  background-color: var(--md-sys-color-primary, #006874);
  color: var(--md-sys-color-on-primary, #fff);
}

.preview-stage {
  min-height: 280px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 32px;
  position: relative;
}

.event-console {
  border: 1px solid var(--md-sys-color-outline-variant, #ccc);
  border-radius: 12px;
  background-color: var(--md-sys-color-surface-container-lowest, #fff);
  margin-bottom: 24px;
  overflow: hidden;
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: var(--md-sys-color-surface-container, #eef0f2);
  border-bottom: 1px solid var(--md-sys-color-outline-variant, #ccc);
}

.clear-btn {
  background: none;
  border: none;
  color: var(--md-sys-color-primary, #006874);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
}

.console-body {
  max-height: 120px;
  overflow-y: auto;
  padding: 8px 16px;
  font-family: monospace;
  font-size: 0.82rem;
}

.console-empty {
  color: var(--md-sys-color-on-surface-variant, #666);
  font-style: italic;
}

.console-entry {
  padding: 3px 0;
  color: var(--md-sys-color-on-surface, #222);
}

.code-preview {
  border-radius: 12px;
  background: #1e1e1e;
  color: #d4d4d4;
  overflow: hidden;
  margin-bottom: 40px;
}

.code-header {
  padding: 8px 16px;
  background: #2d2d2d;
  font-size: 0.8rem;
  font-weight: 600;
  color: #aaa;
}

.code-preview pre {
  margin: 0;
  padding: 16px;
  font-family: monospace;
  font-size: 0.85rem;
  overflow-x: auto;
}
</style>
