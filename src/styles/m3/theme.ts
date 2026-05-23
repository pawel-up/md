import { css } from 'lit'

export default css`
  html.theme-light {
    --md-sys-color-primary-05a: var(--md-sys-color-primary-light-05a);
    --md-sys-color-primary-08a: var(--md-sys-color-primary-light-08a);
    --md-sys-color-primary-11a: var(--md-sys-color-primary-light-11a);
    --md-sys-color-primary-12a: var(--md-sys-color-primary-light-12a);
    --md-sys-color-primary-13a: var(--md-sys-color-primary-light-13a);
    --md-sys-color-primary: var(--md-sys-color-primary-light);
    --md-sys-color-surface-tint: var(--md-sys-color-surface-tint-light);
    --md-sys-color-on-primary: var(--md-sys-color-on-primary-light);
    --md-sys-color-primary-container: var(--md-sys-color-primary-container-light);
    --md-sys-color-on-primary-container: var(--md-sys-color-on-primary-container-light);
    --md-sys-color-secondary: var(--md-sys-color-secondary-light);
    --md-sys-color-on-secondary: var(--md-sys-color-on-secondary-light);
    --md-sys-color-secondary-container: var(--md-sys-color-secondary-container-light);
    --md-sys-color-on-secondary-container: var(--md-sys-color-on-secondary-container-light);
    --md-sys-color-tertiary: var(--md-sys-color-tertiary-light);
    --md-sys-color-on-tertiary: var(--md-sys-color-on-tertiary-light);
    --md-sys-color-tertiary-container: var(--md-sys-color-tertiary-container-light);
    --md-sys-color-on-tertiary-container: var(--md-sys-color-on-tertiary-container-light);
    --md-sys-color-error: var(--md-sys-color-error-light);
    --md-sys-color-on-error: var(--md-sys-color-on-error-light);
    --md-sys-color-error-container: var(--md-sys-color-error-container-light);
    --md-sys-color-on-error-container: var(--md-sys-color-on-error-container-light);
    --md-sys-color-background: var(--md-sys-color-background-light);
    --md-sys-color-on-background: var(--md-sys-color-on-background-light);
    --md-sys-color-surface: var(--md-sys-color-surface-light);
    --md-sys-color-on-surface: var(--md-sys-color-on-surface-light);
    --md-sys-color-surface-variant: var(--md-sys-color-surface-variant-light);
    --md-sys-color-on-surface-variant: var(--md-sys-color-on-surface-variant-light);
    --md-sys-color-outline: var(--md-sys-color-outline-light);
    --md-sys-color-outline-variant: var(--md-sys-color-outline-variant-light);
    --md-sys-color-shadow: var(--md-sys-color-shadow-light);
    --md-sys-color-scrim: var(--md-sys-color-scrim-light);
    --md-sys-color-inverse-surface: var(--md-sys-color-inverse-surface-light);
    --md-sys-color-inverse-on-surface: var(--md-sys-color-inverse-on-surface-light);
    --md-sys-color-inverse-primary: var(--md-sys-color-inverse-primary-light);
    --md-sys-color-primary-fixed: var(--md-sys-color-primary-fixed-light);
    --md-sys-color-on-primary-fixed: var(--md-sys-color-on-primary-fixed-light);
    --md-sys-color-primary-fixed-dim: var(--md-sys-color-primary-fixed-dim-light);
    --md-sys-color-on-primary-fixed-variant: var(--md-sys-color-on-primary-fixed-variant-light);
    --md-sys-color-secondary-fixed: var(--md-sys-color-secondary-fixed-light);
    --md-sys-color-on-secondary-fixed: var(--md-sys-color-on-secondary-fixed-light);
    --md-sys-color-secondary-fixed-dim: var(--md-sys-color-secondary-fixed-dim-light);
    --md-sys-color-on-secondary-fixed-variant: var(--md-sys-color-on-secondary-fixed-variant-light);
    --md-sys-color-tertiary-fixed: var(--md-sys-color-tertiary-fixed-light);
    --md-sys-color-on-tertiary-fixed: var(--md-sys-color-on-tertiary-fixed-light);
    --md-sys-color-tertiary-fixed-dim: var(--md-sys-color-tertiary-fixed-dim-light);
    --md-sys-color-on-tertiary-fixed-variant: var(--md-sys-color-on-tertiary-fixed-variant-light);
    --md-sys-color-surface-dim: var(--md-sys-color-surface-dim-light);
    --md-sys-color-surface-bright: var(--md-sys-color-surface-bright-light);
    --md-sys-color-surface-container-lowest: var(--md-sys-color-surface-container-lowest-light);
    --md-sys-color-surface-container-low: var(--md-sys-color-surface-container-low-light);
    --md-sys-color-surface-container: var(--md-sys-color-surface-container-light);
    --md-sys-color-surface-container-high: var(--md-sys-color-surface-container-high-light);
    --md-sys-color-surface-container-highest: var(--md-sys-color-surface-container-highest-light);

    /* CUSTOM */
    --md-sys-elevation-0: none;
    --md-sys-elevation-1: var(--md-sys-elevation-1-light);
    --md-sys-elevation-2: var(--md-sys-elevation-2-light);
    --md-sys-elevation-3: var(--md-sys-elevation-3-light);
    --md-sys-elevation-4: var(--md-sys-elevation-4-light);
    --md-sys-elevation-5: var(--md-sys-elevation-5-light);

    /* Prism */
    --code-operator-value-color: #a67f59;
    --code-operator-value-background-color: hsla(0, 0%, 100%, 0.5);
    --code-keyword-value-color: #07a;
    --code-function-value-color: #dd4a68;
    --code-variable-value-color: #e90;
    --code-type-text-value-color: #690;
    --code-type-boolean-value-color: #905;
    --code-type-number-value-color: #905;
    --code-property-value-color: #905;
    --code-punctuation-value-color: #999;
    --code-token-comment-value-color: slategray;
  }

  html.theme-dark {
    --md-sys-color-primary-05a: var(--md-sys-color-primary-dark-05a);
    --md-sys-color-primary-08a: var(--md-sys-color-primary-dark-08a);
    --md-sys-color-primary-11a: var(--md-sys-color-primary-dark-11a);
    --md-sys-color-primary-12a: var(--md-sys-color-primary-dark-12a);
    --md-sys-color-primary-13a: var(--md-sys-color-primary-dark-13a);
    --md-sys-color-primary: var(--md-sys-color-primary-dark);
    --md-sys-color-surface-tint: var(--md-sys-color-surface-tint-dark);
    --md-sys-color-on-primary: var(--md-sys-color-on-primary-dark);
    --md-sys-color-primary-container: var(--md-sys-color-primary-container-dark);
    --md-sys-color-on-primary-container: var(--md-sys-color-on-primary-container-dark);
    --md-sys-color-secondary: var(--md-sys-color-secondary-dark);
    --md-sys-color-on-secondary: var(--md-sys-color-on-secondary-dark);
    --md-sys-color-secondary-container: var(--md-sys-color-secondary-container-dark);
    --md-sys-color-on-secondary-container: var(--md-sys-color-on-secondary-container-dark);
    --md-sys-color-tertiary: var(--md-sys-color-tertiary-dark);
    --md-sys-color-on-tertiary: var(--md-sys-color-on-tertiary-dark);
    --md-sys-color-tertiary-container: var(--md-sys-color-tertiary-container-dark);
    --md-sys-color-on-tertiary-container: var(--md-sys-color-on-tertiary-container-dark);
    --md-sys-color-error: var(--md-sys-color-error-dark);
    --md-sys-color-on-error: var(--md-sys-color-on-error-dark);
    --md-sys-color-error-container: var(--md-sys-color-error-container-dark);
    --md-sys-color-on-error-container: var(--md-sys-color-on-error-container-dark);
    --md-sys-color-background: var(--md-sys-color-background-dark);
    --md-sys-color-on-background: var(--md-sys-color-on-background-dark);
    --md-sys-color-surface: var(--md-sys-color-surface-dark);
    --md-sys-color-on-surface: var(--md-sys-color-on-surface-dark);
    --md-sys-color-surface-variant: var(--md-sys-color-surface-variant-dark);
    --md-sys-color-on-surface-variant: var(--md-sys-color-on-surface-variant-dark);
    --md-sys-color-outline: var(--md-sys-color-outline-dark);
    --md-sys-color-outline-variant: var(--md-sys-color-outline-variant-dark);
    --md-sys-color-shadow: var(--md-sys-color-shadow-dark);
    --md-sys-color-scrim: var(--md-sys-color-scrim-dark);
    --md-sys-color-inverse-surface: var(--md-sys-color-inverse-surface-dark);
    --md-sys-color-inverse-on-surface: var(--md-sys-color-inverse-on-surface-dark);
    --md-sys-color-inverse-primary: var(--md-sys-color-inverse-primary-dark);
    --md-sys-color-primary-fixed: var(--md-sys-color-primary-fixed-dark);
    --md-sys-color-on-primary-fixed: var(--md-sys-color-on-primary-fixed-dark);
    --md-sys-color-primary-fixed-dim: var(--md-sys-color-primary-fixed-dim-dark);
    --md-sys-color-on-primary-fixed-variant: var(--md-sys-color-on-primary-fixed-variant-dark);
    --md-sys-color-secondary-fixed: var(--md-sys-color-secondary-fixed-dark);
    --md-sys-color-on-secondary-fixed: var(--md-sys-color-on-secondary-fixed-dark);
    --md-sys-color-secondary-fixed-dim: var(--md-sys-color-secondary-fixed-dim-dark);
    --md-sys-color-on-secondary-fixed-variant: var(--md-sys-color-on-secondary-fixed-variant-dark);
    --md-sys-color-tertiary-fixed: var(--md-sys-color-tertiary-fixed-dark);
    --md-sys-color-on-tertiary-fixed: var(--md-sys-color-on-tertiary-fixed-dark);
    --md-sys-color-tertiary-fixed-dim: var(--md-sys-color-tertiary-fixed-dim-dark);
    --md-sys-color-on-tertiary-fixed-variant: var(--md-sys-color-on-tertiary-fixed-variant-dark);
    --md-sys-color-surface-dim: var(--md-sys-color-surface-dim-dark);
    --md-sys-color-surface-bright: var(--md-sys-color-surface-bright-dark);
    --md-sys-color-surface-container-lowest: var(--md-sys-color-surface-container-lowest-dark);
    --md-sys-color-surface-container-low: var(--md-sys-color-surface-container-low-dark);
    --md-sys-color-surface-container: var(--md-sys-color-surface-container-dark);
    --md-sys-color-surface-container-high: var(--md-sys-color-surface-container-high-dark);
    --md-sys-color-surface-container-highest: var(--md-sys-color-surface-container-highest-dark);

    /* CUSTOM */
    --md-sys-elevation-0: none;
    --md-sys-elevation-1: var(--md-sys-elevation-1-dark);
    --md-sys-elevation-2: var(--md-sys-elevation-2-dark);
    --md-sys-elevation-3: var(--md-sys-elevation-3-dark);
    --md-sys-elevation-4: var(--md-sys-elevation-4-dark);
    --md-sys-elevation-5: var(--md-sys-elevation-5-dark);

    /* Prism */
    --code-operator-value-color: #ffc185;
    --code-operator-value-background-color: transparent;
    --code-keyword-value-color: #00b2ff;
    --code-function-value-color: #ff7d97;
    --code-variable-value-color: #e90;
    --code-type-text-value-color: #aaff00;
    --code-type-boolean-value-color: #f882c4;
    --code-type-number-value-color: #f882c4;
    --code-property-value-color: #ff9bd3;
    --code-punctuation-value-color: #aaa;
    --code-token-comment-value-color: #93a9bf;
  }
`
