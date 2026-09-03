<script setup lang="ts">
import { ref } from 'vue'
import '../../src/components/dropdown-list/ui-dropdown-list.js'
import '../../src/components/list/ui-list.js'
import '../../src/components/list/ui-list-item.js'
import '../../src/components/icon-button/ui-icon-button.js'
import '../../src/components/icons/ui-icon.js'
import '../../src/components/button/ui-button.js'

const list1Selected = ref<string | undefined>()
const list2Selected = ref<string | undefined>()
const list3Selected = ref<string | undefined>()
const list4Selected = ref<string | undefined>()
const verticalAlign = ref<string | undefined>()
const horizontalAlign = ref<string | undefined>()
const noOverlap = ref(false)

const list1SelectHandler = (e: CustomEvent) => {
  const target = e.detail.item as HTMLElement | undefined
  if (!target) return
  list1Selected.value = target.dataset.item
}

const list2SelectHandler = (e: CustomEvent) => {
  const target = e.detail.item as HTMLElement | undefined
  if (!target) return
  list2Selected.value = target.dataset.item
}

const list3SelectHandler = (e: CustomEvent) => {
  const target = e.detail.item as HTMLElement | undefined
  if (!target) return
  list3Selected.value = target.dataset.item
}

const list4SelectHandler = (e: CustomEvent) => {
  const target = e.detail.item as HTMLElement | undefined
  if (!target) return
  list4Selected.value = target.dataset.item
}

const noOverlapHandler = (e: Event) => {
  const input = e.target as HTMLInputElement
  noOverlap.value = input.checked
}

const verticalHandler = (e: Event) => {
  const target = e.target as HTMLSelectElement
  verticalAlign.value = target.value || undefined
}

const horizontalHandler = (e: Event) => {
  const target = e.target as HTMLSelectElement
  horizontalAlign.value = target.value || undefined
}
</script>

<template>
  <div class="demo-page">
    <section class="demo-section">
      <h2 class="title-large">Icon button list</h2>
      <div class="demo-row">
        <ui-dropdown-list @select="list1SelectHandler">
          <ui-icon-button aria-label="Trigger the menu"><ui-icon icon="moreVert"></ui-icon></ui-icon-button>
          <ui-list slot="dropdown" role="menu">
            <ui-list-item role="menuitem" data-item="item 1">Item 1</ui-list-item>
            <ui-list-item role="menuitem" data-item="item 2">Item 2</ui-list-item>
            <ui-list-item role="menuitem" data-item="item 3">Item 3</ui-list-item>
            <ui-list-item role="menuitem" data-item="item 4">Item 4</ui-list-item>
          </ui-list>
        </ui-dropdown-list>
        <p>Last selected: {{ list1Selected || 'none' }}</p>
      </div>

      <h2 class="title-large">Button list</h2>
      <div class="demo-row">
        <ui-dropdown-list @select="list2SelectHandler">
          <ui-button color="outlined">Click me</ui-button>
          <ui-list slot="dropdown" role="menu">
            <ui-list-item role="menuitem" data-item="item 1">Item 1</ui-list-item>
            <ui-list-item role="menuitem" data-item="item 2">Item 2</ui-list-item>
            <ui-list-item role="menuitem" data-item="item 3">Item 3</ui-list-item>
            <ui-list-item role="menuitem" data-item="item 4">Item 4</ui-list-item>
          </ui-list>
        </ui-dropdown-list>
        <p>Last selected: {{ list2Selected || 'none' }}</p>
      </div>

      <h2 class="title-large">List with disabled first item</h2>
      <div class="demo-row">
        <ui-dropdown-list @select="list4SelectHandler">
          <ui-button color="outlined">Open with disabled items</ui-button>
          <ui-list slot="dropdown" role="menu">
            <ui-list-item role="menuitem" disabled data-item="item 1">Item 1 (Disabled)</ui-list-item>
            <ui-list-item role="menuitem" data-item="item 2">Item 2</ui-list-item>
            <ui-list-item role="menuitem" disabled data-item="item 3">Item 3 (Disabled)</ui-list-item>
            <ui-list-item role="menuitem" data-item="item 4">Item 4</ui-list-item>
          </ui-list>
        </ui-dropdown-list>
        <p>Last selected: {{ list4Selected || 'none' }}</p>
      </div>

      <h2 class="title-large">A list in an <code>overflow: hidden</code> element</h2>
      <div class="demo-row">
        <div class="button-in-lists">
          <ui-dropdown-list
            @select="list3SelectHandler"
            :verticalAlign="verticalAlign"
            :horizontalAlign="horizontalAlign"
            :noOverlap="noOverlap"
          >
            <ui-icon-button aria-label="Trigger the menu"><ui-icon icon="moreVert"></ui-icon></ui-icon-button>
            <ui-list slot="dropdown" role="menu">
              <ui-list-item role="menuitem" data-item="item 1">Item 1</ui-list-item>
              <ui-list-item role="menuitem" data-item="item 2">Item 2</ui-list-item>
              <ui-list-item role="menuitem" data-item="item 3">Item 3</ui-list-item>
              <ui-list-item role="menuitem" data-item="item 4">Item 4</ui-list-item>
            </ui-list>
          </ui-dropdown-list>
        </div>
        <label for="verticalAlign">Vertical align</label>
        <select id="verticalAlign" @change="verticalHandler">
          <option value="">None</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="middle">Middle</option>
          <option value="auto">Auto</option>
        </select>
        <label for="horizontalAlign">Horizontal align</label>
        <select id="horizontalAlign" @change="horizontalHandler">
          <option value="">None</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="middle">Middle</option>
          <option value="auto">Auto</option>
        </select>

        <label>
          <input type="checkbox" name="noOverlap" @change="noOverlapHandler" />
          No overlap
        </label>

        <p>Last selected: {{ list3Selected || 'none' }}</p>
      </div>
    </section>
  </div>
</template>
