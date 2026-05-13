'use client'
/** Posts service — all data from API, no mock fallback. */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import * as api from './client'
import type { ApiPost, CreatePostDto } from '@/types/api'

export type { ApiPost, CreatePostDto }

export function usePosts(params?: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['posts', params],
    queryFn: async () => {
      const token = await getToken()
      return api.list<ApiPost>(`/blog${params ? `?${params}` : ''}`, token)
    },
  })
}

export function useCreatePost() {
  const { getToken } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreatePostDto) => {
      const token = await getToken()
      return api.post<ApiPost>('/blog', dto, token)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })
}

export function useUpdatePost() {
  const { getToken } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: Partial<CreatePostDto> }) => {
      const token = await getToken()
      return api.patch<ApiPost>(`/blog/${id}`, dto, token)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })
}

export function useDeletePost() {
  const { getToken } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken()
      return api.del(`/blog/${id}`, token)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  })
}
