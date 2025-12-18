import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'

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
    viteReact(),
  ],
  nitro: {
    preset: 'vercel',
  },
})
