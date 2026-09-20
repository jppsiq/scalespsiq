/** Simpson-Angus: 10 itens de 0 a 4. A interpretação usa a MÉDIA (total dividido por 10). */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { anchored } from '../../lib/options';
import { classify, sumItems } from '../../lib/scoring';

const raw: [string, string, string[]][] = [
  ['Marcha', 'Observe o paciente caminhando pelo corredor: amplitude do passo, balanço dos braços e giro do corpo.', ['Marcha normal.', 'Diminuição leve do balanço dos braços.', 'Redução evidente do balanço dos braços, com rigidez nos braços.', 'Marcha rígida, com os braços mantidos à frente do abdome.', 'Marcha arrastada, festinação, propulsão ou retropulsão.']],
  ['Queda dos braços', 'Paciente em pé, braços elevados à altura dos ombros e soltos em queda livre.', ['Queda livre, com forte ruído do tapa nas coxas.', 'Queda um pouco mais lenta, com ruído menos intenso.', 'Queda lenta, sem impacto audível.', 'Lentidão marcante, sem qualquer ruído.', 'Os braços descem como se houvesse resistência, contra um obstáculo.']],
  ['Balanço dos ombros', 'Segure o antebraço do paciente pelo cotovelo, com a outra mão sobre o ombro, e rode o úmero externamente.', ['Balanço livre.', 'Discreta diminuição do balanço.', 'Diminuição moderada.', 'Diminuição marcante.', 'Ombro totalmente rígido.']],
  ['Rigidez do cotovelo', 'Flexione e estenda passivamente o cotovelo, com o bíceps observado e palpado.', ['Mobilidade normal.', 'Rigidez e resposta em roda denteada discretas.', 'Roda denteada moderada.', 'Rigidez marcante, com dificuldade de flexão passiva.', 'Rigidez extrema, com o cotovelo quase congelado.']],
  ['Fixação do punho', 'Mantenha o punho em uma mão e flexione, estenda e rode passivamente com a outra.', ['Mobilidade normal.', 'Leve rigidez e resistência.', 'Rigidez e resistência moderadas.', 'Rigidez marcante, com dificuldade de movimentação passiva.', 'Punho extremamente rígido, quase congelado.']],
  ['Balanço das pernas', 'Sentado em mesa alta, com as pernas pendentes, balance a perna e observe a oscilação.', ['As pernas balançam livremente.', 'Leve diminuição do balanço.', 'Diminuição moderada.', 'Diminuição marcante.', 'Ausência completa de balanço.']],
  ['Queda da cabeça', 'Deitado, com a cabeça sobre travesseiro, que é então retirado.', ['A cabeça cai completamente, com bom impacto no travesseiro.', 'Queda um pouco lentificada.', 'Queda moderadamente lentificada.', 'Queda muito lenta e rígida.', 'A cabeça não alcança o travesseiro.']],
  ['Glabela', 'Percuta repetidamente a glabela, entre as sobrancelhas, e conte os piscamentos.', ['Zero a 5 piscamentos.', '6 a 10 piscamentos.', '11 a 15 piscamentos.', '16 a 20 piscamentos.', 'Mais de 20 piscamentos.']],
  ['Tremor', 'Observe o paciente caminhando e com os braços estendidos.', ['Ausência de tremor.', 'Tremor discreto, perceptível apenas na ponta dos dedos.', 'Tremor visível, porém leve, das mãos.', 'Tremor moderado das mãos ou da cabeça.', 'Tremor grosseiro, de corpo inteiro ou muito intenso.']],
  ['Salivação', 'Observe durante a conversa e peça ao paciente que abra a boca e eleve a língua.', ['Normal.', 'Excesso de salivação, com acúmulo evidente no assoalho da boca.', 'Excesso que pode produzir dificuldade ocasional de fala.', 'Fala com dificuldade por excesso de saliva.', 'Salivação franca, com babação.']],
];
const items: ScaleItem[] = raw.map(([text, hint, d], i) => ({ id: `sas_${i + 1}`, number: i + 1, text, hint, options: anchored(d) }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 3, severity: 'Sem parkinsonismo', clinicalImplication: 'Média até 0,3, limiar habitual de normalidade. Reavaliar após cada aumento de dose ou troca de antipsicótico.', badgeColor: 'green' },
  { min: 4, max: 11, severity: 'Parkinsonismo leve', clinicalImplication: 'Considere reduzir a dose ou trocar por antipsicótico de menor afinidade D2. Anticolinérgico é opção sintomática, com atenção ao prejuízo cognitivo e ao risco de delirium.', badgeColor: 'yellow' },
  { min: 12, max: 23, severity: 'Parkinsonismo moderado', clinicalImplication: 'Ajuste terapêutico indicado. Parkinsonismo é causa frequente de má adesão e se confunde com sintomas negativos e com depressão.', badgeColor: 'orange' },
  { min: 24, max: 40, severity: 'Parkinsonismo grave', clinicalImplication: 'Revisão urgente do esquema. Rigidez intensa com febre, alteração de consciência e instabilidade autonômica levanta a hipótese de síndrome neuroléptica maligna.', badgeColor: 'red' },
];

export const sas: PsychiatricScale = {
  id: 'sas', name: 'Escala de Simpson-Angus para Efeitos Extrapiramidais', acronym: 'Simpson-Angus (SAS)', category: 'general', type: 'clinician_administered',
  estimatedMinutes: 10, timeframe: 'Momento do exame',
  description: 'Exame padronizado de parkinsonismo induzido por antipsicóticos: rigidez, bradicinesia, tremor, glabela e salivação.',
  instructions: 'Exame físico com o paciente inicialmente caminhando, depois sentado e por fim deitado. Não pontue sintomas atribuíveis a doença de Parkinson idiopática sem considerar a história.',
  licenseNote: 'Âncoras em tradução de trabalho a partir do artigo original.', minScore: 0, maxScore: 40,
  validationInfo: { originalAuthors: 'Simpson GM, Angus JWS', year: 1970, brazilianValidation: 'Tradução de uso corrente em pesquisa no Brasil, sem estudo de validação único de referência.', psychometrics: 'Boa confiabilidade entre avaliadores após treinamento. É a escala de parkinsonismo mais usada em ensaios com antipsicóticos.' },
  about: {
    purposes: ['screening', 'severity', 'monitoring'],
    objective: 'Detectar e quantificar parkinsonismo induzido por medicamentos e orientar o ajuste do esquema. Complementa a AIMS (discinesia tardia) e a Barnes (acatisia).',
    targetPopulation: 'Pacientes em uso de antipsicóticos ou de outros bloqueadores dopaminérgicos. Exame por clínico.',
    accuracy: [{ cutoff: 'Média > 0,3 (total > 3)', sensitivity: 'não se aplica', specificity: 'não se aplica', source: 'Limiar convencional adotado em ensaios clínicos' }],
    limitations: [
      'Avalia apenas parkinsonismo: não detecta acatisia, distonia aguda nem discinesia tardia. Use as três escalas em conjunto.',
      'Não separa parkinsonismo induzido de doença de Parkinson idiopática ou de outro parkinsonismo degenerativo.',
      'Bradicinesia se confunde com sintomas negativos, com retardo psicomotor da depressão e com sedação.',
      'Depende de exame físico cuidadoso: sem treinamento, a concordância entre avaliadores é baixa.',
    ],
    references: [
      'Simpson GM, Angus JWS. A rating scale for extrapyramidal side effects. Acta Psychiatr Scand Suppl. 1970;212:11-19.',
      'Janno S, Holi MM, Tuisku K, Wahlbeck K. Validity of Simpson-Angus Scale (SAS) in a naturalistic schizophrenia population. BMC Neurol. 2005;5:5.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const total = sumItems(items, a);
    const cutoff = classify(total, cutoffs);
    return { total, cutoff, classification: cutoff?.severity ?? 'Sem classificação', notes: [`Média por item: ${(total / 10).toFixed(2).replace('.', ',')} (limiar habitual de parkinsonismo: acima de 0,30).`] };
  },
};
