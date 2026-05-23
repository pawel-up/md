<script setup lang="ts">
import { ref } from 'vue'
import { UiDialogClosingReason } from '../../src/components/dialog/internals/Dialog.js'
import '../../src/components/dialog/ui-confirm-dialog.js'
import '../../src/components/button/ui-button.js'

const basicDialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const customDialogOpen = ref(false)
const lastResult = ref('')

function openBasicDialog() {
  basicDialogOpen.value = true
}

function openDeleteDialog() {
  deleteDialogOpen.value = true
}

function openCustomDialog() {
  customDialogOpen.value = true
}

function handleBasicClose(e: CustomEvent<UiDialogClosingReason>) {
  basicDialogOpen.value = false
  updateResult('Basic Dialog', e.detail)
}

function handleDeleteClose(e: CustomEvent<UiDialogClosingReason>) {
  deleteDialogOpen.value = false
  updateResult('Delete Dialog', e.detail)
}

function handleCustomClose(e: CustomEvent<UiDialogClosingReason>) {
  customDialogOpen.value = false
  updateResult('Custom Dialog', e.detail)
}

function updateResult(dialogType: string, detail: UiDialogClosingReason) {
  const action = detail.cancelled ? 'dismissed' : 'confirmed'
  lastResult.value = `${dialogType} was ${action}`
}
</script>

<template>
  <h1>Confirm Dialog Demo</h1>

  <section class="demo-section">
    <h2>Basic Confirm Dialog</h2>
    <p>A simple confirmation dialog with default button labels.</p>
    <div class="button-group">
      <ui-button color="filled" @click="openBasicDialog">Open Basic Dialog</ui-button>
    </div>

    <ui-confirm-dialog :open="basicDialogOpen" @close="handleBasicClose">
      <span slot="title">Confirm Action</span>
      <p>Are you sure you want to proceed with this action?</p>
    </ui-confirm-dialog>
  </section>

  <section class="demo-section">
    <h2>Delete Confirmation Dialog</h2>
    <p>A confirmation dialog with custom button labels for a destructive action.</p>
    <div class="button-group">
      <ui-button color="filled" @click="openDeleteDialog">Delete Item</ui-button>
    </div>

    <ui-confirm-dialog
      confirmLabel="Delete"
      dismissLabel="Keep"
      destructive
      :open="deleteDialogOpen"
      @close="handleDeleteClose"
    >
      <span slot="title">Delete Item</span>
      <p>Are you sure you want to delete this item? This action cannot be undone.</p>
      <p><strong>This will permanently remove the item from your account.</strong></p>
    </ui-confirm-dialog>
  </section>

  <section class="demo-section">
    <h2>Custom Styled Dialog</h2>
    <p>A confirmation dialog with custom button labels for a specific workflow.</p>
    <div class="button-group">
      <ui-button color="filled" @click="openCustomDialog">Save & Exit</ui-button>
    </div>

    <ui-confirm-dialog
      confirmLabel="Save & Exit"
      dismissLabel="Continue Editing"
      :open="customDialogOpen"
      @close="handleCustomClose"
    >
      <span slot="title">Save Changes</span>
      <p>You have unsaved changes in your document.</p>
      <p>Would you like to save your changes before exiting?</p>
    </ui-confirm-dialog>
  </section>

  <section v-if="lastResult" class="demo-section">
    <h2>Last Action Result</h2>
    <div class="result">{{ lastResult }}</div>
  </section>
</template>
