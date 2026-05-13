'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import * as api from '@/lib/api/client'
import type { ApiUser } from '@/types/api'

export function useUsers() {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const token = await getToken()
      return api.list<ApiUser>('/users', token)
    },
  })
}

export function useMe() {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const token = await getToken()
      return api.get<ApiUser>('/users/me', token)
    },
  })
}

export function useBlockUser() {
  const { getToken } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, block }: { id: string; block: boolean }) => {
      const token = await getToken()
      return api.post(`/users/${id}/${block ? 'block' : 'unblock'}`, {}, token)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function usePromoteUser() {
  const { getToken } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken()
      return api.post(`/users/${id}/promote`, {}, token)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}
