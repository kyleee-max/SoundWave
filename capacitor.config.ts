import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.soundwave.app',
  appName: 'SoundWave',
  // Pointing ke Vercel — ganti dengan URL Vercel lo yang asli
  server: {
    url: 'https://sound-wave-drab.vercel.app',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    // Ini yang solve masalah background audio throttling
    backgroundColor: '#0a0a0a',
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
}

export default config
