import { useEffect, useState } from 'react';

/** Roteamento mínimo por hash (#/ e #/escala/<id>). Dispensa servidor e react-router. */
export function useHashRoute(): { scaleId: string | null; go: (id: string | null) => void } {
  const read = () => window.location.hash.match(/^#\/escala\/([\w-]+)/)?.[1] ?? null;
  const [scaleId, setScaleId] = useState<string | null>(read);

  useEffect(() => {
    const onChange = () => { setScaleId(read()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return { scaleId, go: (id) => { window.location.hash = id ? `#/escala/${id}` : '#/'; } };
}
