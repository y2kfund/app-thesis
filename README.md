# @y2kfund/app-thesis

A Vue 3 component for managing thesis information.

## Features

- ✅ View all thesis
- ➕ Add new thesis
- ✏️ Edit existing thesis
- 🗑️ Delete thesis
- 🔄 Real-time updates via TanStack Query
- 🎨 Clean, modern UI with toast notifications

## Installation

Install from workspace:

```bash
pnpm add @y2kfund/app-thesis@workspace:*
```

## Usage

```vue
<template>
  <div>
    <Thesis />
  </div>
</template>

<script setup>
import { Thesis } from '@y2kfund/app-thesis'
import '@y2kfund/app-thesis/dist/style.css'
</script>
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server (runs on port 5103)
pnpm dev

# Build the library
pnpm build
```

## Architecture

This app follows the same pattern as `app-positions`:

- Uses `@y2kfund/core` for Supabase client and TanStack Query setup
- Provides `useThesisQuery()` hook for data fetching
- Can be used as a standalone app or imported as a component
- Built with TypeScript support

## Notes

- Requires `@y2kfund/core` to be installed and configured
- Database schema: `hf.thesisMaster` table
- Supports add, edit, delete operations
- Real-time updates when data changes

## License

MIT