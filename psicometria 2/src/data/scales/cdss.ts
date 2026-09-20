import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { anchored } from '../../lib/options';
import { simpleSum, triggeredRedFlags, SUICIDE_PROTOCOL } from '../../lib/scoring';

const raw: [string, string, string[]][] = [
  ['Depressão', 'Como você descreveria seu humor nas últimas duas semanas? Consegue mudar de humor quando algo bom acontece?', ['Ausente.', 'Leve: expressa alguma tristeza ou desânimo quando questionado.', 'Moderada: humor deprimido nítido, persistindo por até metade do tempo nas últimas 2 semanas, presente diariamente.', 'Grave: humor marcadamente deprimido, persistindo diariamente por mais da metade do tempo, interferindo no funcionamento motor e social normal.']],
  ['Desesperança', 'Como você vê o seu futuro? Consegue ver alguma saída?', ['Ausente.', 'Leve: em alguns momentos sente desesperança nas últimas 2 semanas, mas ainda tem algum grau de esperança para o futuro.', 'Moderada: desesperança persistente, mas moderada.', 'Grave: sentimento persistente e angustiante de desesperança.']],
  ['Autodepreciação', 'Qual é a sua opinião sobre você mesmo comparado a outras pessoas? Sente-se melhor, pior ou igual aos outros?', ['Ausente.', 'Leve: leve inferioridade, sem se sentir sem valor.', 'Moderada: sente-se sem valor, mas em menos de 50% do tempo.', 'Grave: sente-se sem valor em mais de 50% do tempo. Pode ser desafiado a reconhecer o contrário.']],
  ['Ideias de referência com culpa', 'Você tem a impressão de estar sendo culpado por algo, ou de que as pessoas o culpam sem razão?', ['Ausente.', 'Leve: sente-se culpado por algo pequeno, mas menos de 50% do tempo.', 'Moderada: geralmente (mais de 50% do tempo) sente-se culpado por atos passados cuja importância exagera.', 'Grave: geralmente se sente culpado, em grau delirante, e pode espontaneamente verbalizar: "sou mau, sou a causa de tudo".']],
  ['Culpa patológica', 'Você tende a se culpar por coisas pequenas que possa ter feito no passado? Acha que merece estar tão preocupado com isso?', ['Ausente.', 'Leve: o paciente às vezes se sente exageradamente culpado por alguma falta menor, mas por menos de 50% do tempo.', 'Moderada: em geral (mais de 50% do tempo) sente-se culpado por ações passadas cujo significado exagera.', 'Grave: geralmente se sente culpado, em grau delirante.']],
  ['Depressão matinal', 'Quando você se sente pior no dia, de manhã ou à noite?', ['Ausente: nenhuma variação diurna.', 'Leve: variação diurna presente, mas não todos os dias.', 'Moderada: variação diurna presente em mais da metade dos dias.', 'Grave: variação diurna presente todos os dias.']],
  ['Despertar precoce', 'Você acorda mais cedo de manhã do que o normal para você? Quantas vezes por semana?', ['Ausente: sem despertar precoce.', 'Leve: acorda ocasionalmente (até duas vezes por semana) 1 hora ou mais antes do horário habitual.', 'Moderada: acorda frequentemente (até 5 vezes por semana) 1 hora ou mais antes do habitual.', 'Grave: acorda diariamente 1 hora ou mais antes do horário habitual.']],
  ['Suicídio', 'Você sentiu que a vida não valia a pena? Pensou em acabar com tudo? O que pensou em fazer?', ['Ausente.', 'Leve: pensamentos frequentes de que seria melhor estar morto, ou pensamentos ocasionais de suicídio.', 'Moderada: considerou deliberadamente o suicídio, com um plano, mas não fez tentativa.', 'Grave: tentativa de suicídio aparentemente planejada para não ser descoberto, ou tentativa com intenção clara de morrer.']],
  ['Depressão observada', 'Baseada na observação durante toda a entrevista. Pergunte: "Você sente vontade de chorar?"', ['Ausente.', 'Leve: o paciente parece triste e com a voz melancólica.', 'Moderada: o paciente parece triste durante toda a entrevista, com voz monótona, e chora ou está à beira das lágrimas em alguns momentos.', 'Grave: o paciente engasga ao falar de temas dolorosos, suspira profundamente com frequência e chora abertamente, ou está persistentemente num estado de congelamento e embotamento se a conversa for de tom mais leve.']],
];
const items: ScaleItem[] = raw.map(([text, hint, d], i) => ({ id: `cdss_${i + 1}`, number: i + 1, text, hint, options: anchored(d), ...(i === 7 ? { isRedFlagTrigger: true } : {}) }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 6, severity: 'Abaixo do ponto de corte', clinicalImplication: 'Episódio depressivo maior menos provável. Sintomas negativos e parkinsonismo podem estar mimetizando depressão: avalie com Simpson-Angus e com escala de sintomas negativos.', badgeColor: 'green' },
  { min: 7, max: 27, severity: 'Episódio depressivo provável', clinicalImplication: 'Escore acima de 6 prediz a presença de episódio depressivo maior com boa especificidade. Avalie risco de suicídio, que é elevado na esquizofrenia, e considere tratamento antidepressivo, revisão do antipsicótico e psicoterapia.', badgeColor: 'red' },
];

export const cdss: PsychiatricScale = {
  id: 'cdss', name: 'Escala Calgary de Depressão para Esquizofrenia', acronym: 'Calgary (CDSS)', category: 'psychosis', type: 'clinician_administered',
  estimatedMinutes: 15, timeframe: 'Últimas 2 semanas',
  description: 'Escala construída para medir depressão na esquizofrenia sem confundi-la com sintomas negativos ou com efeitos extrapiramidais.',
  instructions: 'Os oito primeiros itens são pontuados pelo relato do paciente; o nono, pela observação durante toda a entrevista. Use as perguntas indicadas e depois aprofunde conforme necessário.',
  licenseNote: 'Uso livre para fins clínicos e de pesquisa. Itens em tradução de trabalho: a versão brasileira validada é a de Bressan et al. (1998).',
  minScore: 0, maxScore: 27,
  validationInfo: { originalAuthors: 'Addington D, Addington J, Schissel B', year: 1990, brazilianValidation: 'Bressan RA, Chaves AC, Shirakawa I, de Mari J, 1998.', psychometrics: 'Alfa de Cronbach em torno de 0,79 a 0,85 nos estudos de validação.' },
  about: {
    purposes: ['screening', 'severity', 'monitoring'],
    objective: 'Separar depressão de sintomas negativos e de parkinsonismo em pacientes com esquizofrenia, situação em que HAM-D e BDI apresentam desempenho ruim.',
    targetPopulation: 'Pacientes com esquizofrenia ou transtorno esquizoafetivo, em qualquer fase. Heteroaplicável.',
    accuracy: [{ cutoff: '> 6', sensitivity: '82%', specificity: '89%', source: 'Addington et al., 1994' }],
    limitations: [
      'Não exclui a sobreposição com apatia e anedonia dos sintomas negativos: use também uma escala de sintomas negativos.',
      'Não avalia sintomas somáticos nem neurovegetativos de modo abrangente.',
      'Em fase aguda de psicose, o relato pode ser pouco confiável por desorganização ou baixo insight.',
    ],
    references: [
      'Addington D, Addington J, Schissel B. A depression rating scale for schizophrenics. Schizophr Res. 1990;3(4):247-251.',
      'Addington D, Addington J, Maticka-Tyndale E. Specificity of the Calgary Depression Scale for schizophrenics. Schizophr Res. 1994;11(3):239-244.',
      'Bressan RA, Chaves AC, Shirakawa I, de Mari J. Validity study of the Brazilian version of the Calgary Depression Scale for Schizophrenia. Schizophr Res. 1998;32(1):41-49.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const r = simpleSum(items, cutoffs, a);
    return { ...r, clinicalAlert: triggeredRedFlags(items, a).length ? `Item 8 (suicídio) positivo. ${SUICIDE_PROTOCOL} O risco de suicídio na esquizofrenia é mais alto no período pós-alta, no início da doença e quando há bom insight com desesperança.` : undefined };
  },
};
