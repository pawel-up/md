import { css } from 'lit'

export default css`
  .display-large,
  .display-medium,
  .display-small,
  .headline-large,
  .headline-medium,
  .headline-small:not(.spacing-headline-small),
  .title-large,
  .title-medium,
  .title-small {
    margin: 0;
    padding: 0;
  }

  .display-large {
    font-family: var(--md-sys-typescale-display-large-font);
    font-weight: var(--md-sys-typescale-display-large-weight);
    font-size: var(--md-sys-typescale-display-large-size);
    line-height: var(--md-sys-typescale-display-large-height);
    letter-spacing: var(--md-sys-typescale-display-large-tracking);
  }

  .display-medium {
    font-family: var(--md-sys-typescale-display-medium-font);
    font-weight: var(--md-sys-typescale-display-medium-weight);
    font-size: var(--md-sys-typescale-display-medium-size);
    line-height: var(--md-sys-typescale-display-medium-height);
    letter-spacing: var(--md-sys-typescale-display-medium-tracking);
  }

  .display-small {
    font-family: var(--md-sys-typescale-display-small-font);
    font-weight: var(--md-sys-typescale-display-small-weight);
    font-size: var(--md-sys-typescale-display-small-size);
    letter-spacing: var(--md-sys-typescale-display-small-tracking);
    line-height: var(--md-sys-typescale-display-small-height);
  }

  .headline-large {
    font-family: var(--md-sys-typescale-headline-large-font);
    font-weight: var(--md-sys-typescale-headline-large-weight);
    font-size: var(--md-sys-typescale-headline-large-size);
    letter-spacing: var(--md-sys-typescale-headline-large-tracking);
    line-height: var(--md-sys-typescale-headline-large-height);
  }

  .headline-medium {
    font-family: var(--md-sys-typescale-headline-medium-font);
    font-weight: var(--md-sys-typescale-headline-medium-weight);
    font-size: var(--md-sys-typescale-headline-medium-size);
    letter-spacing: var(--md-sys-typescale-headline-medium-tracking);
    line-height: var(--md-sys-typescale-headline-medium-height);
  }

  .headline-small {
    font-family: var(--md-sys-typescale-headline-small-font);
    font-weight: var(--md-sys-typescale-headline-small-weight);
    font-size: var(--md-sys-typescale-headline-small-size);
    letter-spacing: var(--md-sys-typescale-headline-small-tracking);
    line-height: var(--md-sys-typescale-headline-small-height);
  }

  .title-large {
    font-family: var(--md-sys-typescale-title-large-font);
    font-weight: var(--md-sys-typescale-title-large-weight);
    font-size: var(--md-sys-typescale-title-large-size);
    letter-spacing: var(--md-sys-typescale-title-large-tracking);
    line-height: var(--md-sys-typescale-title-large-height);
  }

  .title-medium {
    font-family: var(--md-sys-typescale-title-medium-font);
    font-weight: var(--md-sys-typescale-title-medium-weight);
    font-size: var(--md-sys-typescale-title-medium-size);
    letter-spacing: var(--md-sys-typescale-title-medium-tracking);
    line-height: var(--md-sys-typescale-title-medium-height);
  }

  .title-small {
    font-family: var(--md-sys-typescale-title-small-font);
    font-weight: var(--md-sys-typescale-title-small-weight);
    font-size: var(--md-sys-typescale-title-small-size);
    letter-spacing: var(--md-sys-typescale-title-small-tracking);
    line-height: var(--md-sys-typescale-title-small-height);
  }

  .body-large {
    font-family: var(--md-sys-typescale-body-large-font);
    font-weight: var(--md-sys-typescale-body-large-weight);
    font-size: var(--md-sys-typescale-body-large-size);
    letter-spacing: var(--md-sys-typescale-body-large-tracking);
    line-height: var(--md-sys-typescale-body-large-height);
  }

  .body-medium {
    font-family: var(--md-sys-typescale-body-medium-font);
    font-weight: var(--md-sys-typescale-body-medium-weight);
    font-size: var(--md-sys-typescale-body-medium-size);
    letter-spacing: var(--md-sys-typescale-body-medium-tracking);
    line-height: var(--md-sys-typescale-body-medium-height);
  }

  .body-small {
    font-family: var(--md-sys-typescale-body-small-font);
    font-weight: var(--md-sys-typescale-body-small-weight);
    font-size: var(--md-sys-typescale-body-small-size);
    letter-spacing: var(--md-sys-typescale-body-small-tracking);
    line-height: var(--md-sys-typescale-body-small-height);
  }

  .label-large,
  .label-large-prominent {
    font-family: var(--md-sys-typescale-label-large-font);
    font-size: var(--md-sys-typescale-label-large-size);
    letter-spacing: var(--md-sys-typescale-label-large-tracking);
    line-height: var(--md-sys-typescale-label-large-height);
  }

  .label-large {
    font-weight: var(--md-sys-typescale-label-large-weight);
  }

  .label-large-prominent {
    font-weight: var(--md-sys-typescale-label-large-weight-prominent);
  }

  .label-medium,
  .label-medium-prominent {
    font-family: var(--md-sys-typescale-label-medium-font);
    font-size: var(--md-sys-typescale-label-medium-size);
    letter-spacing: var(--md-sys-typescale-label-medium-tracking);
    line-height: var(--md-sys-typescale-label-medium-height);
  }

  .label-medium {
    font-weight: var(--md-sys-typescale-label-medium-weight);
  }

  .label-medium-prominent {
    font-weight: var(--md-sys-typescale-label-medium-weight-prominent);
  }

  .label-small {
    font-family: var(--md-sys-typescale-label-small-font);
    font-weight: var(--md-sys-typescale-label-small-weight);
    font-size: var(--md-sys-typescale-label-small-size);
    letter-spacing: var(--md-sys-typescale-label-small-tracking);
    line-height: var(--md-sys-typescale-label-small-height);
  }
`
