'use client'
import { useMutation } from '@tanstack/react-query'
import * as api from '@/lib/api/client'

export interface SupportDto {
  name: string; email: string; subject: string; message: string
  type?: 'bug' | 'feature' | 'general' | 'billing'
}

export function useSubmitSupport() {
  return useMutation({
    mutationFn: (dto: SupportDto) => api.post('/support', dto, null),
  })
}
