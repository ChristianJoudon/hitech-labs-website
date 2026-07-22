/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig(() => ({
  // Keep the legacy GitHub Pages build working until the custom domain is live.
  // Cloudflare Pages and local development both serve the site from the root.
  base:
    process.env.VITE_BASE_PATH ??
    (process.env.GITHUB_ACTIONS === 'true' ? '/hitech-labs-website/' : '/'),
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: '.vitest/setup.ts',
    include: ['**/test.{ts,tsx}']
  }
}))
