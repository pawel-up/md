<template>
  <form method="get" action="#" @submit="submitHandler">
    <section class="demo-section">
      <h2 class="display-large">Feature comparison</h2>
      <div class="demo-grid">
        <span>&nbsp;</span>
        <span class="column-title title-medium">Filled</span>
        <span class="column-title title-medium">Outlined</span>

        <span class="row-name title-small">Regular</span>
        <ui-filled-text-field label="Field label" name="regular-filled"></ui-filled-text-field>
        <ui-outlined-text-field label="Field label" name="regular-outlined"></ui-outlined-text-field>

        <span class="row-name title-small">Required</span>
        <ui-filled-text-field
          label="Required label"
          required
          invalidText="This field is required"
          name="required-filled"
        ></ui-filled-text-field>
        <ui-outlined-text-field
          label="Required label"
          required
          invalidText="This field is required"
          name="required-outlined"
        ></ui-outlined-text-field>

        <span class="row-name title-small">Prefix icon</span>
        <ui-filled-text-field label="Prefix input" name="prefix-filled"
          ><ui-icon slot="prefix" icon="search"></ui-icon
        ></ui-filled-text-field>
        <ui-outlined-text-field label="Prefix input" name="prefix-outlined"
          ><ui-icon slot="prefix" icon="search"></ui-icon
        ></ui-outlined-text-field>

        <span class="row-name title-small">Suffix icon</span>
        <ui-filled-text-field label="Suffix input" name="suffix-filled"
          ><ui-icon slot="suffix" icon="close"></ui-icon
        ></ui-filled-text-field>
        <ui-outlined-text-field label="Suffix input" name="suffix-outlined"
          ><ui-icon slot="suffix" icon="close"></ui-icon
        ></ui-outlined-text-field>

        <span class="row-name title-small">Suffix text</span>
        <ui-filled-text-field label="Your weight" name="suffix-text-filled"
          ><span slot="suffix">kg</span></ui-filled-text-field
        >
        <ui-outlined-text-field label="Your weight" name="suffix-text-outlined"
          ><span slot="suffix">kg</span></ui-outlined-text-field
        >

        <span class="row-name title-small">Hiding label</span>
        <ui-filled-text-field label="No label floating" name="noFloat-filled" noFloating></ui-filled-text-field>
        <ui-outlined-text-field
          label="No label floating"
          name="noFloat-outlined"
          noFloating
        ></ui-outlined-text-field>

        <span class="row-name title-small">Supporting text</span>
        <ui-filled-text-field
          label="Text field"
          name="supportingText-filled"
          supportingText="This is a supporting text with a long value"
        ></ui-filled-text-field>
        <ui-outlined-text-field
          label="Text field"
          name="supportingText-outlined"
          supportingText="This is a supporting text with a long value"
        ></ui-outlined-text-field>

        <span class="row-name title-small">Text counter</span>
        <ui-filled-text-field label="Count text" name="counter-filled" maxLength="75"></ui-filled-text-field>
        <ui-outlined-text-field label="Count text" name="counter-outlined" maxLength="75"></ui-outlined-text-field>

        <span class="row-name title-small">Supporting text + counter</span>
        <ui-filled-text-field
          label="Supporting counter"
          maxLength="12"
          supportingText="Only alphanumeric values"
          pattern="[a-zA-Z0-9]*"
          invalidText="Invalid value"
          ><ui-icon slot="suffix" icon="visibility"></ui-icon
        ></ui-filled-text-field>
        <ui-outlined-text-field
          label="Supporting counter"
          maxLength="12"
          supportingText="Only alphanumeric values"
          pattern="[a-zA-Z0-9]*"
          ><ui-icon slot="suffix" icon="visibility"></ui-icon
        ></ui-outlined-text-field>
      </div>
    </section>

    <section class="demo-section">
      <h2 class="display-large">States</h2>
      <div class="demo-grid">
        <span>&nbsp;</span>
        <span class="column-title title-medium">Filled</span>
        <span class="column-title title-medium">Outlined</span>

        <span class="row-name title-small">Disabled</span>
        <ui-filled-text-field label="Input" name="disabled-filled" value="A value" disabled></ui-filled-text-field>
        <ui-outlined-text-field
          label="Input"
          name="disabled-outlined"
          value="A value"
          disabled
        ></ui-outlined-text-field>

        <span class="row-name title-small">Read only</span>
        <ui-filled-text-field label="Input" name="readonly-filled" value="A value" readonly></ui-filled-text-field>
        <ui-outlined-text-field
          label="Input"
          name="readonly-outlined"
          value="A value"
          readonly
        ></ui-outlined-text-field>

        <span class="row-name title-small">Invalid</span>
        <ui-filled-text-field
          label="Input"
          name="invalid-filled"
          value="invalid"
          invalid
          invalidText="Minimum 20 characters."
        ></ui-filled-text-field>
        <ui-outlined-text-field
          label="Input"
          name="invalid-outlined"
          value="invalid"
          invalid
          invalidText="Minimum 20 characters."
        ></ui-outlined-text-field>
      </div>
    </section>

    <section class="demo-section">
      <h2 class="display-large">Types</h2>

      <div class="demo-grid">
        <span>&nbsp;</span>
        <span class="column-title title-medium">Filled</span>
        <span class="column-title title-medium">Outlined</span>

        <span class="row-name title-small">Password</span>
        <ui-filled-text-field label="Enter password" name="pwd-filled" type="password"></ui-filled-text-field>
        <ui-outlined-text-field label="Enter password" name="pwd-outlined" type="password"></ui-outlined-text-field>

        <span class="row-name title-small">Color</span>
        <ui-filled-text-field label="Select a color" name="color-filled" type="color"></ui-filled-text-field>
        <ui-outlined-text-field label="Select a color" name="color-outlined" type="color"></ui-outlined-text-field>

        <span class="row-name title-small">Date</span>
        <ui-filled-text-field label="Select a date" name="date-filled" type="date"></ui-filled-text-field>
        <ui-outlined-text-field label="Select a date" name="date-outlined" type="date"></ui-outlined-text-field>

        <span class="row-name title-small">Datetime-local</span>
        <ui-filled-text-field
          label="Select a date and time"
          name="datetime-local-filled"
          type="datetime-local"
        ></ui-filled-text-field>
        <ui-outlined-text-field
          label="Select a date and time"
          name="datetime-local-outlined"
          type="datetime-local"
        ></ui-outlined-text-field>

        <span class="row-name title-small">Datetime-local</span>
        <ui-filled-text-field label="Select month" name="month-filled" type="month"></ui-filled-text-field>
        <ui-outlined-text-field label="Select month" name="month-outlined" type="month"></ui-outlined-text-field>

        <span class="row-name title-small">Week</span>
        <ui-filled-text-field label="Select week" name="week-filled" type="week"></ui-filled-text-field>
        <ui-outlined-text-field label="Select week" name="week-outlined" type="week"></ui-outlined-text-field>

        <span class="row-name title-small">Time</span>
        <ui-filled-text-field label="Select time" name="time-filled" type="time"></ui-filled-text-field>
        <ui-outlined-text-field label="Select time" name="time-outlined" type="time"></ui-outlined-text-field>

        <span class="row-name title-small">Email</span>
        <ui-filled-text-field label="Enter email" name="email-filled" type="email"></ui-filled-text-field>
        <ui-outlined-text-field label="Enter email" name="email-outlined" type="email"></ui-outlined-text-field>

        <span class="row-name title-small">File</span>
        <ui-filled-text-field label="Select a file" name="file-filled" type="file"></ui-filled-text-field>
        <ui-outlined-text-field label="Select a file" name="file-outlined" type="file"></ui-outlined-text-field>

        <span class="row-name title-small">Number</span>
        <ui-filled-text-field
          label="Enter a number"
          name="number-filled"
          type="number"
          step="10"
          min="0"
          max="100"
        ></ui-filled-text-field>
        <ui-outlined-text-field
          label="Enter a number"
          name="number-outlined"
          type="number"
          step="10"
          min="0"
          max="100"
        ></ui-outlined-text-field>

        <span class="row-name title-small">Tel</span>
        <ui-filled-text-field label="Enter a phone number" name="tel-filled" type="tel"></ui-filled-text-field>
        <ui-outlined-text-field
          label="Enter a phone number"
          name="tel-outlined"
          type="tel"
        ></ui-outlined-text-field>

        <span class="row-name title-small">URL</span>
        <ui-filled-text-field label="Enter a url" name="url-filled" type="url"></ui-filled-text-field>
        <ui-outlined-text-field label="Enter a url" name="url-outlined" type="url"></ui-outlined-text-field>
      </div>
    </section>

    <section class="demo-section">
      <h2 class="title-large">Multiline input</h2>
      <ui-text-area label="Your bio" name="bio" required></ui-text-area>
    </section>

    <section class="demo-section">
      <h2 class="title-large">Inputs in a form</h2>
      <ui-button color="filled" name="submit" value="on" type="submit">Submit</ui-button>
      <output v-if="formValues">
        <code><pre>{{ formValues }}</pre></code>
      </output>
    </section>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import '../../src/components/text-area/ui-text-area.js'
import '../../src/components/text-field/ui-filled-text-field.js'
import '../../src/components/text-field/ui-outlined-text-field.js'
import '../../src/components/checkbox/ui-checkbox.js'
import '../../src/components/icons/ui-icon.js'
import '../../src/components/button/ui-button.js'

const formValues = ref<string | undefined>()

const changeHandler = (e: Event) => {
  const button = e.target as any
  console.log(`Log: ${button.value} checkbox was clicked.`)
}

const submitHandler = (e: Event) => {
  e.preventDefault()
  const form = e.target as HTMLFormElement
  const values = Array.from(new FormData(form)) as any[][]
  const serialized = new URLSearchParams(values).toString()
  formValues.value = serialized
}
</script>
