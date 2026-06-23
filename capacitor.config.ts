import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.everybite.app',
  appName: 'Every Bite',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
