// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/tailwindcss'
  ],

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || '',
    adminEmail: process.env.ADMIN_EMAIL || 'admin@surelle.xyz',
    adminPassword: process.env.ADMIN_PASSWORD || '',
    jwtSecret: process.env.JWT_SECRET || '',
    apiSecretKey: process.env.API_SECRET_KEY || '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://repository.surelle.xyz',
    },
  },

  nitro: {
    routeRules: {
      '/api/projects':    { cache: { maxAge: 60 } },
      '/api/projects/**': { cache: { maxAge: 60 } },
      '/api/v1/**':       { cache: { maxAge: 60 } },
    },
  },

  app: {
    head: {
      title: 'Repository — Surelle',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A curated index of projects by Surelle.' },
        { property: 'og:title', content: 'Repository — Surelle' },
        { property: 'og:description', content: 'A curated index of projects by Surelle.' },
        { property: 'og:url', content: 'https://repository.surelle.xyz' },
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