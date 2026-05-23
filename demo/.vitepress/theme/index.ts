import DefaultTheme from 'vitepress/theme'
import '../../../src/styles/m3/tokens.css'
import '../../../src/styles/m3/theme.css'
import '../../../src/styles/m3/native.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp() {
    if (typeof window !== 'undefined') {
      const updateTheme = () => {
        const isDark = document.documentElement.classList.contains('dark')
        document.documentElement.classList.toggle('theme-dark', isDark)
        document.documentElement.classList.toggle('theme-light', !isDark)
      }

      updateTheme()

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            updateTheme()
          }
        })
      })
      observer.observe(document.documentElement, { attributes: true })
    }
  },
}
