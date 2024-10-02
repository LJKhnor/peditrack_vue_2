<template>
  <div class="personal-infos">
    <div class="info-block">
      <p>Nom</p>
      <input class="info-block-input" type="text" id="name" />
    </div>
    <div class="info-block">
      <p>Prénom</p>
      <input class="info-block-input" type="text" id="firstname" />
    </div>
    <div class="info-block">
      <p>Téléphone</p>
      <input class="info-block-input" type="text" id="phone" />
    </div>
    <div class="info-block">
      <p>Adresse</p>
      <input class="info-block-input" type="text" id="address" />
    </div>
    <div class="info-block">
      <p>Date de naissance</p>
      <input class="info-block-input" type="text" id="birthdate" />
    </div>
    <div class="info-block">
      <p>email</p>
      <input class="info-block-input" type="text" id="email" />
    </div>
    <div class="info-block">
      <p>Conseillés par</p>
      <input class="info-block-input" type="text" id="referenced_by" />
    </div>
    <div class="info-block">
      <p>Docteur</p>
      <input class="info-block-input" type="text" id="doctor" />
    </div>
    <div class="info-block">
      <p>Mutuelle</p>
      <input class="info-block-input" type="text" id="mutual" />
    </div>
    <div class="info-block">
      <p>Commentaires</p>
      <input class="info-block-input" type="text" id="comments" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PatientPersonnalInformations',
  props: {},
  components: {},
  setup() {
    return {}
  }
}
</script>

<style></style>
