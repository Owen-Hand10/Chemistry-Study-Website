import type { Flashcard, Question, TopicId } from './types'

export const topics: { id: TopicId; title: string; short: string; color: string; icon: string; summary: string }[] = [
  { id: 'bohr', title: 'Bohr models', short: 'Bohr', color: 'mint', icon: '◉', summary: 'Energy levels, ground states, and electron jumps.' },
  { id: 'light', title: 'Light & electrons', short: 'Light', color: 'gold', icon: '⌁', summary: 'Photon energy, wavelength, frequency, and spectra.' },
  { id: 'quantum', title: 'Quantum model', short: 'Quantum', color: 'lilac', icon: '∿', summary: 'Probability clouds and the modern picture of the atom.' },
  { id: 'orbitals', title: 'Orbitals', short: 'Orbitals', color: 'blue', icon: '◌', summary: 'Orbital shapes, counts, and electron capacities.' },
  { id: 'filling', title: 'Orbital filling rules', short: 'Filling', color: 'coral', icon: '↟', summary: 'Build electron arrangements with three key rules.' },
  { id: 'configuration', title: 'Electron configurations', short: 'Configs', color: 'mint', icon: '▤', summary: 'Write full and noble-gas shorthand configurations.' },
  { id: 'pes', title: 'PES spectra', short: 'PES', color: 'gold', icon: '⌁', summary: 'Read binding energy, relative abundance, and valence peaks.' },
  { id: 'vsepr', title: 'VSEPR shapes', short: 'VSEPR', color: 'lilac', icon: '⬡', summary: 'Predict molecular geometry from electron domains.' },
  { id: 'trends', title: 'Periodic trends', short: 'Trends', color: 'blue', icon: '⇢', summary: 'Compare radius, ionization energy, and electronegativity.' },
]

const baseQuestions: Question[] = [
  { id: 'q01', topic: 'bohr', prompt: 'How many electrons fit in the first energy level?', options: ['2', '8', '18', '32'], answer: 0, explanation: 'The first principal energy level contains one orbital, which holds up to two electrons.' },
  { id: 'q02', topic: 'bohr', prompt: 'An electron absorbs energy and moves to a higher level. What state is the atom in?', options: ['Ground state', 'Excited state', 'Ionic state', 'Isotope state'], answer: 1, explanation: 'An electron promoted above its lowest available energy level puts the atom in an excited state.' },
  { id: 'q03', topic: 'bohr', prompt: 'What happens when an excited electron falls to a lower energy level?', options: ['A proton is emitted', 'Light is absorbed', 'A photon is released', 'The atom loses a neutron'], answer: 2, explanation: 'The energy difference is released as a photon of light.' },
  { id: 'q04', topic: 'bohr', prompt: 'In the simplified Bohr model, where are the electrons?', options: ['Inside the nucleus', 'In fixed energy levels', 'Between atoms', 'In the proton cloud'], answer: 1, explanation: 'The Bohr model places electrons in specific quantized energy levels around the nucleus.' },
  { id: 'q05', topic: 'light', prompt: 'Which equation relates the speed, wavelength, and frequency of light?', options: ['E = mc²', 'c = λν', 'PV = nRT', 'F = ma'], answer: 1, explanation: 'The speed of light equals wavelength multiplied by frequency: c = λν.' },
  { id: 'q06', topic: 'light', prompt: 'A wave has wavelength 6.00 × 10⁻⁷ m. What is its frequency?', options: ['5.00 × 10¹⁴ Hz', '1.80 × 10² Hz', '2.00 × 10⁻¹⁵ Hz', '5.00 × 10⁻⁷ Hz'], answer: 0, explanation: 'ν = c/λ = (3.00 × 10⁸)/(6.00 × 10⁻⁷) = 5.00 × 10¹⁴ Hz.' },
  { id: 'q07', topic: 'light', prompt: 'If frequency increases, what happens to wavelength?', options: ['It increases', 'It decreases', 'It stays the same', 'It becomes zero'], answer: 1, explanation: 'Because c is constant, wavelength and frequency are inversely proportional.' },
  { id: 'q08', topic: 'light', prompt: 'Why does each element produce a unique line spectrum?', options: ['Each has unique energy-level spacings', 'Each has a different speed of light', 'Electrons have different charges in each atom', 'Each has the same spectrum at a different brightness'], answer: 0, explanation: 'Unique allowed energy differences produce element-specific photon wavelengths.' },
  { id: 'q09', topic: 'quantum', prompt: 'In the quantum model, where are electrons most accurately described?', options: ['On circular tracks', 'In regions of probability', 'Inside the nucleus', 'At a fixed distance only'], answer: 1, explanation: 'The quantum model describes likely locations as probability distributions called electron clouds.' },
  { id: 'q10', topic: 'quantum', prompt: 'What does an orbital represent?', options: ['A circular electron path', 'A region where an electron is likely to be found', 'A proton energy level', 'The atom’s outer edge'], answer: 1, explanation: 'An orbital is a three-dimensional region with a high probability of finding an electron.' },
  { id: 'q11', topic: 'orbitals', prompt: 'What is the maximum number of electrons in a p subshell?', options: ['2', '6', '10', '14'], answer: 1, explanation: 'A p subshell has three orbitals; at two electrons each, it holds six.' },
  { id: 'q12', topic: 'orbitals', prompt: 'How many orbitals are in a d subshell?', options: ['1', '3', '5', '7'], answer: 2, explanation: 'The d subshell contains five orbitals and can hold ten electrons total.' },
  { id: 'q13', topic: 'orbitals', prompt: 'Which orbital is spherical?', options: ['s', 'p', 'd', 'f'], answer: 0, explanation: 'An s orbital has a spherical probability distribution.' },
  { id: 'q14', topic: 'filling', prompt: 'Which principle says to fill the lowest-energy orbitals first?', options: ['Hund’s rule', 'Aufbau principle', 'Pauli exclusion principle', 'Octet rule'], answer: 1, explanation: 'Aufbau means “building up”: electrons enter the lowest-energy available orbitals first.' },
  { id: 'q15', topic: 'filling', prompt: 'How do electrons occupy equal-energy p orbitals before pairing?', options: ['Pair in the first orbital immediately', 'Enter singly with parallel spins', 'Enter singly with opposite spins', 'Skip one orbital'], answer: 1, explanation: 'Hund’s rule fills degenerate orbitals singly with parallel spins before pairing.' },
  { id: 'q16', topic: 'filling', prompt: 'What does the Pauli exclusion principle require in one orbital?', options: ['At most two electrons with opposite spins', 'Exactly two electrons', 'Electrons with matching spins', 'Only one electron in each subshell'], answer: 0, explanation: 'An orbital holds up to two electrons, and they must have opposite spins.' },
  { id: 'q17', topic: 'configuration', prompt: 'What is the electron configuration of oxygen?', options: ['1s² 2s² 2p⁴', '1s² 2s² 2p⁶', '1s² 2s⁴ 2p²', '1s² 2p⁶'], answer: 0, explanation: 'Oxygen has 8 electrons: 1s² 2s² 2p⁴.' },
  { id: 'q18', topic: 'configuration', prompt: 'What is the noble-gas shorthand configuration of sodium?', options: ['[He] 2s² 2p⁶', '[Ne] 3s¹', '[Ar] 4s¹', '[Ne] 3s²'], answer: 1, explanation: 'Sodium has 11 electrons. The first 10 match neon, leaving 3s¹.' },
  { id: 'q19', topic: 'configuration', prompt: 'Which subshell is filled immediately after 3p in the Aufbau order?', options: ['3d', '4p', '4s', '5s'], answer: 2, explanation: 'The 4s subshell is lower in energy than 3d for neutral atoms, so it fills next.' },
  { id: 'q20', topic: 'pes', prompt: 'On a PES graph, what does peak height represent?', options: ['Binding energy', 'Relative number of electrons', 'Atomic radius', 'Photon wavelength'], answer: 1, explanation: 'Peak height (or area, depending on graph convention) indicates relative electron count.' },
  { id: 'q21', topic: 'pes', prompt: 'Which electrons are associated with the lowest binding energy peaks?', options: ['Core electrons', 'Valence electrons', 'Neutrons', 'Nucleus electrons'], answer: 1, explanation: 'Valence electrons are held least tightly and require the least energy to remove.' },
  { id: 'q22', topic: 'pes', prompt: 'A peak farther toward higher binding energy indicates electrons that are…', options: ['More tightly held', 'Farther from the nucleus', 'Higher in electron count', 'In a larger atom'], answer: 0, explanation: 'Greater binding energy means more energy is required to remove the electron.' },
  { id: 'q23', topic: 'vsepr', prompt: 'What is the molecular shape of CO₂?', options: ['Bent', 'Linear', 'Tetrahedral', 'Trigonal pyramidal'], answer: 1, explanation: 'Carbon has two bonding domains and no lone pairs, giving a linear shape.' },
  { id: 'q24', topic: 'vsepr', prompt: 'What is the molecular shape of H₂O?', options: ['Linear', 'Bent', 'Trigonal planar', 'Tetrahedral'], answer: 1, explanation: 'Two bonding pairs and two lone pairs on oxygen create a bent molecular shape.' },
  { id: 'q25', topic: 'vsepr', prompt: 'What is the molecular shape of NH₃?', options: ['Trigonal planar', 'Trigonal pyramidal', 'Linear', 'Bent'], answer: 1, explanation: 'Three bonding pairs and one lone pair create a trigonal pyramidal shape.' },
  { id: 'q26', topic: 'vsepr', prompt: 'What is the shape of CH₄?', options: ['Bent', 'Trigonal planar', 'Tetrahedral', 'Linear'], answer: 2, explanation: 'Four bonding domains and no lone pairs arrange tetrahedrally.' },
  { id: 'q27', topic: 'trends', prompt: 'Which element has the highest electronegativity?', options: ['Oxygen', 'Chlorine', 'Fluorine', 'Nitrogen'], answer: 2, explanation: 'Fluorine is the most electronegative element.' },
  { id: 'q28', topic: 'trends', prompt: 'How does atomic radius generally change across a period from left to right?', options: ['Increases', 'Decreases', 'Stays constant', 'Doubles'], answer: 1, explanation: 'Increasing effective nuclear charge pulls electrons closer across a period.' },
  { id: 'q29', topic: 'trends', prompt: 'How does ionization energy generally change down a group?', options: ['Increases', 'Decreases', 'Stays constant', 'Becomes zero'], answer: 1, explanation: 'Added energy levels and shielding make outer electrons easier to remove down a group.' },
  { id: 'q30', topic: 'trends', prompt: 'Compared with its neutral atom, a positive ion is usually…', options: ['Larger', 'Smaller', 'The same size', 'Unrelated in size'], answer: 1, explanation: 'Cations lose electrons, often an entire outer shell, making them smaller.' },
  { id: 'q31', topic: 'trends', prompt: 'Compared with its neutral atom, a negative ion is usually…', options: ['Smaller', 'Larger', 'The same size', 'Missing a shell'], answer: 1, explanation: 'Added electrons increase electron-electron repulsion, so anions are larger.' },
  { id: 'q32', topic: 'trends', prompt: 'The octet rule describes atoms tending to achieve…', options: ['Eight neutrons', 'Eight valence electrons', 'Eight energy levels', 'Eight protons'], answer: 1, explanation: 'Many main-group atoms gain, lose, or share electrons to reach eight valence electrons.' },
]

export const configurations = [
  { element: 'Oxygen', symbol: 'O', atomicNumber: 8, answer: '1s2 2s2 2p4', shorthand: '[He] 2s2 2p4' },
  { element: 'Sodium', symbol: 'Na', atomicNumber: 11, answer: '1s2 2s2 2p6 3s1', shorthand: '[Ne] 3s1' },
  { element: 'Magnesium', symbol: 'Mg', atomicNumber: 12, answer: '1s2 2s2 2p6 3s2', shorthand: '[Ne] 3s2' },
  { element: 'Chlorine', symbol: 'Cl', atomicNumber: 17, answer: '1s2 2s2 2p6 3s2 3p5', shorthand: '[Ne] 3s2 3p5' },
  { element: 'Calcium', symbol: 'Ca', atomicNumber: 20, answer: '1s2 2s2 2p6 3s2 3p6 4s2', shorthand: '[Ar] 4s2' },
  { element: 'Iron', symbol: 'Fe', atomicNumber: 26, answer: '1s2 2s2 2p6 3s2 3p6 4s2 3d6', shorthand: '[Ar] 4s2 3d6' },
]

export const molecules = [
  { formula: 'CO₂', name: 'Carbon dioxide', shape: 'Linear', domains: '2 bonding · 0 lone pairs', angle: '180°' },
  { formula: 'BF₃', name: 'Boron trifluoride', shape: 'Trigonal planar', domains: '3 bonding · 0 lone pairs', angle: '120°' },
  { formula: 'CH₄', name: 'Methane', shape: 'Tetrahedral', domains: '4 bonding · 0 lone pairs', angle: '109.5°' },
  { formula: 'NH₃', name: 'Ammonia', shape: 'Trigonal pyramidal', domains: '3 bonding · 1 lone pair', angle: '107°' },
  { formula: 'H₂O', name: 'Water', shape: 'Bent', domains: '2 bonding · 2 lone pairs', angle: '104.5°' },
]

const makeQuestion = (id: string, topic: TopicId, prompt: string, options: string[], explanation: string): Question => {
  const mixedOptions = [...options]
  for (let index = mixedOptions.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[mixedOptions[index], mixedOptions[swapIndex]] = [mixedOptions[swapIndex], mixedOptions[index]]
  }
  return { id, topic, prompt, options: mixedOptions, answer: mixedOptions.indexOf(options[0]), explanation }
}

const wavelengthValues = [380, 420, 460, 500, 540, 580, 620, 660, 700, 740, 780, 820]
const wavelengthQuestions = wavelengthValues.map((wavelength, index) => {
  const frequency = 3e8 / (wavelength * 1e-9) / 1e14
  const correct = frequency.toFixed(2)
  return makeQuestion(`wave-frequency-${index}`, 'light', `Light has a wavelength of ${wavelength} nm. Find its frequency.`, [`${correct} × 10¹⁴ Hz`, `${(frequency * 0.5).toFixed(2)} × 10¹⁴ Hz`, `${(frequency * 1.5).toFixed(2)} × 10¹⁴ Hz`, `${(frequency + 0.5).toFixed(2)} × 10¹⁴ Hz`], `ν = c/λ = 3.00 × 10⁸ m/s ÷ ${(wavelength * 1e-9).toExponential(2)} m = ${correct} × 10¹⁴ Hz.`)
})

const frequencyValues = [3.2, 3.6, 4.1, 4.4, 4.8, 5.3, 5.7, 6.1, 6.5, 6.9, 7.2, 7.8]
const frequencyQuestions = frequencyValues.map((frequency, index) => {
  const wavelength = 3000 / frequency
  const correct = Math.round(wavelength)
  return makeQuestion(`wave-wavelength-${index}`, 'light', `A photon has frequency ${frequency.toFixed(1)} × 10¹⁴ Hz. Find its wavelength.`, [`${correct} nm`, `${Math.round(wavelength / 2)} nm`, `${Math.round(wavelength * 2)} nm`, `${Math.round(wavelength + 100)} nm`], `λ = c/ν = 3.00 × 10⁸ m/s ÷ ${(frequency * 1e14).toExponential(2)} Hz ≈ ${correct} nm.`)
})

const superscriptConfig = (value: string) => value.replace(/([spdf])(\d+)/g, (_, orbital: string, count: string) => `${orbital}${'⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(count)]}`)
const configurationQuestions = configurations.flatMap((configuration, index) => {
  const alternatives = configurations.filter((_, otherIndex) => otherIndex !== index)
  const fullOptions = [configuration.answer, ...alternatives.slice(0, 3).map((item) => item.answer)].map(superscriptConfig)
  const shortOptions = [configuration.shorthand, ...alternatives.slice(1, 4).map((item) => item.shorthand)]
  return [
    makeQuestion(`config-full-${index}`, 'configuration', `Which full configuration matches neutral ${configuration.element} (Z = ${configuration.atomicNumber})?`, fullOptions, `Neutral ${configuration.symbol} has ${configuration.atomicNumber} electrons: ${superscriptConfig(configuration.answer)}.`),
    makeQuestion(`config-short-${index}`, 'configuration', `Which noble-gas shorthand represents neutral ${configuration.symbol}?`, shortOptions, `${configuration.symbol} shorthand is ${superscriptConfig(configuration.shorthand)}.`),
  ]
})

const shapeOptions = ['Linear', 'Bent', 'Trigonal planar', 'Trigonal pyramidal', 'Tetrahedral']
const moleculesQuestions = molecules.flatMap((molecule, index) => {
  const shapeIndex = shapeOptions.indexOf(molecule.shape)
  const angles = ['180°', '120°', '109.5°', '107°', '104.5°']
  return [
    makeQuestion(`shape-name-${index}`, 'vsepr', `Using VSEPR, predict the geometry around the central atom in ${molecule.formula}.`, [molecule.shape, ...shapeOptions.filter((_, otherIndex) => otherIndex !== shapeIndex).slice(0, 3)], `${molecule.formula} has ${molecule.domains} at its central atom, so its molecular shape is ${molecule.shape}.`),
    makeQuestion(`shape-angle-${index}`, 'vsepr', `What is the approximate bond angle in ${molecule.formula}?`, [molecule.angle, ...angles.filter((angle) => angle !== molecule.angle).slice(0, 3)], `The ${molecule.shape.toLowerCase()} geometry of ${molecule.formula} has an approximate bond angle of ${molecule.angle}.`),
  ]
})

const trendQuestions = [
  ['Which atom has the larger radius, K or Ca?', 'K', 'Ca', 'Atomic radius decreases across a period.'],
  ['Which atom has the larger radius, Rb or F?', 'Rb', 'F', 'Atomic radius increases down a group and decreases across.'],
  ['Which atom has the larger radius, Li or K?', 'K', 'Li', 'Atomic radius increases down a group.'],
  ['Which atom has the higher ionization energy, Na or K?', 'Na', 'K', 'Ionization energy increases up a group.'],
  ['Which atom has the higher ionization energy, N or P?', 'N', 'P', 'Ionization energy generally increases up a group.'],
  ['Which atom has the higher ionization energy, Mg or Sr?', 'Mg', 'Sr', 'Ionization energy generally decreases down a group.'],
  ['Which atom is more electronegative, F or Cl?', 'F', 'Cl', 'Electronegativity increases up a group; fluorine is highest.'],
  ['Which atom is more electronegative, O or S?', 'O', 'S', 'Electronegativity increases up a group.'],
  ['Which atom is more electronegative, C or O?', 'O', 'C', 'Electronegativity generally increases across a period.'],
  ['Which species has the smaller radius, Mg²⁺ or Mg?', 'Mg²⁺', 'Mg', 'A cation is smaller than its parent atom.'],
  ['Which species has the larger radius, O²⁻ or O?', 'O²⁻', 'O', 'An anion is larger than its parent atom.'],
  ['Which particle is larger, Cl⁻ or Cl?', 'Cl⁻', 'Cl', 'A negative ion has added electron-electron repulsion.'],
  ['Which element is the most electronegative?', 'F', 'O', 'Fluorine has the highest electronegativity.'],
  ['Which direction generally increases atomic radius?', 'Down a group', 'Across a period to the right', 'Atomic radius generally increases down and to the left.'],
].map(([prompt, correct, distractor, explanation], index) => makeQuestion(`trend-${index}`, 'trends', prompt, [correct, distractor, 'They are equal', 'Not enough information'], explanation))

const orbitalQuestions: Question[] = [
  makeQuestion('orbital-s-capacity', 'orbitals', 'How many electrons fit in a complete s subshell?', ['2', '1', '6', '10'], 'An s subshell has one orbital, which can hold two electrons.'),
  makeQuestion('orbital-f-capacity', 'orbitals', 'What is the maximum electron capacity of an f subshell?', ['14', '7', '10', '2'], 'An f subshell has seven orbitals; 7 × 2 = 14 electrons.'),
  makeQuestion('orbital-p-count', 'orbitals', 'How many separate orbitals make up a p subshell?', ['3', '1', '5', '7'], 'A p subshell has three orbitals.'),
  makeQuestion('orbital-d-capacity', 'orbitals', 'What is the maximum electron capacity of a d subshell?', ['10', '5', '6', '14'], 'A d subshell has five orbitals; 5 × 2 = 10 electrons.'),
  makeQuestion('orbital-p-shape', 'orbitals', 'How is a p orbital commonly described in a shape diagram?', ['Dumbbell-shaped', 'Spherical', 'A flat ring', 'A straight line'], 'p orbitals are commonly drawn as dumbbell-shaped probability regions.'),
  makeQuestion('quantum-model-path', 'quantum', 'Why is a fixed circular path not part of the quantum model?', ['Electron position is described by probability', 'Electrons do not move', 'Atoms have no energy levels', 'The nucleus cannot be located'], 'The quantum model describes probability distributions rather than exact classical paths.'),
  makeQuestion('bohr-emission', 'bohr', 'Which event produces an emission line in an element spectrum?', ['An electron drops to a lower energy level', 'A neutron enters the nucleus', 'An electron stays in its ground state', 'A proton changes charge'], 'An electron falling to a lower level releases a photon with a specific energy.'),
  makeQuestion('hund-rule', 'filling', 'In a p subshell with three empty orbitals, where does the first three electrons go?', ['One in each orbital with parallel spins', 'All three pair in the first orbital', 'Two in the first and one in the second', 'One in each orbital with opposite spins'], 'Hund’s rule fills equal-energy orbitals singly with parallel spins before pairing.'),
]

export const questionBank: Question[] = [...baseQuestions, ...wavelengthQuestions, ...frequencyQuestions, ...configurationQuestions, ...moleculesQuestions, ...trendQuestions, ...orbitalQuestions]

export const flashcards: Flashcard[] = [
  { id: 'f1', topic: 'bohr', front: 'Ground state', back: 'The lowest-energy arrangement of an atom’s electrons.' },
  { id: 'f2', topic: 'bohr', front: 'Excited state', back: 'A state where one or more electrons occupy higher-than-lowest energy levels.' },
  { id: 'f3', topic: 'light', front: 'c = λν', back: 'Speed of light = wavelength × frequency. c = 3.00 × 10⁸ m/s.' },
  { id: 'f4', topic: 'light', front: 'Emission spectrum', back: 'A unique set of wavelengths released as excited electrons drop to lower levels.' },
  { id: 'f5', topic: 'quantum', front: 'Electron cloud', back: 'A probability map showing where an electron is likely to be found.' },
  { id: 'f6', topic: 'orbitals', front: 's subshell', back: 'Spherical; 1 orbital; maximum 2 electrons.' },
  { id: 'f7', topic: 'orbitals', front: 'p subshell', back: 'Dumbbell orbitals; 3 orbitals; maximum 6 electrons.' },
  { id: 'f8', topic: 'orbitals', front: 'd subshell', back: '5 orbitals; maximum 10 electrons.' },
  { id: 'f9', topic: 'orbitals', front: 'f subshell', back: '7 orbitals; maximum 14 electrons.' },
  { id: 'f10', topic: 'filling', front: 'Aufbau principle', back: 'Electrons occupy the lowest-energy orbitals available first.' },
  { id: 'f11', topic: 'filling', front: 'Hund’s rule', back: 'Equal-energy orbitals fill singly with parallel spins before any pairing.' },
  { id: 'f12', topic: 'filling', front: 'Pauli exclusion principle', back: 'An orbital holds at most two electrons, and their spins must be opposite.' },
  { id: 'f13', topic: 'configuration', front: 'Na shorthand', back: '[Ne] 3s¹' },
  { id: 'f14', topic: 'pes', front: 'PES peak height', back: 'The relative number of electrons in that subshell.' },
  { id: 'f15', topic: 'pes', front: 'Low binding energy', back: 'Valence electrons; they are held less tightly and removed more easily.' },
  { id: 'f16', topic: 'vsepr', front: 'Tetrahedral', back: 'Four bonding domains and zero lone pairs; ideal bond angle ≈ 109.5°.' },
  { id: 'f17', topic: 'vsepr', front: 'Trigonal pyramidal', back: 'Three bonding domains and one lone pair; example: NH₃.' },
  { id: 'f18', topic: 'trends', front: 'Electronegativity trend', back: 'Generally increases across a period and up a group; fluorine is highest.' },
  { id: 'f19', topic: 'trends', front: 'Atomic radius trend', back: 'Generally decreases across a period and increases down a group.' },
  { id: 'f20', topic: 'trends', front: 'Ion size', back: 'Cations are smaller than their neutral atoms; anions are larger.' },
]

export const orbitalOrder = ['1s', '2s', '2p', '3s', '3p'] as const
export const trendComparisons = [
  { prompt: 'Which atom has the larger radius?', a: 'Na', b: 'Cl', answer: 'Na', property: 'Atomic radius' },
  { prompt: 'Which atom has the higher ionization energy?', a: 'Mg', b: 'Ba', answer: 'Mg', property: 'Ionization energy' },
  { prompt: 'Which atom is more electronegative?', a: 'O', b: 'S', answer: 'O', property: 'Electronegativity' },
  { prompt: 'Which species has the larger radius?', a: 'Na⁺', b: 'Na', answer: 'Na', property: 'Ionic radius' },
]