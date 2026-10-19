<script setup lang="ts">
import { ref } from 'vue'
import '../../src/components/tabs/ui-tab.js'
import '../../src/components/tabs/ui-tabs.js'
import '../../src/components/icons/ui-icon.js'
import '../../src/components/badge/ui-badge.js'

const selected1 = ref('travel1')
const selected2 = ref('hotel2')
const selected3 = ref('travelHotel3')
const selected4 = ref('cars4')
const selected5 = ref('travel5')
const selected6 = ref('travel6')
const selected7 = ref('travel7')
const selectedBadge1 = ref('badgeFlights1')
const selectedBadge2 = ref('badgeFlights2')
const selectedBadge3 = ref('badgeOverview3')
const selectedBadge4 = ref('badgeOverview4')

const state: Record<string, any> = {
  selected1,
  selected2,
  selected3,
  selected4,
  selected5,
  selected6,
  selected7,
  selectedBadge1,
  selectedBadge2,
  selectedBadge3,
  selectedBadge4,
}

const handleTabsChange = (e: Event) => {
  const customEvent = e as CustomEvent
  const target = e.target as HTMLElement
  const property = target.dataset.property
  if (!property || !state[property]) return
  state[property].value = customEvent.detail.item.getAttribute('aria-controls') || ''
}
</script>

<template>
  <section class="demo-section">
    <h2 class="display-large">Primary tabs</h2>

    <div class="frame">
      <ui-tabs data-property="selected1" @change="handleTabsChange">
        <ui-tab aria-controls="travel1">Travel</ui-tab>
        <ui-tab aria-controls="hotel1">Hotel</ui-tab>
        <ui-tab aria-controls="travelHotel1">Travel + Hotel</ui-tab>
        <ui-tab aria-controls="cars1">Cars</ui-tab>
      </ui-tabs>

      <div class="page">
        <p id="travel1" :hidden="selected1 !== 'travel1'">Travel page</p>
        <p id="hotel1" :hidden="selected1 !== 'hotel1'">Hotel page</p>
        <p id="travelHotel1" :hidden="selected1 !== 'travelHotel1'">Hotel & travel page</p>
        <p id="cars1" :hidden="selected1 !== 'cars1'">Cars page</p>
      </div>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="display-large">Secondary tabs</h2>

    <div class="frame">
      <ui-tabs priority="secondary" data-property="selected2" @change="handleTabsChange">
        <ui-tab aria-controls="travel2">Travel</ui-tab>
        <ui-tab aria-controls="hotel2" selected="true">Hotel</ui-tab>
        <ui-tab aria-controls="travelHotel2">Travel + Hotel</ui-tab>
        <ui-tab aria-controls="cars2">Cars</ui-tab>
      </ui-tabs>

      <div class="page">
        <p id="travel2" :hidden="selected2 !== 'travel2'">Travel page</p>
        <p id="hotel2" :hidden="selected2 !== 'hotel2'">Hotel page</p>
        <p id="travelHotel2" :hidden="selected2 !== 'travelHotel2'">Hotel & travel page</p>
        <p id="cars2" :hidden="selected2 !== 'cars2'">Cars page</p>
      </div>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="display-large">Primary icon tabs</h2>
    <div class="frame">
      <ui-tabs data-property="selected3" @change="handleTabsChange">
        <ui-tab aria-controls="travel3">
          <ui-icon slot="icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8.5 22v-1.5l2-1.5v-5.5L2 16v-2l8.5-5V3.5q0-.625.438-1.062Q11.375 2 12 2t1.062.438q.438.437.438 1.062V9l8.5 5v2l-8.5-2.5V19l2 1.5V22L12 21Z"/></svg></ui-icon>
          Travel
        </ui-tab>
        <ui-tab aria-controls="hotel3">
          <ui-icon slot="icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M1 19V4h2v10h8V6h8q1.65 0 2.825 1.175Q23 8.35 23 10v9h-2v-3H3v3Zm6-6q-1.25 0-2.125-.875T4 10q0-1.25.875-2.125T7 7q1.25 0 2.125.875T10 10q0 1.25-.875 2.125T7 13Zm6 1h8v-4q0-.825-.587-1.413Q19.825 8 19 8h-6Zm-6-3q.425 0 .713-.288Q8 10.425 8 10t-.287-.713Q7.425 9 7 9t-.713.287Q6 9.575 6 10t.287.712Q6.575 11 7 11Zm0-1Zm6-2v6Z"/></svg></ui-icon>
          Hotel
        </ui-tab>
        <ui-tab aria-controls="travelHotel3" selected="true">
          <ui-icon slot="icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3 21V7h6V5l3-3 3 3v6h6v10Zm2-2h2v-2H5Zm0-4h2v-2H5Zm0-4h2V9H5Zm6 8h2v-2h-2Zm0-4h2v-2h-2Zm0-4h2V9h-2Zm0-4h2V5h-2Zm6 12h2v-2h-2Zm0-4h2v-2h-2Z"/></svg></ui-icon>
          Travel + Hotel
        </ui-tab>
        <ui-tab aria-controls="cars3">
          <ui-icon slot="icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 19v1q0 .425-.287.712Q5.425 21 5 21H4q-.425 0-.712-.288Q3 20.425 3 20v-8l2.1-6q.15-.45.538-.725Q6.025 5 6.5 5H9V3h6v2h2.5q.475 0 .863.275.387.275.537.725l2.1 6v8q0 .425-.288.712Q20.425 21 20 21h-1q-.425 0-.712-.288Q18 20.425 18 20v-1Zm-.2-9h12.4l-1.05-3H6.85ZM5 12v5Zm2.5 4q.625 0 1.062-.438Q9 15.125 9 14.5t-.438-1.062Q8.125 13 7.5 13t-1.062.438Q6 13.875 6 14.5t.438 1.062Q6.875 16 7.5 16Zm9 0q.625 0 1.062-.438Q18 15.125 18 14.5t-.438-1.062Q17.125 13 16.5 13t-1.062.438Q15 13.875 15 14.5t.438 1.062Q15.875 16 16.5 16ZM5 17h14v-5H5Z"/></svg></ui-icon>
          Cars
        </ui-tab>
      </ui-tabs>
      <div class="page">
        <p id="travel3" :hidden="selected3 !== 'travel3'">Travel page</p>
        <p id="hotel3" :hidden="selected3 !== 'hotel3'">Hotel page</p>
        <p id="travelHotel3" :hidden="selected3 !== 'travelHotel3'">Hotel & travel page</p>
        <p id="cars3" :hidden="selected3 !== 'cars3'">Cars page</p>
      </div>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="display-large">Secondary icon tabs</h2>

    <div class="frame">
      <ui-tabs priority="secondary" data-property="selected4" @change="handleTabsChange">
        <ui-tab aria-controls="travel4">
          <ui-icon slot="icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8.5 22v-1.5l2-1.5v-5.5L2 16v-2l8.5-5V3.5q0-.625.438-1.062Q11.375 2 12 2t1.062.438q.438.437.438 1.062V9l8.5 5v2l-8.5-2.5V19l2 1.5V22L12 21Z"/></svg></ui-icon>
          Travel
        </ui-tab>
        <ui-tab aria-controls="hotel4">
          <ui-icon slot="icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M1 19V4h2v10h8V6h8q1.65 0 2.825 1.175Q23 8.35 23 10v9h-2v-3H3v3Zm6-6q-1.25 0-2.125-.875T4 10q0-1.25.875-2.125T7 7q1.25 0 2.125.875T10 10q0 1.25-.875 2.125T7 13Zm6 1h8v-4q0-.825-.587-1.413Q19.825 8 19 8h-6Zm-6-3q.425 0 .713-.288Q8 10.425 8 10t-.287-.713Q7.425 9 7 9t-.713.287Q6 9.575 6 10t.287.712Q6.575 11 7 11Zm0-1Zm6-2v6Z"/></svg></ui-icon>
          Hotel
        </ui-tab>
        <ui-tab aria-controls="travelHotel4">
          <ui-icon slot="icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3 21V7h6V5l3-3 3 3v6h6v10Zm2-2h2v-2H5Zm0-4h2v-2H5Zm0-4h2V9H5Zm6 8h2v-2h-2Zm0-4h2v-2h-2Zm0-4h2V9h-2Zm0-4h2V5h-2Zm6 12h2v-2h-2Zm0-4h2v-2h-2Z"/></svg></ui-icon>
          Travel + Hotel
        </ui-tab>
        <ui-tab aria-controls="cars4" selected="true">
          <ui-icon slot="icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 19v1q0 .425-.287.712Q5.425 21 5 21H4q-.425 0-.712-.288Q3 20.425 3 20v-8l2.1-6q.15-.45.538-.725Q6.025 5 6.5 5H9V3h6v2h2.5q.475 0 .863.275.387.275.537.725l2.1 6v8q0 .425-.288.712Q20.425 21 20 21h-1q-.425 0-.712-.288Q18 20.425 18 20v-1Zm-.2-9h12.4l-1.05-3H6.85ZM5 12v5Zm2.5 4q.625 0 1.062-.438Q9 15.125 9 14.5t-.438-1.062Q8.125 13 7.5 13t-1.062.438Q6 13.875 6 14.5t.438 1.062Q6.875 16 7.5 16Zm9 0q.625 0 1.062-.438Q18 15.125 18 14.5t-.438-1.062Q17.125 13 16.5 13t-1.062.438Q15 13.875 15 14.5t.438 1.062Q15.875 16 16.5 16ZM5 17h14v-5H5Z"/></svg></ui-icon>
          Cars
        </ui-tab>
      </ui-tabs>
      <div class="page">
        <p id="travel4" :hidden="selected4 !== 'travel4'">Travel page</p>
        <p id="hotel4" :hidden="selected4 !== 'hotel4'">Hotel page</p>
        <p id="travelHotel4" :hidden="selected4 !== 'travelHotel4'">Hotel & travel page</p>
        <p id="cars4" :hidden="selected4 !== 'cars4'">Cars page</p>
      </div>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="display-large">Scrollable tabs</h2>
    <div class="frame scrollable">
      <ui-tabs data-property="selected5" @change="handleTabsChange">
        <ui-tab aria-controls="travel5" selected="true">Travel</ui-tab>
        <ui-tab aria-controls="hotel5">Hotel</ui-tab>
        <ui-tab aria-controls="travelHotel5">Travel + Hotel</ui-tab>
        <ui-tab aria-controls="cars5" disabled="true">Cars</ui-tab>

        <ui-tab aria-controls="travel51">Travel (1)</ui-tab>
        <ui-tab aria-controls="hotel51">Hotel (1)</ui-tab>
        <ui-tab aria-controls="travelHotel51">Travel + Hotel (1)</ui-tab>
        <ui-tab aria-controls="cars51" disabled="true">Cars (1)</ui-tab>

        <ui-tab aria-controls="travel52">Travel (2)</ui-tab>
        <ui-tab aria-controls="hotel52">Hotel (2)</ui-tab>
        <ui-tab aria-controls="travelHotel52">Travel + Hotel (2)</ui-tab>
        <ui-tab aria-controls="cars52" disabled="true">Cars (2)</ui-tab>
      </ui-tabs>

      <div class="page">
        <p id="travel5" :hidden="selected5 !== 'travel5'">Travel page</p>
        <p id="hotel5" :hidden="selected5 !== 'hotel5'">Hotel page</p>
        <p id="travelHotel5" :hidden="selected5 !== 'travelHotel5'">Hotel & travel page</p>
        <p id="cars5" :hidden="selected5 !== 'cars5'">Cars page</p>

        <p id="travel51" :hidden="selected5 !== 'travel51'">Travel page (1)</p>
        <p id="hotel51" :hidden="selected5 !== 'hotel51'">Hotel page (1)</p>
        <p id="travelHotel51" :hidden="selected5 !== 'travelHotel51'">Hotel & travel page (1)</p>
        <p id="cars51" :hidden="selected5 !== 'cars51'">Cars page (1)</p>

        <p id="travel52" :hidden="selected5 !== 'travel52'">Travel page (2)</p>
        <p id="hotel52" :hidden="selected5 !== 'hotel52'">Hotel page (2)</p>
        <p id="travelHotel52" :hidden="selected5 !== 'travelHotel52'">Hotel & travel page (2)</p>
        <p id="cars52" :hidden="selected5 !== 'cars52'">Cars page (2)</p>
      </div>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="display-large">Themed tabs</h2>

    <div class="frame themed">
      <ui-tabs data-property="selected6" @change="handleTabsChange">
        <ui-tab aria-controls="travel6">Travel</ui-tab>
        <ui-tab aria-controls="hotel6">Hotel</ui-tab>
        <ui-tab aria-controls="travelHotel6">Travel + Hotel</ui-tab>
        <ui-tab aria-controls="cars6">Cars</ui-tab>
      </ui-tabs>

      <div class="page">
        <p id="travel6" :hidden="selected6 !== 'travel6'">Travel page</p>
        <p id="hotel6" :hidden="selected6 !== 'hotel6'">Hotel page</p>
        <p id="travelHotel6" :hidden="selected6 !== 'travelHotel6'">Hotel & travel page</p>
        <p id="cars6" :hidden="selected6 !== 'cars6'">Cars page</p>
      </div>
    </div>

    <div class="frame themed">
      <ui-tabs priority="secondary" data-property="selected7" @change="handleTabsChange">
        <ui-tab aria-controls="travel7">Travel</ui-tab>
        <ui-tab aria-controls="hotel7" selected="true">Hotel</ui-tab>
        <ui-tab aria-controls="travelHotel7">Travel + Hotel</ui-tab>
        <ui-tab aria-controls="cars7">Cars</ui-tab>
      </ui-tabs>

      <div class="page">
        <p id="travel7" :hidden="selected7 !== 'travel7'">Travel page</p>
        <p id="hotel7" :hidden="selected7 !== 'hotel7'">Hotel page</p>
        <p id="travelHotel7" :hidden="selected7 !== 'travelHotel7'">Hotel & travel page</p>
        <p id="cars7" :hidden="selected7 !== 'cars7'">Cars page</p>
      </div>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="display-large">Tabs with badges</h2>
    <p>
      Tabs support badges conforming strictly to Material Design 3 specifications:
      anchored with a 6dp overlap on stacked or icon-only tabs, or placed inline trailing the label with a 4dp gap.
    </p>

    <h3 class="title-medium">Primary stacked tabs with badge over icon</h3>
    <div class="frame">
      <ui-tabs data-property="selectedBadge1" @change="handleTabsChange">
        <ui-tab aria-controls="badgeFlights1" selected="true">
          <ui-icon slot="icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8.5 22v-1.5l2-1.5v-5.5L2 16v-2l8.5-5V3.5q0-.625.438-1.062Q11.375 2 12 2t1.062.438q.438.437.438 1.062V9l8.5 5v2l-8.5-2.5V19l2 1.5V22L12 21Z"/></svg></ui-icon>
          Flights
          <ui-badge slot="badge">3</ui-badge>
        </ui-tab>
        <ui-tab aria-controls="badgeTrips1">
          <ui-icon slot="icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M1 19V4h2v10h8V6h8q1.65 0 2.825 1.175Q23 8.35 23 10v9h-2v-3H3v3Zm6-6q-1.25 0-2.125-.875T4 10q0-1.25.875-2.125T7 7q1.25 0 2.125.875T10 10q0 1.25-.875 2.125T7 13Zm6 1h8v-4q0-.825-.587-1.413Q19.825 8 19 8h-6Zm-6-3q.425 0 .713-.288Q8 10.425 8 10t-.287-.713Q7.425 9 7 9t-.713.287Q6 9.575 6 10t.287.712Q6.575 11 7 11Zm0-1Zm6-2v6Z"/></svg></ui-icon>
          Trips
        </ui-tab>
        <ui-tab aria-controls="badgeExplore1">
          <ui-icon slot="icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 22q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.137Q9.925 2 12 2t3.9.788q1.825.787 3.175 2.137 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm-1.8-6.1 5.9-2.9-2.9-5.9-5.9 2.9ZM12 13q.425 0 .713-.288Q13 12.425 13 12t-.287-.713Q12.425 11 12 11t-.713.287Q11 11.575 11 12t.287.712Q11.575 13 12 13Z"/></svg></ui-icon>
          Explore
          <ui-badge slot="badge" dot></ui-badge>
        </ui-tab>
        <ui-tab aria-controls="badgeBuy1">
          <ui-icon slot="icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M7 22q-.825 0-1.412-.587Q5 20.825 5 20t.588-1.413Q6.175 18 7 18t1.413.587Q9 19.175 9 20t-.587 1.413Q7.825 22 7 22Zm10 0q-.825 0-1.412-.587Q15 20.825 15 20t.588-1.413Q16.175 18 17 18t1.413.587Q19 19.175 19 20t-.587 1.413Q17.825 22 17 22ZM6.15 6l2.4 5h7l2.75-5ZM5.2 4h16.55q.675 0 1.013.563.337.562-.013 1.137l-3.55 6.4q-.275.5-.725.7-.45.2-1.025.2H8.1L7 15h12v2H7q-1.125 0-1.7-.887-.575-.888-.15-1.913L6.6 11.6 3 4H1V2h3.25Z"/></svg></ui-icon>
          Buy
          <ui-badge slot="badge">32</ui-badge>
        </ui-tab>
      </ui-tabs>
      <div class="page">
        <p id="badgeFlights1" :hidden="selectedBadge1 !== 'badgeFlights1'">Flights page (with badge 3)</p>
        <p id="badgeTrips1" :hidden="selectedBadge1 !== 'badgeTrips1'">Trips page</p>
        <p id="badgeExplore1" :hidden="selectedBadge1 !== 'badgeExplore1'">Explore page (with dot badge)</p>
        <p id="badgeBuy1" :hidden="selectedBadge1 !== 'badgeBuy1'">Buy page (with badge 32)</p>
      </div>
    </div>

    <h3 class="title-medium">Primary label-only tabs with inline badge (4dp gap)</h3>
    <div class="frame">
      <ui-tabs data-property="selectedBadge2" @change="handleTabsChange">
        <ui-tab aria-controls="badgeFlights2" selected="true">
          Flights
          <ui-badge slot="badge">3</ui-badge>
        </ui-tab>
        <ui-tab aria-controls="badgeTrips2">
          Trips
        </ui-tab>
        <ui-tab aria-controls="badgeExplore2">
          Explore
          <ui-badge slot="badge">999+</ui-badge>
        </ui-tab>
        <ui-tab aria-controls="badgeBuy2">
          Buy
          <ui-badge slot="badge" dot></ui-badge>
        </ui-tab>
      </ui-tabs>
      <div class="page">
        <p id="badgeFlights2" :hidden="selectedBadge2 !== 'badgeFlights2'">Flights page</p>
        <p id="badgeTrips2" :hidden="selectedBadge2 !== 'badgeTrips2'">Trips page</p>
        <p id="badgeExplore2" :hidden="selectedBadge2 !== 'badgeExplore2'">Explore page</p>
        <p id="badgeBuy2" :hidden="selectedBadge2 !== 'badgeBuy2'">Buy page</p>
      </div>
    </div>

    <h3 class="title-medium">Secondary label-only tabs with inline badge (4dp gap)</h3>
    <div class="frame">
      <ui-tabs priority="secondary" data-property="selectedBadge3" @change="handleTabsChange">
        <ui-tab aria-controls="badgeOverview3" selected="true">
          Overview
          <ui-badge slot="badge">3</ui-badge>
        </ui-tab>
        <ui-tab aria-controls="badgeSpecs3">
          Specifications
        </ui-tab>
      </ui-tabs>
      <div class="page">
        <p id="badgeOverview3" :hidden="selectedBadge3 !== 'badgeOverview3'">Overview content</p>
        <p id="badgeSpecs3" :hidden="selectedBadge3 !== 'badgeSpecs3'">Specifications content</p>
      </div>
    </div>

    <h3 class="title-medium">Secondary icon + label tabs with inline badge (8dp icon gap, 4dp badge gap)</h3>
    <div class="frame">
      <ui-tabs priority="secondary" data-property="selectedBadge4" @change="handleTabsChange">
        <ui-tab aria-controls="badgeOverview4" selected="true">
          <ui-icon slot="icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg></ui-icon>
          Overview
          <ui-badge slot="badge">3</ui-badge>
        </ui-tab>
        <ui-tab aria-controls="badgeSpecs4">
          <ui-icon slot="icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg></ui-icon>
          Specifications
        </ui-tab>
      </ui-tabs>
      <div class="page">
        <p id="badgeOverview4" :hidden="selectedBadge4 !== 'badgeOverview4'">Overview content</p>
        <p id="badgeSpecs4" :hidden="selectedBadge4 !== 'badgeSpecs4'">Specifications content</p>
      </div>
    </div>
  </section>
</template>
