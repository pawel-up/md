<script setup lang="ts">
import './CustomDetail.ts'
</script>

<template>
  <a href="../">Back</a>

  <section class="demo-section">
    <h2 class="title-large">Basic</h2>
    <custom-detail>
      <div class="content">
        Lorem ipsum dolor sit amet, per in nusquam nominavi periculis, sit elit oportere ea, id minim maiestatis
        incorrupte duo. Dolorum verterem ad ius, his et nullam verterem. Eu alia debet usu, an doming tritani est.
        Vix ad ponderum petentium suavitate, eum eu tempor populo, graece sententiae constituam vim ex. Cu torquatos
        reprimique neglegentur nec, voluptua periculis has ut, at eos discere deleniti sensibus. Lorem ipsum dolor
        sit amet, per in nusquam nominavi periculis, sit elit oportere ea, id minim maiestatis incorrupte duo.
        Dolorum verterem ad ius, his et nullam verterem. Eu alia debet usu, an doming tritani est. Vix ad ponderum
        petentium suavitate, eum eu tempor populo, graece sententiae constituam vim ex. Cu torquatos reprimique
        neglegentur nec, voluptua periculis has ut, at eos discere deleniti sensibus.
      </div>
    </custom-detail>
  </section>

  <section class="demo-section">
    <h2 class="title-large">Nested, horizontal expand</h2>
    <custom-detail>
      <div class="content">
        <div>
          Lorem ipsum dolor sit amet, per in nusquam nominavi periculis, sit elit oportere ea, id minim maiestatis
          incorrupte duo. Dolorum verterem ad ius, his et nullam verterem. Eu alia debet usu, an doming tritani est.
          Vix ad ponderum petentium suavitate, eum eu tempor populo, graece sententiae constituam vim ex. Cu
          torquatos reprimique neglegentur nec, voluptua periculis has ut, at eos discere deleniti sensibus. Lorem
          ipsum dolor sit amet, per in nusquam nominavi periculis, sit elit oportere ea, id minim maiestatis
          incorrupte duo. Dolorum verterem ad ius, his et nullam verterem. Eu alia debet usu, an doming tritani est.
          Vix ad ponderum petentium suavitate, eum eu tempor populo, graece sententiae constituam vim ex. Cu
          torquatos reprimique neglegentur nec, voluptua periculis has ut, at eos discere deleniti sensibus.
        </div>
        <custom-detail horizontal>
          <div class="content">
            Lorem ipsum dolor sit amet, per in nusquam nominavi periculis, sit elit oportere ea, id minim maiestatis
            incorrupte duo. Dolorum verterem ad ius, his et nullam verterem. Eu alia debet usu, an doming tritani
            est. Vix ad ponderum petentium suavitate, eum eu tempor populo, graece sententiae constituam vim ex. Cu
            torquatos reprimique neglegentur nec, voluptua periculis has ut, at eos discere deleniti sensibus. Lorem
            ipsum dolor sit amet, per in nusquam nominavi periculis, sit elit oportere ea, id minim maiestatis
            incorrupte duo. Dolorum verterem ad ius, his et nullam verterem. Eu alia debet usu, an doming tritani
            est. Vix ad ponderum petentium suavitate, eum eu tempor populo, graece sententiae constituam vim ex. Cu
            torquatos reprimique neglegentur nec, voluptua periculis has ut, at eos discere deleniti sensibus.
          </div>
        </custom-detail>
      </div>
    </custom-detail>
  </section>

  <section class="demo-section">
    <h2 class="title-large">No animation</h2>
    <custom-detail noanimation>
      <div class="content">
        Lorem ipsum dolor sit amet, per in nusquam nominavi periculis, sit elit oportere ea, id minim maiestatis
        incorrupte duo. Dolorum verterem ad ius, his et nullam verterem. Eu alia debet usu, an doming tritani est.
        Vix ad ponderum petentium suavitate, eum eu tempor populo, graece sententiae constituam vim ex. Cu torquatos
        reprimique neglegentur nec, voluptua periculis has ut, at eos discere deleniti sensibus. Lorem ipsum dolor
        sit amet, per in nusquam nominavi periculis, sit elit oportere ea, id minim maiestatis incorrupte duo.
        Dolorum verterem ad ius, his et nullam verterem. Eu alia debet usu, an doming tritani est. Vix ad ponderum
        petentium suavitate, eum eu tempor populo, graece sententiae constituam vim ex. Cu torquatos reprimique
        neglegentur nec, voluptua periculis has ut, at eos discere deleniti sensibus.
      </div>
    </custom-detail>
  </section>
</template>
