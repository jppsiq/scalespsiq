/** Mapas de apresentação. Classes escritas por extenso para o Tailwind não as remover no build. */
import type { BadgeColor, ClinicalPurpose, ScaleCategory, ScaleType } from '../types/scale';

export const BADGE: Record<BadgeColor, { chip: string; hex: string }> = {
  green: { chip: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200', hex: '#10b981' },
  yellow: { chip: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200', hex: '#eab308' },
  orange: { chip: 'bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200', hex: '#f97316' },
  red: { chip: 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-200', hex: '#dc2626' },
  slate: { chip: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100', hex: '#94a3b8' },
};

export const CATEGORY_LABEL: Record<ScaleCategory, string> = {
  mood: 'Humor',
  anxiety: 'Ansiedade, TOC e trauma',
  adhd: 'Neurodesenvolvimento e infância',
  psychosis: 'Psicose e esquizofrenia',
  substances: 'Uso de substâncias',
  cognition: 'Neurocognição',
  function: 'Funcionalidade e cuidador',
  eating: 'Comportamento alimentar',
  sleep: 'Sono',
  general: 'Impressão global e efeitos adversos de medicamentos',
  suicide_risk: 'Risco e segurança',
};

export const CATEGORY_ORDER: ScaleCategory[] = ['mood', 'anxiety', 'adhd', 'psychosis', 'substances', 'cognition', 'function', 'eating', 'sleep', 'general', 'suicide_risk'];

export const TYPE_LABEL: Record<ScaleType, string> = {
  self_administered: 'Autoaplicável',
  clinician_administered: 'Heteroaplicável',
};

export const PURPOSE_LABEL: Record<ClinicalPurpose, string> = {
  screening: 'Rastreio',
  severity: 'Gravidade dimensional',
  monitoring: 'Acompanhamento de resposta',
  diagnostic_support: 'Suporte diagnóstico',
  risk_triage: 'Triagem de risco',
};

/** Normaliza texto para busca sem acento e sem caixa. */
export const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
