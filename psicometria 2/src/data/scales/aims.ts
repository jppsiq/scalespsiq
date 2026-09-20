/** AIMS: o total soma só os itens 1 a 7. A interpretação usa o critério de Schooler-Kane, não faixas de soma. */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { graded, YES_NO } from '../../lib/options';
import { sumItems } from '../../lib/scoring';

const SEV = graded(['Nenhum', 'Mínimo (pode ser extremo do normal)', 'Leve', 'Moderado', 'Grave']);
const F = 'Movimentos faciais e orais', X = 'Movimentos das extremidades', T = 'Movimentos do tronco', G = 'Julgamento global', D = 'Estado dentário';
const items: ScaleItem[] = [
  { section: F, text: 'Músculos da expressão facial', hint: 'Movimentos de testa, sobrancelhas, região periorbital, bochechas. Inclui franzir, piscar, sorrir, fazer caretas.', options: SEV },
  { section: F, text: 'Lábios e região perioral', hint: 'Franzir, fazer bico, estalar os lábios.', options: SEV },
  { section: F, text: 'Mandíbula', hint: 'Morder, cerrar, mastigar, abrir a boca, movimentos laterais.', options: SEV },
  { section: F, text: 'Língua', hint: 'Pontue apenas o aumento de movimento dentro e fora da boca, não a incapacidade de sustentar o movimento.', options: SEV },
  { section: X, text: 'Membros superiores (braços, punhos, mãos, dedos)', hint: 'Inclui movimentos coreicos (rápidos, sem propósito, irregulares) e atetoides (lentos, complexos, serpenteantes). Não inclui tremor.', options: SEV },
  { section: X, text: 'Membros inferiores (pernas, joelhos, tornozelos, dedos)', hint: 'Movimento lateral do joelho, bater o pé, soltar o calcanhar, contorcer o pé, inversão e eversão.', options: SEV },
  { section: T, text: 'Pescoço, ombros e quadris', hint: 'Balançar, torcer, contorcer, movimentos pélvicos.', options: SEV },
  { section: G, text: 'Gravidade dos movimentos anormais', options: graded(['Nenhuma, normal', 'Mínima', 'Leve', 'Moderada', 'Grave']), scored: false },
  { section: G, text: 'Incapacitação devida aos movimentos anormais', options: graded(['Nenhuma, normal', 'Mínima', 'Leve', 'Moderada', 'Grave']), scored: false },
  { section: G, text: 'Consciência do paciente sobre os movimentos anormais', options: graded(['Sem consciência', 'Consciente, sem desconforto', 'Consciente, desconforto leve', 'Consciente, desconforto moderado', 'Consciente, desconforto grave']), scored: false },
  { section: D, text: 'Problemas atuais com dentes e/ou próteses?', options: YES_NO, scored: false },
  { section: D, text: 'O paciente costuma usar prótese dentária?', options: YES_NO, scored: false },
].map((it, i) => ({ id: `aims_${i + 1}`, number: i + 1, ...it }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 1, severity: 'Sem movimentos anormais relevantes', clinicalImplication: 'Repetir periodicamente durante o uso de antipsicóticos (a cada 6 a 12 meses, ou menos em alto risco).', badgeColor: 'green' },
  { min: 2, max: 28, severity: 'Movimentos presentes', clinicalImplication: 'Aplique o critério de Schooler-Kane: ao menos "moderado" (3) em uma área, ou ao menos "leve" (2) em duas ou mais áreas.', badgeColor: 'orange' },
];

export const aims: PsychiatricScale = {
  id: 'aims', name: 'Abnormal Involuntary Movement Scale', acronym: 'AIMS', category: 'general', type: 'clinician_administered',
  estimatedMinutes: 10, timeframe: 'Momento do exame',
  description: 'Exame padronizado de discinesia tardia em usuários de antipsicóticos.',
  instructions: 'Observe o paciente em repouso antes do exame. Procedimento: sentado em cadeira firme sem braços, mãos nos joelhos; mãos pendentes; abrir a boca (2 vezes); protrair a língua (2 vezes); tocar o polegar em cada dedo por 10 a 15 segundos com cada mão; fletir e estender os braços; ficar de pé; estender os braços à frente com as palmas para baixo; caminhar, virar e voltar (2 vezes). Pontue a maior gravidade observada. Movimentos que só aparecem com ativação pontuam 1 grau a menos.',
  scoreLabel: 'Soma dos itens 1 a 7', minScore: 0, maxScore: 28,
  validationInfo: { originalAuthors: 'Guy W (National Institute of Mental Health, ECDEU)', year: 1976, brazilianValidation: 'Escala de domínio público, em tradução de trabalho. Sem estudo de validação brasileiro de referência.', psychometrics: 'Confiabilidade entre avaliadores adequada após treinamento.' },
  about: {
    purposes: ['screening', 'severity', 'monitoring'],
    objective: 'Detectar e acompanhar discinesia tardia. Recomenda-se exame basal antes de iniciar antipsicótico e reavaliação periódica.',
    targetPopulation: 'Pacientes em uso de antipsicóticos ou de outros bloqueadores dopaminérgicos (ex.: metoclopramida). Exame físico por clínico.',
    limitations: ['Não distingue discinesia tardia de outras causas de movimentos anormais (Huntington, discinesia espontânea do idoso, próteses mal ajustadas, estereotipias).', 'O diagnóstico de discinesia tardia (Schooler e Kane, 1982) exige ainda ao menos 3 meses de exposição cumulativa a antipsicótico e ausência de outra causa.', 'Não avalia acatisia, parkinsonismo nem distonia aguda.', 'Tremor não deve ser pontuado.'],
    references: ['Guy W. ECDEU Assessment Manual for Psychopharmacology. Rockville: US Department of Health, Education, and Welfare; 1976:534-537.', 'Schooler NR, Kane JM. Research diagnoses for tardive dyskinesia. Arch Gen Psychiatry. 1982;39(4):486-487.'],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const total = sumItems(items, a);
    const areas = items.slice(0, 7).map((it) => a[it.id] ?? 0);
    const sk = areas.some((v) => v >= 3) || areas.filter((v) => v >= 2).length >= 2;
    const cutoff: CutoffRange = sk ? { ...cutoffs[1], severity: 'Critério de Schooler-Kane atendido', badgeColor: 'red', clinicalImplication: 'Discinesia tardia provável, se houver exposição ≥ 3 meses a antipsicótico e nenhuma outra causa. Rever indicação e dose, considerar troca para agente de menor risco (ex.: clozapina) e inibidor de VMAT2 quando disponível. Evitar anticolinérgicos, que podem piorar o quadro.' } : total >= 2 ? { ...cutoffs[1], severity: 'Movimentos presentes, critério não atendido', badgeColor: 'yellow', clinicalImplication: 'Reavaliar em intervalo curto (por exemplo, 3 meses).' } : cutoffs[0];
    return { total, cutoff, classification: cutoff.severity };
  },
};
