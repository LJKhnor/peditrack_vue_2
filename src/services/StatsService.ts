import apiClient from '@/axios'

// Nombre d'événements d'un jour (date AAAA-MM-JJ, jour du cabinet)
export interface DailyCount {
  date: string
  count: number
}

// GET /data/stats/activity : soins par jour et nouveaux patients par jour (jour de leur premier soin),
// triés par date, sans donnée nominative
export interface ActivityStats {
  cares: DailyCount[]
  newPatients: DailyCount[]
}

export async function getActivityStats(): Promise<ActivityStats> {
  const response = await apiClient.get<ActivityStats>('/data/stats/activity')
  return response.data
}

// Nombre de patients pour un libellé (remarque) ou un groupe (« 0 » = groupe non renseigné)
export interface LabelCount {
  label: string
  count: number
}

// Affection unguéale ou déformation : patients concernés (une fois, quel que soit le pied) et par pied
// (« côté non précisé » : fiches antérieures à la distinction gauche / droite)
export interface FootConditionCount {
  label: string
  patients: number
  left: number
  right: number
  unknownSide: number
}

// GET /data/stats/clinical : profil clinique sur la dernière fiche de chaque patient, sans donnée
// nominative. Les listes suivent l'ordre des options, valeurs à 0 comprises.
export interface ClinicalStats {
  // Patients ayant au moins une fiche (base des pourcentages)
  patients: number
  diabetesType1: number
  diabetesType2: number
  diabeticsByGroup: LabelCount[]
  bleedingDisorder: number
  heartDisorder: number
  nailConditions: FootConditionCount[]
  footDeformities: FootConditionCount[]
  remarks: LabelCount[]
}

export async function getClinicalStats(): Promise<ClinicalStats> {
  const response = await apiClient.get<ClinicalStats>('/data/stats/clinical')
  return response.data
}
