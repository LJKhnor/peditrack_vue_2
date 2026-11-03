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
      footDeformityType: 'Autres',
      footDeformityComment: 'Pied de Charcot',
      nailConditionType: 'Autres',
      nailConditionComment: 'Ongles striés'
    })
    expect(fields['Type déformation du pied']).toBe('Autres — Pied de Charcot')
    expect(fields["Type d'ongle"]).toBe('Autres — Ongles striés')
  })

  it('shows only the type when it is not "Autres"', () => {
    const fields = mountDetail({ footDeformityType: 'Hallux valgus', nailConditionType: null })
    expect(fields['Type déformation du pied']).toBe('Hallux valgus')
    expect(fields["Type d'ongle"]).toBe('—')
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
