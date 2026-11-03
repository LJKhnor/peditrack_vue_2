// Erreurs de l'API au format RFC 7807 (application/problem+json), voir « Contrat d'API »
// dans le CLAUDE.md du backend. Les `detail` sont en anglais et techniques : les écrans
// affichent leurs propres messages en français à partir du statut.
export interface ProblemDetail {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  // présent uniquement pour une erreur de validation (400) : { champ: message }
  errors?: Record<string, string>
}

interface ErrorWithResponse {
  response?: { status?: number; data?: unknown }
}

function responseOf(error: unknown): ErrorWithResponse['response'] {
  if (typeof error !== 'object' || error === null) return undefined
  return (error as ErrorWithResponse).response
}

// Statut HTTP de l'erreur, ou undefined si le serveur n'a pas répondu (réseau, CORS…)
export function errorStatus(error: unknown): number | undefined {
  return responseOf(error)?.status
}

export function problemOf(error: unknown): ProblemDetail | null {
  const data = responseOf(error)?.data
  return typeof data === 'object' && data !== null ? (data as ProblemDetail) : null
}

// Champs en erreur d'une réponse 400 de validation (`@Valid`)
export function fieldErrors(error: unknown): Record<string, string> {
  const errors = problemOf(error)?.errors
  return typeof errors === 'object' && errors !== null ? errors : {}
}
