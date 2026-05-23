<template>
  <section class="demo-section">
    <h2 class="title-large">Listbox</h2>
    <ui-listbox>
      <ui-list-item role="menuitem" data-item="item 1">Item 1</ui-list-item>
      <ui-list-item role="menuitem" data-item="item 2">Item 2</ui-list-item>
      <ui-list-item role="menuitem" data-item="item 3">Item 3</ui-list-item>
      <ui-list-item role="menuitem" data-item="item 4">Item 4</ui-list-item>
    </ui-listbox>
  </section>
</template>

<script setup lang="ts">
import '../../src/components/listbox/ui-listbox.js'
import '../../src/components/list/ui-list-item.js'
</script>
