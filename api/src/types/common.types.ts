export type SortOrder = 'asc' | 'desc'

export type PaginationParams = {
  page: number
  limit: number
  sort?: string
  order?: SortOrder
}

export type PaginationMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}
