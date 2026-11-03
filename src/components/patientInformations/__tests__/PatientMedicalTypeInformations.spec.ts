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

describe('PatientMedicalTypeInformations', () => {
  it('asks for a precision only when the foot deformity is "Autres"', async () => {
    const { wrapper, formData } = mountForm()
    expect(wrapper.find('#footDeformityComment').exists()).toBe(false)

    await wrapper.find('select[name="select-foot-deformity"]').setValue('Autres')
    await wrapper.find('#footDeformityComment').setValue('Pied de Charcot')
    expect(formData.footDeformityType).toBe('Autres')
    expect(formData.footDeformityComment).toBe('Pied de Charcot')

    await wrapper.find('select[name="select-foot-deformity"]').setValue('Hallux valgus')
    expect(wrapper.find('#footDeformityComment').exists()).toBe(false)
  })

  it('asks for a precision only when the nail condition is "Autres"', async () => {
    const { wrapper, formData } = mountForm({ nailConditionType: 'Ongles incarnés' })
    expect(wrapper.find('#nailConditionComment').exists()).toBe(false)

    await wrapper.find('select[name="select-foot-nail-condition"]').setValue('Autres')
    await wrapper.find('#nailConditionComment').setValue('Ongles striés')
    expect(formData.nailConditionComment).toBe('Ongles striés')
  })

  it('shows the precision already recorded on the previous care', () => {
    const { wrapper } = mountForm({ footDeformityType: 'Autres', footDeformityComment: 'Charcot' })
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
