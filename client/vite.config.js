import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// dev: รัน `node server.js` (port 3000) คู่กับ `npm run dev:client` — proxy /api ไปที่ Express
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:3000' } },
});
