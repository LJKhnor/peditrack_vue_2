<template>
  <div class="legal-page">
    <h1>Politique de confidentialité</h1>
    <p class="legal-intro">Veuillez lire attentivement ces conditions avant d'utiliser l'application.</p>
    <section class="legal-content">
      <h2>1. Avis de Non-Responsabilité Médicale</h2>
      <p>
        Cette application est conçue exclusivement pour un usage professionnel en soins de santé.
        Elle ne remplace pas les conseils, diagnostics ou traitements médicaux professionnels.
        Consultez toujours des professionnels de santé qualifiés.
      </p>

      <h2>2. Admissibilité des Utilisateurs</h2>
      <p>
        Les utilisateurs doivent être des professionnels de santé agréés. L'accès non autorisé est
        interdit et peut entraîner des poursuites judiciaires.
      </p>

      <h2>3. Confidentialité des Données et Conformité HIPAA</h2>
      <p>
        Toutes les données de patients sont protégées selon les réglementations HIPAA. Les
        utilisateurs doivent maintenir la confidentialité des patients et utiliser des identifiants
        de connexion sécurisés.
      </p>

      <h2>4. Limitation de Responsabilité</h2>
      <p>
        Le fournisseur de l'application n'est pas responsable des décisions médicales prises en
        fonction de cette application. Les utilisateurs assument l'entière responsabilité des
        décisions de soins aux patients.
      </p>

      <h2>5. Utilisation Acceptable</h2>
      <p>
        Les utilisateurs acceptent d'utiliser cette application uniquement à des fins
        professionnelles légitimes et de se conformer à tous les règlements et lois sanitaires
        applicables.
      </p>

      <h2>6. Modifications et Résiliation</h2>
      <p>
        Nous nous réservons le droit de modifier ou de résilier le service avec préavis.
        L'utilisation continue constitue une acceptation des conditions mises à jour.
      </p>

      <h2>7. Contact</h2>
      <p>
        Pour toute question concernant ces conditions, veuillez contacter notre équipe d'assistance.
      </p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicyView'
}
</script>

<style scoped>
.legal-page {
  max-width: 720px;
  padding: 2rem 0;
}

h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.legal-intro {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  margin-bottom: 2rem;
}

.legal-content h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-top: 1.75rem;
  margin-bottom: 0.5rem;
}

.legal-content p {
  font-size: 0.9375rem;
  color: var(--color-text);
  line-height: 1.7;
}
</style>
