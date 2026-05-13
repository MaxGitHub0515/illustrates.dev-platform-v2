/**
 * Server-side fetch for public API endpoints.
 * Uses API_INTERNAL_URL inside Docker (api:5001) or
 * NEXT_PUBLIC_API_URL for local dev (localhost:5001).
 * No auth token — public routes only.
 */
const API =
  process.env.API_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:5001/api/v1'

export interface PaginatedResult<T> {
  data: T[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export async function serverGet<T>(
  path: string,
  revalidate = 60
): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate },
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return null
    const json = await res.json()
    return (json.data ?? null) as T
  } catch {
    return null
  }
}

export async function serverList<T>(
  path: string,
  revalidate = 60
): Promise<PaginatedResult<T>> {
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate },
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } }
    const json = await res.json()
    return {
      data: json.data ?? [],
      meta: json.meta ?? { total: 0, page: 1, limit: 20, totalPages: 0 },
    }
  } catch {
    return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } }
  }
}
