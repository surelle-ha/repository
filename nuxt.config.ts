export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@nuxt/scripts'
  ],

  scripts: {
    registry: {
      googleAnalytics: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID
        ? {
          id: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID
        }
        : false
    }
  },

  runtimeConfig: {
    // ── Server-only secrets ────────────────────────────────────────
    databaseUrl: process.env.DATABASE_URL || '',
    adminEmail: process.env.ADMIN_EMAIL || '',
    adminPassword: process.env.ADMIN_PASSWORD || '',
    jwtSecret: process.env.JWT_SECRET || '',
    apiSecretKey: process.env.API_SECRET_KEY || '',

    // ── Public (browser-safe) ──────────────────────────────────────
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      googleAnalyticsId: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
    },
  },

  css: ['~/assets/css/main.css'],

  nitro: {
    routeRules: {
      '/api/**': { cache: false },
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Repository',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A curated index of projects.' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&family=Inter:wght@400;500&display=swap',
        },
      ],
    },
  },
})