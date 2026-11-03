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

    <div class="info-block">
      <p>Transpiration</p>
      <select
        name="select-transpiration"
        class="info-block-input"
        id="transpiration-{{transpiration}}"
        v-model="formData.sweatType"
      >
        <option></option>
        <option
          v-for="transpirationType in transpirationTypes"
          :value="transpirationType"
          :key="transpirationType"
        >
          {{ transpirationType }}
        </option>
      </select>
    </div>

    <div class="info-block">
      <p>Remarques</p>
      <select
        name="select-comment"
        class="info-block-input"
        id="comment-{{commentType}}"
        v-model="formData.remarkType"
      >
        <option></option>
        <option v-for="commentType in commentTypes" :value="commentType" :key="commentType">
          {{ commentType }}
        </option>
      </select>
    </div>

    <div class="info-block">
      <p>Circulation</p>
      <select
        name="select-circulation"
        class="info-block-input"
        id="circulation-{{circulationType}}"
        v-model="formData.circulationType"
      >
        <option></option>
        <option
          v-for="circulationType in circulationTypes"
          :value="circulationType"
          :key="circulationType"
        >
          {{ circulationType }}
        </option>
      </select>
    </div>

    <div class="info-block">
      <p>Dermatoses</p>
      <select
        name="select-dermatose"
        class="info-block-input"
        id="dermatose-{{dermatoseType}}"
        v-model="formData.dermatosisType"
      >
        <option></option>
        <option v-for="dermatoseType in dermatoseTypes" :value="dermatoseType" :key="dermatoseType">
          {{ dermatoseType }}
        </option>
      </select>
    </div>

    <hr />

    <!-- déformation du pied et affection unguéales-->
    <div class="info-block">
      <p>Déformation du pied</p>
      <select
        name="select-foot-deformity"
        class="info-block-input"
        id="dermatose-{{footDeformityType}}"
        v-model="formData.footDeformityType"
      >
        <option></option>
        <option
          v-for="footDeformityType in footDeformityTypes"
          :value="footDeformityType"
          :key="footDeformityType"
        >
          {{ footDeformityType }}
        </option>
      </select>
    </div>
    <div v-if="formData.footDeformityType === otherOption" class="info-block">
      <label for="footDeformityComment">Précisez la déformation</label>
      <input
        class="info-block-input"
        type="text"
        id="footDeformityComment"
        v-model="formData.footDeformityComment"
      />
    </div>
    <div class="info-block">
      <p>Affections unguéales</p>
      <select
        name="select-foot-nail-condition"
        class="info-block-input"
        id="nail-condition-{{nailConditionType}}"
        v-model="formData.nailConditionType"
      >
        <option></option>
        <option
          v-for="nailConditionType in nailConditionsTypes"
          :value="nailConditionType"
          :key="nailConditionType"
        >
          {{ nailConditionType }}
        </option>
      </select>
    </div>
    <div v-if="formData.nailConditionType === otherOption" class="info-block">
      <label for="nailConditionComment">Précisez l'affection</label>
      <input
        class="info-block-input"
        type="text"
        id="nailConditionComment"
        v-model="formData.nailConditionComment"
      />
    </div>

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
  setup() {
    return {
      skinTypes: SKIN_TYPES,
      footTypes: FOOT_TYPES,
      transpirationTypes: SWEAT_TYPES,
      commentTypes: REMARK_TYPES,
      circulationTypes: CIRCULATION_TYPES,
      dermatoseTypes: DERMATOSIS_TYPES,
      footDeformityTypes: FOOT_DEFORMITY_TYPES,
      nailConditionsTypes: NAIL_CONDITION_TYPES,
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
