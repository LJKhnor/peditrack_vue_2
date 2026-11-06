import { describe, it, expect } from 'vitest'
import { reactive } from 'vue'
import { mount } from '@vue/test-utils'
import PatientMedicalTypeInformations from '../PatientMedicalTypeInformations.vue'

// Le formulaire parent (NewPatientRecord / EditPatientRecord) passe un objet réactif que les
// champs modifient directement
const mountForm = (initial: Record<string, unknown> = {}) => {
  const formData = reactive<Record<string, unknown>>(initial)
  const wrapper = mount(PatientMedicalTypeInformations, { props: { formData } })
  return { wrapper, formData }
}

type Wrapper = ReturnType<typeof mountForm>['wrapper']

const checkbox = (wrapper: Wrapper, field: string, option: string) =>
  wrapper.find<HTMLInputElement>(`input[type="checkbox"][name="${field}"][value="${option}"]`)

const checkedOptions = (wrapper: Wrapper, field: string) =>
  wrapper
    .findAll<HTMLInputElement>(`input[type="checkbox"][name="${field}"]`)
    .filter((input) => input.element.checked)
    .map((input) => input.element.value)

describe('PatientMedicalTypeInformations', () => {
  it('offers every foot deformity and nail condition for the left and the right foot', () => {
    const { wrapper } = mountForm()
    for (const side of ['left', 'right']) {
      expect(wrapper.findAll(`input[name="${side}FootDeformityTypes"]`)).toHaveLength(7)
      expect(wrapper.findAll(`input[name="${side}NailConditionTypes"]`)).toHaveLength(5)
    }
    expect(checkedOptions(wrapper, 'leftFootDeformityTypes')).toEqual([])
    // pas de rangée « côté non précisé » sans ancienne valeur
    expect(wrapper.findAll('input[name="footDeformityTypes"]')).toHaveLength(0)
    expect(wrapper.findAll('input[name="nailConditionTypes"]')).toHaveLength(0)
    expect(wrapper.findAll('.choice-side').map((side) => side.text())).toEqual([
      'Gauche',
      'Droit',
      'Gauche',
      'Droit'
    ])
  })

  it('offers every sweat, remark, circulation and dermatosis type as a checkbox', () => {
    const { wrapper } = mountForm()
    expect(wrapper.findAll('input[name="sweatTypes"]')).toHaveLength(4)
    expect(wrapper.findAll('input[name="remarkTypes"]')).toHaveLength(4)
    expect(wrapper.findAll('input[name="circulationTypes"]')).toHaveLength(5)
    expect(wrapper.findAll('input[name="dermatosisTypes"]')).toHaveLength(4)
    // plus de liste déroulante pour ces champs
    expect(wrapper.findAll('select')).toHaveLength(2)
  })

  it('selects several values of each new multiple choice, in the order of the options', async () => {
    const { wrapper, formData } = mountForm()

    await checkbox(wrapper, 'sweatTypes', 'Bromidrose').setValue(true)
    await checkbox(wrapper, 'sweatTypes', 'Hyperhidrose').setValue(true)
    await checkbox(wrapper, 'remarkTypes', 'Phlyctènes').setValue(true)
    await checkbox(wrapper, 'remarkTypes', 'Cors').setValue(true)
    await checkbox(wrapper, 'circulationTypes', 'Œdèmes').setValue(true)
    await checkbox(wrapper, 'circulationTypes', 'Pieds froids').setValue(true)
    await checkbox(wrapper, 'dermatosisTypes', 'Verrues').setValue(true)
    await checkbox(wrapper, 'dermatosisTypes', 'Eczéma').setValue(true)

    expect(formData.sweatTypes).toEqual(['Hyperhidrose', 'Bromidrose'])
    expect(formData.remarkTypes).toEqual(['Cors', 'Phlyctènes'])
    expect(formData.circulationTypes).toEqual(['Pieds froids', 'Œdèmes'])
    expect(formData.dermatosisTypes).toEqual(['Eczéma', 'Verrues'])

    await checkbox(wrapper, 'remarkTypes', 'Cors').setValue(false)
    expect(formData.remarkTypes).toEqual(['Phlyctènes'])
    expect(formData.sweatTypes).toEqual(['Hyperhidrose', 'Bromidrose'])
  })

  it('never combines a "Normale" sweat with another sweat type', async () => {
    const { wrapper, formData } = mountForm({ sweatTypes: ['Hyperhidrose', 'Bromidrose'] })

    await checkbox(wrapper, 'sweatTypes', 'Normale').setValue(true)
    expect(formData.sweatTypes).toEqual(['Normale'])
    expect(checkedOptions(wrapper, 'sweatTypes')).toEqual(['Normale'])

    await checkbox(wrapper, 'sweatTypes', 'Anhidrose').setValue(true)
    expect(formData.sweatTypes).toEqual(['Anhidrose'])

    await checkbox(wrapper, 'sweatTypes', 'Anhidrose').setValue(false)
    expect(formData.sweatTypes).toEqual([])
  })

  it('marks the selected choices with a check mark', async () => {
    const { wrapper } = mountForm({ remarkTypes: ['Cors'] })
    const selected = wrapper.findAll('.choice.selected').map((choice) => choice.text())
    expect(selected).toEqual(['✓ Cors'])
  })

  it('shows the sweat, remark, circulation and dermatosis types of the previous care', () => {
    const { wrapper } = mountForm({
      sweatTypes: ['Anhidrose'],
      remarkTypes: ['Durillons', 'Crevasses'],
      circulationTypes: ['Varicosités'],
      dermatosisTypes: []
    })
    expect(checkedOptions(wrapper, 'sweatTypes')).toEqual(['Anhidrose'])
    expect(checkedOptions(wrapper, 'remarkTypes')).toEqual(['Durillons', 'Crevasses'])
    expect(checkedOptions(wrapper, 'circulationTypes')).toEqual(['Varicosités'])
    expect(checkedOptions(wrapper, 'dermatosisTypes')).toEqual([])
  })

  it('selects the foot deformities of each foot independently, in the order of the options', async () => {
    const { wrapper, formData } = mountForm()

    await checkbox(wrapper, 'leftFootDeformityTypes', 'Hallux valgus').setValue(true)
    await checkbox(wrapper, 'leftFootDeformityTypes', 'Orteils en marteau').setValue(true)
    await checkbox(wrapper, 'rightFootDeformityTypes', 'Hallux valgus').setValue(true)
    expect(formData.leftFootDeformityTypes).toEqual(['Orteils en marteau', 'Hallux valgus'])
    expect(formData.rightFootDeformityTypes).toEqual(['Hallux valgus'])

    await checkbox(wrapper, 'leftFootDeformityTypes', 'Hallux valgus').setValue(false)
    expect(formData.leftFootDeformityTypes).toEqual(['Orteils en marteau'])
    expect(formData.rightFootDeformityTypes).toEqual(['Hallux valgus'])
  })

  it('selects the nail conditions of a foot without touching the foot deformities', async () => {
    const { wrapper, formData } = mountForm({ leftFootDeformityTypes: ['Hallux rigidus'] })

    await checkbox(wrapper, 'rightNailConditionTypes', 'Ongles incarnés').setValue(true)
    await checkbox(wrapper, 'rightNailConditionTypes', 'Onycomychoses').setValue(true)
    expect(formData.rightNailConditionTypes).toEqual(['Onycomychoses', 'Ongles incarnés'])
    expect(formData.leftNailConditionTypes).toBeUndefined()
    expect(formData.leftFootDeformityTypes).toEqual(['Hallux rigidus'])
  })

  it('asks for a precision while "Autres" is checked for either foot', async () => {
    const { wrapper, formData } = mountForm({ leftFootDeformityTypes: ['Hallux valgus'] })
    expect(wrapper.find('#footDeformityComment').exists()).toBe(false)

    await checkbox(wrapper, 'rightFootDeformityTypes', 'Autres').setValue(true)
    await wrapper.find('#footDeformityComment').setValue('Pied de Charcot')
    expect(formData.rightFootDeformityTypes).toEqual(['Autres'])
    expect(formData.footDeformityComment).toBe('Pied de Charcot')

    await checkbox(wrapper, 'leftFootDeformityTypes', 'Autres').setValue(true)
    await checkbox(wrapper, 'rightFootDeformityTypes', 'Autres').setValue(false)
    expect(wrapper.find('#footDeformityComment').exists()).toBe(true)

    await checkbox(wrapper, 'leftFootDeformityTypes', 'Autres').setValue(false)
    expect(wrapper.find('#footDeformityComment').exists()).toBe(false)
  })

  it('asks for a precision while "Autres" is among the nail conditions', async () => {
    const { wrapper, formData } = mountForm({ leftNailConditionTypes: ['Ongles incarnés'] })
    expect(wrapper.find('#nailConditionComment').exists()).toBe(false)

    await checkbox(wrapper, 'leftNailConditionTypes', 'Autres').setValue(true)
    await wrapper.find('#nailConditionComment').setValue('Ongles striés')
    expect(formData.leftNailConditionTypes).toEqual(['Ongles incarnés', 'Autres'])
    expect(formData.nailConditionComment).toBe('Ongles striés')
  })

  it('shows the choices of each foot and the precision recorded on the previous care', () => {
    const { wrapper } = mountForm({
      leftFootDeformityTypes: ['Quintus varus'],
      rightFootDeformityTypes: ['Quintus varus', 'Autres'],
      footDeformityComment: 'Charcot',
      leftNailConditionTypes: ['Onycholyses']
    })
    expect(checkedOptions(wrapper, 'leftFootDeformityTypes')).toEqual(['Quintus varus'])
    expect(checkedOptions(wrapper, 'rightFootDeformityTypes')).toEqual(['Quintus varus', 'Autres'])
    expect(checkedOptions(wrapper, 'leftNailConditionTypes')).toEqual(['Onycholyses'])
    expect(checkedOptions(wrapper, 'rightNailConditionTypes')).toEqual([])
    const input = wrapper.find<HTMLInputElement>('#footDeformityComment')
    expect(input.element.value).toBe('Charcot')
  })

  it('shows the values without side of an older record, which move when encoded on a foot', async () => {
    // fiche antérieure à la distinction gauche / droite
    const { wrapper, formData } = mountForm({
      footDeformityTypes: ['Hallux valgus', 'Autres'],
      footDeformityComment: 'Charcot',
      nailConditionTypes: []
    })
    // seules les anciennes valeurs, cochées, pour pouvoir les retirer
    expect(wrapper.findAll('input[name="footDeformityTypes"]')).toHaveLength(2)
    expect(checkedOptions(wrapper, 'footDeformityTypes')).toEqual(['Hallux valgus', 'Autres'])
    expect(wrapper.find('.unknown-side .choice-side').text()).toBe('Côté non précisé')
    expect(wrapper.findAll('input[name="nailConditionTypes"]')).toHaveLength(0)
    expect(wrapper.find('#footDeformityComment').exists()).toBe(true)

    // encodée pour le pied gauche, la valeur quitte « côté non précisé »
    await checkbox(wrapper, 'leftFootDeformityTypes', 'Hallux valgus').setValue(true)
    expect(formData.leftFootDeformityTypes).toEqual(['Hallux valgus'])
    expect(formData.footDeformityTypes).toEqual(['Autres'])

    // décochée, la dernière valeur sans côté fait disparaître la rangée
    await checkbox(wrapper, 'footDeformityTypes', 'Autres').setValue(false)
    expect(formData.footDeformityTypes).toEqual([])
    expect(wrapper.find('.unknown-side').exists()).toBe(false)
    expect(wrapper.find('#footDeformityComment').exists()).toBe(false)
  })

  it('has a toe table: one row per foot with toes R1 to R5, and a comment per foot', async () => {
    const { wrapper, formData } = mountForm()
    const header = wrapper.findAll('.toes-header span').map((cell) => cell.text())
    expect(header).toEqual(['', 'R1', 'R2', 'R3', 'R4', 'R5'])

    const rows = wrapper.findAll('.toes-row[role="group"]')
    expect(rows.map((row) => row.find('.toes-side').text())).toEqual(['Pied gauche', 'Pied droit'])

    for (const [index, side] of ['left', 'right'].entries()) {
      for (let toe = 1; toe <= 5; toe++) {
        // chaque case est dans la ligne de son pied, avec un intitulé accessible
        expect(rows[index].find(`#${side}ToeR${toe}`).exists()).toBe(true)
        expect(wrapper.find(`label[for="${side}ToeR${toe}"]`).text()).toBe(`Orteil R${toe}`)
      }
      expect(wrapper.find(`textarea#${side}ToesComment`).exists()).toBe(true)
    }
    expect(wrapper.find('label[for="leftToesComment"]').text()).toBe('Commentaire pied gauche')

    await wrapper.find('#leftToeR1').setValue('Incarné bord interne')
    await wrapper.find('#rightToeR5').setValue('Ongle épaissi')
    await wrapper.find('#leftToesComment').setValue('Contrôle dans 1 mois')
    expect(formData).toMatchObject({
      leftToeR1: 'Incarné bord interne',
      rightToeR5: 'Ongle épaissi',
      leftToesComment: 'Contrôle dans 1 mois'
    })
  })
})
