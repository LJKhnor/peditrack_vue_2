import type { Health, Patient } from '@/services/PatientService'

type DateValue = string | number | Date | null | undefined

function toDate(value: DateValue): Date | null {
  if (value === null || value === undefined || value === '') return null
  const date = new Date(value)
  return isNaN(date.getTime()) ? null : date
}

// Format AAAA-MM-JJ attendu par <input type="date">, en heure locale.
// Une valeur absente ou invalide donne null (et non le 01/01/1970 de new Date(null)).
export function toInputDate(value: DateValue): string | null {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const date = toDate(value)
  if (!date) return null
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDate(value: DateValue, fallback = '—'): string {
  const date = toDate(value)
  if (!date) return fallback
  return date.toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function computeAge(birthdate: DateValue, today = new Date()): number | null {
  const date = toDate(birthdate)
  if (!date) return null
  let age = today.getFullYear() - date.getFullYear()
  const birthdayPassed =
    today.getMonth() > date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate())
  if (!birthdayPassed) age--
  return age >= 0 ? age : null
}

export function initials(patient: Pick<Patient, 'name' | 'firstname'>): string {
  const first = patient.firstname?.trim().charAt(0) ?? ''
  const last = patient.name?.trim().charAt(0) ?? ''
  return (first + last).toUpperCase() || '?'
}

export function fullName(patient: Pick<Patient, 'name' | 'firstname'>): string {
  return [patient.firstname, patient.name].filter(Boolean).join(' ')
}

export type AlertKey = 'diabetes' | 'bleeding' | 'heart' | 'allergies'

export interface PatientAlert {
  key: AlertKey
  label: string
}

// Fiche santé complète (fiche patient) ou résumé de la liste (`hasAllergies` au lieu du texte)
type AlertSource = Pick<
  Health,
  'diabeteType' | 'withBleedingDisorder' | 'withHeartDisorder' | 'allergies'
> & { hasAllergies?: boolean }

// Alertes médicales mises en avant dans la liste et la fiche patient
export function patientAlerts(health: AlertSource | null | undefined): PatientAlert[] {
  if (!health) return []
  const alerts: PatientAlert[] = []
  if (health.diabeteType) {
    alerts.push({ key: 'diabetes', label: `Diabète type ${health.diabeteType}` })
  }
  if (health.withBleedingDisorder) alerts.push({ key: 'bleeding', label: 'Coagulation' })
  if (health.withHeartDisorder) alerts.push({ key: 'heart', label: 'Cardiaque' })
  if (health.hasAllergies ?? !!health.allergies?.trim()) {
    alerts.push({ key: 'allergies', label: 'Allergies' })
  }
  return alerts
}

function normalize(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// Patient existant avec les mêmes nom, prénom et date de naissance
export function findDuplicate(
  candidate: Pick<Patient, 'name' | 'firstname' | 'birthdate'>,
  patients: Patient[],
  excludeId?: number | null
): Patient | undefined {
  const birthdate = toInputDate(candidate.birthdate)
  if (!birthdate) return undefined
  return patients.find(
    (patient) =>
      patient.id !== excludeId &&
      normalize(patient.name) === normalize(candidate.name) &&
      normalize(patient.firstname) === normalize(candidate.firstname) &&
      toInputDate(patient.birthdate) === birthdate
  )
}

export function matchesSearch(patient: Patient, query: string): boolean {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true
  const phone = (patient.phoneNum ?? '').replace(/\D/g, '')
  const haystack = normalize(
    [patient.name, patient.firstname, patient.email, patient.phoneNum].join(' ')
  )
  return terms.every((term) => {
    const digits = term.replace(/\D/g, '')
    return haystack.includes(term) || (digits.length > 0 && phone.includes(digits))
  })
}
