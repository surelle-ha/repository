/**
 * Lightweight auth composable.
 * Checks the JWT cookie via /api/auth/me on the server side.
 * The result is shared across all components via useState.
 */
export interface AuthUser {
  email: string
  role: string
}

export function useAuth() {
  const user = useState<AuthUser | null>('auth:user', () => null)
  const pending = useState<boolean>('auth:pending', () => false)
  const initialized = useState<boolean>('auth:init', () => false)

  async function fetchUser() {
    pending.value = true
    try {
      const data = await $fetch<AuthUser>('/api/auth/me')
      user.value = { email: data.email as string, role: data.role as string }
    } catch {
      user.value = null
    } finally {
      pending.value = false
      initialized.value = true
    }
  }

  async function login(email: string, password: string) {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    await fetchUser()
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  return { user, pending, initialized, fetchUser, login, logout }
}
