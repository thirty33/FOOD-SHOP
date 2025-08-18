# NavigateWithDelegate Component

A wrapper component that preserves the `delegate_user` query parameter when navigating between routes.

## Purpose

When a master user is viewing or managing a delegated user's content, this component ensures that the `delegate_user` query parameter is maintained during navigation, preserving the context.

## Usage Examples

### Basic Usage with Navigation

```tsx
import { NavigateWithDelegate } from '../NavigateWithDelegate';
import { CloseButton } from '../CloseButton';

// Will navigate to /orders?delegate_user=john if delegate_user param exists
<NavigateWithDelegate to="/orders">
  <CloseButton />
</NavigateWithDelegate>
```

### With Custom Click Handler

```tsx
// Preserves original onClick while adding navigation
<NavigateWithDelegate to="/menu">
  <button onClick={() => console.log('Clicked!')}>
    Go to Menu
  </button>
</NavigateWithDelegate>
```

### With Any Clickable Component

```tsx
// Works with any component that accepts onClick
<NavigateWithDelegate to="/cart">
  <CustomButton variant="primary">
    View Cart
  </CustomButton>
</NavigateWithDelegate>
```

### With Custom Navigation Logic

```tsx
// Use custom navigation handler
<NavigateWithDelegate 
  to="/dashboard"
  onNavigate={(path) => {
    // Custom logic before navigating
    analytics.track('Navigation', { to: path });
    window.location.href = path;
  }}
>
  <a href="#">Dashboard</a>
</NavigateWithDelegate>
```

## Props

| Prop | Type | Description | Required |
|------|------|-------------|----------|
| `children` | `ReactElement` | The clickable component to wrap | Yes |
| `to` | `string` | The destination path | No |
| `onNavigate` | `(path: string) => void` | Custom navigation handler | No |
| `preserveOtherParams` | `boolean` | Whether to preserve other query params (future feature) | No |

## How It Works

1. The component checks if `delegate_user` exists in the current URL query parameters
2. If it exists and a `to` prop is provided, it appends the parameter to the destination URL
3. It overrides the child component's `onClick` handler to perform the navigation
4. If the child already has an `onClick` and no `to` is provided, it calls the original handler

## Integration with Existing Components

### Before
```tsx
<CloseButton onClick={() => navigate('/orders')} />
```

### After
```tsx
<NavigateWithDelegate to="/orders">
  <CloseButton />
</NavigateWithDelegate>
```

This ensures that if a master user is viewing a subordinate's data, they remain in that context when navigating.