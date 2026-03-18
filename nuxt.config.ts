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
    databaseUrl:   process.env.DATABASE_URL   || '',
    adminEmail:    process.env.ADMIN_EMAIL    || 'admin@example.com',
    adminPassword: process.env.ADMIN_PASSWORD || '',
    jwtSecret:     process.env.JWT_SECRET     || '',
    apiSecretKey:  process.env.API_SECRET_KEY || '',
    public: {
      siteUrl:      process.env.NUXT_PUBLIC_SITE_URL      || 'http://localhost:3000',
      siteOwner:    process.env.NUXT_PUBLIC_SITE_OWNER    || 'Developer',
      topbarTitle:  process.env.NUXT_PUBLIC_TOPBAR_TITLE  || 'repository',
      topbarDomain: process.env.NUXT_PUBLIC_TOPBAR_DOMAIN || '',
      heroBanner:   process.env.NUXT_PUBLIC_HERO_BANNER   || "Everything I've built.",
      heroSub:      process.env.NUXT_PUBLIC_HERO_SUB      || 'A living catalogue of side projects, tools, and experiments.',
      hideOriginUi: process.env.NUXT_PUBLIC_HIDE_ORIGIN_UI === 'true',
      forkUrl:      process.env.NUXT_PUBLIC_FORK_URL      || 'https://github.com/surelle-ha/repository',
    },
  },

  nitro: {
    routeRules: {
      '/api/projects':     { cache: false },
      '/api/projects/**':  { cache: false },
      '/api/settings/**':  { cache: false },
      '/api/v1/**':        { cache: { maxAge: 60 } },
    },
  },

  app: {
    head: {
      title: 'Repository',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A curated index of projects.' },
      ],
    },
  },
})