/** Barnes: a soma usa os três primeiros itens (0 a 9). A avaliação clínica global é registrada à parte. */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { anchored } from '../../lib/options';
import { classify, sumItems } from '../../lib/scoring';

const items: ScaleItem[] = [
  { id: 'bars_1', number: 1, text: 'Objetivo: inquietação motora observada', hint: 'Observe o paciente sentado por pelo menos 2 minutos e depois em pé, de forma não constrangedora, durante conversa neutra.', options: anchored([
    'Movimentos normais para a situação.',
    'Presença de movimentos característicos de inquietação, de forma intermitente: balanço ou cruzamento e descruzamento das pernas, oscilação de um pé para outro, marcha no lugar.',
    'Fenômeno de inquietação presente em pelo menos metade do tempo de observação.',
    'O paciente está em movimento constante, incapaz de permanecer sentado ou em pé sem se mexer, durante toda a observação.',
  ]) },
  { id: 'bars_2', number: 2, text: 'Subjetivo: consciência da inquietação', hint: 'Pergunte se sente inquietação interna, incapacidade de manter as pernas paradas ou vontade de se movimentar.', options: anchored([
    'Ausência de inquietação interna.',
    'Inquietação interna inespecífica.',
    'O paciente tem consciência da incapacidade de manter as pernas paradas ou do desejo de movimentar as pernas e/ou queixa-se de inquietação interna agravada especificamente ao ser solicitado a ficar parado.',
    'Consciência de intenso desejo de se movimentar a maior parte do tempo e/ou relata forte desejo de andar ou caminhar de um lado para o outro a maior parte do tempo.',
  ]) },
  { id: 'bars_3', number: 3, text: 'Subjetivo: sofrimento relacionado à inquietação', options: anchored(['Ausente.', 'Leve.', 'Moderado.', 'Grave.']) },
  { id: 'bars_4', number: 4, text: 'Avaliação clínica global da acatisia', hint: 'Não entra na soma. Registra a impressão diagnóstica global, exigindo relato subjetivo mais achados objetivos.', scored: false, options: anchored([
    'Ausente: nenhuma evidência de consciência de inquietação. A presença de movimentos característicos sem queixa subjetiva deve ser pontuada como pseudoacatisia.',
    'Duvidosa: tensão interna inespecífica e movimentos inquietos.',
    'Acatisia leve: consciência da inquietação nas pernas e/ou inquietação interna agravada ao ficar parado. Movimentos inquietos presentes, mas os movimentos característicos podem estar ausentes. A condição causa pouco ou nenhum sofrimento.',
    'Acatisia moderada: consciência da inquietação como descrito na acatisia leve, combinada a movimentos característicos, como balanço de um pé para o outro quando em pé. O paciente relata sofrimento.',
    'Acatisia acentuada: a experiência subjetiva é constante. O desejo de andar de um lado para o outro predomina. O paciente não consegue permanecer sentado ou deitado por mais de alguns minutos. Sofrimento intenso e insônia.',
    'Acatisia grave: relato de intenso desejo de se movimentar a maior parte do tempo, com grande sofrimento e insônia acentuada.',
  ]) },
];

const cutoffs: CutoffRange[] = [
  { min: 0, max: 1, severity: 'Sem acatisia', clinicalImplication: 'Reavaliar após cada introdução ou aumento de dose de antipsicótico, sobretudo nas primeiras semanas.', badgeColor: 'green' },
  { min: 2, max: 4, severity: 'Acatisia leve a moderada', clinicalImplication: 'Reduza a dose ou troque por antipsicótico de menor risco. Propranolol e, em casos selecionados, benzodiazepínico são as opções sintomáticas. Anticolinérgicos têm pouco efeito na acatisia.', badgeColor: 'orange' },
  { min: 5, max: 9, severity: 'Acatisia acentuada a grave', clinicalImplication: 'Intervenção imediata. Acatisia grave causa sofrimento intenso, insônia e está associada a agitação, agressividade e comportamento suicida.', badgeColor: 'red' },
];

export const bars: PsychiatricScale = {
  id: 'bars', name: 'Escala de Acatisia de Barnes', acronym: 'Barnes (BARS)', category: 'general', type: 'clinician_administered',
  estimatedMinutes: 5, timeframe: 'Momento do exame', emergency: true,
  description: 'Avaliação da acatisia induzida por antipsicóticos, com componentes objetivo, subjetivo e de sofrimento.',
  instructions: 'Observe o paciente sentado e depois em pé, durante pelo menos 2 minutos em cada posição, em conversa neutra. Pergunte sobre a experiência subjetiva antes de concluir.',
  licenseNote: 'Âncoras em tradução de trabalho a partir do artigo original.',
  scoreLabel: 'Soma dos itens 1 a 3', minScore: 0, maxScore: 9,
  validationInfo: { originalAuthors: 'Barnes TRE', year: 1989, brazilianValidation: 'Tradução de uso corrente em pesquisa no Brasil, sem estudo de validação único de referência.', psychometrics: 'Boa confiabilidade entre avaliadores no estudo original e na revisão de 2003.' },
  about: {
    purposes: ['screening', 'severity', 'monitoring'],
    objective: 'Identificar acatisia, que é subdiagnosticada e frequentemente confundida com ansiedade, agitação psicótica ou piora do quadro de base.',
    targetPopulation: 'Pacientes em uso de antipsicóticos, antieméticos dopaminérgicos e, eventualmente, de antidepressivos.',
    limitations: [
      'A confusão entre acatisia e agitação é o erro mais caro na prática: aumentar o antipsicótico piora a acatisia. Pergunte sempre se a inquietação é sentida por dentro e se piora ao ficar parado.',
      'Movimentos objetivos sem queixa subjetiva configuram pseudoacatisia, não acatisia.',
      'Não diferencia acatisia aguda, tardia e de retirada, que têm condutas diferentes.',
      'Não avalia parkinsonismo nem discinesia tardia: use Simpson-Angus e AIMS em paralelo.',
    ],
    references: [
      'Barnes TRE. A rating scale for drug-induced akathisia. Br J Psychiatry. 1989;154:672-676.',
      'Barnes TRE. The Barnes Akathisia Rating Scale: revisited. J Psychopharmacol. 2003;17(4):365-370.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const total = sumItems(items, a);
    const cutoff = classify(total, cutoffs);
    const g = a.bars_4;
    return {
      total, cutoff, classification: cutoff?.severity ?? 'Sem classificação',
      notes: g !== undefined ? [`Avaliação clínica global: ${g} de 5.${g === 0 && (a.bars_1 ?? 0) > 0 ? ' Movimentos objetivos sem queixa subjetiva configuram pseudoacatisia.' : ''}`] : undefined,
      clinicalAlert: total >= 5 || (g ?? 0) >= 4 ? 'Acatisia acentuada ou grave. Trate hoje: revise a dose do antipsicótico, considere troca para agente de menor risco e introduza tratamento sintomático (propranolol como primeira opção, na ausência de contraindicação). Não interprete a inquietação como piora psicótica nem aumente o antipsicótico. Acatisia grave associa-se a insônia intensa, disforia, agressividade e risco de suicídio: avalie o risco de forma explícita.' : undefined,
    };
  },
};
