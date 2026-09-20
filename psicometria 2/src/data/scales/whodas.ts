/** WHODAS 2.0, versão de 12 itens, pontuação simples (soma bruta convertida em percentual). */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { anchored } from '../../lib/options';
import { classify, sumItems } from '../../lib/scoring';

const OPT = anchored(['Nenhuma dificuldade.', 'Dificuldade leve.', 'Dificuldade moderada.', 'Dificuldade grave.', 'Dificuldade extrema ou não consegue fazer.'], 1);
const raw: [string, string][] = [
  ['Ficar em pé por longos períodos, como por 30 minutos?', 'mobilidade'],
  ['Cuidar das suas responsabilidades domésticas?', 'vida'],
  ['Aprender uma nova tarefa, como aprender a chegar a um lugar novo?', 'cognicao'],
  ['Em que medida você teve dificuldade em participar de atividades comunitárias (festas, atividades religiosas, outras) da mesma forma que qualquer pessoa?', 'participacao'],
  ['Em que medida você foi emocionalmente afetado(a) pela sua condição de saúde?', 'participacao'],
  ['Concentrar-se em fazer algo por 10 minutos?', 'cognicao'],
  ['Caminhar uma longa distância, como 1 quilômetro?', 'mobilidade'],
  ['Lavar seu corpo inteiro?', 'autocuidado'],
  ['Vestir-se?', 'autocuidado'],
  ['Lidar com pessoas que você não conhece?', 'relacoes'],
  ['Manter uma amizade?', 'relacoes'],
  ['Realizar seu trabalho diário ou suas atividades escolares?', 'vida'],
];
const items: ScaleItem[] = raw.map(([text, subscale], i) => ({
  id: `whodas_${i + 1}`, number: i + 1, text, subscale, options: OPT,
  section: 'Nos últimos 30 dias, quanta dificuldade você teve em...',
}));

const cutoffs: CutoffRange[] = [
  { min: 12, max: 17, severity: 'Sem incapacidade ou mínima', clinicalImplication: 'Funcionamento preservado nos seis domínios.', badgeColor: 'green' },
  { min: 18, max: 26, severity: 'Incapacidade leve', clinicalImplication: 'Dificuldades presentes, com impacto limitado.', badgeColor: 'yellow' },
  { min: 27, max: 38, severity: 'Incapacidade moderada', clinicalImplication: 'Prejuízo relevante. Defina metas funcionais no plano terapêutico, não apenas redução de sintomas.', badgeColor: 'orange' },
  { min: 39, max: 60, severity: 'Incapacidade grave a completa', clinicalImplication: 'Prejuízo importante em vários domínios. Avalie suporte social, reabilitação psicossocial e necessidade de benefício previdenciário.', badgeColor: 'red' },
];

export const whodas: PsychiatricScale = {
  id: 'whodas', name: 'WHODAS 2.0 (12 itens)', acronym: 'WHODAS 2.0', category: 'function', type: 'self_administered',
  estimatedMinutes: 5, timeframe: 'Últimos 30 dias',
  description: 'Medida de funcionalidade e incapacidade da OMS, em seis domínios, independente do diagnóstico.',
  instructions: 'Pense nos últimos 30 dias e responda considerando sua dificuldade média nesse período, incluindo os dias piores e melhores. Considere a dificuldade como você costuma fazer a atividade, com os recursos e ajudas que você normalmente usa.',
  minScore: 12, maxScore: 60,
  subscales: [
    { key: 'cognicao', label: 'Cognição', max: 10 }, { key: 'mobilidade', label: 'Mobilidade', max: 10 },
    { key: 'autocuidado', label: 'Autocuidado', max: 10 }, { key: 'relacoes', label: 'Relações interpessoais', max: 10 },
    { key: 'vida', label: 'Atividades de vida (casa, trabalho, escola)', max: 10 }, { key: 'participacao', label: 'Participação social', max: 10 },
  ],
  licenseNote: 'Instrumento da Organização Mundial da Saúde, de uso livre mediante registro. O DSM-5 e o DSM-5-TR recomendam o WHODAS 2.0 como medida de funcionalidade das seções de medidas dimensionais.',
  validationInfo: { originalAuthors: 'Üstün TB, Kostanjsek N, Chatterji S, Rehm J (Organização Mundial da Saúde)', year: 2010, brazilianValidation: 'Silveira C, Souza RT, Costa ML, et al., 2013 (versão em português); Castro SS, Leite CF, 2015.', psychometrics: 'Consistência interna alta (alfa em torno de 0,90 na versão de 36 itens) e boa estabilidade teste-reteste.' },
  about: {
    purposes: ['severity', 'monitoring'],
    objective: 'Medir o impacto funcional de qualquer condição de saúde, permitindo comparar o prejuízo entre diagnósticos e acompanhar a recuperação funcional, que muitas vezes não acompanha a melhora sintomática.',
    targetPopulation: 'Adultos, com qualquer condição de saúde. Autoaplicável, por entrevista ou por informante.',
    limitations: [
      'A versão de 12 itens explica cerca de 81% da variância da versão completa de 36 itens: para desfechos de pesquisa, prefira a versão longa.',
      'Não distingue a causa do prejuízo: limitação física, dor, efeito adverso de medicamento e sintoma psiquiátrico pontuam igual.',
      'A pontuação oficial da OMS pode ser feita pela soma simples (adotada aqui) ou por escore ponderado por teoria de resposta ao item, que produz valores diferentes.',
      'As faixas de gravidade usadas aqui são uma convenção prática, e não pontos de corte validados: a OMS trabalha com percentis populacionais.',
    ],
    references: [
      'Üstün TB, Kostanjsek N, Chatterji S, Rehm J, eds. Measuring health and disability: manual for WHO Disability Assessment Schedule (WHODAS 2.0). Geneva: WHO; 2010.',
      'Silveira C, Parpinelli MA, Pacagnella RC, et al. Cross-cultural adaptation of the World Health Organization Disability Assessment Schedule (WHODAS 2.0) into Portuguese. Rev Assoc Med Bras. 2013;59(3):234-240.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const total = sumItems(items, a);
    const cutoff = classify(total, cutoffs);
    const pct = Math.round(((total - 12) / 48) * 100);
    return { total, cutoff, classification: cutoff?.severity ?? 'Sem classificação', notes: total >= 12 ? [`Percentual de incapacidade: ${pct}% do máximo possível.`] : undefined };
  },
};
