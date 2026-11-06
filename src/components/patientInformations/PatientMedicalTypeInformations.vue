<template>
  <!-- Chaque ligne : intitulé dans une colonne étroite à gauche, champ à droite (au-dessus sur mobile) -->
  <div class="medical-infos">
    <div class="field-row">
      <label class="field-label" for="skinType">Peau</label>
      <select name="select-skin" class="info-block-input" id="skinType" v-model="formData.skinType">
        <option></option>
        <option v-for="skinType in skinTypes" :value="skinType" :key="skinType">
          {{ skinType }}
        </option>
      </select>
    </div>

    <div class="field-row">
      <label class="field-label" for="footType">Pieds</label>
      <select name="select-foot" class="info-block-input" id="footType" v-model="formData.footType">
        <option></option>
        <option v-for="footType in footTypes" :value="footType" :key="footType">
          {{ footType }}
        </option>
      </select>
    </div>

    <!-- Choix multiples : transpiration, remarques, circulation et dermatoses, puis (après le trait)
         déformations du pied et affections unguéales, encodées par pied, dont l'option « Autres »
         ouvre une précision -->
    <template v-for="group in multiChoices" :key="group.id">
      <hr v-if="group.separatorBefore" />
      <div class="field-row multi-choice">
        <p class="field-label" :id="`${group.id}-label`">{{ group.label }}</p>
        <div class="choice-rows">
          <div
            v-for="row in visibleRows(group)"
            :key="row.field"
            class="choice-row"
            :class="{ 'with-side': row.side, 'unknown-side': row.unknownSide }"
          >
            <span v-if="row.side" class="choice-side" :id="`${row.field}-side`">{{
              row.side
            }}</span>
            <div
              class="choices"
              role="group"
              :aria-labelledby="
                row.side ? `${group.id}-label ${row.field}-side` : `${group.id}-label`
              "
            >
              <!-- La case reste dans le DOM (clavier, lecteur d'écran) mais c'est le bouton qui s'affiche -->
              <label
                v-for="option in rowOptions(group, row)"
                :key="option"
                class="choice"
                :class="{ selected: isSelected(row.field, option) }"
              >
                <input
                  type="checkbox"
                  class="sr-only"
                  :name="row.field"
                  :value="option"
                  :checked="isSelected(row.field, option)"
                  @change="toggle(group, row, option)"
                />
                <span class="choice-check" aria-hidden="true">✓</span>
                {{ option }}
              </label>
            </div>
          </div>
        </div>
      </div>
      <div v-if="group.commentField && hasOther(group)" class="field-row">
        <label class="field-label" :for="group.commentField">{{ group.commentLabel }}</label>
        <input
          class="info-block-input"
          type="text"
          :id="group.commentField"
          v-model="formData[group.commentField]"
        />
      </div>
    </template>

    <!-- Observations par orteil, en tableau : une ligne par pied, une colonne par orteil -->
    <fieldset class="toes">
      <legend>Orteils <span class="toes-hint">(R1 = hallux … R5 = petit orteil)</span></legend>
      <div class="toes-row toes-header" aria-hidden="true">
        <span></span>
        <span v-for="toe in toes" :key="toe">R{{ toe }}</span>
      </div>
      <div
        v-for="foot in feet"
        :key="foot.side"
        class="toes-row"
        role="group"
        :aria-labelledby="`${foot.side}-toes-label`"
      >
        <span class="toes-side" :id="`${foot.side}-toes-label`">{{ foot.label }}</span>
        <label v-for="toe in toes" :key="toe" class="toe-cell" :for="`${foot.side}ToeR${toe}`">
          <!-- « R1 » visible seulement sur mobile (l'en-tête du tableau le remplace sur grand écran) -->
          <span class="toe-name"><span class="sr-only">Orteil </span>R{{ toe }}</span>
          <input
            class="info-block-input"
            type="text"
            :id="`${foot.side}ToeR${toe}`"
            v-model="formData[`${foot.side}ToeR${toe}`]"
          />
        </label>
      </div>
      <div class="toes-comments">
        <div v-for="foot in feet" :key="foot.side" class="toes-comment-block">
          <label :for="`${foot.side}ToesComment`">Commentaire {{ foot.label.toLowerCase() }}</label>
          <textarea
            class="info-block-input toes-comment"
            :id="`${foot.side}ToesComment`"
            rows="2"
            v-model="formData[`${foot.side}ToesComment`]"
          ></textarea>
        </div>
      </div>
    </fieldset>
  </div>
</template>

<script>
import {
  CIRCULATION_TYPES,
  DERMATOSIS_TYPES,
  FOOT_DEFORMITY_TYPES,
  FOOT_TYPES,
  NAIL_CONDITION_TYPES,
  NORMAL_SWEAT,
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

    // Groupe à une seule liste
    const single = (field, label, options, extra = {}) => ({
      id: field,
      label,
      options,
      rows: [{ field }],
      ...extra
    })
    // Groupe encodé par pied. La liste sans côté (fiche antérieure à la distinction gauche / droite)
    // n'apparaît que si elle contient encore des valeurs, et seulement celles-ci, pour pouvoir les
    // décocher ; cocher une valeur pour un pied la retire de cette liste (comme le fait l'API)
    const perFoot = (id, label, options, { unknownSide, left, right }, extra = {}) => ({
      id,
      label,
      options,
      rows: [
        { field: left, side: 'Gauche', clears: unknownSide },
        { field: right, side: 'Droit', clears: unknownSide },
        { field: unknownSide, side: 'Côté non précisé', unknownSide: true }
      ],
      ...extra
    })

    const visibleRows = (group) =>
      group.rows.filter((row) => !row.unknownSide || selected(row.field).length > 0)
    const rowOptions = (group, row) =>
      row.unknownSide
        ? group.options.filter((option) => isSelected(row.field, option))
        : group.options
    const hasOther = (group) => group.rows.some((row) => isSelected(row.field, OTHER_OPTION))

    // Remplace la liste (le champ peut être absent quand le patient n'a pas encore de fiche santé),
    // en gardant l'ordre des options. Une option exclusive (« Normale ») ne se combine avec aucune
    // autre : la cocher décoche les autres, cocher une autre option la décoche
    const toggle = ({ options, exclusive = [] }, { field, clears }, option) => {
      const current = selected(field)
      const adding = !current.includes(option)
      let next
      if (!adding) next = current.filter((value) => value !== option)
      else if (exclusive.includes(option)) next = [option]
      else next = [...current.filter((value) => !exclusive.includes(value)), option]
      props.formData[field] = options.filter((value) => next.includes(value))
      if (adding && clears && isSelected(clears, option)) {
        props.formData[clears] = selected(clears).filter((value) => value !== option)
      }
    }

    return {
      isSelected,
      visibleRows,
      rowOptions,
      hasOther,
      toggle,
      multiChoices: [
        single('sweatTypes', 'Transpiration', SWEAT_TYPES, { exclusive: [NORMAL_SWEAT] }),
        single('remarkTypes', 'Remarques', REMARK_TYPES),
        single('circulationTypes', 'Circulation', CIRCULATION_TYPES),
        single('dermatosisTypes', 'Dermatoses', DERMATOSIS_TYPES),
        perFoot(
          'footDeformities',
          'Déformations du pied',
          FOOT_DEFORMITY_TYPES,
          {
            unknownSide: 'footDeformityTypes',
            left: 'leftFootDeformityTypes',
            right: 'rightFootDeformityTypes'
          },
          {
            commentField: 'footDeformityComment',
            commentLabel: 'Précisez la déformation',
            separatorBefore: true
          }
        ),
        perFoot(
          'nailConditions',
          'Affections unguéales',
          NAIL_CONDITION_TYPES,
          {
            unknownSide: 'nailConditionTypes',
            left: 'leftNailConditionTypes',
            right: 'rightNailConditionTypes'
          },
          { commentField: 'nailConditionComment', commentLabel: "Précisez l'affection" }
        )
      ],
      skinTypes: SKIN_TYPES,
      footTypes: FOOT_TYPES,
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
  --label-width: 11rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 0.375rem 0;
}

/* Masqué visuellement mais lu par les lecteurs d'écran (et focusable pour une case) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

/* Ligne : intitulé dans une colonne étroite, champ sur le reste de la largeur */
.field-row {
  display: grid;
  grid-template-columns: var(--label-width) minmax(0, 1fr);
  align-items: center;
  column-gap: 1rem;
  margin: 0 4px;
}

.field-label {
  font-weight: 600;
  color: var(--color-heading);
}

.field-row .info-block-input {
  width: 100%;
  max-width: 24rem;
}

/* L'intitulé s'aligne sur la première rangée de boutons */
.multi-choice {
  align-items: start;
}

.multi-choice .field-label {
  padding-top: 0.45rem;
}

.choices {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Groupe encodé par pied : une rangée de boutons par côté, le côté en petite colonne */
.choice-rows {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.choice-row.with-side {
  display: grid;
  grid-template-columns: 4.5rem minmax(0, 1fr);
  align-items: start;
  column-gap: 0.5rem;
}

.choice-side {
  padding-top: 0.45rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

/* Valeurs reprises d'une fiche sans côté : à décocher puis à encoder sur le bon pied */
.choice-row.unknown-side {
  grid-template-columns: minmax(0, 1fr);
  row-gap: 0.25rem;
}

.choice-row.unknown-side .choice-side {
  padding-top: 0;
  font-style: italic;
  font-weight: 400;
}

.choice {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  min-height: 2.25rem;
  padding: 0.35rem 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.9rem;
  cursor: pointer;
  user-select: none;
  transition:
    background-color 0.15s,
    border-color 0.15s;
}

.choice:hover {
  border-color: var(--color-border-hover);
}

.choice.selected {
  border-color: var(--color-theme);
  background: var(--color-theme-light);
  color: var(--color-heading);
  font-weight: 600;
}

.choice-check {
  display: none;
  color: var(--color-theme);
  font-weight: 700;
}

.choice.selected .choice-check {
  display: inline;
}

.choice:focus-within {
  outline: 2px solid var(--color-theme);
  outline-offset: 2px;
}

/* Orteils : tableau pied × orteil */
.toes {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 0.5rem 0.75rem 0.75rem;
  margin-top: 0.375rem;
  min-width: 0;
}

.toes legend {
  padding: 0 0.25rem;
  font-weight: 600;
  color: var(--color-heading);
}

.toes-hint {
  font-weight: 400;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.toes-row {
  display: grid;
  grid-template-columns: 7rem repeat(5, minmax(0, 1fr));
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.toes-header {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-align: center;
}

.toes-side {
  font-weight: 600;
}

.toe-cell {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.toe-cell .info-block-input {
  width: 100%;
  padding: 0 0.5rem;
}

/* Sur grand écran, l'en-tête R1…R5 suffit : le nom de l'orteil n'est lu qu'au lecteur d'écran */
.toe-name {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.toes-comments {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.toes-comment-block {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.toes-comment {
  width: 100%;
  height: auto;
  padding: 0.5rem 0.75rem;
  resize: vertical;
}

@media (max-width: 640px) {
  .field-row {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0.375rem;
  }

  .multi-choice .field-label {
    padding-top: 0;
  }

  .field-row .info-block-input {
    max-width: none;
  }

  /* Le tableau devient un bloc par pied, chaque case porte son « R1 » */
  .toes-header {
    display: none;
  }

  .toes-row {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    row-gap: 0.25rem;
  }

  .toes-side {
    grid-column: 1 / -1;
  }

  .toe-name {
    position: static;
    width: auto;
    height: auto;
    overflow: visible;
    clip: auto;
    font-size: 0.8rem;
    text-align: center;
    color: var(--color-text-secondary);
  }

  .toes-comments {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
