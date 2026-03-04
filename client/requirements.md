## Packages
zustand | State management for the shopping cart
date-fns | Formatting dates for order history
lucide-react | Icons for the interface
react-hook-form | Form state management
@hookform/resolvers | Zod validation integration for forms

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["var(--font-sans)"],
  display: ["var(--font-display)"],
}

Auth token is stored in localStorage as 'lomafy_token'. All API requests will attach it as `Authorization: Bearer <token>`.
