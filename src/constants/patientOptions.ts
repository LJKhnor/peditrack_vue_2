// Listes de valeurs des fiches patients. Les libellés des profils podologiques doivent
// correspondre exactement à ceux attendus par l'API (enums côté backend).

export const GROUP_TYPES = [1, 2, 3, 4]
export const DIABETE_TYPES = [1, 2]

export const SKIN_TYPES = ['Normale', 'Pale', 'Cyanosée', 'Sèche', 'Grasse']
export const FOOT_TYPES = ['Creux', 'Plat', 'Grec', 'Egyptien', 'Carré', 'Normal']
export const SWEAT_TYPES = ['Hyperhidrose', 'Anidrose', 'Bromidrose', 'Normale']
export const REMARK_TYPES = ['Cors', 'Durillons', 'Crevasses', 'Phlyctènes']
export const CIRCULATION_TYPES = [
  'Pieds froids',
  'Varicosités',
  'Pieds bleutés',
  'Rougeurs',
  'Œdèmes'
]
export const DERMATOSIS_TYPES = ['Eczéma', 'Psoriasis', 'Verrues', 'Intertrigo G/D']
export const FOOT_DEFORMITY_TYPES = [
  'Orteils en marteau',
  'Hallux valgus',
  'Hallux varus',
  'Quintus valgus',
  'Quintus varus',
  'Hallux rigidus',
  'Autres'
]
export const NAIL_CONDITION_TYPES = [
  'Onycomychoses',
  'Onychogryphoses',
  'Ongles incarnés',
  'Onycholyses',
  'Autres'
]

// Mutualités belges proposées dans le formulaire patient (champ libre côté API).
export const MUTUALITIES = [
  'Mutualité chrétienne',
  'Solidaris',
  'Partenamut',
  'Mutualité libérale',
  'Mutualité neutre',
  'Helan',
  'Freie Krankenkasse',
  'CAAMI',
  'HR Rail'
]
