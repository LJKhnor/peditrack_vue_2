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
