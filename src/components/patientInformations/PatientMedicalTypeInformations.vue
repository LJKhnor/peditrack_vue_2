<template>
  <div class="medical-infos">
    <div class="info-block">
      <p>Peau</p>
      <select
        name="select-skin"
        class="info-block-input"
        id="skin-{{skinType}}"
        v-model="formData.skinType"
      >
        <option></option>
        <option v-for="skinType in skinTypes" :value="skinType" :key="skinType">
          {{ skinType }}
        </option>
      </select>
    </div>

    <div class="info-block">
      <p>Pieds</p>
      <select
        name="select-foot"
        class="info-block-input"
        id="foot-{{footType}}"
        v-model="formData.footType"
      >
        <option></option>
        <option v-for="footType in footTypes" :value="footType" :key="footType">
          {{ footType }}
        </option>
      </select>
    </div>

    <!-- Choix multiples : transpiration, remarques, circulation et dermatoses, puis (après le trait)
         déformations du pied et affections unguéales, dont l'option « Autres » ouvre une précision -->
    <template v-for="group in multiChoices" :key="group.field">
      <hr v-if="group.separatorBefore" />
      <div class="info-block multi-choice">
        <p :id="`${group.field}-label`">{{ group.label }}</p>
        <div class="choices" role="group" :aria-labelledby="`${group.field}-label`">
          <label
            v-for="option in group.options"
            :key="option"
            class="choice"
            :class="{ selected: isSelected(group.field, option) }"
          >
            <input
              type="checkbox"
              :name="group.field"
              :value="option"
              :checked="isSelected(group.field, option)"
              @change="toggle(group, option)"
            />
            {{ option }}
          </label>
        </div>
      </div>
      <div v-if="group.commentField && isSelected(group.field, otherOption)" class="info-block">
        <label :for="group.commentField">{{ group.commentLabel }}</label>
        <input
          class="info-block-input"
          type="text"
          :id="group.commentField"
          v-model="formData[group.commentField]"
        />
      </div>
    </template>

    <!-- Observations par orteil (R1 = hallux … R5 = petit orteil), pour chaque pied -->
    <div class="feet">
      <fieldset v-for="foot in feet" :key="foot.side" class="foot">
        <legend>{{ foot.label }}</legend>
        <div v-for="toe in toes" :key="toe" class="info-block">
          <label :for="`${foot.side}ToeR${toe}`">Orteil R{{ toe }}</label>
          <input
            class="info-block-input"
            type="text"
            :id="`${foot.side}ToeR${toe}`"
            v-model="formData[`${foot.side}ToeR${toe}`]"
          />
        </div>
        <div class="info-block">
          <label :for="`${foot.side}ToesComment`">Commentaire</label>
          <textarea
            class="info-block-input toes-comment"
            :id="`${foot.side}ToesComment`"
            rows="2"
            v-model="formData[`${foot.side}ToesComment`]"
          ></textarea>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script>
import {
  CIRCULATION_TYPES,
  DERMATOSIS_TYPES,
  FOOT_DEFORMITY_TYPES,
  FOOT_TYPES,
  NAIL_CONDITION_TYPES,
  OTHER_OPTION,
  REMARK_TYPES,
  SKIN_TYPES,
  SWEAT_TYPES
} from '@/constants/patientOptions'
import { TOES } from '@/utils/patient'

export default {
  name: 'PatientMedicalTypeInformations',
  props: ['formData'],
  components: {},
  setup(props) {
    const selected = (field) => {
      const value = props.formData[field]
      return Array.isArray(value) ? value : []
    }
    const isSelected = (field, option) => selected(field).includes(option)
    // Remplace la liste (le champ peut être absent quand le patient n'a pas encore de fiche santé),
    // en gardant l'ordre des options
    const toggle = ({ field, options }, option) => {
      const current = selected(field)
      const next = current.includes(option)
        ? current.filter((value) => value !== option)
        : [...current, option]
      props.formData[field] = options.filter((value) => next.includes(value))
    }

    return {
      isSelected,
      toggle,
      multiChoices: [
        { field: 'sweatTypes', label: 'Transpiration', options: SWEAT_TYPES },
        { field: 'remarkTypes', label: 'Remarques', options: REMARK_TYPES },
        { field: 'circulationTypes', label: 'Circulation', options: CIRCULATION_TYPES },
        { field: 'dermatosisTypes', label: 'Dermatoses', options: DERMATOSIS_TYPES },
        {
          field: 'footDeformityTypes',
          label: 'Déformations du pied',
          options: FOOT_DEFORMITY_TYPES,
          commentField: 'footDeformityComment',
          commentLabel: 'Précisez la déformation',
          separatorBefore: true
        },
        {
          field: 'nailConditionTypes',
          label: 'Affections unguéales',
          options: NAIL_CONDITION_TYPES,
          commentField: 'nailConditionComment',
          commentLabel: "Précisez l'affection"
        }
      ],
      skinTypes: SKIN_TYPES,
      footTypes: FOOT_TYPES,
      otherOption: OTHER_OPTION,
      toes: TOES,
      feet: [
        { side: 'left', label: 'Pied gauche' },
        { side: 'right', label: 'Pied droit' }
      ]
    }
  }
}
</script>

<style scoped>
.medical-infos {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 0.75rem 0;
}

.info-block label {
  width: 50%;
}

.multi-choice {
  align-items: flex-start;
}

.multi-choice p {
  padding-top: 0.4rem;
}

.choices {
  width: 30vw;
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.info-block .choice {
  width: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3rem 0.65rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.9rem;
  cursor: pointer;
  user-select: none;
}

.choice:hover {
  border-color: var(--color-border-hover);
}

.choice.selected {
  border-color: var(--color-theme);
  background: var(--color-theme-light);
}

.choice input {
  accent-color: var(--color-theme);
  margin: 0;
}

.choice:focus-within {
  outline: 2px solid var(--color-theme);
  outline-offset: 1px;
}

.feet {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.foot {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  min-width: 0;
}

.foot legend {
  padding: 0 0.25rem;
  font-weight: 600;
}

.foot .info-block-input {
  width: 50%;
}

.toes-comment {
  height: auto;
  padding: 0.5rem 0.75rem;
  resize: vertical;
}
</style>
