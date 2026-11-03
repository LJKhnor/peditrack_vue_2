import apiClient from '@/axios'

// Données personnelles renvoyées par GET /patients et GET /patients/{id} (PatientDto)
export interface Patient {
  id: number
  name: string
  firstname: string
  phoneNum?: string | null
  birthdate?: string | null
  address?: string | null
  email?: string | null
  personOfContact?: string | null
  personOfContactPhoneNumber?: string | null
  referenceBy?: string | null
  doctor?: string | null
  mutual?: string | null
  comments?: string | null
  point?: { x: number; y: number } | null
}

export type PatientFields = Omit<Patient, 'id' | 'point'>

// Informations médicales d'une fiche de santé (HealthDto, hors soins prodigués)
export interface MedicalFields {
  groupType: number
  diabeteType: number
  withHeartDisorder: boolean
  withBleedingDisorder: boolean
  withThyroideDisorder: boolean
  // Prothèse dont le côté n'est pas précisé (fiche antérieure à la distinction gauche / droite)
  hasHipProsthesis: boolean
  hasKneeProsthesis: boolean
  hasLeftHipProsthesis: boolean
  hasRightHipProsthesis: boolean
  hasLeftKneeProsthesis: boolean
  hasRightKneeProsthesis: boolean
  hasRecentDiseases: boolean
  hasRecentOperations: boolean
  allergies: string | null
  drugs: string | null
  skinType: string | null
  footType: string | null
  sweatType: string | null
  remarkType: string | null
  circulationType: string | null
  dermatosisType: string | null
  footDeformityType: string | null
  nailConditionType: string | null
}

export interface Health extends Partial<MedicalFields> {
  careDate?: string | null
  care?: string | null
  usedProducts?: string | null
  usedTools?: string | null
  possibleWounds?: string | null
  advice?: string | null
}

// Ligne de la liste des patients (GET /patients/summary) : informations personnelles, date du
// dernier soin et alertes de la dernière fiche santé, calculées par le backend
export interface PatientSummary extends Patient {
  lastVisit: string | null
  diabeteType: number
  withBleedingDisorder: boolean
  withHeartDisorder: boolean
  hasAllergies: boolean
}

export interface PatientRecord {
  patientDto: Patient
  healthDto: Health | null
  healthHistory?: Health[]
}

const PATIENT_KEYS: (keyof PatientFields)[] = [
  'name',
  'firstname',
  'phoneNum',
  'birthdate',
  'address',
  'email',
  'personOfContact',
  'personOfContactPhoneNumber',
  'referenceBy',
  'doctor',
  'mutual',
  'comments'
]

export function pickPatientFields(patient: Partial<Patient>): PatientFields {
  const fields = {} as Record<string, unknown>
  for (const key of PATIENT_KEYS) fields[key] = patient[key] ?? null
  return fields as unknown as PatientFields
}

// L'API attend des dates ISO complètes (OffsetDateTime) ; une date vide est omise.
export function toApiDate(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return isNaN(date.getTime()) ? undefined : date.toISOString()
}

// PUT /patients/{id} ne met à jour que les informations personnelles du patient
export function buildPatientPayload(patient: PatientFields) {
  return { ...patient, birthdate: toApiDate(patient.birthdate) }
}

export async function getPatients(): Promise<Patient[]> {
  const response = await apiClient.get<Patient[]>('/patients')
  return response.data
}

export async function getPatientSummaries(): Promise<PatientSummary[]> {
  const response = await apiClient.get<PatientSummary[]>('/patients/summary')
  return response.data
}

export async function getPatientRecord(id: number): Promise<PatientRecord> {
  const response = await apiClient.get<PatientRecord>(`/patients/${id}`)
  return response.data
}

export async function deletePatient(id: number) {
  await apiClient.delete(`/patients/${id}`)
}

export async function updatePatient(id: number, patient: PatientFields) {
  const response = await apiClient.put<Patient>(`/patients/${id}`, buildPatientPayload(patient))
  return response.data
}
