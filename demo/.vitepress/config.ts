import { defineConfig } from 'vitepress'

export default defineConfig({
  vite: {
    esbuild: { target: 'es2022' },
    build: { target: 'es2022' },
    plugins: [
      {
        name: 'custom-hmr',
        enforce: 'post',
        handleHotUpdate({ file, server }) {
          if (file.includes('/src/')) {
            server.ws.send({ type: 'full-reload', path: '*' })
          }
        },
      },
    ],
  },
  title: 'Material 3 components',
  description: 'Material 3 components from Pawel Uchida-Psztyc',
  head: [
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
        rel: 'stylesheet',
      },
    ],
  ],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Components', link: '/components/button' },
    ],
    sidebar: [
      {
        text: 'Components',
        items: [
          { text: 'Button', link: '/components/button' },
          { text: 'Checkbox', link: '/components/checkbox' },
          { text: 'Chip', link: '/components/chip' },
          { text: 'Collapse', link: '/components/collapse' },
          { text: 'Date Picker', link: '/components/date-picker' },
          { text: 'Dialog', link: '/components/dialog' },
          { text: 'Dropdown List', link: '/components/dropdown-list' },
          { text: 'Focus Ring', link: '/components/focus-ring' },
          { text: 'Icon Button', link: '/components/icon-button' },
          { text: 'Inputs', link: '/components/inputs' },
          { text: 'List', link: '/components/list' },
          { text: 'Listbox', link: '/components/listbox' },
          { text: 'Menu', link: '/components/menu' },
          { text: 'Notification', link: '/components/notification' },
          { text: 'Progress', link: '/components/progress' },
          { text: 'Segmented Button', link: '/components/segmented-button' },
          { text: 'Select', link: '/components/select' },
          { text: 'Tabs', link: '/components/tabs' },
        ],
      },
    ],
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.includes('-'),
      },
    },
  },
})
