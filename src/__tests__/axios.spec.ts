import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import apiClient from '../axios'

describe('apiClient request interceptor', () => {
  let savedAdapter: any
  let capturedConfig: any

  beforeAll(() => {
    savedAdapter = apiClient.defaults.adapter
    apiClient.defaults.adapter = async (config: any) => {
      capturedConfig = config
      return { data: {}, status: 200, statusText: 'OK', headers: {}, config, request: {} }
    }
  })

  afterAll(() => {
    apiClient.defaults.adapter = savedAdapter
  })

  beforeEach(() => {
    localStorage.clear()
    capturedConfig = null
  })

  it('adds an Authorization header when a token is stored', async () => {
    localStorage.setItem('token', JSON.stringify('my-jwt-token'))
    await apiClient.get('/test')
    expect(capturedConfig.headers['Authorization']).toBe('Bearer my-jwt-token')
  })

  it('does not add an Authorization header when no token is stored', async () => {
    await apiClient.get('/test')
    expect(capturedConfig.headers['Authorization']).toBeUndefined()
  })

  it('removes the corrupted token from localStorage and does not crash', async () => {
    localStorage.setItem('token', '{{{not-valid-json')
    await apiClient.get('/test')
    expect(localStorage.getItem('token')).toBeNull()
    expect(capturedConfig.headers['Authorization']).toBeUndefined()
  })
})
