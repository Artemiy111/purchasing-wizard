import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import autoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      routesDirectory: 'src/app/routes',
      target: 'solid',
      autoCodeSplitting: true,
      generatedRouteTree: 'src/app/route-tree.gen.ts',
    }),
    solid(),
    tailwindcss(),
    // autoImport({
    //   include: /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
    //   dts: './auto-imports.d.ts',
    //   imports: ['solid-js'],
    // }),
  ],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api/komus': {
        target: 'https://komus-opt.ru/api2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/komus/, ''),
      },
      '/api/samson': {
        target: 'https://api.samsonopt.ru/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/samson/, ''),
      },
    },
  },
})
