# GRIMWORLD Starter Kit: Frontend (Next.js)

The Next.js frontend for the **GRIMWORLD Starter Kit**, a Laravel + Next.js starter. It talks to the Laravel REST API in the `backend/` folder.

> Developed by **FJ Buenaflor**.

## Features

- Next.js (App Router) with TypeScript
- Tailwind CSS with a theme driven by CSS variables
- Landing, login, and register pages (login uses **username**)
- Protected `(authenticated)` route group with sidebar, topbar, and breadcrumbs
- Light, dark, and system themes, changeable in Settings
- TanStack Query for data fetching and session state
- Axios client that attaches the token and unwraps Laravel errors
- Reusable UI components (`Button`, `Input`, `FormField`, `Card`, and more)

## Requirements

- Node.js 20 or higher
- npm
- The backend running at `http://localhost:8000` (see `backend/README.md`)

## Quick start

Start the backend first, then:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The landing page shows an **API online** badge when the frontend can reach Laravel.

On Windows PowerShell, use `copy .env.example .env.local` instead of `cp`.

## Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Description | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Laravel API base URL, including `/api`, no trailing slash | `http://localhost:8000/api` |

Restart `npm run dev` whenever you change this file. Never commit `.env.local`.

## Trying it out

1. Go to `http://localhost:3000/register` and create an account.
2. You land on `/dashboard`.
3. Open **Settings** (from the user menu in the topbar, or the sidebar) and switch between Light, Dark, and System.
4. Log out from the user menu, then log in again with your **username**.

## Project structure

```
frontend/
├── app/
│   ├── (authenticated)/          # Protected pages (sidebar + topbar layout)
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   └── settings/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── globals.css               # Theme colors and component classes
│   ├── layout.tsx                # Root layout and providers
│   └── page.tsx                  # Landing page
├── components/
│   ├── layout/                   # AuthenticatedLayout, Sidebar, Topbar, Breadcrumbs, AppPage
│   └── ui/                       # Button, Input, Label, InputError, FormField, Alert, Card, StatCard, ThemeToggle
├── context/
│   ├── AuthContext.tsx           # Auth state (login, register, logout)
│   └── BreadcrumbContext.tsx
├── providers/
│   ├── QueryProvider.tsx         # TanStack Query
│   └── ThemeProvider.tsx         # Light / dark / system
├── lib/
│   ├── api.ts                    # Axios instance
│   └── utils.ts
└── types/
    ├── user.ts
    └── breadcrumb.ts
```

`components`, `context`, `providers`, `lib`, and `types` sit at the project root, next to `app/`, because the `@/` import alias points to the root.

## How authentication works

1. The user logs in or registers, and Laravel returns `{ user, token }`.
2. The token is saved in `localStorage` and attached to every request by `lib/api.ts`.
3. On page load, `AuthContext` calls `GET /api/user` (through TanStack Query) to restore the session.
4. Pages inside `app/(authenticated)/` are guarded by `AuthenticatedLayout`, which redirects to `/login` when there is no user.
5. Any `401` response clears the token and sends the user to `/login`.

## Theming

All colors live in `app/globals.css`, in the `:root` block (light) and `:root.dark` block (dark). To rebrand the kit, edit the values there:

```css
:root {
  --primary: #7c3aed;
  --primary-foreground: #ffffff;
  --danger: #dc2626;
  /* ... */
}
```

The tokens are exposed to Tailwind, so you can use classes like `bg-primary`, `text-danger`, `bg-surface`, `border-border`, and `text-muted-foreground` anywhere. Avoid hardcoded colors like `bg-blue-600` so themes keep working.

To add a new token, define it in `:root`, then expose it inside `@theme inline`:

```css
--color-info: var(--info);
```

### Light and dark mode

The theme is stored in `localStorage` under the key `theme` (`light`, `dark`, or `system`). `ThemeProvider` toggles a `dark` class on `<html>`, and an inline script in `app/layout.tsx` applies it before first paint to avoid a flash. Users change it in **Settings**, or with the sun/moon button in the topbar.

## UI components

Import reusable components from `components/ui`:

```tsx
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";

<Card>
  <FormField label="Email" name="email" type="email" error={errors.email} />
  <Button variant="danger" loading={submitting}>Delete</Button>
</Card>
```

`Button` variants: `primary` (default), `secondary`, `danger`.

## Adding a new protected page

1. Create `app/(authenticated)/your-page/page.tsx`:

   ```tsx
   "use client";

   import AppPage from "@/components/layout/AppPage";
   import type { BreadcrumbItem } from "@/types/breadcrumb";

   const breadcrumbs: BreadcrumbItem[] = [
     { title: "Your page", href: "/your-page" },
   ];

   export default function YourPage() {
     return (
       <AppPage breadcrumbs={breadcrumbs}>
         <h1 className="text-2xl font-semibold">Your page</h1>
       </AppPage>
     );
   }
   ```

2. Add a link in `navItems` inside `components/layout/Sidebar.tsx`.

The page gets the sidebar, topbar, breadcrumbs, and login guard automatically. Pages without `AppPage` still get breadcrumbs built from the URL.

## Fetching data (recommended pattern)

Keep each feature in three layers:

```
services/users.ts     # Axios calls only
hooks/useUsers.ts     # TanStack Query hooks (useQuery / useMutation)
app/.../page.tsx      # UI only, calls the hooks
```

Avoid calling the API from `useEffect` in components. Use `useQuery` for reads and `useMutation` (with `invalidateQueries`) for writes.

The users screen requests `GET /users?page=N`. The Laravel response should wrap its paginator as `{ "users": { "data": [], "current_page": 1, "last_page": 1, "per_page": 5, "from": 1, "to": 5, "total": 5 } }`; the screen uses those fields for server-side pagination and searches the currently loaded page.

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run start    # run the production build
npm run lint     # lint the code
```

## Troubleshooting

| Problem | Likely cause and fix |
| --- | --- |
| `Cannot find module '@/context/AuthContext'` | `context/` must be at the project root (`frontend/context`), not inside `app/`. Then run **TypeScript: Restart TS Server** in VS Code. |
| Landing page shows **API offline** | Laravel isn't running, or `NEXT_PUBLIC_API_URL` is wrong (it must end with `/api`). Restart `npm run dev` after editing `.env.local`. |
| CORS error in the browser console | Set `FRONTEND_URL=http://localhost:3000` in the backend `.env`, then run `php artisan config:clear`. |
| "Request failed with status code 422" | `lib/api.ts` is missing the response interceptor that unwraps Laravel errors. |
| `Cannot destructure property 'setTheme' ... as it is null` | `ThemeProvider` is not wrapped around the app in `app/layout.tsx`. |
| Theme stuck on dark mode | `globals.css` still has the `@media (prefers-color-scheme: dark)` block. Use `:root.dark` instead. |
| `Cannot apply unknown utility class` in `globals.css` | Don't use variants like `placeholder:` inside `@apply`. Write plain CSS for those rules. |
| `The default export is not a React Component in "/dashboard/layout"` | A `layout.tsx` file is empty. Delete it, or add a default-exported component. |
| Redirected to `/login` after login | The token was rejected. Check that the backend is running and the `personal_access_tokens` migration uses `uuidMorphs`. |
| Warning about `package-lock.json` outside the repo | Harmless. Silence it with `turbopack: { root: __dirname }` in `next.config.ts`. |

## Security note

The token is stored in `localStorage`, which is simple but exposed to XSS. For production apps, consider httpOnly cookies or Sanctum's cookie-based SPA authentication.

## Credits

Developed by **FJ Buenaflor**.
# grimworld-nextjs-frontend
