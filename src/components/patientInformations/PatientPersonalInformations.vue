<template>
  <div class="personal-infos">
    <div class="info-block">
      <p>Nom</p>
      <input
        class="info-block-input"
        name="name"
        type="text"
        id="name"
        v-model="formData.name"
        required
      />
    </div>
    <div class="info-block">
      <p>Prénom</p>
      <input
        class="info-block-input"
        type="text"
        id="firstname"
        v-model="formData.firstname"
        required
      />
    </div>
    <div class="info-block">
      <p>Téléphone</p>
      <input class="info-block-input" type="text" id="phone" v-model="formData.phoneNum" />
    </div>
    <div class="info-block">
      <p>Adresse</p>
      <input class="info-block-input" type="text" id="address" v-model="formData.address" />
    </div>
    <div class="info-block">
      <p>Date de naissance</p>
      <input class="info-block-input" type="date" id="birthdate" v-model="formData.birthdate" />
    </div>
    <div class="info-block">
      <p>Email</p>
      <input class="info-block-input" type="email" id="email" v-model="formData.email" />
    </div>
    <div class="info-block">
      <p>Personne de contact</p>
      <input
        class="info-block-input"
        type="text"
        id="person_of_contact"
        v-model="formData.personOfContact"
      />
    </div>
    <div class="info-block">
      <p>Téléphone de la personne de contact</p>
      <input
        class="info-block-input"
        type="text"
        id="phone_person_of_contact"
        v-model="formData.personOfContactPhoneNumber"
      />
    </div>
    <div class="info-block">
      <p>Conseillés par</p>
      <input
        class="info-block-input"
        type="text"
        id="referenced_by"
        v-model="formData.referenceBy"
      />
    </div>
    <div class="info-block">
      <p>Docteur</p>
      <input class="info-block-input" type="text" id="doctor" v-model="formData.doctor" />
    </div>
    <div class="info-block">
      <p>Mutuelle</p>
      <input class="info-block-input" type="text" id="mutual" v-model="formData.mutual" />
    </div>
    <div class="info-block">
      <p>Commentaires</p>
      <input class="info-block-input" type="text" id="comments" v-model="formData.comments" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PatientPersonnalInformations',
  props: ['formData'],
  components: {},
  setup() {
    return {}
  }
}
</script>

<style></style>
