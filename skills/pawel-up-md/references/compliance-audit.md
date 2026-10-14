# MD3 Compliance Audit

When invoked with `audit` as the argument (e.g., `/material-3 audit`), or when asked to audit/review MD3 compliance, analyze the target app or page and produce a compliance report.

## Audit Procedure

1. **Identify the target**: The user provides a URL (use browser tools to inspect), file paths (read source), or a running app.
2. **Inspect the following categories** and score each 0–10:

| Category | What to check |
|----------|--------------|
| **Color tokens** | Uses `--md-sys-color-*` variables. No hardcoded or arbitrary colors for surfaces without reason. Proper tonal pairing (`onX` on `X`). |
| **Typography** | MD3 type scale uses `--md-sys-typescale-*` tokens; correct roles (Display, Headline, Title, Body, Label). |
| **Shape** | Uses `--md-sys-shape-corner-*` tokens. Buttons: full; cards: medium; avoid magic numbers. |
| **Elevation** | Tonal elevation via `--md-sys-elevation-*`. Includes hover/focus states where relevant. |
| **Components** | Uses `@pawel-up/md` custom elements (`<ui-*>`). Correct variants and proper semantic HTML. |
| **Layout** | Canonical layouts; readable max width on large widths; foldable hinge avoidance. |
| **Navigation** | Uses `ui-tabs`, `ui-menu`, or semantic navigation structures. |
| **Motion** | Transitions use MD3 easing/duration tokens. |
| **Accessibility** | **Verify contrast**: UI components often need **3:1** for large text/borders and **4.5:1** for normal text. Proper ARIA, focus order, touch targets (~48dp), and keyboard navigation. |
| **Theming** | CSS custom properties on `.theme-light` or `.theme-dark` applied to the `html` element or subtree. |

3. **Generate the report**:

```markdown
# MD3 Compliance Audit Report

Target: [URL or file path]
Date: [date]
Overall Score: [X/100]

## Scores by Category
| Category       | Score | Status |
|----------------|-------|--------|
| Color tokens   | X/10  | [pass/warn/fail] |
| Typography     | X/10  | [pass/warn/fail] |
| Shape          | X/10  | [pass/warn/fail] |
| Elevation      | X/10  | [pass/warn/fail] |
| Components     | X/10  | [pass/warn/fail] |
| Layout         | X/10  | [pass/warn/fail] |
| Navigation     | X/10  | [pass/warn/fail] |
| Motion         | X/10  | [pass/warn/fail] |
| Accessibility  | X/10  | [pass/warn/fail] |
| Theming        | X/10  | [pass/warn/fail] |

## Critical Issues
[List items scoring 0-3 with specific file:line references and fixes]

## Warnings
[List items scoring 4-6 with recommendations]

## Passing
[List items scoring 7-10 with notes on what's done well]

## Recommended Fixes (Priority Order)
1. [Most impactful fix first]
2. ...
```

## Audit Methods

**For a live URL** (browser or devtools):
- Inspect computed styles and CSS variables (`--md-sys-*`)
- Resize viewport or use responsive mode for breakpoints
- Capture screenshots at key widths if helpful

**For source code** (file paths provided):
- **Web:** HTML/JSX/Vue/Svelte; CSS/SCSS for tokens
- Check **web** imports for `@pawel-up/md`

**Quick checks** (adapt paths to your stack):
```bash
# Web: hardcoded colors
grep -rn '#[0-9a-fA-F]\{3,8\}' --include='*.css' --include='*.scss'
```

**Browser automation** (if your environment exposes MCP browser tools): navigate, snapshot DOM/CSS variables, resize for breakpoints — optional, not required.

## Scoring Guide

- **9-10**: Fully MD3 compliant, uses correct tokens and patterns
- **7-8**: Mostly compliant, minor issues (e.g., a few hardcoded values)
- **4-6**: Partially compliant, some MD3 patterns but significant gaps
- **1-3**: Major violations, mostly non-MD3 or MD2 patterns
- **0**: Not applicable or completely absent

Status thresholds: **pass** (7+), **warn** (4-6), **fail** (0-3)
