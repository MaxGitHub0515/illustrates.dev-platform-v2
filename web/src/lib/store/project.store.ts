'use client'
import { create } from 'zustand'

interface ProjectFilters {
  search:       string
  status:       'all' | 'published' | 'draft' | 'archived'
  sort:         'newest' | 'views' | 'alpha'
  selectedTags: string[]
}

interface ProjectState extends ProjectFilters {
  setSearch:     (q: string) => void
  setStatus:     (s: ProjectFilters['status']) => void
  setSort:       (s: ProjectFilters['sort']) => void
  toggleTag:     (tag: string) => void
  clearFilters:  () => void
}

const DEFAULT: ProjectFilters = {
  search:       '',
  status:       'all',
  sort:         'newest',
  selectedTags: [],
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
  ...DEFAULT,
  setSearch:    (search)  => set({ search }),
  setStatus:    (status)  => set({ status }),
  setSort:      (sort)    => set({ sort }),
  toggleTag:    (tag)     => {
    const tags = get().selectedTags
    set({ selectedTags: tags.includes(tag) ? tags.filter(t=>t!==tag) : [...tags, tag] })
  },
  clearFilters: ()        => set(DEFAULT),
}))
