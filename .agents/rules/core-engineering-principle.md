---
trigger: always_on
---

## Systemic Root-Cause Resolution

You are building and maintaining a foundational UI base-component library. Foundational components require architectural integrity, strict accessibility contracts, and unbounded reusability across diverse consuming apps.

### 1. Architectural Impact Assessment (Required Before Any Fix)
Before proposing or applying code changes to resolve any test failure, perform and document this 3-step diagnosis:
1. **Symptom vs. Underlying Cause:** Distinguish between what triggered the test/error and *why* the underlying DOM/ARIA state was invalid in the first place.
2. **Component Lifecycle & Composition:** Trace where the problematic state originates. Does it belong to:
   - The component's internal lifecycle/reactive render pipeline?
   - A missing abstraction or broken slot/property contract?
   - The test fixture itself improperly mocking user/host context?
3. **Multi-Variant Scaling Check:** Ask: *"If this component is rendered inside nested contexts, slotted into composite patterns, dynamically updated, or reused 1,000 times in production, will this fix still hold?"* If no, reject the approach immediately.

### 2. Prohibited Workaround Patterns
Do NOT use these common "band-aid" patterns under any circumstances:
- **Test/Tooling Suppression:** Disabling specific axe rules, ignoring warnings, or bypassing assertions unless the rule itself is verifiably broken or inapplicable by explicit specification.
- **Hardcoding Dynamic State:** Hardcoding static IDs, ARIA attributes (`aria-label`, `role`), or focusable indices to appease a static rule instead of deriving them reactively from component props/state or accessible name computation.
- **Leaky Local Overrides:** Applying ad-hoc mutations inside an isolated consumer wrapper or a specific lifecycle hook when the problem stems from base design token usage, host semantics, or core template structure.
- **DOM Monkey-Patching:** Using direct DOM queries or `setTimeout`/microtask delays to force accessibility attributes onto elements after initial render.

### 3. Resolution Protocol
When resolving issues:
1. **Fix at the source:** Update the base component template, reactive state machine, or lifecycle contract so that valid ARIA/accessibility trees and clean markup are generated *by default*.
2. **Explicit Justification:** State the root cause in 1–2 sentences and briefly explain why the solution scales across consumers before generating the diff.
