# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DeliciusFood CRM Frontend - A React/TypeScript application for managing prepared meal sales with a modern interface for menu management, order processing, and shopping cart functionality.

## Development Commands

### Core Commands
- `npm run dev` - Start development server on port 5174 with host access
- `npm run build` - TypeScript compilation + production build  
- `npm run lint` - Run ESLint for code quality
- `npm run test` - Run tests with Vitest
- `npm run coverage` - Generate test coverage report

### Testing
- Tests use Vitest with jsdom environment
- Setup file: `src/setupTests.ts`
- Coverage excludes config files, types, App.tsx, main.tsx
- Run single test file: `npm run test -- src/path/to/test.tsx`

## Architecture Overview

### State Management
- Global state managed via React Context (`GlobalProvider`) + useReducer pattern
- Main state store: `src/store/state/initialState.ts`
- Reducers: `src/store/reducers/` (menuReducer, globalReducer)
- Context providers wrap the entire app in `main.tsx`

### HTTP Client Architecture
- Base HTTP client class: `src/classes/HttpClient.ts`
- Service classes extend HttpClient (e.g., `AuthHttpService` in `src/services/user.ts`)
- Automatic token injection via axios interceptors
- Handles 401 redirects and response validation
- Error handling with Spanish localized messages

### Routing Structure
- Route definitions in `src/config/routes.ts` 
- Protected routes wrap most pages via `ProtectedRoute` component
- Main routes: Menus (home), Categories, Product Detail, Cart, Checkout, Orders
- Dynamic route helpers: `GET_CATEGORY_ROUTE(menuId)`, `GET_PRODUCT_DETAIL_ROUTE(productId)`

### Component Organization
- Each component in its own directory with `index.tsx`
- Custom hooks in `src/hooks/` for reusable logic
- TypeScript definitions in `src/types/` (separate .d.ts files)
- Icons components in `src/components/Icons/`

### Key Features
- Order management with status tracking
- Shopping cart with quantity controls and order persistence
- Menu calendar view with daily menu visualization  
- Category-based product browsing
- User authentication with role-based permissions
- LocalStorage integration for cart, tokens, selected menus

### Environment Configuration
- Uses Vite environment variables (VITE_*)
- Required: `VITE_API_URL`, `VITE_TIMEZONE`, `VITE_COMPANY_NAME`
- Optional: Company logo and product image URLs
- Environment example in `.env.example`

## Custom Hooks
- `useAuth` - Authentication state and login/logout
- `useLocalStorage` - Persistent storage utilities
- `useMenus`, `useCategories` - Data fetching for menu/category lists
- `useCurrentOrder` - Active order state management
- `useNotification` - Toast notifications via notistack

## Testing Strategy
- Component testing with React Testing Library
- Custom hook testing with `@testing-library/react-hooks`
- Coverage reporting via vitest/coverage-v8
- Example test files in `src/components/*/` and `src/tests/`