import { describe, it, expect } from 'vitest'
import {
  computeAge,
  findDuplicate,
  initials,
  lastVisit,
  matchesSearch,
  patientAlerts,
  toInputDate
} from '../patient'
import type { Patient } from '@/services/PatientService'

const patient = (overrides: Partial<Patient> = {}): Patient => ({
  id: 1,
  name: 'Dupont',
  firstname: 'Élise',
  phoneNum: '0471 23 45 67',
  email: 'elise@example.be',
  birthdate: '1950-03-02T00:00:00Z',
  ...overrides
})

describe('toInputDate', () => {
  it('returns null for missing or invalid values instead of 1970-01-01', () => {
    expect(toInputDate(null)).toBeNull()
    expect(toInputDate(undefined)).toBeNull()
    expect(toInputDate('')).toBeNull()
    expect(toInputDate('pas une date')).toBeNull()
  })

  it('keeps an input date as is and formats dates as YYYY-MM-DD in local time', () => {
    expect(toInputDate('2026-11-03')).toBe('2026-11-03')
    expect(toInputDate(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05')
  })
})

describe('computeAge', () => {
  const today = new Date(2026, 10, 3)

  it('counts a birthday only once it has passed', () => {
    expect(computeAge('1950-11-03', today)).toBe(76)
    expect(computeAge('1950-11-04', today)).toBe(75)
  })

  it('returns null without a valid birthdate', () => {
    expect(computeAge(null, today)).toBeNull()
    expect(computeAge('2030-01-01', today)).toBeNull()
  })
})

describe('initials', () => {
  it('uses the first letters of first name and last name', () => {
    expect(initials(patient())).toBe('ÉD')
    expect(initials({ name: '', firstname: '' })).toBe('?')
  })
})

describe('patientAlerts', () => {
  it('lists diabetes, bleeding disorder, heart disorder and allergies', () => {
    const alerts = patientAlerts({
      diabeteType: 2,
      withBleedingDisorder: true,
      withHeartDisorder: false,
      allergies: 'Latex'
    })
    expect(alerts.map((alert) => alert.key)).toEqual(['diabetes', 'bleeding', 'allergies'])
    expect(alerts[0].label).toBe('Diabète type 2')
  })

  it('ignores empty allergies and missing health data', () => {
    expect(patientAlerts({ diabeteType: 0, allergies: '  ' })).toEqual([])
    expect(patientAlerts(null)).toEqual([])
  })
})

describe('lastVisit', () => {
  it('returns the most recent care date and skips entries without a date', () => {
    const result = lastVisit([
      { careDate: '2026-01-10T00:00:00Z' },
      { careDate: null, care: '' },
      { careDate: '2026-05-02T00:00:00Z' }
    ])
    expect(result).toBe('2026-05-02T00:00:00.000Z')
  })

  it('returns null when no care has a date', () => {
    expect(lastVisit([{ careDate: null }])).toBeNull()
    expect(lastVisit(undefined)).toBeNull()
  })
})

describe('findDuplicate', () => {
  const patients = [patient()]

  it('matches same name, first name and birthdate ignoring case and accents', () => {
    const candidate = { name: 'DUPONT', firstname: 'elise', birthdate: '1950-03-02' }
    expect(findDuplicate(candidate, patients)?.id).toBe(1)
  })

  it('ignores the edited patient and different birthdates', () => {
    const candidate = { name: 'Dupont', firstname: 'Élise', birthdate: '1950-03-02' }
    expect(findDuplicate(candidate, patients, 1)).toBeUndefined()
    expect(findDuplicate({ ...candidate, birthdate: '1951-03-02' }, patients)).toBeUndefined()
  })
})

describe('matchesSearch', () => {
  it('searches name, first name, email and phone', () => {
    expect(matchesSearch(patient(), 'dupont elise')).toBe(true)
    expect(matchesSearch(patient(), 'example.be')).toBe(true)
    expect(matchesSearch(patient(), '0471234567')).toBe(true)
    expect(matchesSearch(patient(), 'martin')).toBe(false)
    expect(matchesSearch(patient(), '   ')).toBe(true)
  })
})
