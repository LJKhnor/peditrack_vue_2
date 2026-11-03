import { describe, it, expect } from 'vitest'
import { errorStatus, fieldErrors, problemOf } from '../apiError'

const problem = {
  type: 'about:blank',
  title: 'Bad Request',
  status: 400,
  detail: 'Validation failed',
  instance: '/api/users/register',
  errors: { password: 'Password must be at least 8 characters' }
}

describe('apiError', () => {
  it('reads the status and the ProblemDetail of an axios error', () => {
    const error = { response: { status: 400, data: problem } }
    expect(errorStatus(error)).toBe(400)
    expect(problemOf(error)?.detail).toBe('Validation failed')
    expect(fieldErrors(error)).toEqual({ password: 'Password must be at least 8 characters' })
  })

  it('returns nothing when the server did not answer', () => {
    const error = new Error('Network Error')
    expect(errorStatus(error)).toBeUndefined()
    expect(problemOf(error)).toBeNull()
    expect(fieldErrors(error)).toEqual({})
  })

  it('ignores a body that is not a ProblemDetail object', () => {
    const error = { response: { status: 500, data: 'Internal Server Error' } }
    expect(problemOf(error)).toBeNull()
    expect(fieldErrors(error)).toEqual({})
  })
})
