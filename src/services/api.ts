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
      // Clone the response so we can read it multiple times if needed
      const clonedResponse = response.clone()
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      
      try {
        const errorData = await clonedResponse.json()
        // Check various common error message fields
        errorMessage = errorData.message || errorData.error || errorData.msg || errorMessage
      } catch (e) {
        // If JSON parsing fails, try reading as text
        try {
          const textError = await response.text()
          if (textError) errorMessage = textError
        } catch (textErr) {
          // Keep the default errorMessage
        }
      }
      
      throw new Error(errorMessage)
    }
    return response.json()
  },
}
