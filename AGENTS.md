# AGENTS.md — y2kfund/app-thesis

**Purpose:** This repo contains the **Thesis app**. The app also exposes a Vue 3 **component** that can be used by other apps. The component is published privately to GitHub Packages as `@y2kfund/app-thesis`.

- **Repo name:** `app-thesis`
- **Package name:** `@y2kfund/app-thesis`
- **Component export:** `Thesis`
- **Org:** https://github.com/orgs/y2kfund/
- **Core pkg:** `@y2kfund/core` (aka **app-core**) — provides initialization, query hooks with realtime, and shared types.
- **Functionality:** Manages thesis data (add, edit, delete, view)

**System layout (simplified)**
- **app-core** (`@y2kfund/core`) ⟶ single file with Supabase client, TanStack Query, and ready-to-use hooks
- **app-thesis** (`@y2kfund/app-thesis`) ⟶ simple Vue component that uses `useThesisQuery()` from core
- **app-dashboard** ⟶ uses **app-core** + **app-thesis**

---

## 1) Architecture & Rules (simplified)

1. **Consume app-core**: Install `@y2kfund/core` and import `useThesisQuery()`, `useSupabase()`.
2. **No local Supabase or QueryClient creation**: Everything comes from core's plugin.
3. **Export a Vue component** for dashboard/other apps to import.
4. **Keep it simple**: No ag-grid needed, just a clean list view with modals.

---

## 2) Simplified File Layout

```
src/
  Thesis.vue           # main component (clean, no debug code)
  index.ts             # library entry: export component + props interface
dev/
  index.html           # local dev harness page
  dev.ts               # installs app-core plugin, mounts <Thesis/>
package.json
vite.config.ts
tsconfig.json
README.md
AGENTS.md            # this file
```

---

## 3) Library entry & exports (simplified)

**`src/index.ts`**
```ts
export { default as Thesis } from './Thesis.vue'
export interface ThesisProps {
  userId?: string | null
}
```

---

## 4) Component implementation (clean & direct)

**`src/Thesis.vue`**
- Uses `useThesisQuery()` from `@y2kfund/core`
- Displays thesis in a card layout
- Add/Edit/Delete modals
- Toast notifications for feedback
- No debug code in production

---

## 5) Data pattern (simplified)

```ts
import { useThesisQuery, useSupabase } from '@y2kfund/core'
import { useQueryClient } from '@tanstack/vue-query'

const thesisQuery = useThesisQuery()
const supabase = useSupabase()
const queryClient = useQueryClient()

// For mutations:
await supabase.schema('hf').from('thesisMaster').insert([...])
queryClient.invalidateQueries({ queryKey: ['thesis'] })
```

- **No manual subscriptions**: TanStack Query + core's built-in realtime handles it.
- **No localStorage**: Query persistence is in core (IndexedDB).

---

## 6) Build & Package

**`vite.config.ts`**
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: 'Thesis',
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['vue', '@y2kfund/core']
    }
  },
  server: { port: 5103 }
})
```

---

## 7) Usage (simplified)

```ts
// In dashboard
import { Thesis } from '@y2kfund/app-thesis'
import '@y2kfund/app-thesis/dist/style.css'

// In template
<Thesis />
```

All data fetching, caching, and realtime updates are handled transparently by the `@y2kfund/core` hooks.

---

## 8) Do / Don't

- ✅ Install **app-core** and consume its hooks: `useSupabase()`, `useThesisQuery()`, and TanStack Query context.
- ✅ Use **TanStack Query**; persistence is handled by **app-core**.
- ✅ Use toast notifications for user feedback.
- ❌ Don't create Supabase clients or `QueryClient`s in this library.
- ❌ Don't use localStorage for caching.
- ❌ Don't add global CSS.

---

## 9) Definition of done

- ✅ `pnpm dev` runs a standalone demo
- ✅ `pnpm build` produces clean `dist/` ESM library
- ✅ Component uses `useThesisQuery` with automatic realtime
- ✅ No debug code, no unnecessary files
- ✅ Published as `@y2kfund/app-thesis` on GitHub Packages

**System layout**
- **app-core** (`@y2kfund/core`) ⟶ initializes Supabase client **and** TanStack Query, provides them via Vue plugin
- **app-thesis** (`@y2kfund/app-thesis`) ⟶ consumes core's client/query; exports `<Thesis />`
- **app-dashboard** ⟶ uses **app-core** + **app-thesis**