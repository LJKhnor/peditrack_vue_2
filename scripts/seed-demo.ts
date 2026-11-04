/**
 * Compte de démonstration LOCAL : crée (ou réutilise) le compte « demo » et le remplit
 * d'environ 100 patients fictifs avec leur historique de soins.
 *
 * Tout passe par l'API REST, comme le frontend : les champs sensibles sont donc chiffrés par
 * le backend exactement comme de vraies données.
 *
 *   npm run seed:demo
 *
 * Variables d'environnement :
 *   DEMO_API_URL           défaut http://localhost:8085/api (refusé s'il ne pointe pas en local)
 *   DEMO_REGISTRATION_KEY  clé d'inscription libre, nécessaire seulement à la 1re exécution
 *
 * Rejouable : les patients déjà présents sur le compte démo sont supprimés (suppression
 * logique côté backend) avant d'être recréés. Les données sont déterministes (graine fixe).
 * Les positions sur la carte apparaissent après le passage du géocodage Nominatim (toutes les 4 h).
 */
import {
  CIRCULATION_TYPES,
  DERMATOSIS_TYPES,
  FOOT_DEFORMITY_TYPES,
  FOOT_TYPES,
  MUTUALITIES,
  NAIL_CONDITION_TYPES,
  OTHER_OPTION,
  REMARK_TYPES,
  SKIN_TYPES,
  SWEAT_TYPES
} from '../src/constants/patientOptions'

const API_URL = process.env.DEMO_API_URL ?? 'http://localhost:8085/api'
const REGISTRATION_KEY = process.env.DEMO_REGISTRATION_KEY

const DEMO_USER = {
  username: 'demo',
  mail: 'demo@example.com',
  password: 'Demo2026!'
}
// Adresse publique (hôtel de ville de Namur) : centre de la carte et des zones de chalandise
const DEMO_ADDRESS = { street: "Place d'Armes 1", postalCode: '5000', locality: 'Namur' }

const PATIENT_COUNT = 100
const CONCURRENCY = 4
const SEED = 20261103

// ── Générateur pseudo-aléatoire déterministe (mulberry32) ──────────────────────────────────

let state = SEED
function random(): number {
  state = (state + 0x6d2b79f5) | 0
  let t = Math.imul(state ^ (state >>> 15), 1 | state)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const int = (min: number, max: number) => min + Math.floor(random() * (max - min + 1))
const chance = (probability: number) => random() < probability
const pick = <T>(items: readonly T[]): T => items[Math.floor(random() * items.length)]
// count éléments distincts, dans l'ordre de la liste
const pickSome = <T>(items: readonly T[], count: number): T[] => {
  const chosen = new Set<T>()
  while (chosen.size < Math.min(count, items.length)) chosen.add(pick(items))
  return items.filter((item) => chosen.has(item))
}
const maybe = <T>(probability: number, value: () => T): T | null =>
  chance(probability) ? value() : null

// ── Données fictives ────────────────────────────────────────────────────────────────────────

const FEMALE_NAMES = [
  'Marie',
  'Jeanne',
  'Monique',
  'Josiane',
  'Christiane',
  'Françoise',
  'Nicole',
  'Martine',
  'Anne',
  'Isabelle',
  'Nathalie',
  'Sophie',
  'Julie',
  'Claire',
  'Danielle',
  'Simone',
  'Germaine',
  'Yvette',
  'Paulette',
  'Colette',
  'Brigitte',
  'Chantal',
  'Véronique',
  'Catherine'
]
const MALE_NAMES = [
  'Jean',
  'Jacques',
  'Michel',
  'André',
  'Pierre',
  'Philippe',
  'Marc',
  'Paul',
  'Joseph',
  'Georges',
  'Roger',
  'Guy',
  'Claude',
  'Daniel',
  'Alain',
  'Luc',
  'Patrick',
  'Christian',
  'Albert',
  'Marcel',
  'René',
  'Francis',
  'Thierry',
  'Didier'
]
const SURNAMES = [
  'Peeters',
  'Janssens',
  'Maes',
  'Jacobs',
  'Mertens',
  'Willems',
  'Claes',
  'Goossens',
  'Wouters',
  'Dubois',
  'Lambert',
  'Dupont',
  'Martin',
  'Simon',
  'Laurent',
  'Leclercq',
  'Renard',
  'Gilles',
  'Collard',
  'Henry',
  'Mathieu',
  'Lemaire',
  'Denis',
  'Thiry',
  'Hubert',
  'Charlier',
  'Fontaine',
  'Piette',
  'Lambotte',
  'Delvaux',
  'Bodart',
  'Collignon',
  'François',
  'Pirotte',
  'Baudoin',
  'Marchal',
  'Noël',
  'Remacle',
  'Massart',
  'Gérard',
  'Hennaux',
  'Jadot',
  'Lecomte',
  'Mouton',
  'Masson',
  'Leroy',
  'Wilmet',
  'Grégoire'
]
// Rues existantes de la région namuroise, pour que le géocodage place les patients sur la carte
const STREETS: [street: string, postalCode: string, locality: string][] = [
  ['Rue de Fer', '5000', 'Namur'],
  ["Rue de l'Ange", '5000', 'Namur'],
  ['Rue Saint-Jacques', '5000', 'Namur'],
  ['Rue Godefroid', '5000', 'Namur'],
  ['Boulevard Cauchy', '5000', 'Namur'],
  ['Rue Rogier', '5000', 'Namur'],
  ['Rue Julie Billiart', '5000', 'Namur'],
  ['Rue de Bruxelles', '5000', 'Namur'],
  ["Boulevard d'Herbatte", '5000', 'Namur'],
  ['Rue Lelièvre', '5000', 'Namur'],
  ['Avenue Reine Astrid', '5000', 'Namur'],
  ['Rue Henri Lecocq', '5000', 'Namur'],
  ['Rue Patenier', '5000', 'Namur'],
  ['Avenue des Combattants', '5000', 'Namur'],
  ['Rue Henri Blès', '5000', 'Namur'],
  ['Avenue Jean Materne', '5100', 'Jambes'],
  ['Chaussée de Marche', '5100', 'Jambes'],
  ['Rue de Dave', '5100', 'Jambes'],
  ['Boulevard de la Meuse', '5100', 'Jambes'],
  ['Rue Mazy', '5100', 'Jambes'],
  ['Chaussée de Liège', '5100', 'Jambes'],
  ['Avenue Prince de Liège', '5100', 'Jambes'],
  ['Chaussée de Dinant', '5100', 'Wépion'],
  ['Chaussée de Marche', '5101', 'Erpent'],
  ['Chaussée de Waterloo', '5002', 'Saint-Servais'],
  ['Chaussée de Louvain', '5004', 'Bouge'],
  ['Chaussée de Charleroi', '5030', 'Gembloux'],
  ['Avenue de la Faculté d’Agronomie', '5030', 'Gembloux'],
  ['Chaussée de Namur', '5170', 'Profondeville'],
  ['Avenue Roi Albert', '5300', 'Andenne'],
  ['Rue de Namur', '5070', 'Fosses-la-Ville'],
  ['Chaussée de Namur', '5310', 'Éghezée']
]
const DOCTORS = [
  'Dr Pierre Delhaye',
  'Dr Sophie Lambot',
  'Dr Marc Henrard',
  'Dr Claire Gobert',
  'Dr Luc Bertrand',
  'Dr Nadia El Amrani',
  'Dr Thomas Wautier',
  'Dr Hélène Dussart'
]
const REFERRERS = [
  'Médecin traitant',
  'Bouche-à-oreille',
  'Pharmacie',
  'Maison de repos',
  'Kinésithérapeute',
  'Infirmière à domicile',
  'Site internet'
]
const COMMENTS = [
  'Se déplace avec une canne',
  'Préfère les rendez-vous en matinée',
  'Malentendant, parler distinctement',
  'Soins à domicile',
  'Vient accompagné de sa fille',
  'Très anxieux lors des soins'
]
const ALLERGIES = ['Latex', 'Pénicilline', 'Iode', 'Sparadrap', 'Nickel', 'Lanoline']
const ANTICOAGULANTS = ['Xarelto', 'Eliquis', 'Sintrom']
const TOE_NOTES = [
  'Incarné bord interne',
  'Incarné bord externe',
  'Ongle épaissi',
  'Mycose',
  'Hématome sous-unguéal',
  'Cor dorsal'
]
const TOE_COMMENTS = [
  'Contrôle au prochain soin',
  'Orthoplastie conseillée',
  'Douleur au chaussage'
]
const PRODUCTS = [
  'Chlorhexidine',
  'Alcool 70 %',
  "Crème à l'urée 10 %",
  'Vaseline salicylée',
  'Isobétadine',
  'Tulle gras',
  'Protection en silicone'
]

// ── Construction des patients ───────────────────────────────────────────────────────────────

type Json = Record<string, unknown>

interface DemoPatient {
  personal: Json
  medical: Json
  cares: Json[]
}

const today = new Date()

function isoDate(date: Date, hour = 0): string {
  const day = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), hour))
  return day.toISOString()
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function slug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
}

function phone(): string {
  const two = () => String(int(0, 99)).padStart(2, '0')
  return `04${pick(['70', '71', '72', '75', '76', '77', '78', '79', '85', '86', '95', '96', '97', '98', '99'])} ${two()} ${two()} ${two()}`
}

function buildPersonal(index: number): Json {
  const female = chance(0.6)
  const firstname = pick(female ? FEMALE_NAMES : MALE_NAMES)
  const name = pick(SURNAMES)
  const age = chance(0.75) ? int(60, 94) : int(22, 59)
  const birthdate = new Date(today.getFullYear() - age, int(0, 11), int(1, 28))
  const [street, postalCode, locality] = pick(STREETS)
  const elderly = age >= 75
  const contact = maybe(
    elderly ? 0.7 : 0.15,
    () => `${pick([...FEMALE_NAMES, ...MALE_NAMES])} ${name}`
  )

  return {
    name,
    firstname,
    birthdate: isoDate(birthdate),
    phoneNum: phone(),
    email: maybe(
      elderly ? 0.25 : 0.7,
      () => `${slug(firstname)}.${slug(name)}${index}@example.com`
    ),
    // ~5 % sans adresse, pour la liste « sans position sur la carte »
    address: chance(0.05) ? null : `${street} ${int(1, 180)}, ${postalCode} ${locality}`,
    personOfContact: contact,
    personOfContactPhoneNumber: contact ? phone() : null,
    referenceBy: maybe(0.8, () => pick(REFERRERS)),
    doctor: pick(DOCTORS),
    mutual: pick(MUTUALITIES),
    comments: maybe(0.15, () => pick(COMMENTS))
  }
}

function buildMedical(age: number): Json {
  const diabeteType = chance(age >= 60 ? 0.2 : 0.08) ? (chance(0.85) ? 2 : 1) : 0
  const bleeding = chance(age >= 70 ? 0.18 : 0.05)
  const heart = chance(age >= 70 ? 0.2 : 0.05)
  const thyroid = chance(0.08)
  const drugs = [
    diabeteType === 1 ? 'Insuline' : diabeteType === 2 ? 'Metformine' : null,
    bleeding ? pick(ANTICOAGULANTS) : null,
    heart ? 'Bisoprolol' : null,
    thyroid ? 'L-Thyroxine' : null
  ].filter(Boolean)

  // Les booléens sont envoyés sous les deux noms acceptés par HealthBodyDto (@JsonProperty
  // « isWith… » et setter « with… »), l'un des deux étant ignoré selon la désérialisation.
  const withAliases = (key: string, value: boolean) => ({
    [key]: value,
    [`is${key[0].toUpperCase()}${key.slice(1)}`]: value
  })

  // Choix multiples : le plus souvent un seul, parfois deux
  const footDeformityTypes = chance(0.35) ? pickSome(FOOT_DEFORMITY_TYPES, chance(0.3) ? 2 : 1) : []
  const nailConditionTypes = chance(0.45) ? pickSome(NAIL_CONDITION_TYPES, chance(0.3) ? 2 : 1) : []

  return {
    groupType: diabeteType ? int(1, 3) : chance(0.1) ? 1 : 0,
    diabeteType,
    ...withAliases('withBleedingDisorder', bleeding),
    ...withAliases('withHeartDisorder', heart),
    ...withAliases('withThyroideDisorder', thyroid),
    hasLeftHipProsthesis: chance(age >= 65 ? 0.06 : 0.005),
    hasRightHipProsthesis: chance(age >= 65 ? 0.06 : 0.005),
    hasLeftKneeProsthesis: chance(age >= 65 ? 0.06 : 0.005),
    hasRightKneeProsthesis: chance(age >= 65 ? 0.06 : 0.005),
    hasRecentDiseases: chance(0.05),
    hasRecentOperations: chance(0.05),
    allergies: maybe(0.15, () => pick(ALLERGIES)),
    drugs: drugs.length ? drugs.join(', ') : null,
    skinType: maybe(0.7, () => pick(SKIN_TYPES)),
    footType: maybe(0.6, () => pick(FOOT_TYPES)),
    sweatType: maybe(0.5, () => pick(SWEAT_TYPES)),
    remarkType: maybe(0.6, () => pick(REMARK_TYPES)),
    circulationType: maybe(age >= 70 ? 0.5 : 0.15, () => pick(CIRCULATION_TYPES)),
    dermatosisType: maybe(0.15, () => pick(DERMATOSIS_TYPES)),
    footDeformityTypes,
    footDeformityComment: footDeformityTypes.includes(OTHER_OPTION) ? 'Pied de Charcot' : null,
    nailConditionTypes,
    nailConditionComment: nailConditionTypes.includes(OTHER_OPTION) ? 'Ongles striés' : null,
    ...buildToes('left', nailConditionTypes.length > 0),
    ...buildToes('right', nailConditionTypes.length > 0)
  }
}

// Notes d'orteils (R1 = hallux … R5 = petit orteil), surtout quand une affection unguéale est notée
function buildToes(side: 'left' | 'right', hasNailCondition: boolean): Json {
  const toes: Json = {}
  for (let toe = 1; toe <= 5; toe++) {
    toes[`${side}ToeR${toe}`] = maybe(hasNailCondition ? (toe === 1 ? 0.5 : 0.1) : 0.02, () =>
      pick(TOE_NOTES)
    )
  }
  toes[`${side}ToesComment`] = maybe(hasNailCondition ? 0.2 : 0, () => pick(TOE_COMMENTS))
  return toes
}

function buildCare(medical: Json, date: Date): Json {
  const nails = (medical.nailConditionTypes ?? []) as string[]
  const acts = ['coupe et fraisage des ongles']
  const side = () => pick(['droit', 'gauche'])
  if (medical.remarkType === 'Cors') acts.push(`énucléation d'un cor au 5e orteil ${side()}`)
  if (medical.remarkType === 'Durillons') acts.push('dégraissage des durillons plantaires')
  if (medical.remarkType === 'Crevasses') acts.push('soin des crevasses talonnières')
  if (medical.remarkType === 'Phlyctènes') acts.push('protection des phlyctènes')
  if (nails.includes('Ongles incarnés')) acts.push(`soin d'ongle incarné, hallux ${side()}`)
  if (nails.includes('Onycomychoses')) acts.push('meulage des ongles mycosés')
  if (nails.includes('Onychogryphoses')) acts.push("réduction d'onychogryphose")
  const care = acts.join(', ')

  const tools = ['pince à ongles', 'fraise diamantée']
  if (medical.remarkType === 'Cors' || medical.remarkType === 'Durillons')
    tools.push('scalpel lame n°15')
  if (nails.includes('Ongles incarnés')) tools.push('gouge')

  const advice = medical.diabeteType
    ? 'Inspecter les pieds chaque jour, ne jamais marcher pieds nus'
    : medical.skinType === 'Sèche'
      ? 'Hydrater les pieds quotidiennement'
      : pick([
          'Porter des chaussures larges et souples',
          'Sécher soigneusement entre les orteils',
          'Éviter de couper les ongles trop court'
        ])

  return {
    date: isoDate(date, 9),
    care: care[0].toUpperCase() + care.slice(1),
    usedProducts: Array.from(new Set([pick(PRODUCTS), pick(PRODUCTS)])).join(', '),
    usedTools: tools.join(', '),
    possibleWounds: chance(0.08)
      ? pick([
          'Légère hémorragie au niveau de l’hallux, désinfectée',
          'Petite plaie au 5e orteil, pansement posé'
        ])
      : null,
    advice: `${advice}. Prochain soin dans ${int(5, 10)} semaines.`
  }
}

function buildCares(medical: Json): Json[] {
  // Premier soin entre il y a 2 ans et la semaine passée, puis un soin toutes les 5 à 10 semaines
  let date = addDays(today, -int(7, 730))
  const cares: Json[] = []
  while (date < today && cares.length < 8) {
    cares.push(buildCare(medical, date))
    date = addDays(date, int(35, 70))
  }
  return cares
}

function buildPatients(): DemoPatient[] {
  return Array.from({ length: PATIENT_COUNT }, (_, index) => {
    const personal = buildPersonal(index + 1)
    const age = today.getFullYear() - new Date(personal.birthdate as string).getFullYear()
    const medical = buildMedical(age)
    return { personal, medical, cares: buildCares(medical) }
  })
}

// ── Appels à l'API ──────────────────────────────────────────────────────────────────────────

let token = ''

class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message)
  }
}

async function api<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : undefined
  if (!response.ok) {
    // erreurs au format ProblemDetail (voir « Contrat d'API » du backend)
    const detail = data?.errors ? JSON.stringify(data.errors) : data?.detail
    throw new ApiError(response.status, `${method} ${path} → ${response.status} ${detail ?? ''}`)
  }
  return data as T
}

async function login(): Promise<number> {
  const response = await api<{ token: string; id: number }>('POST', '/auth/signin', {
    username: DEMO_USER.username,
    password: DEMO_USER.password
  })
  token = response.token
  return response.id
}

async function ensureAccount(): Promise<number> {
  try {
    return await login()
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error
  }
  if (!REGISTRATION_KEY) {
    throw new Error(
      "Le compte démo n'existe pas encore : relancez avec DEMO_REGISTRATION_KEY=<clé d'inscription libre>."
    )
  }
  console.log('Création du compte démo…')
  await api('POST', '/users/register', { ...DEMO_USER, registrationKey: REGISTRATION_KEY })
  return login()
}

async function inPool<T>(items: T[], worker: (item: T) => Promise<void>) {
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (next < items.length) await worker(items[next++])
    })
  )
}

async function main() {
  const host = new URL(API_URL).hostname
  if (!['localhost', '127.0.0.1'].includes(host)) {
    throw new Error(`Refusé : ce script ne s'exécute qu'en local (DEMO_API_URL = ${API_URL}).`)
  }

  const userId = await ensureAccount()
  await api('PUT', `/users/${userId}`, { username: DEMO_USER.username, ...DEMO_ADDRESS })

  const existing = await api<{ id: number }[]>('GET', '/patients')
  if (existing.length) console.log(`Suppression des ${existing.length} patients existants…`)
  await inPool(existing, (patient) => api('DELETE', `/patients/${patient.id}`))

  const patients = buildPatients()
  let careCount = 0
  let done = 0
  await inPool(patients, async ({ personal, medical, cares }) => {
    // La création enregistre la première fiche santé : on y place directement le premier soin
    const [first, ...others] = cares
    const created = await api<{ id: number }>('POST', '/patients', {
      ...personal,
      ...medical,
      ...first
    })
    for (const care of others) {
      await api('POST', `/patients/${created.id}/health`, { ...medical, ...care })
    }
    careCount += cares.length
    if (++done % 20 === 0) console.log(`${done}/${patients.length} patients créés`)
  })

  console.log(`
Compte démo prêt : ${patients.length} patients, ${careCount} soins.
  Identifiant : ${DEMO_USER.username}
  Mot de passe : ${DEMO_USER.password}
Les positions sur la carte apparaîtront après le prochain passage du géocodage (toutes les 4 h).`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
