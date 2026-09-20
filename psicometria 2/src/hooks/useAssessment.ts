import { useCallback, useMemo, useState } from 'react';
import type { Answers, PsychiatricScale } from '../types/scale';
import { isComplete, progress, visibleItems } from '../lib/scoring';

/**
 * Estado de uma aplicação. Liga a camada de dados (scale) à de regras (lib/scoring)
 * e entrega valores prontos para a UI. As respostas vivem só em memória.
 */
export function useAssessment(scale: PsychiatricScale) {
  const [answers, setAnswers] = useState<Answers>({});

  const setAnswer = useCallback((id: string, value: number) => setAnswers((prev) => ({ ...prev, [id]: value })), []);
  const reset = useCallback(() => setAnswers({}), []);

  return useMemo(() => {
    const items = visibleItems(scale.items, answers);
    // Descarta respostas de itens que ficaram ocultos pela lógica de salto.
    const clean: Answers = Object.fromEntries(items.filter((it) => answers[it.id] !== undefined).map((it) => [it.id, answers[it.id]]));
    return {
      answers: clean,
      items,
      setAnswer,
      reset,
      progress: progress(scale.items, clean),
      complete: isComplete(scale.items, clean),
      started: Object.keys(clean).length > 0,
      result: scale.calculateScore(clean),
    };
  }, [scale, answers, setAnswer, reset]);
}

export type Assessment = ReturnType<typeof useAssessment>;
