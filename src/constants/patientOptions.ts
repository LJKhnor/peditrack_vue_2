// Listes de valeurs des fiches patients. Les libellés des profils podologiques doivent
// correspondre exactement à ceux attendus par l'API (enums côté backend).

export const GROUP_TYPES = [1, 2, 3, 4]
export const DIABETE_TYPES = [1, 2]

export const SKIN_TYPES = ['Normale', 'Pale', 'Cyanosée', 'Sèche', 'Grasse']
export const FOOT_TYPES = ['Creux', 'Plat', 'Grec', 'Egyptien', 'Carré', 'Normal']
// « Normale » ne se combine avec aucun autre type de transpiration (option exclusive du formulaire)
export const NORMAL_SWEAT = 'Normale'
export const SWEAT_TYPES = ['Hyperhidrose', 'Anhidrose', 'Bromidrose', NORMAL_SWEAT]
export const REMARK_TYPES = ['Cors', 'Durillons', 'Crevasses', 'Phlyctènes']
export const CIRCULATION_TYPES = [
  'Pieds froids',
  'Varicosités',
  'Pieds bleutés',
  'Rougeurs',
  'Œdèmes'
]
// Option « Autres » des déformations du pied et affections unguéales : elle ouvre un champ de précision
export const OTHER_OPTION = 'Autres'
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
