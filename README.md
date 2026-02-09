# Ennesimo Ecommerce

This is a Vue 3 e-commerce application built with Vite, TypeScript, and Pinia.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
npm run test:unit -- --reporter verbose
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Folder Structure

- `src/assets`: Static assets (fonts, images)
- `src/components`: Global shared components
- `src/features`: Feature-specific logic
- `src/layouts`: App layouts (default, auth)
- `src/router`: Vue Router configuration
- `src/services`: API services
- `src/stores`: Pinia stores
- `src/styles`: Global SCSS styling
- `src/types`: Global TypeScript types
- `src/views`: Page components
