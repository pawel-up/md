# @pawel-up/md

> A modern, fully-featured Material Design 3 (Material You) Web Component library built with Lit.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm version](https://badge.fury.io/js/@pawel-up%2Fmd.svg)](https://badge.fury.io/js/@pawel-up%2Fmd)

## Motivation

Google's official `@material/web` component library has entered maintenance mode, leaving a void for developers who need actively maintained, cutting-edge Material Design 3 components. 

`@pawel-up/md` was built from the ground up to provide a robust, modern, and production-ready implementation of the Material You specification. It delivers dynamic color theming, tonal surfaces, modern shape morphing, and spring-based physics without any legacy dependencies.

## Features

- **Pure Web Components:** Built entirely with [Lit](https://lit.dev/), ensuring they are lightweight, fast, and framework-agnostic. Use them seamlessly in Vue, React, Angular, Svelte, or Vanilla JS.
- **Material Design 3:** Faithfully implements the latest MD3 specifications, avoiding the outdated MD2 legacy code entirely.
- **Dynamic Theming:** Deep support for dynamic colors, contrast variants, and tonal surface elevation (no more default drop shadows!).
- **Accessible by Default:** Built with rich ARIA support, keyboard navigation, and focus management out of the box.
- **Comprehensive Catalog:** Includes everything from foundational buttons, inputs, and menus, to complex dialogs, navigation drawers, and date pickers.

## Installation

```bash
npm install @pawel-up/md
```

## Quick Start

Import the components you need and use them directly in your HTML:

```html
<!DOCTYPE html>
<html lang="en" class="theme-light">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  
  <!-- Import the specific components you need -->
  <script type="module">
    import '@pawel-up/md/button/ui-button.js';
    import '@pawel-up/md/icons/ui-icon.js';
  </script>
</head>
<body>
  
  <!-- Use them seamlessly -->
  <ui-button color="filled">
    <ui-icon slot="icon">check</ui-icon>
    Submit
  </ui-button>

</body>
</html>
```

## Documentation & Demos

You can run the interactive documentation and component playground locally. It's powered by VitePress for lightning-fast browsing:

```bash
# Install dependencies
npm install

# Start the local documentation server
npm run demo:dev
```

## Theming

The library uses CSS class-based theming applied to the `<html>` element to automatically handle light and dark modes mapping to MD3 tokens:

```html
<!-- Light Mode -->
<html class="theme-light">

<!-- Dark Mode -->
<html class="theme-dark">
```

Customize your app's theme by overriding the `--md-sys-color-*` and `--md-sys-typescale-*` CSS custom properties.

## License

Apache-2.0 © Pawel Uchida-Psztyc
