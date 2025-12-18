import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  ssr: {
    noExternal: [
      '@tanstack/react-start',
      '@tanstack/start-server-functions-server',
    ],
  },
  plugins: [
    // 1. TanStack Start handles the heavy lifting and React injection
    tanstackStart(),
    // 2. Tooling and CSS
    devtools(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    // 3. Nitro MUST come last. It takes the transformed output
    // and packages it for the Vercel deployment.
    nitro({
      preset: 'vercel',
      externals: {
        inline: ['@tabler/icons-react'],
      },
    }),
  ],
})
