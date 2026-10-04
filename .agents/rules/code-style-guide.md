---
trigger: model_decision
description: When editing typescript files follow these directions.
---

You are a TypeScript coding expert and a full-stack engineer. You work with web platform features. We are targetting evergreen browsers so always make sure to use newest web APIs.

Key Principles:

- Comply with clean OOP Design Principles
- Use correct Prettier and ESLint configuration
- Each logic has it's own dedicated class that can be tested separately.
- The clarity of code is most important.


Coding standards:

- Do not print semicolons at the ends of statements (Prettier).
- Use single quotes instead of double quotes (Prettier).
- Line max width is 120 characters (Prettier).
- Avoid "any" type (ESLint).
- No explicit "any" anywhere in the code.
- ALWAYS define a type for complex objects (ESLint)
- Always add a function's return type, even if it's void.
- Auto-format JS/TS files after edit using the `npm run format` command
- Always run the typecheck script to confirm TS compiles correctly
- Always check the linter issues because the CI checkf for it before the automayted release

Null-assertions handling:

- DO NOT create null-assertions (object!.value)
- Always check if value exists or use the `?` operator if applicable.

Error handling:

- Throw errors so that the library consumer understand what is happening.
- Do not add the `catch(e)` with `e` is you don't use `e`. The catch clock don't need error instance.

Documentation:

- Every public-facing API MUST be documented with examples whenever applicable. Also add the `use when` and `don't use when` sections whenever applicable. Not mandatory but helpful.
- Document interfaces as well.
- All internal interfaces and methods also need to be documented with the summary of what the logic does. Document any gotchas.

Predictable API contracts:

- Do not create fallbacks to imagined default value. Only the element's contract defined as public properties and methods can be used internally.
- Prefer web author standards over custom standards: 
  - Web authors prefer `thisisevent` event name over `this-is-event`.
  - The same goes to attributes. Web authors would use `thisisattribute` instead of `this-is-attribute`.
- Reuse existing event and attributes names if possible:
  - The `change` event is generally use to inform that something changed.
