import { defineConfig, loadEnv  } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env.VITE_SECRET': JSON.stringify(env.VITE_SECRET),
      'process.env.VITE_MY_NODE_NAME': JSON.stringify(env.VITE_MY_NODE_NAME),
      'process.env.VITE_HOSTNAME': JSON.stringify(env.VITE_HOSTNAME),
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    plugins: [react()],
    preview: {
      port: 8080,
      strictPort: true,
    },
    server: {
      port: 8080,
      strictPort: true,
      host: true,
      origin: "http://0.0.0.0:8080",
    },
    }
  }
)

