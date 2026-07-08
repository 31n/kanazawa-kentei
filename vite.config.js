import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' makes the build use relative asset paths so it works when
// hosted at https://<user>.github.io/<repo>/ regardless of the repo name.
export default defineConfig({
  base: './',
  plugins: [react()],
})
