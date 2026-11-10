import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import StatsView from '../StatsView.vue'
import type { PatientSummary } from '@/services/PatientService'

vi.mock('@/services/StatsService', () => ({
  getActivityStats: vi.fn(async () => ({ cares: [], newPatients: [] })),
  getClinicalStats: vi.fn(async () => ({
    patients: 1,
    diabetesType1: 0,
    diabetesType2: 1,
    diabeticsByGroup: [{ label: '2', count: 1 }],
    bleedingDisorder: 0,
    heartDisorder: 0,
    nailConditions: [],
    footDeformities: [],
    remarks: []
  }))
}))

// vi.mock est remonté en tête du fichier : la donnée de test doit l'être aussi
const { patient } = vi.hoisted(() => ({
  patient: {
    id: 1,
    name: 'Dupont',
    firstname: 'Élise',
    // dernier soin en 2020, rythme de 6 semaines : en retard
    lastVisit: '2020-01-01T00:00:00Z',
    careInterval: 42,
    diabeteType: 0,
    withBleedingDisorder: false,
    withHeartDisorder: false,
    hasAllergies: false
  } satisfies PatientSummary
}))

vi.mock('@/services/PatientService', () => ({
  getPatientSummaries: vi.fn(async () => [patient])
}))

async function mountAt(path: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/stats', component: StatsView }]
  })
  await router.push(path)
  const wrapper = mount(StatsView, { global: { plugins: [router] } })
  await flushPromises()
  return { wrapper, router }
}

const visiblePanel = (wrapper: Awaited<ReturnType<typeof mountAt>>['wrapper']) =>
  wrapper
    .findAll('[role="tabpanel"]')
    .filter((panel) => (panel.element as HTMLElement).style.display !== 'none')
    .map((panel) => panel.attributes('id'))

describe('StatsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens on the patient base, with the number of patients to call back', async () => {
    const { wrapper } = await mountAt('/stats')

    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs.map((tab) => tab.text())).toEqual([
      'Patientèle',
      'Profil clinique',
      'Activité',
      'Patients à relancer 1'
    ])
    expect(tabs[0].attributes('aria-selected')).toBe('true')
    expect(visiblePanel(wrapper)).toEqual(['panel-patientele'])
  })

  it('switches tab on click and keeps it in the URL', async () => {
    const { wrapper, router } = await mountAt('/stats')

    await wrapper.findAll('[role="tab"]')[3].trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.query.onglet).toBe('relances')
    expect(visiblePanel(wrapper)).toEqual(['panel-relances'])
  })

  it('opens the tab given in the URL and moves with the arrow keys', async () => {
    const { wrapper, router } = await mountAt('/stats?onglet=activite')
    expect(visiblePanel(wrapper)).toEqual(['panel-activite'])

    await wrapper.findAll('[role="tab"]')[2].trigger('keydown', { key: 'ArrowLeft' })
    await flushPromises()

    expect(router.currentRoute.value.query.onglet).toBe('clinique')
  })

  it('falls back to the patient base for an unknown tab', async () => {
    const { wrapper } = await mountAt('/stats?onglet=inconnu')
    expect(visiblePanel(wrapper)).toEqual(['panel-patientele'])
  })
})
