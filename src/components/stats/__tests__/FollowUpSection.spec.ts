import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FollowUpSection from '../FollowUpSection.vue'
import type { PatientSummary } from '@/services/PatientService'

const today = new Date(2026, 10, 9)

const summary = (overrides: Partial<PatientSummary>): PatientSummary => ({
  id: 1,
  name: 'Dupont',
  firstname: 'Élise',
  lastVisit: '2026-06-01T00:00:00Z',
  careInterval: 42,
  diabeteType: 0,
  withBleedingDisorder: false,
  withHeartDisorder: false,
  hasAllergies: false,
  ...overrides
})

const patients = [
  summary({
    id: 1,
    name: 'Dupont',
    phoneNum: '0471 23 45 67',
    personOfContact: 'Marc Dupont',
    personOfContactPhoneNumber: '0479 11 22 33'
  }),
  summary({ id: 2, name: 'Martin', diabeteType: 2, hasAllergies: true }),
  // à jour : vu il y a 9 jours
  summary({ id: 3, name: 'Leroy', lastVisit: '2026-10-31T00:00:00Z' }),
  // un seul soin
  summary({ id: 4, name: 'Simon', careInterval: null })
]

const names = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('.late-name').map((name) => name.text())

describe('FollowUpSection', () => {
  it('lists the late patients with their phone and their contact person', () => {
    const wrapper = mount(FollowUpSection, { props: { patients, today } })

    expect(names(wrapper)).toEqual(['Élise Dupont', 'Élise Martin'])
    const phone = wrapper.find('.phone')
    expect(phone.attributes('href')).toBe('tel:0471234567')
    expect(phone.text()).toBe('0471 23 45 67')
    expect(wrapper.find('.contact').text()).toBe('Contact : Marc Dupont 0479 11 22 33')
    expect(wrapper.find('.contact-phone').attributes('href')).toBe('tel:0479112233')
    expect(wrapper.find('.no-phone').text()).toBe('Pas de téléphone')
    expect(wrapper.find('.follow-up-note').text()).toContain('1 patient n’a qu’un seul soin')
  })

  it('shows only the patients at risk, without the allergies badge', async () => {
    const wrapper = mount(FollowUpSection, { props: { patients, today } })
    const buttons = wrapper.findAll('.segmented button')
    expect(buttons.map((button) => button.text())).toEqual(['Tous (2)', 'À risque (1)'])

    await buttons[1].trigger('click')

    expect(names(wrapper)).toEqual(['Élise Martin'])
    expect(wrapper.findAll('.alert-badge').map((badge) => badge.text())).toEqual([
      '⚠ Diabète type 2'
    ])
  })

  it('says when nobody is late', () => {
    const wrapper = mount(FollowUpSection, { props: { patients: [patients[2]], today } })
    expect(wrapper.find('.follow-up-empty').text()).toBe('Aucun patient en retard.')
  })
})
