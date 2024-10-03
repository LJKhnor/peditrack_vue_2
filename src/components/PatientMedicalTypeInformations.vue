<template>
  <div class="medical-infos">
    <div class="info-block">
      <p>Peau</p>
      <select name="select-skin" class="info-block-input" type="text" id="skin-{{skinType}}">
        <option></option>
        <option v-for="skinType in skinTypes" value="{{ skinType }}" :key="skinType">
          {{ skinType }}
        </option>
      </select>
    </div>

    <div class="info-block">
      <p>Pieds</p>
      <select name="select-foot" class="info-block-input" type="text" id="foot-{{footType}}">
        <option></option>
        <option v-for="footType in footTypes" value="{{ footType }}" :key="footType">
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
      >
        <option></option>
        <option
          v-for="transpirationType in transpirationTypes"
          value="{{ transpirationType }}"
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
      >
        <option></option>
        <option v-for="commentType in commentTypes" value="{{ commentType }}" :key="commentType">
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
      >
        <option></option>
        <option
          v-for="circulationType in circulationTypes"
          value="{{ circulationType }}"
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
      >
        <option></option>
        <option
          v-for="dermatoseType in dermatoseTypes"
          value="{{ dermatoseType }}"
          :key="dermatoseType"
        >
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
      >
        <option></option>
        <option
          v-for="footDeformityType in footDeformityTypes"
          value="{{ footDeformityType }}"
          :key="footDeformityType"
        >
          {{ footDeformityType }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PatientMedicalTypeInformations',
  props: {},
  components: {},
  setup() {
    let skinTypes = ['Normale', 'Pale', 'Cyanosée', 'Sèche', 'Grasse']
    let footTypes = ['Creux', 'Plat', 'Grec', 'Egyptien', 'Carré', 'Normal']
    let transpirationTypes = ['Hyperhidrose', 'Anidrose', 'Bromidrose', 'Normale']
    let commentTypes = ['Cors', 'Durillons', 'Crevasses', 'Phlyctènes']
    let circulationTypes = ['Pieds froids', 'Varicosités', 'Pieds bleutés', 'Rougeurs', 'Œdèmes']
    let dermatoseTypes = ['Eczéma', 'Psoriasis', 'Verrues', 'Intertrigo G/D']

    let footDeformityTypes = [
      'Orteils en marteau',
      'Hallux valgus',
      'Hallux varus',
      'Quintus valgus',
      'Quintus varus',
      'Hallux rigidus',
      'Autres'
    ]
    let nailConditionsTypes = [
      'Onycomychoses',
      'Onychogryphoses',
      'Ongles incarnés',
      'Onycholyses',
      'Autres'
    ]

    return {
      skinTypes,
      footTypes,
      transpirationTypes,
      commentTypes,
      circulationTypes,
      dermatoseTypes,
      footDeformityTypes,
      nailConditionsTypes
    }
  }
}
</script>

<style></style>
