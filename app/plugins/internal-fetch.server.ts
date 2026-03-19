import { useRequestEvent } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const secret = config.jwtSecret as string
  if (!secret) return

  const event = useRequestEvent()
  if (!event) return

  // Forward the token into the SSR request so useFetch picks it up
  event.node.req.headers['x-internal-token'] = secret
})