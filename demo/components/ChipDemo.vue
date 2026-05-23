<script setup lang="ts">
import type UiChip from '../../src/components/chip/internals/Chip.js'
import '../../src/components/chip/ui-chip.js'
import '../../src/components/chip/ui-chip-set.js'
import '../../src/components/icons/ui-icon.js'

const calendarIcon = `<svg viewBox="0 0 24 24"><path d="M17 22v-3h-3v-2h3v-3h2v3h3v2h-3v3ZM5 20q-.825 0-1.413-.587Q3 18.825 3 18V6q0-.825.587-1.412Q4.175 4 5 4h1V2h2v2h6V2h2v2h1q.825 0 1.413.588Q19 5.175 19 6v6.1q-.5-.075-1-.075t-1 .075V10H5v8h7q0 .5.075 1t.275 1ZM5 8h12V6H5Zm0 0V6v2Z"/></svg>`

const handleClickHandler = (e: Event) => {
  const chip = e.target as UiChip
  console.log(`A ${chip.type} chip was clicked.`)
}

const handleClose = (e: Event) => {
  const chip = e.target as UiChip
  console.log(`A ${chip.type} chip was closed.`)
}

const handleList = (e: Event) => {
  const chip = e.target as UiChip
  console.log(`A ${chip.type} chip requested to trigger a list.`)
}

const handleSelect = (e: Event) => {
  const chip = e.target as UiChip
  console.log('A filter chip was selected, current state is', chip.checked)
}
</script>

<template>
  <a href="../">Back</a>
  <section class="demo-section">
    <h2 class="display-large">Assist chip</h2>

    <div class="grid-5">
      <span>&nbsp;</span>
      <span class="column-title title-medium">Regular</span>
      <span class="column-title title-medium">Icon</span>
      <span class="column-title title-medium">Avatar</span>
      <span class="column-title title-medium">Elevated</span>

      <span class="row-name title-small">Enabled</span>
      <ui-chip type="assist" @click="handleClickHandler">Assist</ui-chip>
      <ui-chip type="assist" @click="handleClickHandler">
        <ui-icon slot="icon" v-html="calendarIcon"></ui-icon>
        Assist
      </ui-chip>
      <ui-chip type="assist" @click="handleClickHandler">
        <img src="./pawel6c9a.jpg" slot="avatar" alt="Pawel Psztyc" />
        Assist
      </ui-chip>
      <ui-chip type="assist" @click="handleClickHandler" elevated>
        <ui-icon slot="icon" v-html="calendarIcon"></ui-icon>Assist
      </ui-chip>

      <span class="row-name title-small">Disabled</span>
      <ui-chip type="assist" disabled @click="handleClickHandler">Assist</ui-chip>
      <ui-chip type="assist" @click="handleClickHandler" disabled>
        <ui-icon slot="icon" v-html="calendarIcon"></ui-icon>
        Assist
      </ui-chip>
      <ui-chip type="assist" disabled @click="handleClickHandler">
        <img src="./pawel6c9a.jpg" slot="avatar" alt="Pawel Psztyc" />
        Assist
      </ui-chip>
      <ui-chip type="assist" @click="handleClickHandler" disabled elevated>
        <ui-icon slot="icon" v-html="calendarIcon"></ui-icon>
        Assist
      </ui-chip>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="display-large">Filter chip</h2>
    <div class="grid-5">
      <span>&nbsp;</span>
      <span class="column-title title-medium">Unchecked</span>
      <span class="column-title title-medium">Checked</span>
      <span class="column-title title-medium">List</span>
      <span class="column-title title-medium">Elevated</span>

      <span class="row-name title-small">Enabled</span>
      <ui-chip type="filter" @click="handleClickHandler" @select="handleSelect">Filter</ui-chip>
      <ui-chip type="filter" checked @click="handleClickHandler" @select="handleSelect"
        >Filter</ui-chip
      >
      <ui-chip
        type="filter"
        list
        @click="handleClickHandler"
        @list="handleList"
        @select="handleSelect"
        >Other</ui-chip
      >
      <ui-chip
        type="filter"
        list
        elevated
        @click="handleClickHandler"
        @list="handleList"
        @select="handleSelect"
        >Other</ui-chip
      >

      <span class="row-name title-small">Disabled</span>
      <ui-chip type="filter" disabled @click="handleClickHandler" @select="handleSelect"
        >Filter</ui-chip
      >
      <ui-chip type="filter" disabled checked @click="handleClickHandler" @select="handleSelect"
        >Filter</ui-chip
      >
      <ui-chip
        type="filter"
        list
        disabled
        @click="handleClickHandler"
        @list="handleList"
        @select="handleSelect"
        >Other</ui-chip
      >
      <ui-chip
        type="filter"
        list
        elevated
        disabled
        @click="handleClickHandler"
        @list="handleList"
        @select="handleSelect"
        >Other</ui-chip
      >
    </div>
  </section>

  <section class="demo-section">
    <h2 class="display-large">Input chip</h2>

    <div class="grid-5">
      <span>&nbsp;</span>
      <span class="column-title title-medium">Regular</span>
      <span class="column-title title-medium">removable</span>
      <span class="column-title title-medium">Disabled</span>
      <span class="column-title title-medium">Elevated</span>

      <span class="row-name title-small">Regular</span>
      <ui-chip type="input" @click="handleClickHandler">Input</ui-chip>
      <ui-chip type="input" removable @click="handleClickHandler" @close="handleClose"
        >Input</ui-chip
      >
      <ui-chip type="input" disabled @click="handleClickHandler">Input</ui-chip>
      <ui-chip type="input" elevated @click="handleClickHandler">Input</ui-chip>

      <span class="row-name title-small">With icon</span>
      <ui-chip type="input" @click="handleClickHandler">
        <ui-icon slot="icon" v-html="calendarIcon"></ui-icon>
        Input
      </ui-chip>
      <ui-chip type="input" @click="handleClickHandler" removable @close="handleClose">
        <ui-icon slot="icon" v-html="calendarIcon"></ui-icon>
        Input
      </ui-chip>
      <ui-chip type="input" @click="handleClickHandler" removable disabled @close="handleClose">
        <ui-icon slot="icon" v-html="calendarIcon"></ui-icon>
        Input
      </ui-chip>
      <ui-chip type="input" @click="handleClickHandler" removable elevated @close="handleClose">
        <ui-icon slot="icon" v-html="calendarIcon"></ui-icon>
        Input
      </ui-chip>

      <span class="row-name title-small">With avatar</span>
      <ui-chip type="input" @click="handleClickHandler">
        <img src="./pawel6c9a.jpg" slot="avatar" alt="Pawel Psztyc" />
        Input
      </ui-chip>
      <ui-chip type="input" @click="handleClickHandler" removable @close="handleClose">
        <img src="./pawel6c9a.jpg" slot="avatar" alt="Pawel Psztyc" />
        Input
      </ui-chip>
      <ui-chip type="input" @click="handleClickHandler" removable disabled @close="handleClose">
        <img src="./pawel6c9a.jpg" slot="avatar" alt="Pawel Psztyc" />
        Input
      </ui-chip>
      <ui-chip type="input" @click="handleClickHandler" removable elevated @close="handleClose">
        <img src="./pawel6c9a.jpg" slot="avatar" alt="Pawel Psztyc" />
        Input
      </ui-chip>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="display-large">Suggestion chip</h2>
    <div class="demo-row grid-3 frame">
      <ui-chip type="suggestion" @click="handleClickHandler">Enabled</ui-chip>
      <ui-chip type="suggestion" @click="handleClickHandler" elevated>Elevated</ui-chip>
      <ui-chip type="suggestion" disabled @click="handleClickHandler">Disabled</ui-chip>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="display-large">Chip set</h2>
    <ui-chip-set>
      <ui-chip type="input" @click="handleClickHandler" removable>Input</ui-chip>
      <ui-chip type="input" @click="handleClickHandler" removable>Input</ui-chip>
      <ui-chip type="input" @click="handleClickHandler" removable>Input</ui-chip>
    </ui-chip-set>
  </section>
</template>
