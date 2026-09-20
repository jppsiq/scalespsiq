/** Conjuntos de opções reutilizáveis entre instrumentos. */
import type { ScaleOption } from '../types/scale';

export const FREQ_2_WEEKS: ScaleOption[] = [
  { label: 'Nenhuma vez', value: 0 },
  { label: 'Vários dias', value: 1 },
  { label: 'Mais da metade dos dias', value: 2 },
  { label: 'Quase todos os dias', value: 3 },
];

export const YES_NO: ScaleOption[] = [
  { label: 'Não', value: 0 },
  { label: 'Sim', value: 1 },
];

/** Gera opções numéricas 0..max para domínios pontuados pelo aplicador (MEEM, MoCA). */
export function points(max: number): ScaleOption[] {
  return Array.from({ length: max + 1 }, (_, v) => ({ label: `${v}`, value: v }));
}

/** Gera opções a partir de rótulos, com valor inicial e passo (o passo 2 cobre os itens de peso duplo da YMRS). */
export function graded(labels: string[], start = 0, step = 1): ScaleOption[] {
  return labels.map((label, i) => ({ label, value: start + i * step }));
}

/** Opções com âncora descritiva completa: cada entrada é o texto do grau correspondente. */
export function anchored(descriptions: string[], start = 0, step = 1): ScaleOption[] {
  return descriptions.map((description, i) => ({ label: String(start + i * step), value: start + i * step, description }));
}

export const CORRECT: ScaleOption[] = [
  { label: 'Incorreto', value: 0 },
  { label: 'Correto', value: 1 },
];

export const SEV_0_4 = graded(['Ausente', 'Leve', 'Moderado', 'Grave', 'Muito grave']);
export const SEV_0_2 = graded(['Ausente', 'Leve ou duvidoso', 'Claramente presente']);
export const SEV_1_7 = graded(['Ausente', 'Mínimo', 'Leve', 'Moderado', 'Moderadamente grave', 'Grave', 'Extremo'], 1);
