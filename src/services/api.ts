const BASE_URL = 'https://fakestoreapi.com'

let authToken: string | null = null

export const api = {
  setToken(token: string | null) {
    authToken = token
  },

  async get<T>(endpoint: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response}`)
    }
    return response.json()
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      let errorMessage = `API Error: ${response.statusText}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // If JSON parsing fails, try reading as text
        try {
          const textError = await response.text()
          if (textError) errorMessage = textError
        } catch (textErr) {
          // Fallback to statusText
        }
      }
      throw new Error(errorMessage)
    }
    return response.json()
  },
}
