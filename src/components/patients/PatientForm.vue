<template>
  <BaseModal title="Modifier le patient" @close="emit('close')">
    <form id="patient-form" novalidate @submit.prevent="submit">
      <div v-if="duplicate" class="pf-banner pf-banner-warning" role="alert">
        ⚠ Un patient <strong>{{ fullName(duplicate) }}</strong> né le
        {{ formatDate(duplicate.birthdate) }} existe déjà. Vérifiez qu'il ne s'agit pas d'un doublon
        avant d'enregistrer.
      </div>
      <div v-if="submitError" class="pf-banner pf-banner-error" role="alert">
        {{ submitError }}
      </div>

      <section class="pf-section">
        <h3>Identité</h3>
        <div class="pf-grid">
          <div class="pf-field">
            <label for="pf-firstname">Prénom <span class="pf-required">*</span></label>
            <input
              id="pf-firstname"
              v-model="form.firstname"
              class="pf-input"
              :class="{ 'pf-invalid': errors.firstname }"
              type="text"
              autocomplete="off"
            />
            <span v-if="errors.firstname" class="pf-error">{{ errors.firstname }}</span>
          </div>
          <div class="pf-field">
            <label for="pf-name">Nom <span class="pf-required">*</span></label>
            <input
              id="pf-name"
              v-model="form.name"
              class="pf-input"
              :class="{ 'pf-invalid': errors.name }"
              type="text"
              autocomplete="off"
            />
            <span v-if="errors.name" class="pf-error">{{ errors.name }}</span>
          </div>
          <div class="pf-field">
            <label for="pf-birthdate">Date de naissance <span class="pf-required">*</span></label>
            <input
              id="pf-birthdate"
              v-model="form.birthdate"
              class="pf-input"
              :class="{ 'pf-invalid': errors.birthdate }"
              type="date"
              min="1900-01-01"
              :max="today"
            />
            <span v-if="errors.birthdate" class="pf-error">{{ errors.birthdate }}</span>
          </div>
        </div>
      </section>

      <section class="pf-section">
        <h3>Coordonnées</h3>
        <div class="pf-grid">
          <div class="pf-field">
            <label for="pf-phone">Téléphone <span class="pf-required">*</span></label>
            <input
              id="pf-phone"
              v-model="form.phoneNum"
              class="pf-input"
              :class="{ 'pf-invalid': errors.phoneNum }"
              type="tel"
            />
            <span v-if="errors.phoneNum" class="pf-error">{{ errors.phoneNum }}</span>
          </div>
          <div class="pf-field">
            <label for="pf-email">Email</label>
            <input
              id="pf-email"
              v-model="form.email"
              class="pf-input"
              :class="{ 'pf-invalid': errors.email }"
              type="email"
            />
            <span v-if="errors.email" class="pf-error">{{ errors.email }}</span>
          </div>
          <div class="pf-field pf-field-wide">
            <label for="pf-address">Adresse</label>
            <input id="pf-address" v-model="form.address" class="pf-input" type="text" />
          </div>
          <div class="pf-field">
            <label for="pf-contact">Personne de contact</label>
            <input id="pf-contact" v-model="form.personOfContact" class="pf-input" type="text" />
          </div>
          <div class="pf-field">
            <label for="pf-contact-phone">Téléphone de la personne de contact</label>
            <input
              id="pf-contact-phone"
              v-model="form.personOfContactPhoneNumber"
              class="pf-input"
              type="tel"
            />
          </div>
        </div>
      </section>

      <section class="pf-section">
        <h3>Suivi</h3>
        <div class="pf-grid">
          <div class="pf-field">
            <label for="pf-mutual">Mutualité</label>
            <select id="pf-mutual" v-model="mutualChoice" class="pf-input">
              <option value="">—</option>
              <option v-for="mutual in MUTUALITIES" :key="mutual" :value="mutual">
                {{ mutual }}
              </option>
              <option :value="OTHER_MUTUAL">Autre…</option>
            </select>
          </div>
          <div v-if="mutualChoice === OTHER_MUTUAL" class="pf-field">
            <label for="pf-mutual-other">Autre mutualité</label>
            <input id="pf-mutual-other" v-model="mutualOther" class="pf-input" type="text" />
          </div>
          <div class="pf-field">
            <label for="pf-doctor">Médecin traitant</label>
            <input id="pf-doctor" v-model="form.doctor" class="pf-input" type="text" />
          </div>
          <div class="pf-field">
            <label for="pf-reference">Conseillé par</label>
            <input id="pf-reference" v-model="form.referenceBy" class="pf-input" type="text" />
          </div>
          <div class="pf-field pf-field-wide">
            <label for="pf-comments">Commentaires</label>
            <textarea id="pf-comments" v-model="form.comments" class="pf-input"></textarea>
          </div>
        </div>
      </section>
    </form>

    <template #footer>
      <button type="button" class="pf-btn-ghost" @click="emit('close')">Annuler</button>
      <button type="submit" form="patient-form" class="btn" :disabled="saving">
        {{ saving ? 'Enregistrement…' : duplicate ? 'Enregistrer quand même' : 'Enregistrer' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import BaseModal from './BaseModal.vue'
import { MUTUALITIES } from '@/constants/patientOptions'
import {
  pickPatientFields,
  updatePatient,
  type Patient,
  type PatientFields
} from '@/services/PatientService'
import { findDuplicate, formatDate, fullName, toInputDate } from '@/utils/patient'
import '@/assets/patient-form.css'

const OTHER_MUTUAL = '__other__'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Modification des seules informations personnelles : les données médicales et les soins
// sont saisis via « Encoder le soin » (page Patients).
const props = defineProps<{ patient: Patient; patients: Patient[] }>()

const emit = defineEmits<{ close: []; saved: [patient: Patient] }>()

const today = toInputDate(new Date()) ?? undefined

const form = reactive<PatientFields>({
  ...pickPatientFields(props.patient),
  birthdate: toInputDate(props.patient.birthdate)
})

const initialMutual = form.mutual?.trim() ?? ''
const mutualChoice = ref(
  initialMutual === '' || MUTUALITIES.includes(initialMutual) ? initialMutual : OTHER_MUTUAL
)
const mutualOther = ref(mutualChoice.value === OTHER_MUTUAL ? initialMutual : '')

const errors = reactive<
  Partial<Record<'firstname' | 'name' | 'birthdate' | 'phoneNum' | 'email', string>>
>({})
const saving = ref(false)
const submitError = ref('')

const duplicate = computed(() => findDuplicate(form, props.patients, props.patient.id))

function isBlank(value: string | null | undefined) {
  return value == null || value.trim() === ''
}

function validate(): boolean {
  for (const key of Object.keys(errors) as (keyof typeof errors)[]) delete errors[key]

  if (isBlank(form.firstname)) errors.firstname = 'Le prénom est obligatoire.'
  if (isBlank(form.name)) errors.name = 'Le nom est obligatoire.'
  if (isBlank(form.phoneNum)) errors.phoneNum = 'Le téléphone est obligatoire.'

  if (isBlank(form.birthdate)) {
    errors.birthdate = 'La date de naissance est obligatoire.'
  } else {
    const birthdate = new Date(form.birthdate as string)
    if (isNaN(birthdate.getTime()) || !/^\d{4}-\d{2}-\d{2}$/.test(form.birthdate as string)) {
      errors.birthdate = 'Date invalide.'
    } else if (birthdate.getFullYear() < 1900 || (today && form.birthdate! > today)) {
      errors.birthdate = 'La date doit être comprise entre 1900 et aujourd’hui.'
    }
  }

  if (!isBlank(form.email) && !EMAIL_PATTERN.test(form.email!.trim())) {
    errors.email = 'Adresse email invalide.'
  }

  return Object.keys(errors).length === 0
}

// L'API ignore les champs null lors d'une mise à jour : on envoie une chaîne vide pour
// qu'un champ effacé dans le formulaire le soit aussi en base.
function patientFields(): PatientFields {
  const fields = { ...form }
  fields.mutual = mutualChoice.value === OTHER_MUTUAL ? mutualOther.value : mutualChoice.value
  for (const key of Object.keys(fields) as (keyof PatientFields)[]) {
    if (key !== 'birthdate') fields[key] = (fields[key] ?? '').trim()
  }
  return fields
}

async function submit() {
  if (saving.value || !validate()) return
  saving.value = true
  submitError.value = ''
  try {
    emit('saved', await updatePatient(props.patient.id, patientFields()))
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du patient :", error)
    submitError.value = "L'enregistrement a échoué. Vérifiez votre connexion et réessayez."
  } finally {
    saving.value = false
  }
}
</script>
