import { describe, it, expect, beforeEach } from 'vitest'
import StorageService from '../StorageService'

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('setItem', () => {
    it('stores a value as a JSON string', () => {
      StorageService.setItem('key', { name: 'test' })
      expect(localStorage.getItem('key')).toBe('{"name":"test"}')
    })

    it('stores a primitive value as JSON', () => {
      StorageService.setItem('num', 42)
      expect(localStorage.getItem('num')).toBe('42')
    })

    it('overwrites an existing key', () => {
      StorageService.setItem('key', 'first')
      StorageService.setItem('key', 'second')
      expect(StorageService.getItem('key')).toBe('second')
    })
  })

  describe('getItem', () => {
    it('returns the parsed value for a stored key', () => {
      localStorage.setItem('key', '{"id":1}')
      expect(StorageService.getItem('key')).toEqual({ id: 1 })
    })

    it('returns null for a missing key', () => {
      expect(StorageService.getItem('nonexistent')).toBeNull()
    })

    it('round-trips an object through set and get', () => {
      const user = { id: 7, username: 'alice', pointX: 10.5, pointY: 20.3 }
      StorageService.setItem('user', user)
      expect(StorageService.getItem('user')).toEqual(user)
    })
  })

  describe('removeItem', () => {
    it('removes an existing key from localStorage', () => {
      StorageService.setItem('key', 'value')
      StorageService.removeItem('key')
      expect(localStorage.getItem('key')).toBeNull()
    })

    it('does not throw when the key does not exist', () => {
      expect(() => StorageService.removeItem('nonexistent')).not.toThrow()
    })
  })
})
