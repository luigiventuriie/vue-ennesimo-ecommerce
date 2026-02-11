# Ennesimo E-commerce

A modern e-commerce web app built with Vue 3, TypeScript, and Vite.

**Live Demo:** [https://luigiventuriie.github.io/vue-ennesimo-ecommerce/](https://luigiventuriie.github.io/vue-ennesimo-ecommerce/)

## Setup & Installation

### Prerequisites

Node.js `^20.19.0 || >=22.12.0`

### Install Dependencies

```bash
git clone https://github.com/luigiventuriie/vue-ennesimo-ecommerce.git
cd vue-ennesimo-ecommerce
npm install
```

## Running the App

### Development Server

```bash
npm run dev
```

Runs on `http://localhost:5173`

### Production Build

```bash
npm run build        # Type-check and build
npm run preview      # Preview production build
```

## Testing

### Unit Tests

```bash
npm run test:unit                                    # Run all unit tests
npm run test:unit -- --reporter verbose              # Verbose output
npm run test:unit -- --coverage                      # With coverage
npm run test:unit src/stores/__tests__/cart.spec.ts  # Run specific test
```

### End-to-End Tests

```bash
npm run test:e2e:dev        # Open Cypress UI
npm run test:e2e            # Run headless
```

## Deployment

### Deploy to GitHub Pages

```bash
npm run deploy
```

### Manual GitHub Pages Setup

1. Update `vite.config.ts` with your repo name:

```ts
base: '/your-repo-name/'
```

2. Run `npm run deploy`
3. Go to **Settings → Pages** in your GitHub repo
4. Set source to **gh-pages** branch
5. Save

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build-only
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Features

- Product browsing with search and filtering by category
- Shopping cart with real-time total calculation
- Wishlist for saving favorite products
- User authentication with session persistence
- Dark/light mode with system preference detection
- Toast notifications for user feedback
- PWA support with offline capabilities
- Responsive mobile-first design

## Tech Stack

| Category             | Technology                    |
| -------------------- | ----------------------------- |
| **Framework**        | Vue 3 (Composition API)       |
| **Build Tool**       | Vite                          |
| **Language**         | TypeScript                    |
| **State Management** | Pinia                         |
| **Routing**          | Vue Router                    |
| **Styling**          | SCSS with CSS variables       |
| **Testing**          | Vitest (unit) + Cypress (E2E) |
| **PWA**              | vite-plugin-pwa               |
| **API**              | Fake Store API                |

## Project Structure

```
src/
├── assets/          # Static assets (fonts, images)
├── components/      # Reusable UI components
│   ├── __tests__/   # Component tests
│   └── Base*.vue    # Base components
├── layouts/         # App layouts
├── router/          # Vue Router configuration
├── services/        # API service layer
│   ├── api.ts
│   ├── authService.ts
│   └── productService.ts
├── stores/          # Pinia state stores
│   ├── auth.ts
│   ├── cart.ts
│   ├── wishlist.ts
│   └── search.ts
├── styles/          # Global SCSS
│   ├── _variables.scss
│   └── main.scss
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── views/           # Page components
├── App.vue          # Root component
└── main.ts          # App entry point
```

## Architecture

### State Management (Pinia)

- **auth**: User authentication state and login/logout logic
- **cart**: Shopping cart items with cookie persistence
- **wishlist**: Saved products with cookie persistence
- **search**: Search query state (ephemeral)

### Service Layer

API calls abstracted into dedicated services:

- `productService`: Product fetching and filtering
- `authService`: Authentication logic

Benefits: easier testing, cleaner views, single source of truth for API endpoints

## Key Design Decisions

- **Service Layer Pattern**: Separation of concerns, views don't know about HTTP
- **Small Components**: Focused, reusable components (CategoryTag, ProductRating, etc.)
- **CSS Variables**: Dynamic theme switching without runtime cost
- **Cookie Persistence**: Cart/wishlist survive page reloads
- **Local vs Global State**: Toast notifications use local state (only needed in one component)

## Test Coverage

- **Unit Tests**: 25+ test files covering components, stores, services, utils, and views
- **E2E Tests**: Login flow, cart flow, wishlist flow with persistence testing

## License

Educational/interview purposes

## Author

**Luigi Venturi** - [@luigiventuriie](https://github.com/luigiventuriie)
