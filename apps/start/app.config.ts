// app.config.ts
import { defineConfig } from '@tanstack/react-start/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  vite: {
    plugins: [
      //@ts-ignore
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
  },

})