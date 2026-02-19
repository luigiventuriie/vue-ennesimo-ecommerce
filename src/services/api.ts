const BASE_URL = 'https://fakestoreapi.com'

let authToken: string | null = null

export const api = {
  setToken(token: string | null) {
    authToken = token
  },

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    }

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  },

  async post<T>(endpoint: string, data: any, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    }

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      ...options,
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const clonedResponse = response.clone()
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`

      try {
        const errorData = await clonedResponse.json()
        errorMessage = errorData.message || errorData.error || errorData.msg || errorMessage
      } catch {
        try {
          const textError = await response.text()
          if (textError) errorMessage = textError
        } catch {}
      }

      throw new Error(errorMessage)
    }
    return response.json()
  },
}
