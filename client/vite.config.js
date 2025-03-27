import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Output to client/dist
    sourcemap: true, // Optional for debugging
  },
  base: '/', // Serve assets from root (matches Render.com)
});