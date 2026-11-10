import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ClinicalSection from '../ClinicalSection.vue'
import type { ClinicalStats } from '@/services/StatsService'

const foot = (label: string, patients: number, left: number, right: number, unknownSide = 0) => ({
  label,
  patients,
  left,
  right,
  unknownSide
})

const clinical: ClinicalStats = {
  patients: 10,
  diabetesType1: 1,
  diabetesType2: 3,
  diabeticsByGroup: [
    { label: '0', count: 1 },
    { label: '1', count: 0 },
    { label: '2', count: 2 },
    { label: '3', count: 1 },
    { label: '4', count: 0 }
  ],
  bleedingDisorder: 2,
  heartDisorder: 0,
  nailConditions: [
    foot('Onycomychoses', 3, 2, 2),
    foot('Onychogryphoses', 0, 0, 0),
    foot('Ongles incarnés', 5, 1, 4, 1)
  ],
  footDeformities: [foot('Hallux valgus', 0, 0, 0)],
  remarks: [
    { label: 'Cors', count: 2 },
    { label: 'Durillons', count: 6 },
    { label: 'Crevasses', count: 0 }
  ]
}

const rows = (wrapper: ReturnType<typeof mount>, label: string) =>
  wrapper
    .find(`ol[aria-label="${label}"]`)
    .findAll('.bar-row')
    .map((row) =>
      row
        .findAll('.bar-label, .bar-value')
        .map((cell) => cell.text().replace(/\s+/g, ' '))
        .join(' | ')
    )

describe('ClinicalSection', () => {
  it('shows diabetes, bleeding and heart disorders as shares of the patients', () => {
    const wrapper = mount(ClinicalSection, { props: { clinical } })
    const tiles = wrapper
      .findAll('.tile')
      .map((tile) =>
        ['.tile-label', '.tile-value', '.tile-detail']
          .map((part) => tile.find(part).text().replace(/\s+/g, ' '))
          .join(' | ')
      )

    expect(tiles).toEqual([
      'Patients diabétiques | 4 | 40 % des patients · type 1 : 1 · type 2 : 3',
      'Trouble de la coagulation | 2 | 20 % des patients',
      'Problèmes cardiaques | 0 | 0 % des patients'
    ])
  })

  it('lists the diabetics by group, the group not filled in last', () => {
    const wrapper = mount(ClinicalSection, { props: { clinical } })

    expect(rows(wrapper, 'Patients diabétiques par groupe')).toEqual([
      'Groupe 1 | 0 (0 %)',
      'Groupe 2 | 2 (50 %)',
      'Groupe 3 | 1 (25 %)',
      'Groupe 4 | 0 (0 %)',
      'Groupe non renseigné | 1 (25 %)'
    ])
  })

  it('ranks the nail conditions with the split per foot, without the absent ones', () => {
    const wrapper = mount(ClinicalSection, { props: { clinical } })

    expect(rows(wrapper, 'Patients par affection unguéale')).toEqual([
      'Ongles incarnés Pied gauche : 1 · pied droit : 4 · côté non précisé : 1 | 5 (50 %)',
      'Onycomychoses Pied gauche : 2 · pied droit : 2 | 3 (30 %)'
    ])
    expect(rows(wrapper, 'Patients par remarque')).toEqual([
      'Durillons | 6 (60 %)',
      'Cors | 2 (20 %)'
    ])
    expect(wrapper.text()).toContain('Aucune déformation encodée.')
  })
})
