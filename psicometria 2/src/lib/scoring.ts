/**
 * CAMADA DE REGRAS DE NEGÓCIO: funções puras, sem React e sem DOM.
 * Tudo aqui é testável isoladamente (ver scoring.test.ts).
 */
import type { Answers, CutoffRange, ScaleItem } from '../types/scale';

/** Itens visíveis segundo a lógica de salto (showIf). */
export function visibleItems(items: ScaleItem[], answers: Answers): ScaleItem[] {
  return items.filter((it) => (it.showIf ? it.showIf(answers) : true));
}

/** Itens que precisam estar respondidos para a avaliação ser considerada completa. */
export function requiredItems(items: ScaleItem[], answers: Answers): ScaleItem[] {
  return visibleItems(items, answers).filter((it) => !it.optional);
}

export function isComplete(items: ScaleItem[], answers: Answers): boolean {
  return requiredItems(items, answers).every((it) => answers[it.id] !== undefined);
}

export function progress(items: ScaleItem[], answers: Answers): { done: number; total: number } {
  const req = requiredItems(items, answers);
  return { done: req.filter((it) => answers[it.id] !== undefined).length, total: req.length };
}

/**
 * Valor efetivamente contabilizado de um item, já aplicando a inversão.
 * Inversão genérica: máx + mín - resposta (funciona para 0..1, 0..4, 1..7 etc.).
 */
export function itemScore(item: ScaleItem, answers: Answers): number {
  const raw = answers[item.id];
  if (raw === undefined) return 0;
  if (!item.reverse) return raw;
  const values = item.options.map((o) => o.value);
  return Math.max(...values) + Math.min(...values) - raw;
}

/** Soma dos itens pontuáveis e visíveis. Aceita um filtro (ex.: por subescala). */
export function sumItems(items: ScaleItem[], answers: Answers, filter?: (it: ScaleItem) => boolean): number {
  return visibleItems(items, answers)
    .filter((it) => it.scored !== false)
    .filter((it) => (filter ? filter(it) : true))
    .reduce((acc, it) => acc + itemScore(it, answers), 0);
}

/** Soma por subescala, a partir do campo item.subscale. */
export function sumBySubscale(items: ScaleItem[], answers: Answers): Record<string, number> {
  const out: Record<string, number> = {};
  for (const it of items) {
    if (!it.subscale || it.scored === false) continue;
    out[it.subscale] = (out[it.subscale] ?? 0) + itemScore(it, answers);
  }
  return out;
}

/** Quantos itens atingem um limiar (usado na Parte A do ASRS e no PCL-5). */
export function countAtOrAbove(items: ScaleItem[], answers: Answers, threshold: (it: ScaleItem) => number): number {
  return items.filter((it) => answers[it.id] !== undefined && answers[it.id] >= threshold(it)).length;
}

/** Localiza a faixa de gravidade correspondente ao total. */
export function classify(total: number, cutoffs: CutoffRange[]): CutoffRange | undefined {
  return cutoffs.find((c) => total >= c.min && total <= c.max);
}

/** Itens de alerta cujo limiar foi atingido. */
export function triggeredRedFlags(items: ScaleItem[], answers: Answers): ScaleItem[] {
  return items.filter(
    (it) => it.isRedFlagTrigger && answers[it.id] !== undefined && answers[it.id] >= (it.redFlagThreshold ?? 1),
  );
}

/** Resultado padrão para escalas de soma simples com faixas e subescalas opcionais. */
export function simpleSum(items: ScaleItem[], cutoffs: CutoffRange[], answers: Answers) {
  const total = sumItems(items, answers);
  const cutoff = classify(total, cutoffs);
  const subscores = sumBySubscale(items, answers);
  return {
    total,
    cutoff,
    classification: cutoff?.severity ?? 'Sem classificação',
    subscores: Object.keys(subscores).length ? subscores : undefined,
  };
}

/** Texto padrão de protocolo de crise, reutilizado pelas escalas com item de suicídio. */
export const SUICIDE_PROTOCOL =
  'Avalie o risco de suicídio agora, antes de encerrar o atendimento: ideação, plano, intenção, acesso a meios, ' +
  'tentativas prévias e fatores de proteção. Não deixe o paciente sozinho se houver risco iminente. Restrinja o acesso ' +
  'a meios letais, envolva familiar ou acompanhante, construa um plano de segurança e defina o nível de cuidado ' +
  '(seguimento próximo, emergência psiquiátrica ou internação). Apoio 24h: CVV 188. Emergência: SAMU 192.';
