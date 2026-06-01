<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useData } from 'vitepress';

const COLOR_VARS = [
  '--md-sys-color-primary',
  '--md-sys-color-surface-tint',
  '--md-sys-color-on-primary',
  '--md-sys-color-primary-container',
  '--md-sys-color-on-primary-container',
  '--md-sys-color-secondary',
  '--md-sys-color-on-secondary',
  '--md-sys-color-secondary-container',
  '--md-sys-color-on-secondary-container',
  '--md-sys-color-tertiary',
  '--md-sys-color-on-tertiary',
  '--md-sys-color-tertiary-container',
  '--md-sys-color-on-tertiary-container',
  '--md-sys-color-error',
  '--md-sys-color-on-error',
  '--md-sys-color-error-container',
  '--md-sys-color-on-error-container',
  '--md-sys-color-background',
  '--md-sys-color-on-background',
  '--md-sys-color-surface',
  '--md-sys-color-on-surface',
  '--md-sys-color-surface-variant',
  '--md-sys-color-on-surface-variant',
  '--md-sys-color-outline',
  '--md-sys-color-outline-variant',
  '--md-sys-color-shadow',
  '--md-sys-color-scrim',
  '--md-sys-color-inverse-surface',
  '--md-sys-color-inverse-on-surface',
  '--md-sys-color-inverse-primary',
  '--md-sys-color-primary-fixed',
  '--md-sys-color-on-primary-fixed',
  '--md-sys-color-primary-fixed-dim',
  '--md-sys-color-on-primary-fixed-variant',
  '--md-sys-color-secondary-fixed',
  '--md-sys-color-on-secondary-fixed',
  '--md-sys-color-secondary-fixed-dim',
  '--md-sys-color-on-secondary-fixed-variant',
  '--md-sys-color-tertiary-fixed',
  '--md-sys-color-on-tertiary-fixed',
  '--md-sys-color-tertiary-fixed-dim',
  '--md-sys-color-on-tertiary-fixed-variant',
  '--md-sys-color-surface-dim',
  '--md-sys-color-surface-bright',
  '--md-sys-color-surface-container-lowest',
  '--md-sys-color-surface-container-low',
  '--md-sys-color-surface-container',
  '--md-sys-color-surface-container-high',
  '--md-sys-color-surface-container-highest'
];

function cssVarValue(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function renderGrid() {
  const grid = document.getElementById('colorGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const frag = document.createDocumentFragment();
  COLOR_VARS.forEach(v => {
    const value = cssVarValue(v);
    const item = document.createElement('div');
    item.className = 'color-item';
    const swatch = document.createElement('div');
    swatch.className = 'swatch';
    swatch.style.background = `var(${v})`;
    const isColor = /#|rgb|hsl|oklab|lab|lch/i.test(value);
    if (isColor && value) {
      const valSpan = document.createElement('span');
      valSpan.className = 'value';
      valSpan.textContent = value;
      swatch.appendChild(valSpan);
    }
    const label = document.createElement('code');
    label.textContent = v;
    item.appendChild(swatch);
    item.appendChild(label);
    frag.appendChild(item);
  });
  grid.appendChild(frag);
}

const { isDark } = useData();

watch(isDark, () => {
  setTimeout(renderGrid, 0);
});

onMounted(() => renderGrid());

const setTheme = (theme: string) => {
  isDark.value = theme === 'dark';
};
</script>

<template>
  <div class="demo">
    <p>This is a demonstration of the Material Design 3 theme.</p>

    <section class="demo-section">
      <h2 class="display-large">System Colors</h2>
      <div class="controls" id="themeToggle">
        <span style="font-size:12px;opacity:.75">Theme:</span>
        <button type="button" data-theme="light" :aria-pressed="!isDark" @click="setTheme('light')">Light</button>
        <button type="button" data-theme="dark" :aria-pressed="isDark" @click="setTheme('dark')">Dark</button>
      </div>
      <div class="color-grid" id="colorGrid" aria-live="polite"></div>
    </section>
  </div>
</template>

<style>
.color-grid {
  --min-tile-size: 110px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--min-tile-size), 1fr));
  gap: 1rem;
  margin-block: 1.5rem;
}
.color-item {
  font: 12px/1.2 Roboto, system-ui, sans-serif;
  text-align: center;
  border: 1px solid var(--md-sys-color-outline-variant, #ccc);
  border-radius: 8px;
  overflow: hidden;
  background: var(--md-sys-color-surface, #fff);
  box-shadow: 0 1px 2px rgba(0,0,0,.08);
  display: flex;
  flex-direction: column;
}
.color-item code {
  flex: 1;
}
.color-item .swatch {
  aspect-ratio: 3/2;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--md-sys-color-on-surface, #000);
  font-size: 10px;
  position: relative;
}
.color-item .swatch span.value {
  position: absolute;
  inset: auto 4px 4px 4px;
  padding: 2px 4px;
  font-size: 10px;
  border-radius: 4px;
  background: rgba(0,0,0,.45);
  color: #fff;
  mix-blend-mode: luminosity;
  backdrop-filter: blur(2px);
}
.color-item code {
  display: block;
  padding: .5rem .25rem .65rem;
  word-break: break-word;
  color: var(--md-sys-color-on-surface-variant, #444);
  background: linear-gradient(var(--md-sys-color-surface-container-highest, #f7f7f7), var(--md-sys-color-surface-container-high, #eee));
}
.controls { display: flex; gap: .75rem; align-items: center; margin-top: .5rem; }
.controls button {
  font: 500 12px/1 Roboto, system-ui, sans-serif;
  padding: .5rem .75rem;
  border-radius: 20px;
  cursor: pointer;
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border: none;
}
.controls button[aria-pressed="true"] {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}
</style>
