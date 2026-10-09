<template>
  <section class="demo-section">
    <h2 class="display-large">Interactive Playground</h2>
    <p>Customize list variant, density, line count, leading media, and trailing controls.</p>

    <!-- Controls -->
    <div class="demo-controls">
      <div class="control-row">
        <label>Variant:</label>
        <button
          :class="['toggle-btn', { active: playgroundType === 'standard' }]"
          @click="playgroundType = 'standard'"
        >
          Standard
        </button>
        <button
          :class="['toggle-btn', { active: playgroundType === 'expressive' }]"
          @click="playgroundType = 'expressive'"
        >
          Expressive
        </button>
      </div>

      <div class="control-row">
        <label>Density:</label>
        <button
          v-for="d in (['0', '-1', '-2', '-3'] as const)"
          :key="d"
          :class="['toggle-btn', { active: playgroundDensity === d }]"
          @click="playgroundDensity = d"
        >
          {{ d }}
        </button>
      </div>

      <div class="control-row">
        <label>Lines:</label>
        <button
          v-for="l in (['one', 'two', 'three'] as const)"
          :key="l"
          :class="['toggle-btn', { active: playgroundLines === l }]"
          @click="playgroundLines = l"
        >
          {{ l }}
        </button>
      </div>

      <div class="control-row">
        <label>Leading:</label>
        <button
          v-for="media in (['none', 'icon', 'avatar', 'image', 'video'] as const)"
          :key="media"
          :class="['toggle-btn', { active: playgroundLeading === media }]"
          @click="playgroundLeading = media"
        >
          {{ media }}
        </button>
      </div>

      <div class="control-row">
        <label>Trailing:</label>
        <button
          v-for="t in (['none', 'text', 'checkbox', 'switch', 'action'] as const)"
          :key="t"
          :class="['toggle-btn', { active: playgroundTrailing === t }]"
          @click="playgroundTrailing = t"
        >
          {{ t }}
        </button>
      </div>

      <div class="demo-row">
        <label>
          <input type="checkbox" v-model="playgroundSelectActive" />
          Select Active
        </label>
        <label>
          <input type="checkbox" v-model="playgroundDisabled" />
          Disable 3rd item
        </label>
      </div>
    </div>

    <div class="frame">
      <!-- Standard List -->
      <ui-list
        v-if="playgroundType === 'standard'"
        :density="playgroundDensity"
        :selectActive="playgroundSelectActive"
        @select="onPlaygroundSelect"
      >
        <ui-list-item
          v-for="(item, idx) in playgroundItems"
          :key="idx"
          :lines="playgroundLines"
          :image="playgroundLeading !== 'none' ? playgroundLeading : undefined"
          :disabled="playgroundDisabled && idx === 2"
        >
          <ui-icon v-if="playgroundLeading === 'icon'" slot="start">{{ item.icon }}</ui-icon>
          <span v-else-if="playgroundLeading === 'avatar'" slot="start" class="avatar-badge">{{ item.avatar }}</span>
          <img v-else-if="playgroundLeading === 'image'" slot="start" :src="samplePhoto" alt="Thumbnail" />
          <span v-else-if="playgroundLeading === 'video'" slot="start" class="video-thumbnail">
            <img :src="samplePhoto" alt="Video" />
          </span>

          {{ item.title }}

          <p v-if="playgroundLines !== 'one'" slot="supporting-text" class="clear-p">
            {{ playgroundLines === 'three' ? longSupportingText : shortSupportingText }}
          </p>

          <span v-if="playgroundTrailing === 'text'" slot="end-text">{{ item.meta }}</span>
          <ui-checkbox
            v-else-if="playgroundTrailing === 'checkbox'"
            slot="end"
            @pointerdown.stop.prevent="stopEvent"
            @click.stop.prevent="stopEvent"
          ></ui-checkbox>
          <ui-switch
            v-else-if="playgroundTrailing === 'switch'"
            slot="end"
            @pointerdown.stop.prevent="stopEvent"
            @click.stop.prevent="stopEvent"
          ></ui-switch>
          <ui-icon-button
            v-else-if="playgroundTrailing === 'action'"
            slot="end"
            color="standard"
            @pointerdown.stop.prevent="stopEvent"
            @click.stop.prevent="stopEvent"
          >
            <ui-icon aria-hidden="true">more_vert</ui-icon>
          </ui-icon-button>
        </ui-list-item>
      </ui-list>

      <!-- Expressive List -->
      <ui-expressive-list
        v-else
        :density="playgroundDensity"
        :selectActive="playgroundSelectActive"
        @select="onPlaygroundSelect"
      >
        <ui-expressive-list-item
          v-for="(item, idx) in playgroundItems"
          :key="idx"
          :lines="playgroundLines"
          :image="playgroundLeading !== 'none' ? playgroundLeading : undefined"
          :disabled="playgroundDisabled && idx === 2"
        >
          <ui-icon v-if="playgroundLeading === 'icon'" slot="start">{{ item.icon }}</ui-icon>
          <span v-else-if="playgroundLeading === 'avatar'" slot="start" class="avatar-badge">{{ item.avatar }}</span>
          <img v-else-if="playgroundLeading === 'image'" slot="start" :src="samplePhoto" alt="Thumbnail" />
          <span v-else-if="playgroundLeading === 'video'" slot="start" class="video-thumbnail">
            <img :src="samplePhoto" alt="Video" />
          </span>

          {{ item.title }}

          <p v-if="playgroundLines !== 'one'" slot="supporting-text" class="clear-p">
            {{ playgroundLines === 'three' ? longSupportingText : shortSupportingText }}
          </p>

          <span v-if="playgroundTrailing === 'text'" slot="end-text">{{ item.meta }}</span>
          <ui-checkbox
            v-else-if="playgroundTrailing === 'checkbox'"
            slot="end"
            @pointerdown.stop.prevent="stopEvent"
            @click.stop.prevent="stopEvent"
          ></ui-checkbox>
          <ui-switch
            v-else-if="playgroundTrailing === 'switch'"
            slot="end"
            @pointerdown.stop.prevent="stopEvent"
            @click.stop.prevent="stopEvent"
          ></ui-switch>
          <ui-icon-button
            v-else-if="playgroundTrailing === 'action'"
            slot="end"
            color="standard"
            @pointerdown.stop.prevent="stopEvent"
            @click.stop.prevent="stopEvent"
          >
            <ui-icon aria-hidden="true">more_vert</ui-icon>
          </ui-icon-button>
        </ui-expressive-list-item>
      </ui-expressive-list>
    </div>

    <p v-if="lastSelectionMessage">
      <em>{{ lastSelectionMessage }}</em>
    </p>

    <pre><code>{{ generatedCode }}</code></pre>
  </section>

  <section class="demo-section">
    <h2 class="display-large">Standard vs Expressive Design</h2>
    <p>
      <strong>Standard List</strong> (<code>&lt;ui-list&gt;</code>) renders continuous rectangular rows.
      <strong>Expressive List</strong> (<code>&lt;ui-expressive-list&gt;</code>) uses 28px rounded pills with a 2px gap.
    </p>
    <div class="demo-row">
      <div style="flex: 1; min-width: 280px">
        <h3>Standard List</h3>
        <div class="frame">
          <ui-list selectActive="true">
            <ui-list-item class="select">
              <ui-icon slot="start">inbox</ui-icon>
              All Inboxes
              <span slot="end-text">142</span>
            </ui-list-item>
            <ui-list-item>
              <ui-icon slot="start">star</ui-icon>
              Starred
              <span slot="end-text">9</span>
            </ui-list-item>
            <ui-list-item>
              <ui-icon slot="start">send</ui-icon>
              Sent Messages
              <span slot="end-text">48</span>
            </ui-list-item>
          </ui-list>
        </div>
      </div>
      <div style="flex: 1; min-width: 280px">
        <h3>Expressive List</h3>
        <div class="frame">
          <ui-expressive-list selectActive="true">
            <ui-expressive-list-item class="select">
              <ui-icon slot="start">inbox</ui-icon>
              All Inboxes
              <span slot="end-text">142</span>
            </ui-expressive-list-item>
            <ui-expressive-list-item>
              <ui-icon slot="start">star</ui-icon>
              Starred
              <span slot="end-text">9</span>
            </ui-expressive-list-item>
            <ui-expressive-list-item>
              <ui-icon slot="start">send</ui-icon>
              Sent Messages
              <span slot="end-text">48</span>
            </ui-expressive-list-item>
          </ui-expressive-list>
        </div>
      </div>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="display-large">Density Variations</h2>
    <p>
      MD3 density scale: <code>0</code> (56px default), <code>-1</code> (52px), <code>-2</code> (48px), and <code>-3</code> (44px).
    </p>
    <div class="demo-row">
      <div v-for="d in (['0', '-1', '-2', '-3'] as const)" :key="d" style="flex: 1; min-width: 180px">
        <p><strong>Density {{ d }}</strong> ({{ d === '0' ? '56px' : d === '-1' ? '52px' : d === '-2' ? '48px' : '44px' }})</p>
        <div class="frame">
          <ui-expressive-list :density="d">
            <ui-expressive-list-item>
              <ui-icon slot="start">person</ui-icon>
              Profile
              <span slot="end-text">Active</span>
            </ui-expressive-list-item>
            <ui-expressive-list-item>
              <ui-icon slot="start">security</ui-icon>
              Security
              <span slot="end-text">2 keys</span>
            </ui-expressive-list-item>
            <ui-expressive-list-item>
              <ui-icon slot="start">palette</ui-icon>
              Theme
              <span slot="end-text">System</span>
            </ui-expressive-list-item>
          </ui-expressive-list>
        </div>
      </div>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="display-large">Leading Content Types</h2>
    <p>
      List items support 4 image presets: <code>icon</code> (24px), circular <code>avatar</code> (40px),
      square <code>image</code> (56px), and 16:9 <code>video</code> thumbnail (114×64px).
    </p>
    <div class="frame">
      <ui-expressive-list>
        <ui-expressive-list-item image="icon" lines="two">
          <ui-icon slot="start">folder</ui-icon>
          Documents & Archives
          <p slot="supporting-text" class="clear-p">24px icon in leading position</p>
          <span slot="end-text">1.2 GB</span>
        </ui-expressive-list-item>

        <ui-expressive-list-item image="avatar" lines="two">
          <span slot="start" class="avatar-badge color-primary">JD</span>
          Jane Doe
          <p slot="supporting-text" class="clear-p">Lead UX Architect</p>
          <ui-icon-button slot="end" color="standard" @click.stop.prevent="stopEvent">
            <ui-icon aria-hidden="true">mail</ui-icon>
          </ui-icon-button>
        </ui-expressive-list-item>

        <ui-expressive-list-item image="image" lines="two">
          <img slot="start" :src="samplePhoto" alt="Thumbnail" />
          Mountain Sunrise Album
          <p slot="supporting-text" class="clear-p">56×56px square media thumbnail</p>
          <span slot="end-text">14 tracks</span>
        </ui-expressive-list-item>

        <ui-expressive-list-item image="video" lines="two">
          <span slot="start" class="video-thumbnail">
            <img :src="samplePhoto" alt="Video preview" />
            <span class="video-duration">12:45</span>
          </span>
          Building Accessible Components
          <p slot="supporting-text" class="clear-p">114×64px 16:9 video preview</p>
          <ui-checkbox slot="end" @click.stop.prevent="stopEvent" @pointerdown.stop.prevent="stopEvent"></ui-checkbox>
        </ui-expressive-list-item>
      </ui-expressive-list>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="display-large">Collapsible Groups</h2>
    <p>
      Set <code>collapsible="true"</code> on <code>&lt;ui-expressive-list&gt;</code> with parent-child relationships.
    </p>
    <div class="frame">
      <ui-expressive-list collapsible="true">
        <ui-expressive-list-item id="grp-dev" open="true">
          <ui-icon slot="start">code</ui-icon>
          Development Tools
          <ui-icon-button slot="end" width="narrow">
            <ui-icon aria-hidden="true">keyboard_arrow_up</ui-icon>
          </ui-icon-button>
        </ui-expressive-list-item>
        <ui-expressive-list-item parent="grp-dev">
          <ui-icon slot="start">terminal</ui-icon>
          Terminal Configuration
        </ui-expressive-list-item>
        <ui-expressive-list-item parent="grp-dev">
          <ui-icon slot="start">source</ui-icon>
          Git VCS Repositories
        </ui-expressive-list-item>

        <ui-expressive-list-item id="grp-design">
          <ui-icon slot="start">brush</ui-icon>
          Design Assets
          <ui-icon-button slot="end" width="narrow">
            <ui-icon aria-hidden="true">keyboard_arrow_up</ui-icon>
          </ui-icon-button>
        </ui-expressive-list-item>
        <ui-expressive-list-item parent="grp-design">
          <ui-icon slot="start">color_lens</ui-icon>
          Color Palette Generator
        </ui-expressive-list-item>
        <ui-expressive-list-item parent="grp-design">
          <ui-icon slot="start">text_fields</ui-icon>
          Typography Scale Tokens
        </ui-expressive-list-item>

        <ui-expressive-list-item>
          <ui-icon slot="start">help_outline</ui-icon>
          Help & Documentation
          <span slot="end-text">External</span>
        </ui-expressive-list-item>
      </ui-expressive-list>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="display-large">Dynamic List Mutation</h2>
    <div class="demo-row">
      <ui-button color="filled" @click="addDynamicItem">
        <ui-icon slot="icon">add</ui-icon>
        Add Item
      </ui-button>
      <ui-button color="outlined" :disabled="dynamicItems.length === 0" @click="clearDynamicItems">
        <ui-icon slot="icon">clear_all</ui-icon>
        Clear All
      </ui-button>
      <span style="align-self: center">{{ dynamicItems.length }} item(s)</span>
    </div>
    <div class="frame">
      <ui-expressive-list selectActive="true">
        <ui-expressive-list-item
          v-for="(item, index) in dynamicItems"
          :key="item.id"
          image="avatar"
          :lines="item.lines"
        >
          <span slot="start" class="avatar-badge">{{ index + 1 }}</span>
          {{ item.name }}
          <p v-if="item.lines !== 'one'" slot="supporting-text" class="clear-p">
            Added dynamically • ID #{{ item.id }}
          </p>
          <ui-icon-button
            slot="end"
            color="standard"
            aria-label="Remove item"
            @click.stop="removeDynamicItem(index)"
          >
            <ui-icon aria-hidden="true">delete</ui-icon>
          </ui-icon-button>
        </ui-expressive-list-item>
        <ui-expressive-list-item v-if="dynamicItems.length === 0" static="true">
          <ui-icon slot="start">info</ui-icon>
          No items in list. Click "Add Item" above to create items.
        </ui-expressive-list-item>
      </ui-expressive-list>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="display-large">Static and disabled state</h2>
    <div class="frame">
      <ui-expressive-list>
        <ui-expressive-list-item static="true">
          <ui-icon slot="start">flight</ui-icon>
          Static item (no interaction)
        </ui-expressive-list-item>
        <ui-expressive-list-item image="avatar" static="true">
          <span slot="start" class="avatar-badge">H</span>
          Static avatar
          <ui-checkbox slot="end" @pointerdown.stop.prevent="stopEvent"></ui-checkbox>
        </ui-expressive-list-item>
        <ui-expressive-list-item disabled="true">
          <ui-icon slot="start">hotel</ui-icon>
          Disabled item
        </ui-expressive-list-item>
        <ui-expressive-list-item disabled="true">
          2000,00
          <span slot="end-text">PLN</span>
        </ui-expressive-list-item>
      </ui-expressive-list>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import '../../src/components/list/ui-list.js'
import '../../src/components/list/ui-list-item.js'
import '../../src/components/list/ui-expressive-list.js'
import '../../src/components/list/ui-expressive-list-item.js'
import '../../src/components/button/ui-button.js'
import '../../src/components/icons/ui-icon.js'
import '../../src/components/icon-button/ui-icon-button.js'
import '../../src/components/checkbox/ui-checkbox.js'
import '../../src/components/switch/ui-switch.js'

import samplePhoto from './pawel6c9a.jpg'

// Playground state
const playgroundType = ref<'standard' | 'expressive'>('expressive')
const playgroundDensity = ref<'0' | '-1' | '-2' | '-3'>('0')
const playgroundLines = ref<'one' | 'two' | 'three'>('two')
const playgroundLeading = ref<'none' | 'icon' | 'avatar' | 'image' | 'video'>('icon')
const playgroundTrailing = ref<'none' | 'text' | 'checkbox' | 'switch' | 'action'>('action')
const playgroundSelectActive = ref<boolean>(true)
const playgroundDisabled = ref<boolean>(false)

const lastSelectionMessage = ref<string>('Click an item to see selection events')

const shortSupportingText = 'Secondary descriptive text for contextual information'
const longSupportingText =
  'Longer multi-line supporting description providing comprehensive details about this item, clamped to 2 lines in MD3.'

const playgroundItems = [
  { title: 'System Security Audit', icon: 'shield', avatar: 'SA', meta: 'Passed' },
  { title: 'Cloud Database Replication', icon: 'cloud_sync', avatar: 'DB', meta: 'Running' },
  { title: 'Network Gateway Configuration', icon: 'router', avatar: 'GW', meta: 'Offline' },
  { title: 'Telemetry Metrics Stream', icon: 'monitoring', avatar: 'TM', meta: '1.4k/s' },
]

const stopEvent = (e: Event): void => {
  e.preventDefault()
  e.stopPropagation()
}

const onPlaygroundSelect = (e: Event): void => {
  const detail = (e as CustomEvent).detail
  const item = detail?.item as HTMLElement | undefined
  const title = item?.textContent?.trim().split('\n')[0] || 'Unknown item'
  const index = detail?.index ?? '?'
  lastSelectionMessage.value = `Selected "${title}" (index ${index})`
}

// Dynamic items
interface DynamicItem {
  id: number
  name: string
  lines: 'one' | 'two'
}

let dynamicCounter = 4
const dynamicItems = ref<DynamicItem[]>([
  { id: 1, name: 'Cloud Function Worker', lines: 'two' },
  { id: 2, name: 'Cache Invalidation Daemon', lines: 'two' },
  { id: 3, name: 'Pub/Sub Topic Subscriber', lines: 'two' },
])

const addDynamicItem = (): void => {
  const id = dynamicCounter++
  dynamicItems.value = [
    ...dynamicItems.value,
    {
      id,
      name: `Background Service Worker #${id}`,
      lines: 'two',
    },
  ]
}

const removeDynamicItem = (idx: number): void => {
  dynamicItems.value = dynamicItems.value.filter((_, i) => i !== idx)
}

const clearDynamicItems = (): void => {
  dynamicItems.value = []
}

// Generated HTML snippet
const generatedCode = computed(() => {
  const tag = playgroundType.value === 'standard' ? 'ui-list' : 'ui-expressive-list'
  const itemTag = playgroundType.value === 'standard' ? 'ui-list-item' : 'ui-expressive-list-item'
  const densityAttr = playgroundDensity.value !== '0' ? ` density="${playgroundDensity.value}"` : ''
  const selectAttr = playgroundSelectActive.value ? ' selectActive="true"' : ''
  const linesAttr = playgroundLines.value !== 'one' ? ` lines="${playgroundLines.value}"` : ''
  const imageAttr = playgroundLeading.value !== 'none' ? ` image="${playgroundLeading.value}"` : ''

  return `<${tag}${densityAttr}${selectAttr}>
  <${itemTag}${linesAttr}${imageAttr}>
    ${playgroundLeading.value === 'icon' ? '<ui-icon slot="start">folder</ui-icon>\n    ' : ''}${
    playgroundLeading.value === 'avatar' ? '<span slot="start" class="avatar">A</span>\n    ' : ''
  }Headline Title${
    playgroundLines.value !== 'one' ? '\n    <p slot="supporting-text">Supporting description</p>' : ''
  }${playgroundTrailing.value === 'text' ? '\n    <span slot="end-text">Metadata</span>' : ''}${
    playgroundTrailing.value === 'checkbox' ? '\n    <ui-checkbox slot="end"></ui-checkbox>' : ''
  }${playgroundTrailing.value === 'switch' ? '\n    <ui-switch slot="end"></ui-switch>' : ''}${
    playgroundTrailing.value === 'action' ? '\n    <ui-icon-button slot="end"><ui-icon>more_vert</ui-icon></ui-icon-button>' : ''
  }
  </${itemTag}>
</${tag}>`
})
</script>

<style scoped>
.demo-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.control-row label {
  min-width: 65px;
  font-weight: 500;
  font-size: 0.875rem;
}

.toggle-btn {
  background: var(--md-sys-color-surface, #ffffff);
  color: var(--md-sys-color-on-surface, #1d1b20);
  border: 1px solid var(--md-sys-color-outline, rgba(121, 116, 126, 0.4));
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.toggle-btn:hover {
  background: var(--md-sys-color-surface-container-high, #e6e0e9);
}

.toggle-btn.active {
  background: var(--md-sys-color-secondary-container, #e8def8);
  color: var(--md-sys-color-on-secondary-container, #1d192b);
  border-color: var(--md-sys-color-secondary, #625b71);
  font-weight: 600;
}

.avatar-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--md-sys-color-primary-container, #eaddff);
  color: var(--md-sys-color-on-primary-container, #21005d);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9375rem;
}

.avatar-badge.color-primary {
  background: var(--md-sys-color-secondary-container, #e8def8);
  color: var(--md-sys-color-on-secondary-container, #1d192b);
}

.video-thumbnail {
  position: relative;
  display: inline-block;
  width: 114px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.video-duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.75);
  color: #ffffff;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 600;
  line-height: 1;
}

.clear-p {
  margin: 0 !important;
  line-height: inherit;
}
</style>
