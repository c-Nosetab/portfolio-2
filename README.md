# chrisbateson.dev

Personal portfolio site built on the Kinetic Editorial design direction.

## Monorepo Layout

| Path          | Description                |
| ------------- | -------------------------- |
| `apps/web`    | Next.js 15 frontend        |
| `apps/studio` | Sanity Studio              |

## Commands

- `pnpm dev` - run all apps in development mode
- `pnpm build` - build all apps
- `pnpm lint` - lint all packages
- `pnpm typecheck` - type-check all packages

## Environment Setup

Copy `apps/web/.env.example` to `apps/web/.env.local` and fill in the values.

## References

- `portfolio-site-plan.md` for the full site plan
- `DESIGN-DIRECTION.md` for the design direction
