import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  ssr: {
    noExternal: [
      '@tabler/icons-react',
      '@tanstack/react-router',
      '@tanstack/react-start',
    ],
  },
  optimizeDeps: {
    include: ['@tabler/icons-react'],
  },
  plugins: [
    tanstackStart(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    devtools(),
    nitro(),
  ],
  nitro: {
    preset: 'vercel',
    rollupConfig: {
      output: {
        entryFileNames: 'index.mjs',
      },
    },
    moduleSideEffects: ['@tanstack/react-start/server'],
  },
})
