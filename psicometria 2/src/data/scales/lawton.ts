/** Lawton e Brody: AIVD. Três graus por atividade (1 a 3). Mínimo 7, máximo 21. */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { simpleSum } from '../../lib/scoring';

const raw: [string, string, string, string][] = [
  ['Uso do telefone', 'Não é capaz de usar o telefone.', 'Consegue usar com ajuda (atende, mas não disca; usa apenas números memorizados).', 'Usa o telefone sem ajuda: procura números, disca e atende.'],
  ['Uso de transporte', 'Não viaja, a não ser em veículo adaptado ou acompanhado.', 'Viaja acompanhado ou apenas em táxi, não usa transporte coletivo sozinho.', 'Viaja sozinho em transporte coletivo ou dirige o próprio carro.'],
  ['Compras', 'Incapaz de fazer compras.', 'Faz compras pequenas ou acompanhado.', 'Faz todas as compras de que precisa, sozinho.'],
  ['Preparo das refeições', 'Não prepara as refeições: precisa que sirvam a comida pronta.', 'Prepara refeições simples ou apenas esquenta o que foi preparado.', 'Planeja, prepara e serve as refeições sozinho, de forma adequada.'],
  ['Trabalho doméstico', 'Não participa de nenhuma tarefa doméstica.', 'Realiza tarefas leves (lavar louça, arrumar a cama) ou precisa de ajuda em tarefas pesadas.', 'Mantém a casa sozinho ou com ajuda ocasional para trabalho pesado.'],
  ['Uso de medicamentos', 'Não é capaz de tomar os medicamentos sozinho.', 'Toma se alguém preparar a dose e lembrar o horário.', 'Toma os medicamentos na dose e no horário corretos, sem lembretes.'],
  ['Manuseio de dinheiro', 'Não lida com dinheiro.', 'Administra pequenas quantias, mas precisa de ajuda para contas, banco e compras grandes.', 'Administra o próprio dinheiro: paga contas, vai ao banco, controla gastos.'],
];
const items: ScaleItem[] = raw.map(([text, a1, a2, a3], i) => ({
  id: `lawton_${i + 1}`, number: i + 1, text,
  options: [{ label: '1', value: 1, description: a1 }, { label: '2', value: 2, description: a2 }, { label: '3', value: 3, description: a3 }],
}));

const cutoffs: CutoffRange[] = [
  { min: 7, max: 7, severity: 'Dependência total', clinicalImplication: 'Nenhuma atividade instrumental preservada.', badgeColor: 'red' },
  { min: 8, max: 15, severity: 'Dependência parcial', clinicalImplication: 'Prejuízo instrumental relevante. Combinado com rastreio cognitivo alterado, sustenta a hipótese de síndrome demencial.', badgeColor: 'orange' },
  { min: 16, max: 20, severity: 'Dependência leve', clinicalImplication: 'Perda em atividades isoladas. Costuma ser a primeira manifestação funcional do declínio cognitivo.', badgeColor: 'yellow' },
  { min: 21, max: 21, severity: 'Independente', clinicalImplication: 'Independente nas sete atividades instrumentais.', badgeColor: 'green' },
];

export const lawton: PsychiatricScale = {
  id: 'lawton', name: 'Escala de Atividades Instrumentais de Vida Diária de Lawton e Brody', acronym: 'Lawton (AIVD)', category: 'function', type: 'clinician_administered',
  estimatedMinutes: 5, timeframe: 'Desempenho atual',
  description: 'Sete atividades instrumentais, que exigem planejamento e cognição e se perdem antes das atividades básicas.',
  instructions: 'Pergunte ao paciente e, obrigatoriamente, a um informante. Pontue o que a pessoa faz hoje, não o que já fez. Quando a atividade nunca fez parte da rotina da pessoa, registre em observações e interprete com cautela.',
  minScore: 7, maxScore: 21,
  validationInfo: { originalAuthors: 'Lawton MP, Brody EM', year: 1969, brazilianValidation: 'Santos RL, Virtuoso Júnior JS, 2008 (confiabilidade da versão em português).', psychometrics: 'Alfa de Cronbach de 0,92 na avaliação brasileira de confiabilidade.' },
  about: {
    purposes: ['severity', 'monitoring', 'diagnostic_support'],
    objective: 'Detectar o declínio funcional precoce, que é o critério que separa comprometimento cognitivo leve de demência.',
    targetPopulation: 'Idosos e adultos com suspeita de declínio cognitivo ou transtorno mental grave. Entrevista com informante.',
    limitations: [
      'Influência cultural e de papéis de gênero: homens de gerações mais velhas podem nunca ter cozinhado ou lavado roupa, o que rebaixa o escore sem indicar doença.',
      'Limitação física (artrose, sequela motora, baixa visão) reduz o escore sem prejuízo cognitivo.',
      'Depende da qualidade do informante. Cuidadores sobrecarregados superestimam o prejuízo; familiares distantes o subestimam.',
      'A pontuação de 1 a 3 é uma simplificação da escala original, que usa gradações diferentes por atividade.',
    ],
    references: [
      'Lawton MP, Brody EM. Assessment of older people: self-maintaining and instrumental activities of daily living. Gerontologist. 1969;9(3):179-186.',
      'Santos RL, Virtuoso Júnior JS. Confiabilidade da versão brasileira da escala de atividades instrumentais da vida diária. Rev Bras Promoc Saude. 2008;21(4):290-296.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => simpleSum(items, cutoffs, a),
};
