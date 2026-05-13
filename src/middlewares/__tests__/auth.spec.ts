import { describe, it, expect, beforeEach } from 'vitest'
import { isAuthenticated } from '../auth.js'

function makeJwt(payload: object): string {
  const encoded = btoa(JSON.stringify(payload))
  return `eyJhbGciOiJIUzI1NiJ9.${encoded}.testsig`
}

describe('isAuthenticated', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns false when no token is stored', () => {
    expect(isAuthenticated()).toBe(false)
  })

  it('returns true for a valid non-expired token', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600
    // Token stored via StorageService is JSON-encoded
    localStorage.setItem('token', JSON.stringify(makeJwt({ exp })))
    expect(isAuthenticated()).toBe(true)
  })

  it('returns false for an expired token', () => {
    const exp = Math.floor(Date.now() / 1000) - 3600
    localStorage.setItem('token', JSON.stringify(makeJwt({ exp })))
    expect(isAuthenticated()).toBe(false)
  })

  it('returns false for a token with no JWT structure (no dots)', () => {
    localStorage.setItem('token', JSON.stringify('not-a-valid-jwt'))
    expect(isAuthenticated()).toBe(false)
  })

  it('returns false for a token with invalid base64 in the payload segment', () => {
    localStorage.setItem('token', JSON.stringify('hdr.!!!bad_base64!!!.sig'))
    expect(isAuthenticated()).toBe(false)
  })

  it('returns false for a token whose payload is valid base64 but not JSON', () => {
    const notJson = btoa('this is not json')
    localStorage.setItem('token', JSON.stringify(`hdr.${notJson}.sig`))
    // JSON.parse of non-JSON throws → catch returns false
    expect(isAuthenticated()).toBe(false)
  })
})
