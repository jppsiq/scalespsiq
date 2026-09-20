/** MADRS: âncoras definidas nos graus pares (0, 2, 4, 6). Os ímpares são graus intermediários. */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { simpleSum, triggeredRedFlags, SUICIDE_PROTOCOL } from '../../lib/scoring';

const raw: [string, string, [string, string, string, string]][] = [
  ['Tristeza aparente', 'Desânimo, tristeza e desespero refletidos na fala, na expressão facial e na postura. Pontue pela profundidade e pela incapacidade de se animar.', ['Nenhuma tristeza.', 'Parece abatido, mas anima-se sem dificuldade.', 'Parece triste e infeliz a maior parte do tempo.', 'Parece muito triste todo o tempo. Extremamente desanimado.']],
  ['Tristeza relatada', 'Relato de humor deprimido, independentemente de transparecer. Inclui abatimento, desânimo, sensação de desamparo e desesperança.', ['Tristeza ocasional, de acordo com as circunstâncias.', 'Triste ou abatido, mas anima-se sem dificuldade.', 'Sentimentos persistentes de tristeza ou melancolia. O humor ainda é influenciado por circunstâncias externas.', 'Tristeza, miséria ou desânimo contínuos e invariáveis.']],
  ['Tensão interior', 'Desconforto mal definido, irritabilidade, inquietação interna, tensão mental que chega a pânico, pavor ou angústia.', ['Plácido. Apenas tensão interior passageira.', 'Sentimentos ocasionais de irritabilidade e desconforto mal definido.', 'Sentimentos contínuos de tensão interior ou pânico intermitente, que o paciente só domina com alguma dificuldade.', 'Pavor ou angústia implacáveis. Pânico avassalador.']],
  ['Sono reduzido', 'Redução da duração ou da profundidade do sono em comparação com o padrão habitual do paciente.', ['Dorme como de costume.', 'Leve dificuldade para adormecer, ou sono levemente reduzido, leve ou entrecortado.', 'Sono reduzido ou interrompido por pelo menos duas horas.', 'Menos de duas ou três horas de sono.']],
  ['Apetite reduzido', 'Perda de apetite em comparação com o habitual. Pontue pela perda do desejo de comer ou pela necessidade de se forçar a comer.', ['Apetite normal ou aumentado.', 'Apetite levemente reduzido.', 'Sem apetite. A comida não tem sabor.', 'Precisa ser persuadido a comer.']],
  ['Dificuldades de concentração', 'Dificuldade de organizar os pensamentos, chegando à falta incapacitante de concentração.', ['Sem dificuldades de concentração.', 'Dificuldades ocasionais em organizar os pensamentos.', 'Dificuldade para se concentrar e sustentar o pensamento, que reduz a capacidade de ler ou de manter uma conversa.', 'Incapaz de ler ou conversar sem grande dificuldade.']],
  ['Lassidão', 'Dificuldade ou lentidão para iniciar e executar as atividades do dia a dia.', ['Quase nenhuma dificuldade para começar. Sem lentidão.', 'Dificuldades para iniciar atividades.', 'Dificuldades para iniciar atividades rotineiras simples, que são executadas com esforço.', 'Lassidão completa. Incapaz de fazer qualquer coisa sem ajuda.']],
  ['Incapacidade de sentir', 'Experiência subjetiva de interesse reduzido pelo ambiente ou por atividades que normalmente dão prazer. Capacidade reduzida de reagir com emoção adequada.', ['Interesse normal pelo ambiente e pelas pessoas.', 'Capacidade reduzida de desfrutar dos interesses habituais.', 'Perda de interesse pelo ambiente. Perda de sentimentos por amigos e conhecidos.', 'Sente-se emocionalmente paralisado, incapaz de sentir raiva, pesar ou prazer, com falha completa ou mesmo dolorosa em sentir algo por parentes próximos e amigos.']],
  ['Pensamentos pessimistas', 'Pensamentos de culpa, inferioridade, autorreprovação, pecado, remorso e ruína.', ['Sem pensamentos pessimistas.', 'Ideias flutuantes de fracasso, autorreprovação ou autodepreciação.', 'Autoacusações persistentes, ou ideias definidas, mas ainda racionais, de culpa ou pecado. Pessimismo crescente sobre o futuro.', 'Delírios de ruína, remorso ou pecado irremediável. Autoacusações absurdas e inabaláveis.']],
  ['Pensamentos suicidas', 'Sentimento de que não vale a pena viver, de que uma morte natural seria bem-vinda, pensamentos suicidas e preparativos. Tentativas em si não influenciam a pontuação.', ['Aprecia a vida ou a aceita como ela é.', 'Cansado da vida. Pensamentos suicidas apenas passageiros.', 'Acha que provavelmente seria melhor estar morto. Pensamentos suicidas frequentes e suicídio considerado solução possível, mas sem planos ou intenção específicos.', 'Planos explícitos de suicídio para quando houver oportunidade. Preparativos ativos.']],
];

const items: ScaleItem[] = raw.map(([text, hint, a], i) => ({
  id: `madrs_${i + 1}`, number: i + 1, text, hint,
  options: [0, 1, 2, 3, 4, 5, 6].map((v) => ({ label: String(v), value: v, description: v % 2 === 0 ? a[v / 2] : undefined })),
  ...(i === 9 ? { isRedFlagTrigger: true, redFlagThreshold: 2 } : {}),
}));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 6, severity: 'Sem depressão / remissão', clinicalImplication: 'Remissão costuma ser definida como ≤ 10 (ou ≤ 12) em ensaios clínicos.', badgeColor: 'green' },
  { min: 7, max: 19, severity: 'Depressão leve', clinicalImplication: 'Sintomas leves.', badgeColor: 'yellow' },
  { min: 20, max: 34, severity: 'Depressão moderada', clinicalImplication: 'Tratamento ativo indicado.', badgeColor: 'orange' },
  { min: 35, max: 60, severity: 'Depressão grave', clinicalImplication: 'Avaliar risco, sintomas psicóticos e necessidade de tratamento intensivo.', badgeColor: 'red' },
];

export const madrs: PsychiatricScale = {
  id: 'madrs', name: 'Montgomery-Åsberg Depression Rating Scale', acronym: 'MADRS', category: 'mood', type: 'clinician_administered',
  estimatedMinutes: 20, timeframe: 'Última semana',
  description: 'Gravidade de depressão em 10 itens centrados no núcleo afetivo e cognitivo, sensível à mudança com o tratamento.',
  instructions: 'Pontue com base em entrevista clínica, partindo de perguntas amplas para perguntas detalhadas. Os graus 0, 2, 4 e 6 têm âncora descritiva. Use 1, 3 e 5 quando o quadro ficar entre duas âncoras.',
  licenseNote: 'Âncoras em tradução de trabalho. Para uso formal utilize a versão em português publicada (Dratcu, Ribeiro e Calil, 1987) e, de preferência, o guia de entrevista estruturada SIGMA.',
  minScore: 0, maxScore: 60,
  validationInfo: { originalAuthors: 'Montgomery SA, Åsberg M', year: 1979, brazilianValidation: 'Dratcu L, Ribeiro LC, Calil HM, 1987.', psychometrics: 'Confiabilidade entre avaliadores de 0,89 a 0,97 no estudo original.' },
  about: {
    purposes: ['severity', 'monitoring'],
    objective: 'Medir a gravidade do episódio depressivo e a resposta ao tratamento (redução ≥ 50%).',
    targetPopulation: 'Adultos com depressão diagnosticada. Heteroaplicável.',
    limitations: ['Não é instrumento diagnóstico.', 'Não avalia sintomas atípicos (hipersonia, hiperfagia), retardo psicomotor nem ansiedade somática.', 'As faixas de gravidade (Snaith et al., 1986) são convenções e variam entre autores.'],
    references: ['Montgomery SA, Åsberg M. A new depression scale designed to be sensitive to change. Br J Psychiatry. 1979;134:382-389.', 'Snaith RP, Harrop FM, Newby DA, Teale C. Grade scores of the Montgomery-Åsberg Depression and the Clinical Anxiety Scales. Br J Psychiatry. 1986;148:599-601.', 'Dratcu L, Ribeiro LC, Calil HM. Depression assessment in Brazil: the first application of the Montgomery-Åsberg Depression Rating Scale. Br J Psychiatry. 1987;150:797-800.'],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const r = simpleSum(items, cutoffs, a);
    return { ...r, clinicalAlert: triggeredRedFlags(items, a).length ? `Item 10 (pensamentos suicidas) com pontuação ≥ 2. ${SUICIDE_PROTOCOL}` : undefined };
  },
};
