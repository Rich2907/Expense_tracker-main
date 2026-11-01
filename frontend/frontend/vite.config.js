import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The backend only allows CORS from http://localhost:5173, so keep this port fixed.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
});
