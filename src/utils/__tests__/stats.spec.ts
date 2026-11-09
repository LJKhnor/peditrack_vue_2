import { describe, it, expect } from 'vitest'
import type { PatientSummary } from '@/services/PatientService'
import {
  activitySummary,
  daysBetween,
  formatDuration,
  formatRhythm,
  isAtRisk,
  latePatients,
  telHref,
  unknownRhythmCount,
  monthlyColumns,
  parseDay,
  weekdayColumns,
  weeklyColumns,
  weekStart
} from '../stats'

// Lundi 9 novembre 2026
const today = new Date(2026, 10, 9)

describe('parseDay', () => {
  it('reads an API day as a local date', () => {
    const day = parseDay('2026-11-03')
    expect([day.getFullYear(), day.getMonth(), day.getDate()]).toEqual([2026, 10, 3])
  })
})

describe('weekStart', () => {
  it('returns the monday of the week, sunday included', () => {
    expect(weekStart(new Date(2026, 10, 9)).getDate()).toBe(9)
    expect(weekStart(new Date(2026, 10, 15)).getDate()).toBe(9)
    expect(weekStart(new Date(2026, 10, 1)).getDate()).toBe(26)
  })
})

describe('monthlyColumns', () => {
  const counts = [
    { date: '2025-11-20', count: 4 },
    { date: '2025-12-01', count: 1 },
    { date: '2026-10-02', count: 2 },
    { date: '2026-10-30', count: 3 },
    { date: '2026-11-03', count: 6 }
  ]

  it('sums the last 12 months, current month last, with the same month a year earlier', () => {
    const columns = monthlyColumns(counts, today)
    expect(columns).toHaveLength(12)
    expect(columns[0]).toMatchObject({ key: '2025-12', label: 'déc.', value: 1, previous: 0 })
    expect(columns[10]).toMatchObject({ key: '2026-10', title: 'octobre 2026', value: 5 })
    expect(columns[11]).toMatchObject({ key: '2026-11', value: 6, previous: 4 })
  })

  it('crosses the year boundary', () => {
    const columns = monthlyColumns(counts, new Date(2026, 0, 15), 3)
    expect(columns.map((column) => column.key)).toEqual(['2025-11', '2025-12', '2026-01'])
  })
})

describe('weeklyColumns', () => {
  it('sums the last weeks from monday to sunday', () => {
    const columns = weeklyColumns(
      [
        { date: '2026-11-01', count: 1 }, // dimanche : semaine du 26 octobre
        { date: '2026-11-02', count: 2 },
        { date: '2026-11-08', count: 3 },
        { date: '2026-11-09', count: 4 }
      ],
      today,
      3
    )
    expect(columns.map((column) => [column.key, column.value])).toEqual([
      ['2026-10-26', 1],
      ['2026-11-02', 5],
      ['2026-11-09', 4]
    ])
    expect(columns[2]).toMatchObject({ label: '9 nov.', title: 'Semaine du 9 nov. 2026' })
  })
})

describe('weekdayColumns', () => {
  it('counts the cares of the last 12 months per weekday, from monday', () => {
    const columns = weekdayColumns(
      [
        { date: '2025-11-30', count: 9 }, // avant le 1er décembre 2025 : ignoré
        { date: '2025-12-01', count: 1 }, // lundi
        { date: '2026-11-03', count: 2 }, // mardi
        { date: '2026-11-07', count: 5 } // samedi
      ],
      today
    )
    expect(columns.map((column) => column.value)).toEqual([1, 2, 0, 0, 0, 5, 0])
    expect(columns[0]).toMatchObject({ label: 'Lun.', title: 'Lundi' })
  })
})

describe('activitySummary', () => {
  it('compares the current month and the year to date with the previous periods', () => {
    const summary = activitySummary(
      [
        { date: '2025-01-05', count: 1 },
        { date: '2025-11-09', count: 2 },
        { date: '2025-11-10', count: 10 }, // après le même jour l'an dernier
        { date: '2026-01-02', count: 3 },
        { date: '2026-10-15', count: 4 },
        { date: '2026-11-02', count: 5 }
      ],
      today
    )
    expect(summary).toEqual({
      thisMonth: 5,
      lastMonth: 4,
      sameMonthLastYear: 12,
      yearToDate: 12,
      lastYearToDate: 3
    })
  })

  it('takes december of the previous year as last month in january', () => {
    const summary = activitySummary([{ date: '2025-12-20', count: 2 }], new Date(2026, 0, 5))
    expect(summary.lastMonth).toBe(2)
    expect(summary.yearToDate).toBe(0)
  })
})

const summary = (overrides: Partial<PatientSummary> = {}): PatientSummary => ({
  id: 1,
  name: 'Dupont',
  firstname: 'Élise',
  lastVisit: null,
  careInterval: null,
  diabeteType: 0,
  withBleedingDisorder: false,
  withHeartDisorder: false,
  hasAllergies: false,
  ...overrides
})

describe('daysBetween', () => {
  it('counts whole days, across a daylight saving change', () => {
    expect(daysBetween(new Date(2026, 9, 20, 18), new Date(2026, 10, 9, 8))).toBe(20)
  })
})

describe('latePatients', () => {
  it('lists the patients not seen for more than 1.5 times their usual interval', () => {
    const late = latePatients(
      [
        // rythme 28 jours, vu il y a 42 jours : exactement 1,5 fois, pas encore en retard
        summary({ id: 1, lastVisit: '2026-09-28T00:00:00Z', careInterval: 28 }),
        // rythme 28 jours, vu il y a 43 jours : en retard, attendu depuis 15 jours
        summary({ id: 2, lastVisit: '2026-09-27T00:00:00Z', careInterval: 28 }),
        // rythme inconnu (un seul soin) ou jamais soigné : jamais en retard
        summary({ id: 3, lastVisit: '2025-01-01T00:00:00Z', careInterval: null }),
        summary({ id: 4, lastVisit: null, careInterval: null })
      ],
      today
    )
    expect(late.map((item) => item.patient.id)).toEqual([2])
    expect(late[0]).toMatchObject({ interval: 28, overdueDays: 15, atRisk: false })
  })

  it('puts the most recently late patients first and flags the patients at risk', () => {
    const late = latePatients(
      [
        summary({ id: 1, lastVisit: '2025-11-09T00:00:00Z', careInterval: 42 }),
        summary({ id: 2, lastVisit: '2026-08-01T00:00:00Z', careInterval: 42, diabeteType: 2 })
      ],
      today
    )
    expect(late.map((item) => [item.patient.id, item.atRisk])).toEqual([
      [2, true],
      [1, false]
    ])
  })
})

describe('isAtRisk', () => {
  it('means diabetes, bleeding disorder or heart disorder, not allergies', () => {
    expect(isAtRisk(summary({ diabeteType: 1 }))).toBe(true)
    expect(isAtRisk(summary({ withBleedingDisorder: true }))).toBe(true)
    expect(isAtRisk(summary({ withHeartDisorder: true }))).toBe(true)
    expect(isAtRisk(summary({ hasAllergies: true }))).toBe(false)
  })
})

describe('unknownRhythmCount', () => {
  it('counts the patients cared for only once', () => {
    expect(
      unknownRhythmCount([
        summary({ lastVisit: '2026-01-01T00:00:00Z', careInterval: null }),
        summary({ lastVisit: '2026-01-01T00:00:00Z', careInterval: 30 }),
        summary({ lastVisit: null })
      ])
    ).toBe(1)
  })
})

describe('formatDuration and formatRhythm', () => {
  it('uses days, then weeks, then months, then years', () => {
    expect(formatDuration(1)).toBe('1 jour')
    expect(formatDuration(10)).toBe('10 jours')
    expect(formatDuration(21)).toBe('3 sem.')
    expect(formatDuration(150)).toBe('5 mois')
    expect(formatDuration(800)).toBe('2 ans')
    expect(formatRhythm(10)).toBe('tous les 10 jours')
    expect(formatRhythm(42)).toBe('toutes les 6 sem.')
    expect(formatRhythm(91)).toBe('tous les 3 mois')
  })
})

describe('telHref', () => {
  it('keeps only digits and the plus sign', () => {
    expect(telHref('0471 23 45 67')).toBe('tel:0471234567')
    expect(telHref('+32 (0)471/23.45.67')).toBe('tel:+320471234567')
  })
})
