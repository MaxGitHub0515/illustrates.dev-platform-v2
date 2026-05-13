'use client'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import * as api from '@/lib/api/client'
import type { ApiStats } from '@/types/api'

export function useStats() {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const token = await getToken()
      return api.get<ApiStats>('/stats', token)
    },
    refetchInterval: 30_000, // refresh every 30s
  })
}
