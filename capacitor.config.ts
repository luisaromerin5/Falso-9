import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.falso9.app',
  appName: 'Falso 9',
  webDir: 'public',
  server: {
    url: 'https://falso-9-production.up.railway.app',
    cleartext: true,
  },
  ios: {
    contentInset: 'automatic',
  },
};

export default config;
