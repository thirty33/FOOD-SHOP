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

#### Testing Best Practices

**General Testing Principles:**
- Study and understand WHY tests are failing rather than making superficial fixes to make them pass
- Validate real functionality instead of creating tests that pass quickly without proving behavior
- Tests should reflect actual user interactions and component behavior
- Always investigate root causes of test failures before attempting fixes

**React Testing with act():**
- Wrap all state-updating operations in `act()` to avoid React warnings
- Use `await act(async () => { /* operations */ })` for async state updates
- Import `act` from `@testing-library/react`
- Examples:
  ```typescript
  // Wrap component rendering
  await act(async () => {
    render(<TestWrapper><Component /></TestWrapper>)
  })
  
  // Wrap user interactions that trigger state changes
  await act(async () => {
    fireEvent.scroll(window, { target: { scrollY: 100 } })
    await new Promise(resolve => setTimeout(resolve, 200))
  })
  ```

**MSW (Mock Service Worker) Setup:**
- Use `server.resetHandlers(...newHandlers)` to replace default handlers completely
- Organize test-specific handlers in separate files (e.g., `infiniteScrollHandlers.ts`)
- Create focused mock data that matches the exact API response structure
- Test handlers should only respond to specific conditions (e.g., specific menuId)
- Example handler structure:
  ```typescript
  http.get(`${API_URL}/endpoint/:param`, ({ request, params }) => {
    const { param } = params
    if (param !== 'expected_value') return // Pass to next handler
    
    return HttpResponse.json({
      status: 'success',
      data: mockData
    })
  })
  ```

**Infinite Scroll Testing:**
- Mock window dimensions and scroll properties using `Object.defineProperty()`
- Simulate real scroll events with `window.dispatchEvent(new Event('scroll'))`
- Verify both API call counts and DOM content changes
- Test pagination limits (no extra calls after last page)
- Example scroll simulation:
  ```typescript
  Object.defineProperty(window, 'innerHeight', { value: 800 })
  Object.defineProperty(document.documentElement, 'scrollTop', { value: 750 })
  window.dispatchEvent(new Event('scroll'))
  ```

**Text and Content Validation:**
- Use `truncateString()` helper function in tests instead of hardcoding truncated text
- Import truncation length constants from `src/config/constant.ts` (e.g., `TRUNCATE_LENGTHS.CATEGORY_NAME`)
- Test both positive cases (content exists) and negative cases (content doesn't exist yet)
- Use regex patterns for flexible text matching when needed

**Mock Organization:**
- Mock only dependencies that are not core to the functionality being tested
- Keep mocks as minimal as possible while providing required data
- Use spies (`vi.spyOn()`) to verify function calls and their parameters
- Example mock structure:
  ```typescript
  vi.mock('../../hooks/useAuth', () => ({
    useAuth: () => ({
      user: { id: 1, name: 'Test User', role: 'individual' }
    })
  }))
  ```

**Async Testing Patterns:**
- Use `waitFor()` for assertions that depend on async operations
- Avoid arbitrary timeouts; prefer waiting for specific conditions
- Verify API calls and DOM changes in sequence
- Example:
  ```typescript
  await waitFor(() => {
    expect(apiSpy).toHaveBeenCalledTimes(1)
  })
  expect(screen.getByText('Expected Content')).toBeInTheDocument()
  ```

**Test Structure and Organization:**
- Create focused tests that validate specific functionality
- Use descriptive test names that explain the behavior being validated
- Group related assertions in logical steps with clear comments
- Separate setup, execution, and verification phases clearly

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