import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { anchored } from '../../lib/options';
import { simpleSum } from '../../lib/scoring';

const OPT = anchored(['Nunca.', 'Raramente.', 'Algumas vezes.', 'Frequentemente.', 'Sempre.']);
const texts = [
  'Sente que o seu familiar solicita mais ajuda do que ele necessita?',
  'Sente que, por causa do tempo que gasta com o seu familiar, já não tem tempo suficiente para você mesmo(a)?',
  'Sente-se tenso(a) quando tem de cuidar do seu familiar e ainda tem outras tarefas por fazer?',
  'Sente-se envergonhado(a) com o comportamento do seu familiar?',
  'Sente-se irritado(a) quando está junto do seu familiar?',
  'Acha que a situação atual afeta a sua relação com amigos ou outros membros da família de forma negativa?',
  'Tem receio pelo futuro destinado ao seu familiar?',
  'Sente que o seu familiar está dependente de você?',
  'Sente-se esgotado(a) quando tem de estar junto do seu familiar?',
  'Vê a sua saúde ser afetada por ter de cuidar do seu familiar?',
  'Sente que não tem a vida privada que desejaria por causa do seu familiar?',
  'Pensa que as suas relações sociais são afetadas por cuidar do seu familiar?',
  'Sente-se pouco à vontade em convidar amigos para vir à sua casa por causa do seu familiar?',
  'Acredita que o seu familiar espera que você cuide dele como se fosse a única pessoa com quem ele pudesse contar?',
  'Sente que não tem dinheiro suficiente para cuidar do seu familiar, somando-se às suas outras despesas?',
  'Sente-se incapaz de cuidar do seu familiar por muito mais tempo?',
  'Sente que perdeu o controle da sua vida desde que a doença do seu familiar se manifestou?',
  'Desejaria poder entregar o seu familiar aos cuidados de outra pessoa?',
  'Sente-se inseguro(a) acerca do que fazer com o seu familiar?',
  'Sente que poderia fazer mais pelo seu familiar?',
  'Pensa que poderia cuidar melhor do seu familiar?',
  'Em geral, sente-se muito sobrecarregado(a) por cuidar do seu familiar?',
];
const items: ScaleItem[] = texts.map((text, i) => ({ id: `zarit_${i + 1}`, number: i + 1, text, options: OPT }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 20, severity: 'Sobrecarga ausente ou mínima', clinicalImplication: 'Mantenha a psicoeducação e reavalie quando o quadro do paciente piorar.', badgeColor: 'green' },
  { min: 21, max: 40, severity: 'Sobrecarga leve a moderada', clinicalImplication: 'Ofereça psicoeducação, orientação sobre manejo de sintomas comportamentais, rede de apoio e divisão de tarefas entre familiares.', badgeColor: 'yellow' },
  { min: 41, max: 60, severity: 'Sobrecarga moderada a grave', clinicalImplication: 'Avalie o cuidador como paciente: rastreie depressão e ansiedade, avalie sono, saúde física e isolamento. Considere cuidado formal de apoio, centro-dia e grupos de cuidadores.', badgeColor: 'orange' },
  { min: 61, max: 88, severity: 'Sobrecarga grave', clinicalImplication: 'Situação de risco para o cuidador e para o paciente, incluindo risco de negligência e de maus-tratos. Intervenção dirigida ao cuidador é prioridade terapêutica.', badgeColor: 'red' },
];

export const zarit: PsychiatricScale = {
  id: 'zarit', name: 'Escala de Sobrecarga do Cuidador de Zarit', acronym: 'Zarit', category: 'function', type: 'self_administered',
  estimatedMinutes: 10, timeframe: 'Experiência atual do cuidador',
  description: 'Vinte e dois itens sobre o impacto do cuidado na saúde, na vida social, na situação financeira e no bem-estar emocional do cuidador.',
  instructions: 'Respondida pelo cuidador, não pelo paciente. Leia cada item e marque com que frequência você se sente daquela maneira. Não há resposta certa ou errada.',
  minScore: 0, maxScore: 88,
  validationInfo: { originalAuthors: 'Zarit SH, Reever KE, Bach-Peterson J', year: 1980, brazilianValidation: 'Scazufca M, 2002.', psychometrics: 'Alfa de Cronbach de 0,87 na versão brasileira.' },
  about: {
    purposes: ['screening', 'severity', 'monitoring'],
    objective: 'Medir a sobrecarga do cuidador, que é fator de risco independente para institucionalização do paciente, para adoecimento do cuidador e para maus-tratos.',
    targetPopulation: 'Cuidadores familiares de pessoas com demência, transtorno mental grave, deficiência ou doença crônica incapacitante.',
    limitations: [
      'Mede sobrecarga percebida, que depende de expectativas culturais, de suporte disponível e do vínculo prévio, e nem sempre corresponde à gravidade objetiva do caso.',
      'Os pontos de corte variam entre estudos: use as faixas como orientação e valorize a mudança no seguimento.',
      'Não substitui o rastreio de depressão no cuidador, que deve ser feito à parte.',
      'Cuidadores podem minimizar respostas por culpa ou por receio de julgamento: aplique em ambiente reservado, sem o paciente presente.',
    ],
    references: [
      'Zarit SH, Reever KE, Bach-Peterson J. Relatives of the impaired elderly: correlates of feelings of burden. Gerontologist. 1980;20(6):649-655.',
      'Scazufca M. Brazilian version of the Burden Interview scale for the assessment of burden of care in carers of people with mental illnesses. Braz J Psychiatry. 2002;24(1):12-17.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => simpleSum(items, cutoffs, a),
};
