import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

import apiClient from '../../axios'
import AuthService from '../AuthService'

const mockPost = vi.mocked(apiClient.post)
const mockGet = vi.mocked(apiClient.get)

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('getCurrentUser', () => {
    it('returns null when no user is stored', () => {
      expect(AuthService.getCurrentUser()).toBeNull()
    })

    it('returns the parsed user object', () => {
      const user = { id: 1, username: 'alice' }
      localStorage.setItem('user', JSON.stringify(user))
      expect(AuthService.getCurrentUser()).toEqual(user)
    })

    it('removes corrupted user data and returns null', () => {
      localStorage.setItem('user', '{not valid json')
      expect(AuthService.getCurrentUser()).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })
  })

  describe('getCurrentToken', () => {
    it('returns null when no token is stored', () => {
      expect(AuthService.getCurrentToken()).toBeNull()
    })

    it('returns the token string', () => {
      const jwt = 'eyJhbGciOiJIUzI1NiJ9.payload.sig'
      localStorage.setItem('token', JSON.stringify(jwt))
      expect(AuthService.getCurrentToken()).toBe(jwt)
    })

    it('removes corrupted token data and returns null', () => {
      localStorage.setItem('token', '{{{not valid json')
      expect(AuthService.getCurrentToken()).toBeNull()
      expect(localStorage.getItem('token')).toBeNull()
    })
  })

  describe('isCurrentUserConnected', () => {
    it('returns false when no token is stored', () => {
      expect(AuthService.isCurrentUserConnected()).toBe(false)
    })

    it('returns true when a token is stored', () => {
      localStorage.setItem('token', JSON.stringify('some-jwt'))
      expect(AuthService.isCurrentUserConnected()).toBe(true)
    })
  })

  describe('getCurrentUserId', () => {
    it('returns undefined when no user is stored', () => {
      expect(AuthService.getCurrentUserId()).toBeUndefined()
    })

    it('returns the user id', () => {
      localStorage.setItem('user', JSON.stringify({ id: 42, username: 'bob' }))
      expect(AuthService.getCurrentUserId()).toBe(42)
    })
  })

  describe('logout', () => {
    it('removes both user and token from localStorage', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1 }))
      localStorage.setItem('token', JSON.stringify('jwt'))
      AuthService.logout()
      expect(localStorage.getItem('user')).toBeNull()
      expect(localStorage.getItem('token')).toBeNull()
    })
  })

  describe('login', () => {
    it('stores the token and user with coordinates on success', async () => {
      mockPost.mockResolvedValue({ data: { token: 'jwt-token', id: 1 } })
      mockGet.mockResolvedValue({ data: { pointX: 10.5, pointY: 20.3 } })

      await AuthService.login({ username: 'alice', password: 'pass' })

      expect(AuthService.getCurrentToken()).toBe('jwt-token')
      expect(AuthService.getCurrentUser()).toEqual({
        id: 1,
        username: 'alice',
        pointX: 10.5,
        pointY: 20.3,
      })
    })

    it('stores the user without coordinates when the /info endpoint fails', async () => {
      mockPost.mockResolvedValue({ data: { token: 'jwt-token', id: 2 } })
      mockGet.mockRejectedValue(new Error('Network error'))

      await AuthService.login({ username: 'bob', password: 'pass' })

      expect(AuthService.getCurrentUser()).toEqual({ id: 2, username: 'bob' })
    })

    it('stores nothing when the response contains no token', async () => {
      mockPost.mockResolvedValue({ data: {} })

      await AuthService.login({ username: 'unknown', password: 'wrong' })

      expect(AuthService.getCurrentToken()).toBeNull()
      expect(AuthService.getCurrentUser()).toBeNull()
    })
  })
})
