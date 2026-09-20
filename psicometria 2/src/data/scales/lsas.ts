/** LSAS: 24 situações avaliadas em duas dimensões (medo e evitação), gerando 48 pontuações. */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { anchored } from '../../lib/options';
import { simpleSum } from '../../lib/scoring';

const MEDO = anchored(['Nenhum.', 'Leve.', 'Moderado.', 'Grave.']);
const EVIT = anchored(['Nunca (0%).', 'Ocasionalmente (1 a 33%).', 'Com frequência (34 a 66%).', 'Habitualmente (67 a 100%).']);

// [situação, é situação de desempenho?]
const sit: [string, boolean][] = [
  ['Usar o telefone em público', true], ['Participar de pequenos grupos', false], ['Comer em locais públicos', true],
  ['Beber na companhia de outras pessoas em locais públicos', true], ['Falar com pessoas que representam autoridade', false],
  ['Atuar, representar ou dar uma palestra diante de uma plateia', true], ['Ir a uma festa', false],
  ['Trabalhar sendo observado(a)', true], ['Escrever sendo observado(a)', true], ['Telefonar para alguém que não conhece bem', false],
  ['Conversar com pessoas que não conhece bem', false], ['Encontrar-se com estranhos', false], ['Urinar em banheiro público', true],
  ['Entrar numa sala quando as outras pessoas já estão sentadas', true], ['Ser o centro das atenções', false],
  ['Falar em uma reunião', true], ['Fazer uma prova ou um teste', true], ['Expressar desagrado ou desaprovação a pessoas que não conhece bem', false],
  ['Olhar nos olhos de pessoas que não conhece bem', false], ['Fazer um relato a um grupo', true],
  ['Tentar conquistar alguém', false], ['Devolver mercadorias a uma loja', false], ['Dar uma festa', false],
  ['Resistir à pressão de um vendedor insistente', false],
];
const items: ScaleItem[] = sit.flatMap(([s, perf], i) => [
  { id: `lsas_m${i + 1}`, number: i * 2 + 1, text: `${s} — medo ou ansiedade`, options: MEDO, subscale: perf ? 'medoDesempenho' : 'medoSocial', section: 'Avalie cada situação em duas dimensões, considerando a última semana' },
  { id: `lsas_e${i + 1}`, number: i * 2 + 2, text: `${s} — esquiva`, options: EVIT, subscale: perf ? 'evitDesempenho' : 'evitSocial' },
]);

const cutoffs: CutoffRange[] = [
  { min: 0, max: 29, severity: 'Fobia social improvável', clinicalImplication: 'Ansiedade social dentro do esperado.', badgeColor: 'green' },
  { min: 30, max: 49, severity: 'Fobia social leve', clinicalImplication: 'Sintomas presentes com prejuízo limitado.', badgeColor: 'yellow' },
  { min: 50, max: 64, severity: 'Fobia social moderada', clinicalImplication: 'Ponto de corte habitual de indicação de tratamento. Terapia cognitivo-comportamental com exposição e ISRS são as opções de primeira linha.', badgeColor: 'orange' },
  { min: 65, max: 79, severity: 'Fobia social acentuada', clinicalImplication: 'Prejuízo social e profissional evidente. Avaliar comorbidade com depressão e uso de álcool.', badgeColor: 'red' },
  { min: 80, max: 144, severity: 'Fobia social grave a muito grave', clinicalImplication: 'Faixa da forma generalizada, com esquiva ampla. Tratamento combinado e seguimento próximo.', badgeColor: 'red' },
];

export const lsas: PsychiatricScale = {
  id: 'lsas', name: 'Escala de Ansiedade Social de Liebowitz', acronym: 'LSAS', category: 'anxiety', type: 'clinician_administered',
  estimatedMinutes: 20, timeframe: 'Última semana',
  description: 'Vinte e quatro situações sociais e de desempenho, pontuadas quanto ao medo e à esquiva.',
  instructions: 'Para cada situação, pontue o medo ou a ansiedade e, em seguida, a frequência da esquiva na última semana. Se o paciente evita a situação há muito tempo, peça que imagine como se sentiria se a enfrentasse hoje.',
  minScore: 0, maxScore: 144,
  subscales: [
    { key: 'medoSocial', label: 'Medo em situações de interação social', max: 33 }, { key: 'evitSocial', label: 'Esquiva de interação social', max: 33 },
    { key: 'medoDesempenho', label: 'Medo em situações de desempenho', max: 39 }, { key: 'evitDesempenho', label: 'Esquiva de desempenho', max: 39 },
  ],
  licenseNote: 'Uso livre para fins clínicos e de pesquisa. Itens em tradução de trabalho: a versão brasileira é a de Santos, Loureiro e Crippa (2013).',
  validationInfo: { originalAuthors: 'Liebowitz MR', year: 1987, brazilianValidation: 'Santos LF, Loureiro SR, Crippa JAS, Osório FL, 2013.', psychometrics: 'Consistência interna alta (alfa acima de 0,90) e boa sensibilidade à mudança com o tratamento.' },
  about: {
    purposes: ['severity', 'monitoring', 'screening'],
    objective: 'Medir gravidade da ansiedade social e acompanhar resposta. A redução de 30% ou mais no escore total costuma definir resposta ao tratamento.',
    targetPopulation: 'Adolescentes e adultos com transtorno de ansiedade social. Aplicada por entrevista; existe versão de autorrelato com desempenho semelhante.',
    accuracy: [{ cutoff: '≥ 30', sensitivity: 'alta', specificity: 'moderada', source: 'Rytwinski et al., 2009 (corte de triagem)' }],
    limitations: [
      'Não diferencia ansiedade social de transtorno de personalidade esquiva, de TEA nem de ansiedade secundária a sintomas psicóticos.',
      'Quem evita uma situação há anos pode subestimar o medo por falta de exposição recente: pergunte sobre a expectativa.',
      'Situações da lista podem não fazer parte da rotina do paciente (por exemplo, dar uma festa ou fazer provas), o que reduz o escore artificialmente.',
      'A separação entre subescalas social e de desempenho não é sustentada de forma consistente por análises fatoriais.',
    ],
    references: [
      'Liebowitz MR. Social phobia. Mod Probl Pharmacopsychiatry. 1987;22:141-173.',
      'Santos LF, Loureiro SR, Crippa JAS, Osório FL. Psychometric validation study of the Liebowitz Social Anxiety Scale: self-reported version, Brazilian Portuguese. Trends Psychiatry Psychother. 2013;35(4):270-276.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const r = simpleSum(items, cutoffs, a);
    const s = r.subscores ?? {};
    return { ...r, notes: [`Medo total: ${(s.medoSocial ?? 0) + (s.medoDesempenho ?? 0)}/72. Esquiva total: ${(s.evitSocial ?? 0) + (s.evitDesempenho ?? 0)}/72.`] };
  },
};
