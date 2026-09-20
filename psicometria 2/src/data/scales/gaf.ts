/** AGF: item único. Cada opção representa uma faixa de 10 pontos; o valor registrado é o ponto médio. */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';

const bands: [number, string, string][] = [
  [95, '100 a 91', 'Funcionamento superior em uma ampla variedade de atividades. Os problemas da vida nunca parecem fugir ao controle. Procurado pelos outros por causa de suas qualidades. Sem sintomas.'],
  [85, '90 a 81', 'Sintomas ausentes ou mínimos (por exemplo, ansiedade leve antes de uma prova), bom funcionamento em todas as áreas, interessado e envolvido em uma ampla gama de atividades, socialmente eficaz, satisfeito com a vida, apenas preocupações do dia a dia.'],
  [75, '80 a 71', 'Se há sintomas, são reações transitórias e esperáveis a estressores psicossociais. Não mais que leve prejuízo no funcionamento social, ocupacional ou escolar.'],
  [65, '70 a 61', 'Alguns sintomas leves (humor deprimido e insônia leve) ou alguma dificuldade no funcionamento social, ocupacional ou escolar, mas de modo geral funcionando razoavelmente bem, com alguns relacionamentos interpessoais significativos.'],
  [55, '60 a 51', 'Sintomas moderados (afeto embotado, fala circunstancial, ataques de pânico ocasionais) ou dificuldade moderada no funcionamento social, ocupacional ou escolar (poucos amigos, conflitos com colegas de trabalho).'],
  [45, '50 a 41', 'Sintomas graves (ideação suicida, rituais obsessivos graves, furtos frequentes em lojas) ou qualquer prejuízo grave no funcionamento social, ocupacional ou escolar (sem amigos, incapaz de manter um emprego).'],
  [35, '40 a 31', 'Algum prejuízo no teste de realidade ou na comunicação (fala às vezes ilógica, obscura ou irrelevante), ou grande prejuízo em várias áreas: trabalho ou escola, relações familiares, julgamento, pensamento ou humor.'],
  [25, '30 a 21', 'O comportamento é consideravelmente influenciado por delírios ou alucinações, ou há grave prejuízo na comunicação ou no julgamento, ou incapacidade de funcionar em quase todas as áreas.'],
  [15, '20 a 11', 'Algum perigo de ferir a si mesmo ou a outros, ou ocasionalmente falha em manter a higiene pessoal mínima, ou grosseiro prejuízo na comunicação.'],
  [5, '10 a 1', 'Perigo persistente de ferir gravemente a si mesmo ou a outros, ou incapacidade persistente de manter a higiene pessoal mínima, ou ato suicida grave com expectativa clara de morte.'],
];

const items: ScaleItem[] = [{
  id: 'gaf_1', number: 1,
  text: 'Considere o funcionamento psicológico, social e ocupacional em um continuum hipotético entre saúde e doença',
  hint: 'Não inclua prejuízo decorrente de limitações físicas ou ambientais. Escolha a faixa e, se quiser precisar o número dentro dela, registre nas observações do relatório.',
  options: bands.map(([value, label, description]) => ({ label, value, description })),
  isRedFlagTrigger: true, redFlagThreshold: 25,
}];

const cutoffs: CutoffRange[] = bands.map(([, label, description], i) => {
  const max = 100 - i * 10, min = max - 9;
  return { min, max, severity: label, clinicalImplication: description, badgeColor: (max >= 81 ? 'green' : max >= 61 ? 'yellow' : max >= 41 ? 'orange' : 'red') as CutoffRange['badgeColor'] };
}).reverse();

export const gaf: PsychiatricScale = {
  id: 'gaf', name: 'Avaliação Global do Funcionamento', acronym: 'AGF (GAF)', category: 'function', type: 'clinician_administered',
  estimatedMinutes: 2, timeframe: 'Momento atual ou o período de referência que você definir',
  description: 'Escala única de 1 a 100 que resume o funcionamento global, historicamente o Eixo V do DSM-IV.',
  instructions: 'Pontue em duas etapas: identifique a faixa de 10 pontos em que o paciente se encontra pela pior dos dois critérios, sintomas ou funcionamento; depois refine o número dentro da faixa. Registre também o período avaliado (atual, na admissão, ou o melhor nível no último ano).',
  scoreLabel: 'AGF', minScore: 1, maxScore: 100,
  validationInfo: { originalAuthors: 'Endicott J, Spitzer RL, Fleiss JL, Cohen J (a partir da Global Assessment Scale)', year: 1976, brazilianValidation: 'Traduzida no DSM-IV-TR em português, de uso corrente no Brasil.', psychometrics: 'Confiabilidade entre avaliadores boa com treinamento e âncoras (CCI acima de 0,80), mas modesta na prática clínica de rotina.' },
  about: {
    purposes: ['severity', 'monitoring'],
    objective: 'Resumir em um número a gravidade global, útil para comparar momentos do tratamento, documentar evolução, justificar nível de cuidado e instruir laudos e perícias.',
    targetPopulation: 'Qualquer paciente psiquiátrico. Pontuada por clínico.',
    limitations: [
      'O DSM-5 abandonou a AGF por misturar em um único número sintomas, funcionamento e risco, que podem estar dissociados. O substituto recomendado é o WHODAS 2.0.',
      'Confiabilidade baixa sem treinamento: avaliadores diferentes chegam a números bastante distintos para o mesmo caso.',
      'Sujeita a viés de contexto: pontuações tendem a ser infladas ou deflacionadas conforme a finalidade administrativa da avaliação.',
      'Não deve ser usada isoladamente para decidir alta, internação ou benefício: fundamente com a descrição clínica.',
    ],
    references: [
      'Endicott J, Spitzer RL, Fleiss JL, Cohen J. The Global Assessment Scale: a procedure for measuring overall severity of psychiatric disturbance. Arch Gen Psychiatry. 1976;33(6):766-771.',
      'American Psychiatric Association. Diagnostic and Statistical Manual of Mental Disorders. 4th ed, text revision. Washington: APA; 2000. Eixo V.',
      'Aas IHM. Global Assessment of Functioning (GAF): properties and frontier of current knowledge. Ann Gen Psychiatry. 2010;9:20.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const total = a.gaf_1 ?? 0;
    const cutoff = cutoffs.find((c) => total >= c.min && total <= c.max);
    return {
      total, cutoff, classification: cutoff ? `AGF na faixa ${cutoff.severity}` : 'Sem classificação',
      notes: total ? ['O valor registrado é o ponto médio da faixa escolhida. Para um número exato, anote-o nas observações do relatório.'] : undefined,
      clinicalAlert: total > 0 && total <= 25 ? 'Faixa de funcionamento compatível com risco de dano a si ou a outros, grave prejuízo de comunicação ou de julgamento, ou incapacidade de autocuidado básico. Avalie de forma explícita o risco de suicídio e de heteroagressão, a capacidade de autocuidado e a necessidade de nível de cuidado intensivo, incluindo internação. CVV 188. SAMU 192.' : undefined,
    };
  },
};
