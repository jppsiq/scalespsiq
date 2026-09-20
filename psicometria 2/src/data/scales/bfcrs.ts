/** Bush-Francis (instrumento de rastreio, 14 itens): o corte é a CONTAGEM de itens presentes, não a soma. */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { anchored } from '../../lib/options';
import { classify, countAtOrAbove, sumItems } from '../../lib/scoring';

const raw: [string, string, string[]][] = [
  ['Excitação', 'Atividade motora extrema e sem propósito, não atribuível à acatisia ou à agitação dirigida a um objetivo.', ['Ausente.', 'Inquietação excessiva, movimentos intermitentes.', 'Movimentos frequentes e sem propósito, com verbalização aumentada.', 'Excitação constante, atividade motora incessante.']],
  ['Imobilidade ou estupor', 'Hipoatividade extrema, mobilidade mínima, ausência de resposta a estímulos.', ['Ausente.', 'Sentado imóvel, pouco responsivo a perguntas.', 'Praticamente sem movimento, quase sem resposta.', 'Estupor, ausência de resposta a estímulos dolorosos.']],
  ['Mutismo', 'Ausência ou redução acentuada da resposta verbal.', ['Ausente.', 'Fala verbalmente reduzida, responde em poucas palavras.', 'Fala menos de 20 palavras em 5 minutos.', 'Ausência de fala.']],
  ['Olhar fixo', 'Olhar fixo, com redução do piscamento e do rastreamento visual.', ['Ausente.', 'Contato ocular pobre, olhar desviado por menos de 20 segundos por vez, piscamento reduzido.', 'Olhar fixo por mais de 20 segundos por vez, desviando o olhar ocasionalmente.', 'Olhar fixo, sem desviar, não redirecionável.']],
  ['Postura ou catalepsia', 'Manutenção espontânea de postura, inclusive posturas incomuns.', ['Ausente.', 'Postura mantida por menos de 1 minuto.', 'Postura mantida por mais de 1 minuto e menos de 15 minutos.', 'Postura bizarra mantida por mais de 15 minutos.']],
  ['Careteamento (grimacing)', 'Manutenção de expressões faciais incomuns.', ['Ausente.', 'Por menos de 10 segundos.', 'Por mais de 10 segundos.', 'Expressões bizarras ou mantidas.']],
  ['Ecopraxia ou ecolalia', 'Imitação dos movimentos ou da fala do examinador.', ['Ausente.', 'Ocasional.', 'Frequente.', 'Constante.']],
  ['Estereotipia', 'Atividade motora repetitiva, sem propósito, não dirigida a um objetivo.', ['Ausente.', 'Ocasional.', 'Frequente.', 'Constante.']],
  ['Maneirismo', 'Movimentos estranhos e circunstanciais, caricaturas de ações comuns e dirigidas a um fim.', ['Ausente.', 'Ocasional.', 'Frequente.', 'Constante.']],
  ['Verbigeração', 'Repetição de frases ou sentenças, como um disco riscado.', ['Ausente.', 'Ocasional.', 'Frequente, difícil de interromper.', 'Constante.']],
  ['Rigidez', 'Manutenção de postura rígida apesar do esforço para mobilizar; não pontuar se houver roda denteada ou tremor.', ['Ausente.', 'Resistência leve.', 'Resistência moderada.', 'Resistência grave, impossibilidade de mobilização.']],
  ['Negativismo', 'Resistência aparentemente sem motivo a instruções ou a tentativas de mobilizar o paciente.', ['Ausente.', 'Resistência leve, ocasionalmente contrário.', 'Resistência moderada e consistente.', 'Resistência grave e contínua.']],
  ['Flexibilidade cérea', 'Durante a mobilização, o paciente oferece resistência inicial semelhante à de uma vela sendo dobrada.', ['Ausente.', 'Presente.', 'Presente.', 'Presente.']],
  ['Retraimento (withdrawal)', 'Recusa a comer, beber ou manter contato visual.', ['Ausente.', 'Ingesta ou contato visual mínimos por menos de um dia.', 'Ingesta ou contato visual mínimos por mais de um dia.', 'Ausência de ingesta oral por mais de um dia.']],
];
const items: ScaleItem[] = raw.map(([text, hint, d], i) => ({ id: `bf_${i + 1}`, number: i + 1, text, hint, options: anchored(d) }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 1, severity: 'Rastreio negativo', clinicalImplication: 'Nenhum ou apenas um sinal presente. Reavalie se houver mudança do quadro: a catatonia é frequentemente intermitente.', badgeColor: 'green' },
  { min: 2, max: 42, severity: 'Rastreio positivo', clinicalImplication: 'Dois ou mais sinais presentes entre os 14 itens de rastreio. Aplique a escala completa (23 itens), investigue causa clínica e neurológica e considere a prova terapêutica com lorazepam.', badgeColor: 'red' },
];

export const bfcrs: PsychiatricScale = {
  id: 'bfcrs', name: 'Instrumento de Rastreio de Catatonia de Bush-Francis', acronym: 'Bush-Francis (BFCSI)', category: 'psychosis', type: 'clinician_administered',
  estimatedMinutes: 10, timeframe: 'Momento do exame', emergency: true,
  description: 'Os 14 primeiros itens da escala de Bush-Francis, usados como rastreio de catatonia à beira do leito.',
  instructions: 'Roteiro de exame: observe o paciente enquanto tenta uma conversa; examine o movimento do braço buscando roda denteada e flexibilidade cérea; teste a postura pedindo ao paciente que estenda o braço; coce a cabeça de modo exagerado observando ecopraxia; examine o reflexo glabelar; estenda a mão dizendo "não aperte minha mão"; verifique sinais vitais. Pontue apenas o que for observado ou documentado nas últimas 24 horas.',
  licenseNote: 'Uso livre em ambiente clínico e de pesquisa. Âncoras em tradução de trabalho. O rastreio positivo deve ser seguido da escala completa de 23 itens.',
  scoreLabel: 'Soma dos 14 itens', minScore: 0, maxScore: 42,
  subscales: [{ key: 'presentes', label: 'Itens presentes (critério de rastreio: 2 ou mais)', max: 14 }],
  validationInfo: { originalAuthors: 'Bush G, Fink M, Petrides G, Dowling F, Francis A', year: 1996, brazilianValidation: 'Tradução de uso corrente. Sem estudo brasileiro de validação de referência.', psychometrics: 'Confiabilidade entre avaliadores alta no estudo original (kappa de 0,93 para a presença de catatonia).' },
  about: {
    purposes: ['screening', 'severity', 'monitoring'],
    objective: 'Detectar catatonia, síndrome frequentemente não reconhecida e potencialmente letal, e acompanhar a resposta ao tratamento.',
    targetPopulation: 'Pacientes com imobilidade, mutismo, negativismo, excitação inexplicada ou alteração comportamental aguda, em qualquer diagnóstico de base.',
    limitations: [
      'A catatonia é sindrômica, não diagnóstica: ocorre em transtornos do humor (a causa mais comum), psicoses, autismo, encefalites autoimunes, doenças metabólicas e neurológicas. A investigação orgânica é obrigatória.',
      'Rigidez com febre, instabilidade autonômica e elevação de CPK sugere catatonia maligna ou síndrome neuroléptica maligna, ambas emergências. Antipsicóticos podem precipitar ou agravar esses quadros.',
      'Sinais flutuam ao longo do dia: um exame isolado normal não afasta o diagnóstico.',
      'Retraimento e recusa alimentar exigem avaliação imediata de hidratação, nutrição, trombose venosa e broncoaspiração.',
    ],
    references: [
      'Bush G, Fink M, Petrides G, Dowling F, Francis A. Catatonia. I. Rating scale and standardized examination. Acta Psychiatr Scand. 1996;93(2):129-136.',
      'Sienaert P, Dhossche DM, Vancampfort D, De Hert M, Gazdag G. A clinical review of the treatment of catatonia. Front Psychiatry. 2014;5:181.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const n = countAtOrAbove(items, a, () => 1);
    const cutoff = classify(n, cutoffs);
    const answered = items.some((it) => a[it.id] !== undefined);
    return {
      total: sumItems(items, a), cutoff, subscores: { presentes: n },
      classification: cutoff?.severity ?? 'Sem classificação',
      notes: [`${n} de 14 sinais presentes (critério de rastreio: 2 ou mais).`],
      clinicalAlert: n >= 2 && answered ? 'Rastreio de catatonia positivo. Aplique a escala completa de 23 itens e investigue causa clínica e neurológica: exames laboratoriais com CPK e eletrólitos, neuroimagem, e punção lombar ou eletroencefalograma conforme a suspeita. Avalie hidratação, nutrição, risco de trombose venosa e de broncoaspiração. A prova terapêutica com lorazepam é diagnóstica e terapêutica; a eletroconvulsoterapia é o tratamento de escolha nos casos graves e na catatonia maligna. Reavalie a indicação de antipsicóticos, que podem agravar o quadro. Rigidez com febre, disautonomia e CPK elevada configuram emergência.' : undefined,
    };
  },
};
