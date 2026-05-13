'use client'
import type { ApiResponse, PaginationMeta } from '@/types/api'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001/api/v1'

export async function apiFetch<T>(
  path: string,
  token: string | null,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  })

  // 204 No Content — successful DELETE/PATCH with no body
  if (res.status === 204) {
    return { success: true } as ApiResponse<T>
  }

  const json: ApiResponse<T> = await res.json()

  if (!res.ok) {
    throw new Error(json.error?.message ?? `Request failed: ${res.status}`)
  }

  return json
}

export async function get<T>(path: string, token: string | null): Promise<T> {
  const res = await apiFetch<T>(path, token)
  return res.data as T
}

export async function list<T>(
  path: string,
  token: string | null
): Promise<{ data: T[]; meta: PaginationMeta }> {
  const res = await apiFetch<T[]>(path, token)
  return { data: res.data ?? [], meta: res.meta as PaginationMeta }
}

export async function post<T>(path: string, body: unknown, token: string | null): Promise<T> {
  const res = await apiFetch<T>(path, token, {
    method: 'POST',
    body:   JSON.stringify(body),
  })
  return res.data as T
}

export async function patch<T>(path: string, body: unknown, token: string | null): Promise<T> {
  const res = await apiFetch<T>(path, token, {
    method: 'PATCH',
    body:   JSON.stringify(body),
  })
  return res.data as T
}

export async function del(path: string, token: string | null): Promise<void> {
  await apiFetch(path, token, { method: 'DELETE' })
}
