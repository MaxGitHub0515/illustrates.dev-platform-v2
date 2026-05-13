'use client'
/** Project service — all data comes from API, no mock fallback. */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import * as api from './client'
import type { ApiProject, CreateProjectDto } from '@/types/api'

export type { ApiProject, CreateProjectDto }

export function useProjects(params?: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['projects', params],
    queryFn: async () => {
      const token = await getToken()
      return api.list<ApiProject>(`/projects${params ? `?${params}` : ''}`, token)
    },
  })
}

export function useProject(id: string) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const token = await getToken()
      return api.get<ApiProject>(`/projects/${id}`, token)
    },
    enabled: !!id,
  })
}

export function useCreateProject() {
  const { getToken } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: CreateProjectDto) => {
      const token = await getToken()
      return api.post<ApiProject>('/projects', dto, token)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export function useUpdateProject() {
  const { getToken } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: Partial<CreateProjectDto> }) => {
      const token = await getToken()
      return api.patch<ApiProject>(`/projects/${id}`, dto, token)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export function useDeleteProject() {
  const { getToken } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken()
      return api.del(`/projects/${id}`, token)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}
