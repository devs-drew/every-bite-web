import type { CapacitorConfig } from '@capacitor/cli'

// ponytail: server.url enables live-reload on device; remove for production builds
const DEV_SERVER_URL = process.env.CAPACITOR_DEV_URL ?? ''

const config: CapacitorConfig = {
  appId: 'com.everybite.app',
  appName: 'Every Bite',
  webDir: 'dist',
  server: DEV_SERVER_URL
    ? { url: DEV_SERVER_URL, cleartext: true, androidScheme: 'http' }
    : { androidScheme: 'https' },
}

export default config
