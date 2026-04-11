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

  vite: {
    optimizeDeps: {
      include: [
        '@surelle-ha/dead-fuse'
      ]
    }
  },

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
      googleSiteVerification: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
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
      // ── Default title & template ─────────────────────────────────
      titleTemplate: '%s — Repository',
      title: 'Repository',

      htmlAttrs: { lang: 'en' },

      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A curated index of projects.' },
        { name: 'theme-color', content: '#0d0d0f' },
        { name: 'robots', content: 'index,follow' },

        // ── Open Graph defaults ──────────────────────────────────────
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Repository' },
        { property: 'og:title', content: 'Repository' },
        { property: 'og:description', content: 'A curated index of projects.' },
        { property: 'og:image', content: `${process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og-default.png` },
        { property: 'og:url', content: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000' },

        // ── Twitter / X card defaults ────────────────────────────────
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Repository' },
        { name: 'twitter:description', content: 'A curated index of projects.' },
        { name: 'twitter:image', content: `${process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og-default.png` },

        ...(process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? [{
          name: 'google-site-verification',
          content: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        }] : []),
      ],

      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&family=Inter:wght@400;500&display=swap',
        },
      ],
    },
  },
})