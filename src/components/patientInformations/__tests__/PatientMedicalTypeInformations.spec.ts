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
  it('offers every foot deformity and nail condition as a checkbox', () => {
    const { wrapper } = mountForm()
    expect(wrapper.findAll('input[name="footDeformityTypes"]')).toHaveLength(7)
    expect(wrapper.findAll('input[name="nailConditionTypes"]')).toHaveLength(5)
    expect(checkedOptions(wrapper, 'footDeformityTypes')).toEqual([])
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

  it('selects several foot deformities, in the order of the options', async () => {
    const { wrapper, formData } = mountForm()

    await checkbox(wrapper, 'footDeformityTypes', 'Hallux valgus').setValue(true)
    await checkbox(wrapper, 'footDeformityTypes', 'Orteils en marteau').setValue(true)
    expect(formData.footDeformityTypes).toEqual(['Orteils en marteau', 'Hallux valgus'])

    await checkbox(wrapper, 'footDeformityTypes', 'Orteils en marteau').setValue(false)
    expect(formData.footDeformityTypes).toEqual(['Hallux valgus'])
  })

  it('selects several nail conditions without touching the foot deformities', async () => {
    const { wrapper, formData } = mountForm({ footDeformityTypes: ['Hallux rigidus'] })

    await checkbox(wrapper, 'nailConditionTypes', 'Ongles incarnés').setValue(true)
    await checkbox(wrapper, 'nailConditionTypes', 'Onycomychoses').setValue(true)
    expect(formData.nailConditionTypes).toEqual(['Onycomychoses', 'Ongles incarnés'])
    expect(formData.footDeformityTypes).toEqual(['Hallux rigidus'])
  })

  it('asks for a precision only while "Autres" is among the foot deformities', async () => {
    const { wrapper, formData } = mountForm({ footDeformityTypes: ['Hallux valgus'] })
    expect(wrapper.find('#footDeformityComment').exists()).toBe(false)

    await checkbox(wrapper, 'footDeformityTypes', 'Autres').setValue(true)
    await wrapper.find('#footDeformityComment').setValue('Pied de Charcot')
    expect(formData.footDeformityTypes).toEqual(['Hallux valgus', 'Autres'])
    expect(formData.footDeformityComment).toBe('Pied de Charcot')

    await checkbox(wrapper, 'footDeformityTypes', 'Autres').setValue(false)
    expect(wrapper.find('#footDeformityComment').exists()).toBe(false)
  })

  it('asks for a precision only while "Autres" is among the nail conditions', async () => {
    const { wrapper, formData } = mountForm({ nailConditionTypes: ['Ongles incarnés'] })
    expect(wrapper.find('#nailConditionComment').exists()).toBe(false)

    await checkbox(wrapper, 'nailConditionTypes', 'Autres').setValue(true)
    await wrapper.find('#nailConditionComment').setValue('Ongles striés')
    expect(formData.nailConditionTypes).toEqual(['Ongles incarnés', 'Autres'])
    expect(formData.nailConditionComment).toBe('Ongles striés')
  })

  it('shows the choices and the precision already recorded on the previous care', () => {
    const { wrapper } = mountForm({
      footDeformityTypes: ['Quintus varus', 'Autres'],
      footDeformityComment: 'Charcot',
      nailConditionTypes: ['Onycholyses']
    })
    expect(checkedOptions(wrapper, 'footDeformityTypes')).toEqual(['Quintus varus', 'Autres'])
    expect(checkedOptions(wrapper, 'nailConditionTypes')).toEqual(['Onycholyses'])
    const input = wrapper.find<HTMLInputElement>('#footDeformityComment')
    expect(input.element.value).toBe('Charcot')
  })

  it('has toes R1 to R5 and a comment for each foot', async () => {
    const { wrapper, formData } = mountForm()
    const legends = wrapper.findAll('legend').map((legend) => legend.text())
    expect(legends).toEqual(['Pied gauche', 'Pied droit'])

    for (const side of ['left', 'right']) {
      for (let toe = 1; toe <= 5; toe++) {
        const input = wrapper.find(`#${side}ToeR${toe}`)
        expect(input.exists()).toBe(true)
        expect(wrapper.find(`label[for="${side}ToeR${toe}"]`).text()).toBe(`Orteil R${toe}`)
      }
      expect(wrapper.find(`textarea#${side}ToesComment`).exists()).toBe(true)
    }

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
