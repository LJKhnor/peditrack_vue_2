import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PatientsSection from '../PatientsSection.vue'
import type { PatientSummary } from '@/services/PatientService'

const today = new Date(2026, 10, 9)

let nextId = 1
const summary = (overrides: Partial<PatientSummary>): PatientSummary => ({
  id: nextId++,
  name: 'Dupont',
  firstname: 'Élise',
  birthdate: '1950-01-01',
  lastVisit: '2026-10-01T00:00:00Z',
  careInterval: null,
  diabeteType: 0,
  withBleedingDisorder: false,
  withHeartDisorder: false,
  hasAllergies: false,
  ...overrides
})

const tiles = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('.tile').map((tile) => ({
    label: tile.find('.tile-label').text(),
    value: tile.find('.tile-value').text(),
    detail: tile.find('.tile-detail').exists() ? tile.find('.tile-detail').text() : ''
  }))

const rows = (wrapper: ReturnType<typeof mount>, label: string) =>
  wrapper
    .find(`ol[aria-label="${label}"]`)
    .findAll('.bar-row')
    .map((row) => `${row.find('.bar-label').text()} ${row.find('.bar-value').text()}`)

describe('PatientsSection', () => {
  const patients = [
    summary({ doctor: 'Dr Delhaye', mutual: 'Solidaris', birthdate: '1940-05-01' }),
    summary({ doctor: 'dr. delhaye', mutual: 'Solidaris' }),
    summary({ doctor: 'Dr Henrard', mutual: 'Helan', lastVisit: '2024-01-01T00:00:00Z' }),
    summary({ doctor: null, mutual: null, birthdate: null })
  ]

  it('shows the number of patients, the average age and the most referenced doctor', () => {
    const wrapper = mount(PatientsSection, { props: { patients, today } })

    expect(tiles(wrapper)).toEqual([
      { label: 'Patients', value: '4', detail: '3 vus ces 12 derniers mois' },
      { label: 'Âge moyen', value: '79 ans', detail: 'De 76 à 86 ans' },
      { label: 'Médecin le plus référencé', value: 'Dr Delhaye', detail: '2 patients (50 %)' }
    ])
  })

  it('ranks the mutualities and the doctors', () => {
    const wrapper = mount(PatientsSection, { props: { patients, today } })

    expect(rows(wrapper, 'Patients par mutualité')).toEqual([
      'Solidaris 2 (50 %)',
      'Helan 1 (25 %)'
    ])
    expect(rows(wrapper, 'Patients par médecin traitant')).toEqual([
      'Dr Delhaye 2 (50 %)',
      'Dr Henrard 1 (25 %)'
    ])
    const notes = wrapper.findAll('.card-note').map((note) => note.text())
    expect(notes).toEqual([
      '1 patient sans date de naissance',
      'Mutualité non renseignée : 1 patient',
      'Médecin non renseigné : 1 patient.'
    ])
  })

  it('lists tied doctors in the tile', () => {
    const wrapper = mount(PatientsSection, {
      props: {
        patients: [summary({ doctor: 'Dr Delhaye' }), summary({ doctor: 'Dr Henrard' })],
        today
      }
    })
    const doctorTile = tiles(wrapper)[2]
    expect(doctorTile.label).toBe('Médecins les plus référencés')
    expect(doctorTile.value).toBe('Dr Delhaye, Dr Henrard')
    expect(doctorTile.detail).toBe('1 patient (50 %) chacun')
  })
})
