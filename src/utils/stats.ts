import type { DailyCount } from '@/services/StatsService'

// Une colonne de graphique : valeur de la période et, en option, valeur de comparaison
export interface Column {
  key: string
  label: string
  // Libellé complet, pour l'infobulle et le tableau (« novembre 2026 », « semaine du 2 nov. 2026 »)
  title: string
  value: number
  previous?: number
}

const MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre'
]
const SHORT_MONTHS = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.'
]
export const WEEKDAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

// « 2026-11-03 » en date locale (new Date('2026-11-03') serait minuit UTC, la veille selon le fuseau)
export function parseDay(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const pad = (value: number) => String(value).padStart(2, '0')

export const monthKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}`

export const dayKey = (date: Date) => `${monthKey(date)}-${pad(date.getDate())}`

export const monthName = (date: Date) => `${MONTHS[date.getMonth()]} ${date.getFullYear()}`

// Lundi de la semaine d'une date
export function weekStart(date: Date): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
  return start
}

function sumBy(counts: DailyCount[], key: (date: Date) => string): Map<string, number> {
  const sums = new Map<string, number>()
  for (const { date, count } of counts) {
    const bucket = key(parseDay(date))
    sums.set(bucket, (sums.get(bucket) ?? 0) + count)
  }
  return sums
}

// Les `months` derniers mois, mois en cours compris, avec le même mois de l'année précédente
export function monthlyColumns(counts: DailyCount[], today: Date, months = 12): Column[] {
  const sums = sumBy(counts, monthKey)
  return Array.from({ length: months }, (_, index) => {
    const month = new Date(today.getFullYear(), today.getMonth() - (months - 1 - index), 1)
    const lastYear = new Date(month.getFullYear() - 1, month.getMonth(), 1)
    return {
      key: monthKey(month),
      label: SHORT_MONTHS[month.getMonth()],
      title: monthName(month),
      value: sums.get(monthKey(month)) ?? 0,
      previous: sums.get(monthKey(lastYear)) ?? 0
    }
  })
}

// Les `weeks` dernières semaines (du lundi au dimanche), semaine en cours comprise
export function weeklyColumns(counts: DailyCount[], today: Date, weeks = 12): Column[] {
  const sums = sumBy(counts, (date) => dayKey(weekStart(date)))
  const current = weekStart(today)
  return Array.from({ length: weeks }, (_, index) => {
    const start = new Date(current)
    start.setDate(start.getDate() - 7 * (weeks - 1 - index))
    const label = `${start.getDate()} ${SHORT_MONTHS[start.getMonth()]}`
    return {
      key: dayKey(start),
      label,
      title: `Semaine du ${label} ${start.getFullYear()}`,
      value: sums.get(dayKey(start)) ?? 0
    }
  })
}

// Répartition par jour de la semaine sur les 12 derniers mois (mois en cours compris)
export function weekdayColumns(counts: DailyCount[], today: Date): Column[] {
  const from = new Date(today.getFullYear(), today.getMonth() - 11, 1)
  const sums = new Array(7).fill(0)
  for (const { date, count } of counts) {
    const day = parseDay(date)
    if (day >= from && day <= today) sums[(day.getDay() + 6) % 7] += count
  }
  return WEEKDAYS.map((name, index) => ({
    key: String(index),
    label: name.slice(0, 3) + '.',
    title: name,
    value: sums[index]
  }))
}

export interface ActivitySummary {
  thisMonth: number
  lastMonth: number
  sameMonthLastYear: number
  // Depuis le 1er janvier, et sur la même période l'an dernier (jusqu'au même jour)
  yearToDate: number
  lastYearToDate: number
}

export function activitySummary(counts: DailyCount[], today: Date): ActivitySummary {
  const month = monthKey(today)
  const lastMonth = monthKey(new Date(today.getFullYear(), today.getMonth() - 1, 1))
  const sameMonthLastYear = monthKey(new Date(today.getFullYear() - 1, today.getMonth(), 1))
  const todayKey = dayKey(today)
  const lastYearToday = `${today.getFullYear() - 1}${todayKey.slice(4)}`
  const summary = {
    thisMonth: 0,
    lastMonth: 0,
    sameMonthLastYear: 0,
    yearToDate: 0,
    lastYearToDate: 0
  }

  for (const { date, count } of counts) {
    const key = date.slice(0, 7)
    if (key === month) summary.thisMonth += count
    else if (key === lastMonth) summary.lastMonth += count
    if (key === sameMonthLastYear) summary.sameMonthLastYear += count
    if (date.slice(0, 4) === todayKey.slice(0, 4) && date <= todayKey) summary.yearToDate += count
    if (date.slice(0, 4) === lastYearToday.slice(0, 4) && date <= lastYearToday) {
      summary.lastYearToDate += count
    }
  }
  return summary
}
