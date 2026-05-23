---
applyTo: "src/{elements,md,styles,modeling}/**,demo/**"
---

# Lit Element Best Practices

You are an expert developer in web components using the Lit library and Material Design version 3, focusing on best practices, accessibility, and responsive design.

## Key Principles

- Comply with web elements authoring standards when designing a web component.
- Use accessibility best practices to produce semantically relevant web components.
- Prioritize web standards over custom implementation.
- Prioritize APIs that are passing the Web Platform Baseline
- Minimize external dependencies, but also balance between custom code and widely known and trusted dependencies.
- Everything must be ES compliant. Use the appropriate standards for module imports.

## Lit Web Components

- Ensure the appropriate aria roles are applied to each element.
- Prioritize well-known events (like change, select) over custom events.
- Provide examples of usage when producing component documentation.
- Prioritize native elements over custom elements whenever possible.
- Prioritize composition over attribute passed configuration (a dropdown should have a semantic HTML structure and not auto-generated structure from a complex configuration object).
- Think of other use-cases and how the custom element can scale for future use cases.
- Reuse existing components whenever possible.
- Prefer to put lifecycle methods after the constructor and before the render and other methods.
- Put render methods at the end of the class.
- Use `@property` decorator for public properties and `@state` decorator for private properties.
- Use `@query` decorator for querying elements in the shadow DOM.
- Use `@queryAssignedElements` decorator for querying slotted elements.
- Boolean properties should be initialized to `false` in the constructor.
- Use `@eventOptions` decorator to specify event options like `capture`, `passive`, and `once`.
- Use `@queryAsync` decorator for querying elements that may not be immediately available in the DOM.
- Use `@state` decorator for properties that are internal to the component and should not be exposed to the outside world.
- Avoid passing complex objects as properties. Instead, use simple types like `string`, `number`, or `boolean` and handle complex logic internally.
- Use lifecycle methods like `connectedCallback`, `disconnectedCallback`, and `update` to manage component state and behavior.
- Use `willUpdate` method to perform actions before the component updates, such as validating properties or preparing data.
- Place the component definition under the `internals/` directory of a component folder. The components registration should be done in the component file in the main component directory.
- Place the base material components under the `src/md/` directory.
- Place composite components under the `src/elements/` directory.

## Documentation
- Document public properties and public function for authors to understand what these properties and functions do.
- Use JSDoc comments to document public properties, methods, and events.
- Document all events and their structure (for custom events).
- Use `@attribute` to document attributes that can be set on the component.
- Use `@fires` to document events that the component emits.
- Use `@example` to provide examples of how to use the component.
- Use `@slot` to document slots that the component uses.
- Use `@csspart` to document CSS parts that can be styled by the user.
- Use `@cssproperty` to document CSS properties that can be used to style the component
- Only document properties with the property declaration. Do not document properties, events, and attributes on the class declaration.

## CSS and Styling

- Prioritize native CSS over JavaScript implementation. Use Web Platform Baseline even if the editor says it's not supported.
- Use anchoring and popover API whenever possible and applicable over JavaScript positioning.
- Place lit component styles in a separate file with the `.styles.ts` extension.
- Add styles to the component registration class, not the base class.
- Declare the `part` attributes to expose custom styling.
- When working on base components, use CSS variables to allow customization of the component styles.
- Define component states via the `internals.states.add("--state-name")` method. These states can be used as `component-name:state(state-name) {}` in the CSS.

## Error handling

- Components either communicate errors through rendering them internally or dispatch an error event with the error details to the parent component or application.
- Prefer error states defined on the element internals over custom error styling.

## Naming Convention

- Follow web authoring standards as closely as possible.
- Minimize the use of "-" in attribute and event names. Use the web authoring standards for naming attributes and events.
- Use camelCase for properties and methods.
- Do not prefix private or protected properties and methods with an underscore. Use the typescript `private` and `protected` keywords to indicate visibility.

## Testing

- Use @open-wc/testing library.
- Always add accessibility tests.
- Create fixtures for different states of a component.
- To run tests for a specific file, use the `--files` option in the test command. For example:

  ```bash
  npm test -- --files=".tmp/test/**/[test file name].test.js"
  ```
  
- Prefer the Assert API over the Expect API for assertions. The Assert API is more performant and provides better error messages.
- When updating an element's property, await for the update to complete using `await element.updateComplete` before making assertions. This ensures that the component has fully rendered before checking its state.

## Component Demoing

- Always produce a demo page under the demo/ directory.
- Use the `DemoPage` class to bootstrap the demo page.
- Use material styles with the demo page. Minimize custom styling.
- Try to render each state separately and minimize the use of complex configurations.
- Start with simple states and progressively enhance the demo with more complex configurations.
- If a component produces output, ensure that the demo page shows the output in a readable format. Use one output per component.
- Document the states in a way that is obvious to the user. Use headings and paragraphs to explain the states.
- Due to the nature how the demo pages are processed, ensure that typescript files that belong to the demo page are imported from the `/.tmp/demo/` directory. This is done automatically by the build process. Imports inside the typescript file should reference files from the `src/` folder directly.
