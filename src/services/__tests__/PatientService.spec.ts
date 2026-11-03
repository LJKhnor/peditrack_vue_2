import { describe, it, expect } from 'vitest'
import { buildPatientPayload, pickPatientFields, toApiDate } from '../PatientService'

describe('toApiDate', () => {
  it('converts an input date to an ISO date-time and omits empty values', () => {
    expect(toApiDate('2026-11-03')).toBe('2026-11-03T00:00:00.000Z')
    expect(toApiDate('')).toBeUndefined()
    expect(toApiDate(null)).toBeUndefined()
    expect(toApiDate('invalide')).toBeUndefined()
  })
})

describe('buildPatientPayload', () => {
  it('sends only personal information, without the id, the map point or health data', () => {
    const patient = pickPatientFields({
      id: 3,
      name: 'Dupont',
      firstname: 'Élise',
      birthdate: '1950-03-02',
      point: { x: 1, y: 2 }
    })
    const payload = buildPatientPayload(patient)

    expect(payload).toMatchObject({ name: 'Dupont', firstname: 'Élise' })
    expect(payload.birthdate).toBe('1950-03-02T00:00:00.000Z')
    expect(payload).not.toHaveProperty('id')
    expect(payload).not.toHaveProperty('point')
    expect(payload).not.toHaveProperty('diabeteType')
    expect(payload).not.toHaveProperty('date')
  })
})
