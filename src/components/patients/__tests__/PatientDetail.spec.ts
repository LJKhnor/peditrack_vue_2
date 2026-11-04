import { describe, it, expect, afterEach } from 'vitest'
import { mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import PatientDetail from '../PatientDetail.vue'
import type { Health, PatientRecord } from '@/services/PatientService'

const record = (health: Health): PatientRecord => ({
  patientDto: { id: 1, name: 'Dupont', firstname: 'Élise' },
  healthDto: health,
  healthHistory: []
})

let wrapper: VueWrapper | undefined

// BaseModal se téléporte dans <body> : on lit les cartes du dossier médical dans le document
const mountDetail = (health: Health) => {
  wrapper = mount(PatientDetail, {
    props: { record: record(health) },
    attachTo: document.body,
    global: { stubs: { RouterLink: RouterLinkStub } }
  })
  const cards = [...document.body.querySelectorAll('.health-card')]
  return Object.fromEntries(
    cards.map((card) => [
      card.querySelector('.health-label')?.textContent?.trim(),
      card.querySelector('.health-value')?.textContent?.trim()
    ])
  )
}

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('PatientDetail', () => {
  it('shows the precision of an "Autres" deformity and nail condition', () => {
    const fields = mountDetail({
      footDeformityTypes: ['Autres'],
      footDeformityComment: 'Pied de Charcot',
      nailConditionTypes: ['Autres'],
      nailConditionComment: 'Ongles striés'
    })
    expect(fields['Déformations du pied']).toBe('Autres — Pied de Charcot')
    expect(fields['Affections unguéales']).toBe('Autres — Ongles striés')
  })

  it('lists several deformities and nail conditions, with the "Autres" precision', () => {
    const fields = mountDetail({
      footDeformityTypes: ['Orteils en marteau', 'Hallux valgus', 'Autres'],
      footDeformityComment: 'Pied de Charcot',
      nailConditionTypes: ['Onycomychoses', 'Ongles incarnés']
    })
    expect(fields['Déformations du pied']).toBe(
      'Orteils en marteau, Hallux valgus, Autres — Pied de Charcot'
    )
    expect(fields['Affections unguéales']).toBe('Onycomychoses, Ongles incarnés')
  })

  it('shows only the types when there is no "Autres", and a dash when there is none', () => {
    const fields = mountDetail({
      footDeformityTypes: ['Hallux valgus'],
      footDeformityComment: 'ancien commentaire',
      nailConditionTypes: []
    })
    expect(fields['Déformations du pied']).toBe('Hallux valgus')
    expect(fields['Affections unguéales']).toBe('—')
  })

  it('shows a dash when the lists are missing', () => {
    const fields = mountDetail({})
    expect(fields['Déformations du pied']).toBe('—')
    expect(fields['Affections unguéales']).toBe('—')
  })

  it('summarises the toes of each foot', () => {
    const fields = mountDetail({
      leftToeR1: 'Incarné bord interne',
      leftToesComment: 'Contrôle dans 1 mois',
      rightToeR5: 'Ongle épaissi'
    })
    expect(fields['Orteils pied gauche']).toBe('R1 : Incarné bord interne · Contrôle dans 1 mois')
    expect(fields['Orteils pied droit']).toBe('R5 : Ongle épaissi')
  })

  it('shows the prosthesis sides', () => {
    const fields = mountDetail({
      hasLeftHipProsthesis: true,
      hasRightHipProsthesis: true,
      hasKneeProsthesis: true
    })
    expect(fields['Prothèse de hanche']).toBe('Gauche et droite')
    expect(fields['Prothèse de genoux']).toBe('Oui, côté non précisé')
  })
})
