'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import * as api from '@/lib/api/client'
import type { ApiDiscussion } from '@/types/api'

export function useDiscussions(params?: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['discussions', params],
    queryFn: async () => {
      const token = await getToken()
      return api.list<ApiDiscussion>(`/discussions${params ? `?${params}` : ''}`, token)
    },
  })
}

export function useDeleteDiscussion() {
  const { getToken } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken()
      return api.del(`/discussions/${id}`, token)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['discussions'] }),
  })
}

export function useUpdateDiscussionStatus() {
  const { getToken } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const token = await getToken()
      return api.patch(`/discussions/${id}`, { status }, token)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['discussions'] }),
  })
}

export function useMyDiscussions() {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['my-discussions'],
    queryFn: async () => {
      const token = await getToken()
      return api.list<ApiDiscussion>('/discussions/me', token)
    },
  })
}
