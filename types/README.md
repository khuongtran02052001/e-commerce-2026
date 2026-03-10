# Type System Structure

This project now uses a domain-first type layout.

## Primary source of truth

- `types/domain/order.ts`
  - Order entities used by user/admin/order flows.
- `types/domain/employee.ts`
  - Employee roles, permissions, workflow tracking types.
- `types/domain/admin.ts`
  - Admin dashboard-specific types (admin user, analytics, admin product).

## Barrel export

- `types/index.ts`
  - Re-exports domain + shared types for convenient imports.

## Backward compatibility layers

- `types/order.ts` -> re-export from `types/domain/order.ts`
- `types/employee.ts` -> re-export from `types/domain/employee.ts`
- `components/admin/types.ts` -> re-export from domain types

These wrappers are kept to avoid breaking old imports while migrating.

## Recommended import style

Use direct domain imports for new code:

- `@/types/domain/order`
- `@/types/domain/employee`
- `@/types/domain/admin`

Use `@/types` only when you intentionally want broad re-export access.

