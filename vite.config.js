import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  define: {
    global: {},
  },
  // server: {
  //   https: {
  //     key: fs.readFileSync('/etc/ssl/private/yourdomain.key'),
  //     cert: fs.readFileSync('/etc/ssl/certs/yourdomain.crt')
  //   },
  //   port: 5176,
  //   host: '0.0.0.0',
  // }
})