/**
 * MDQ: critério composto. Positivo somente quando os TRÊS critérios são satisfeitos:
 *  (1) 7 ou mais respostas "Sim" nos 13 sintomas, (2) coocorrência no mesmo período, (3) prejuízo moderado ou sério.
 */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { YES_NO } from '../../lib/options';
import { sumItems } from '../../lib/scoring';

const STEM = 'Já houve algum período em que você não estava no seu jeito habitual e... ';
const symptoms = [
  'você se sentiu tão bem ou tão eufórico(a) que outras pessoas acharam que você não estava no seu normal, ou ficou tão eufórico(a) que se meteu em problemas?',
  'ficou tão irritado(a) que gritou com pessoas ou começou brigas ou discussões?',
  'sentiu-se muito mais autoconfiante que o habitual?',
  'dormiu muito menos que o habitual e não sentiu falta do sono?',
  'ficou muito mais falante ou falou muito mais rápido que o habitual?',
  'os pensamentos corriam pela sua cabeça ou você não conseguia desacelerar a mente?',
  'distraía-se tão facilmente com as coisas ao redor que tinha dificuldade de se concentrar ou de manter o foco?',
  'teve muito mais energia que o habitual?',
  'ficou muito mais ativo(a) ou fez muito mais coisas que o habitual?',
  'ficou muito mais sociável ou extrovertido(a) que o habitual (por exemplo, telefonou para amigos no meio da noite)?',
  'ficou muito mais interessado(a) em sexo que o habitual?',
  'fez coisas que eram incomuns para você ou que outras pessoas poderiam considerar excessivas, tolas ou arriscadas?',
  'gastou dinheiro a ponto de trazer problemas para você ou para sua família?',
];

const anyTwoYes = (a: Record<string, number>) => symptoms.filter((_, i) => a[`mdq_${i + 1}`] === 1).length >= 2;

const items: ScaleItem[] = [
  ...symptoms.map<ScaleItem>((t, i) => ({ id: `mdq_${i + 1}`, number: i + 1, text: STEM + t, options: YES_NO, section: 'Pergunta 1: sintomas' })),
  { id: 'mdq_co', number: 14, text: 'Se você marcou "Sim" em mais de um dos itens acima, vários deles aconteceram durante o mesmo período?', options: YES_NO, scored: false, section: 'Perguntas 2 e 3: coocorrência e prejuízo', showIf: anyTwoYes },
  {
    id: 'mdq_imp', number: 15, scored: false, section: 'Perguntas 2 e 3: coocorrência e prejuízo', showIf: anyTwoYes,
    text: 'Quanto problema esses comportamentos lhe causaram (incapacidade de trabalhar; problemas familiares, financeiros ou legais; discussões ou brigas)?',
    options: [{ label: 'Nenhum problema', value: 0 }, { label: 'Problema pequeno', value: 1 }, { label: 'Problema moderado', value: 2 }, { label: 'Problema sério', value: 3 }],
  },
];

const cutoffs: CutoffRange[] = [
  { min: 0, max: 6, severity: 'Rastreio negativo', clinicalImplication: 'Menos de 7 sintomas. Não exclui transtorno bipolar, sobretudo tipo II.', badgeColor: 'green' },
  { min: 7, max: 13, severity: '7 ou mais sintomas', clinicalImplication: 'Só é rastreio positivo se também houver coocorrência dos sintomas e prejuízo moderado ou sério.', badgeColor: 'orange' },
];

export const mdq: PsychiatricScale = {
  id: 'mdq', name: 'Mood Disorder Questionnaire', acronym: 'MDQ', category: 'mood', type: 'self_administered',
  estimatedMinutes: 5, timeframe: 'Ao longo da vida',
  description: 'Rastreio de história de sintomas maníacos ou hipomaníacos ao longo da vida.',
  instructions: 'Responda "Sim" ou "Não" para cada pergunta, pensando em qualquer período da sua vida.',
  scoreLabel: 'Sintomas assinalados', minScore: 0, maxScore: 13,
  validationInfo: {
    originalAuthors: 'Hirschfeld RMA, Williams JBW, Spitzer RL, et al.', year: 2000,
    brazilianValidation: 'Castelo MS, Carvalho ER, Gerhard ES, et al., 2010 (população psiquiátrica, Fortaleza).',
    psychometrics: 'Alfa de Cronbach 0,90 no estudo original.',
  },
  about: {
    purposes: ['screening'],
    objective: 'Identificar pacientes, em especial os deprimidos, que precisam de investigação dirigida de transtorno do espectro bipolar.',
    targetPopulation: 'Adultos em ambulatório de psiquiatria ou atenção primária. Autoaplicável.',
    accuracy: [
      { cutoff: 'Critério completo (ambulatório psiquiátrico)', sensitivity: '73%', specificity: '90%', source: 'Hirschfeld et al., 2000' },
      { cutoff: 'Critério completo (população geral)', sensitivity: '28%', specificity: '97%', source: 'Hirschfeld et al., 2003' },
    ],
    limitations: [
      'Sensibilidade baixa para transtorno bipolar tipo II e em população geral. Muitos serviços flexibilizam o critério de prejuízo para aumentar a detecção.',
      'Falsos positivos frequentes em transtorno de personalidade borderline, TDAH, TEPT e uso de substâncias.',
      'Depende de insight e memória de episódios passados. Informante colateral melhora a acurácia.',
      'Rastreio positivo indica necessidade de entrevista clínica longitudinal, não diagnóstico.',
    ],
    references: [
      'Hirschfeld RMA, Williams JBW, Spitzer RL, et al. Development and validation of a screening instrument for bipolar spectrum disorder: the Mood Disorder Questionnaire. Am J Psychiatry. 2000;157(11):1873-1875.',
      'Hirschfeld RMA, Holzer C, Calabrese JR, et al. Validity of the Mood Disorder Questionnaire: a general population study. Am J Psychiatry. 2003;160(1):178-180.',
      'Castelo MS, Carvalho ER, Gerhard ES, et al. Validity of the Mood Disorder Questionnaire in a Brazilian psychiatric population. Braz J Psychiatry. 2010;32(4):424-428.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const total = sumItems(items, a);
    const c1 = total >= 7, c2 = a.mdq_co === 1, c3 = (a.mdq_imp ?? 0) >= 2;
    const positive = c1 && c2 && c3;
    return {
      total,
      cutoff: positive ? { ...cutoffs[1], severity: 'Rastreio positivo', badgeColor: 'red' } : c1 ? cutoffs[1] : cutoffs[0],
      classification: positive ? 'Rastreio positivo para espectro bipolar' : 'Rastreio negativo',
      notes: [
        `Critério 1 (7 ou mais sintomas): ${c1 ? 'atendido' : 'não atendido'} (${total}/13).`,
        `Critério 2 (sintomas no mesmo período): ${c2 ? 'atendido' : 'não atendido'}.`,
        `Critério 3 (prejuízo moderado ou sério): ${c3 ? 'atendido' : 'não atendido'}.`,
      ],
    };
  },
};
