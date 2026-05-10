<template>
  <div class="pricing-page">
    <h1>Tarifs</h1>
    <p class="pricing-intro">Un abonnement simple et transparent pour gérer votre cabinet.</p>

    <div class="pricing-card">
      <div class="pricing-header">
        <span class="pricing-name">PediMed Standard</span>
        <div class="pricing-amount">
          <span class="price">35€</span>
          <span class="period">&nbsp;/ mois</span>
        </div>
        <p class="pricing-vat">TVA non applicable — article 293 B du CGI</p>
      </div>

      <ul class="pricing-features">
        <li v-for="feature in features" :key="feature">
          <span class="check">✓</span>
          {{ feature }}
        </li>
      </ul>

      <a
        class="btn-cta"
        href="mailto:joachim.lejeune.dev@gmail.com?subject=Demande%20d%27acc%C3%A8s%20PediMed&body=Bonjour%2C%0A%0AJe%20souhaite%20souscrire%20%C3%A0%20l%27abonnement%20PediMed%20Standard%20(35%E2%82%AC%2Fmois).%0A%0AMerci%20de%20m%27envoyer%20mon%20code%20d%27activation.%0A%0ACordialement"
      >
        Demander l'accès
      </a>
    </div>

    <section class="pricing-howto">
      <h2>Comment ça fonctionne ?</h2>
      <ol>
        <li>Envoyez une demande d'accès en cliquant sur le bouton ci-dessus.</li>
        <li>Après validation, vous recevrez votre code d'activation par email.</li>
        <li>Utilisez ce code lors de la création de votre compte sur la page d'inscription.</li>
      </ol>
      <a
        class="btn-secondary"
        href="mailto:joachim.lejeune.dev@gmail.com?subject=Demande%20d%27acc%C3%A8s%20PediMed&body=Bonjour%2C%0A%0AJe%20souhaite%20souscrire%20%C3%A0%20l%27abonnement%20PediMed%20Standard%20(35%E2%82%AC%2Fmois).%0A%0AMerci%20de%20m%27envoyer%20mon%20code%20d%27activation.%0A%0ACordialement"
      >
        Demander mon code d'activation
      </a>
    </section>
  </div>
</template>

<script>
export default {
  name: 'PricingView',
  setup() {
    const features = [
      'Gestion des patients',
      'Gestion des rendez-vous',
      'Carte géographique',
      'Support & mises à jour inclus',
    ]
    return { features }
  }
}
</script>

<style scoped>
.pricing-page {
  max-width: 560px;
  padding: 2rem 0;
}

h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.pricing-intro {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  margin-bottom: 2rem;
}

.pricing-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 2px 12px var(--color-shadow);
  padding: 2rem;
  margin-bottom: 2rem;
}

.pricing-header {
  margin-bottom: 1.5rem;
}

.pricing-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pricing-amount {
  display: flex;
  align-items: baseline;
  margin-top: 0.75rem;
}

.price {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-heading);
}

.period {
  font-size: 1rem;
  color: var(--color-text-secondary);
}

.pricing-vat {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.pricing-features li {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.9375rem;
  color: var(--color-text);
}

.check {
  color: var(--color-theme);
  font-weight: 700;
  font-size: 1rem;
}

.btn-cta {
  display: inline-block;
  width: 100%;
  text-align: center;
  padding: 0.625rem 1.25rem;
  background: var(--color-theme);
  color: #fff;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s;
  box-sizing: border-box;
}

.btn-cta:hover {
  opacity: 0.88;
}

.pricing-howto {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem 2rem;
}

.pricing-howto h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.pricing-howto ol {
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.pricing-howto li {
  font-size: 0.9375rem;
  color: var(--color-text);
  line-height: 1.6;
}

.btn-secondary {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-theme);
  color: var(--color-theme);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.btn-secondary:hover {
  background: var(--color-theme);
  color: #fff;
}
</style>
