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
      rightFootDeformityTypes: ['Autres'],
      footDeformityComment: 'Pied de Charcot',
      leftNailConditionTypes: ['Autres'],
      nailConditionComment: 'Ongles striés'
    })
    expect(fields['Déformations du pied']).toBe('Droit : Autres — Pied de Charcot')
    expect(fields['Affections unguéales']).toBe('Gauche : Autres — Ongles striés')
  })

  it('lists the deformities and nail conditions of each foot', () => {
    const fields = mountDetail({
      leftFootDeformityTypes: ['Orteils en marteau', 'Hallux valgus'],
      rightFootDeformityTypes: ['Hallux valgus', 'Autres'],
      footDeformityComment: 'Pied de Charcot',
      leftNailConditionTypes: [],
      rightNailConditionTypes: ['Onycomychoses', 'Ongles incarnés']
    })
    expect(fields['Déformations du pied']).toBe(
      'Gauche : Orteils en marteau, Hallux valgus · Droit : Hallux valgus, Autres — Pied de Charcot'
    )
    expect(fields['Affections unguéales']).toBe('Droit : Onycomychoses, Ongles incarnés')
  })

  it('shows the values without side of an older record', () => {
    const fields = mountDetail({
      footDeformityTypes: ['Hallux valgus'],
      footDeformityComment: 'ancien commentaire',
      leftFootDeformityTypes: ['Quintus varus'],
      nailConditionTypes: ['Onycholyses']
    })
    expect(fields['Déformations du pied']).toBe(
      'Gauche : Quintus varus · Côté non précisé : Hallux valgus'
    )
    expect(fields['Affections unguéales']).toBe('Côté non précisé : Onycholyses')
  })

  it('shows a dash when no foot has a deformity nor a nail condition', () => {
    const fields = mountDetail({
      footDeformityTypes: [],
      leftFootDeformityTypes: [],
      rightFootDeformityTypes: [],
      nailConditionTypes: []
    })
    expect(fields['Déformations du pied']).toBe('—')
    expect(fields['Affections unguéales']).toBe('—')
  })

  it('shows a dash when the lists are missing', () => {
    const fields = mountDetail({})
    expect(fields['Déformations du pied']).toBe('—')
    expect(fields['Affections unguéales']).toBe('—')
    expect(fields['Transpiration']).toBe('—')
    expect(fields['Remarques']).toBe('—')
    expect(fields['Circulation']).toBe('—')
    expect(fields['Dermatoses']).toBe('—')
  })

  it('lists several sweat, remark, circulation and dermatosis types', () => {
    const fields = mountDetail({
      sweatTypes: ['Hyperhidrose', 'Bromidrose'],
      remarkTypes: ['Cors'],
      circulationTypes: ['Pieds froids', 'Varicosités', 'Œdèmes'],
      dermatosisTypes: []
    })
    expect(fields['Transpiration']).toBe('Hyperhidrose, Bromidrose')
    expect(fields['Remarques']).toBe('Cors')
    expect(fields['Circulation']).toBe('Pieds froids, Varicosités, Œdèmes')
    expect(fields['Dermatoses']).toBe('—')
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
