import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  // 1. Force Vite to bundle these instead of leaving them as imports
  ssr: {
    noExternal: [
      '@tanstack/react-start',
      '@tanstack/start-server-core',
      '@tanstack/react-router',
    ],
  },
  plugins: [
    tanstackStart(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    devtools(),
    nitro({
      preset: 'vercel',
      // 2. Force Nitro to inline these during the second bundling pass
      externals: {
        inline: [
          '@tabler/icons-react',
          '@tanstack/react-start',
          '@tanstack/start-server-core',
        ],
      },
    }),
  ],
})
