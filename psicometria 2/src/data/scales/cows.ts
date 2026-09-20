/** COWS: 11 itens com máximos diferentes. Reaplicada de forma seriada para titular o tratamento. */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { simpleSum } from '../../lib/scoring';

const opt = (d: [number, string][]) => d.map(([value, description]) => ({ label: String(value), value, description }));
const raw: [string, string, [number, string][]][] = [
  ['Frequência cardíaca de repouso', 'Medida após o paciente estar sentado ou deitado por 1 minuto.', [[0, 'Até 80 bpm.'], [1, 'De 81 a 100 bpm.'], [2, 'De 101 a 120 bpm.'], [4, 'Acima de 120 bpm.']]],
  ['Sudorese', 'Na última meia hora, não relacionada à temperatura do ambiente nem à atividade.', [[0, 'Sem calafrios nem rubor relatados.'], [1, 'Relato subjetivo de calafrios ou rubor.'], [2, 'Rubor ou umidade visível na face.'], [3, 'Gotas de suor na fronte ou no rosto.'], [4, 'Suor escorrendo pelo rosto.']]],
  ['Inquietação', 'Observação durante a avaliação.', [[0, 'Capaz de permanecer sentado e parado.'], [1, 'Relata dificuldade de ficar parado, mas consegue.'], [3, 'Movimentação frequente das pernas ou dos braços.'], [5, 'Incapaz de permanecer sentado por mais de alguns segundos.']]],
  ['Diâmetro pupilar', 'Sob luz ambiente.', [[0, 'Pupilas puntiformes ou de tamanho normal para a luz do ambiente.'], [1, 'Pupilas possivelmente maiores que o normal para a luz do ambiente.'], [2, 'Pupilas moderadamente dilatadas.'], [5, 'Pupilas tão dilatadas que apenas a borda da íris é visível.']]],
  ['Dores ósseas ou articulares', 'Se o paciente já tinha dor crônica, pontue apenas o componente adicional atribuído à abstinência.', [[0, 'Sem desconforto.'], [1, 'Desconforto leve e difuso.'], [2, 'O paciente relata dor intensa e difusa em músculos ou articulações.'], [4, 'O paciente esfrega as articulações ou os músculos e é incapaz de ficar parado por causa do desconforto.']]],
  ['Coriza ou lacrimejamento', 'Não atribuível a sintomas de resfriado ou a alergia.', [[0, 'Ausentes.'], [1, 'Congestão nasal ou olhos incomumente úmidos.'], [2, 'Coriza ou lacrimejamento.'], [4, 'Coriza constante ou lágrimas escorrendo pela face.']]],
  ['Sintomas gastrointestinais', 'Na última meia hora.', [[0, 'Sem sintomas.'], [1, 'Cólicas abdominais.'], [2, 'Náusea ou fezes amolecidas.'], [3, 'Vômito ou diarreia.'], [5, 'Múltiplos episódios de vômito ou diarreia.']]],
  ['Tremor', 'Observação das mãos estendidas.', [[0, 'Sem tremor.'], [1, 'Tremor palpável, mas não visível.'], [2, 'Tremor leve visível.'], [4, 'Tremor grosseiro ou contrações musculares.']]],
  ['Bocejos', 'Observação durante a avaliação.', [[0, 'Ausentes.'], [1, 'Boceja uma ou duas vezes durante a avaliação.'], [2, 'Boceja três ou mais vezes durante a avaliação.'], [4, 'Boceja várias vezes por minuto.']]],
  ['Ansiedade ou irritabilidade', '', [[0, 'Ausentes.'], [1, 'O paciente relata irritabilidade ou ansiedade crescentes.'], [2, 'O paciente está obviamente irritável ou ansioso.'], [4, 'O paciente está tão irritável ou ansioso que a participação na avaliação fica difícil.']]],
  ['Piloereção', 'Observação da pele.', [[0, 'Pele lisa.'], [3, 'Pelos eriçados ou arrepios palpáveis nos braços.'], [5, 'Piloereção proeminente.']]],
];
const items: ScaleItem[] = raw.map(([text, hint, d], i) => ({ id: `cows_${i + 1}`, number: i + 1, text, hint: hint || undefined, options: opt(d) }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 4, severity: 'Sem abstinência significativa', clinicalImplication: 'Abstinência ausente ou mínima. A indução de buprenorfina antes do aparecimento de sintomas objetivos pode precipitar abstinência.', badgeColor: 'green' },
  { min: 5, max: 12, severity: 'Abstinência leve', clinicalImplication: 'Escore ≥ 8 a 12 costuma ser o limiar mínimo para iniciar a indução de buprenorfina com segurança, conforme o protocolo do serviço e a meia-vida do opioide usado.', badgeColor: 'yellow' },
  { min: 13, max: 24, severity: 'Abstinência moderada', clinicalImplication: 'Tratamento indicado: agonista (metadona ou buprenorfina) conforme disponibilidade e protocolo, com medidas sintomáticas para dor, náusea, diarreia e insônia.', badgeColor: 'orange' },
  { min: 25, max: 36, severity: 'Abstinência moderadamente grave', clinicalImplication: 'Desconforto intenso, com risco elevado de abandono do tratamento e de retorno imediato ao uso.', badgeColor: 'red' },
  { min: 37, max: 48, severity: 'Abstinência grave', clinicalImplication: 'Avaliar hidratação, distúrbios hidroeletrolíticos e comorbidades. Em gestantes, a abstinência de opioides traz risco fetal: o tratamento com agonista é a conduta recomendada.', badgeColor: 'red' },
];

export const cows: PsychiatricScale = {
  id: 'cows', name: 'Escala Clínica de Abstinência de Opioides', acronym: 'COWS', category: 'substances', type: 'clinician_administered',
  estimatedMinutes: 5, timeframe: 'Momento da avaliação', emergency: true,
  description: 'Gravidade da síndrome de abstinência de opioides em 11 itens, usada para o momento e a titulação do tratamento.',
  instructions: 'Avalie no momento do exame e reaplique em intervalos regulares para acompanhar a evolução e orientar a indução do agonista. Pontue apenas o que for atribuível à abstinência.',
  licenseNote: 'Escala de domínio público. Âncoras em tradução de trabalho.', minScore: 0, maxScore: 48,
  validationInfo: { originalAuthors: 'Wesson DR, Ling W', year: 2003, brazilianValidation: 'Tradução de uso corrente em serviços de dependência química no Brasil, sem estudo de validação brasileiro consolidado.', psychometrics: 'Boa correlação com escalas de abstinência mais longas e com marcadores objetivos.' },
  about: {
    purposes: ['severity', 'monitoring'],
    objective: 'Quantificar a abstinência de opioides, decidir o momento seguro de iniciar buprenorfina e acompanhar a resposta ao tratamento.',
    targetPopulation: 'Pacientes com uso de opioides em abstinência, em emergência, enfermaria ou serviço especializado.',
    limitations: [
      'Vários itens são inespecíficos: ansiedade, taquicardia, sudorese e sintomas gastrointestinais ocorrem em abstinência de outras substâncias, infecção, sepse, tireotoxicose e crises de ansiedade.',
      'Iniciar buprenorfina com escore baixo pode precipitar abstinência, sobretudo após opioides de meia-vida longa. Siga o protocolo do serviço.',
      'Não substitui a avaliação clínica global nem a investigação de comorbidades infecciosas frequentes nessa população.',
      'A abstinência de opioides raramente é letal em adultos saudáveis, mas é grave em gestantes, em neonatos e em quem tem doença clínica descompensada.',
    ],
    references: [
      'Wesson DR, Ling W. The Clinical Opiate Withdrawal Scale (COWS). J Psychoactive Drugs. 2003;35(2):253-259.',
      'The ASAM National Practice Guideline for the Treatment of Opioid Use Disorder: 2020 Focused Update. J Addict Med. 2020;14(2S Suppl 1):1-91.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => simpleSum(items, cutoffs, a),
};
