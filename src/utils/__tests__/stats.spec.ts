import { describe, it, expect } from 'vitest'
import {
  activitySummary,
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
