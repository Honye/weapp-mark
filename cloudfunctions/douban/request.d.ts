export const request: (params: {
  headers?: Record<string, string>
  url?: string
  path?: string
  method?: 'GET'
  data?: Record<string, unknown>
}) => Promise<unknown>
