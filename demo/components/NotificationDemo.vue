<script setup lang="ts">
import { SnackNotifications } from '../../src/components/notification/SnackNotifications.js'
import '../../src/components/button/ui-button.js'

const simpleHandler = () => {
  SnackNotifications.notify('Simple notification')
}

const timeoutHandler = () => {
  SnackNotifications.notify('2-seconds notification', 2000)
}

const closeHandler = () => {
  SnackNotifications.notify('This toast has a close button.', {
    close: true,
    closed() {
      console.log('Close action occurred')
    },
  })
}

const actionHandler = () => {
  SnackNotifications.notify('This toast is persistent.', {
    actionLabel: 'Click me',
    actionCallback() {
      console.log('Action was called (action)')
    },
    persistent: true,
  })
}

const closeActionHandler = () => {
  SnackNotifications.notify('Close and action toast message.', {
    actionLabel: 'Click me',
    actionCallback() {
      console.log('Action was called (close and action)')
    },
    close: true,
    closed() {
      console.log('The close & action toast was closed.')
    },
  })
}
</script>

<template>
  <section class="demo-section">
    <h2 class="title-large">Snackbar</h2>
    <div class="demo-row">
      <ui-button color="filled" @click="simpleHandler">Simple snackbar</ui-button>
      <ui-button color="filled" @click="timeoutHandler">2 second snackbar</ui-button>
      <ui-button color="filled" @click="closeHandler">With close button</ui-button>
      <ui-button color="filled" @click="actionHandler">With action</ui-button>
      <ui-button color="filled" @click="closeActionHandler">With action and close button</ui-button>
    </div>
  </section>
</template>
