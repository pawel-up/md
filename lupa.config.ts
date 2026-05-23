/* eslint-disable no-restricted-globals */
import { defineConfig } from '@pawel-up/lupa/runner'
import type { Assert } from '@pawel-up/lupa/assert'
import esbuild from 'esbuild'

const activated = ['progress']
if (process.env.GITHUB_ACTIONS === 'true') {
  activated.push('github')
}

export default defineConfig({
  testPlugins: ['@pawel-up/lupa/assert'],
  reporters: {
    activated,
  },
  suites: [
    {
      name: 'unit',
      files: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.spec.ts'],
    },
  ],
  harness: {
    stylesheets: ['./src/styles/m3/tokens.css', './src/styles/m3/theme.css'],
    template: `
      <!DOCTYPE html>
      <html lang="en" class="theme-light">
        <head>
          <meta charset="utf-8">
          <title>Unit tests</title>
          <!-- lupa-stylesheets -->
        </head>
        <body>
          <div id="app-root"></div>
          <!-- lupa-scripts -->
        </body>
      </html>
    `,
  },
  vite: {
    plugins: [
      {
        name: 'esbuild-decorators',
        enforce: 'pre',
        async transform(code: string, id: string) {
          if (id.endsWith('.ts') && code.includes('@')) {
            const result = await esbuild.transform(code, {
              loader: 'ts',
              target: 'es2024',
              sourcemap: true,
              sourcefile: id,
            })
            return { code: result.code, map: result.map }
          }
        },
      },
    ],
    optimizeDeps: {
      include: ['axe-core', 'sinon', 'lit', 'lit-html'],
      exclude: ['@pawel-up/lupa'],
    },
  },
})

declare module '@pawel-up/lupa/testing' {
  interface TestContext {
    assert: Assert
  }
}
