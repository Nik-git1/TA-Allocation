import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig( {
  plugins: [ react() ],
  server: {
    host: true
  },
  // define: {
  //   'import.meta.env.VITE_API_URL': JSON.stringify( 'http://localhost:5001' )
  // }
} )
