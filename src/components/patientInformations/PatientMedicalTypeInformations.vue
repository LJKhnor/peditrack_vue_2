<template>
  <div class="medical-infos">
    <div class="info-block">
      <p>Peau</p>
      <select
        name="select-skin"
        class="info-block-input"
        type="text"
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
        type="text"
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
        type="text"
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
        type="text"
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
        type="text"
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
        type="text"
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
        type="text"
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
    <div class="info-block">
      <p>Affections unguéales</p>
      <select
        name="select-foot-nail-condition"
        class="info-block-input"
        type="text"
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
  </div>
</template>

<script>
import {
  CIRCULATION_TYPES,
  DERMATOSIS_TYPES,
  FOOT_DEFORMITY_TYPES,
  FOOT_TYPES,
  NAIL_CONDITION_TYPES,
  REMARK_TYPES,
  SKIN_TYPES,
  SWEAT_TYPES
} from '@/constants/patientOptions'

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
      nailConditionsTypes: NAIL_CONDITION_TYPES
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
</style>
