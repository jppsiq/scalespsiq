import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

/** Tema claro/escuro. Lembra a escolha no navegador e, sem escolha prévia, segue o sistema. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('psicometria:theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch { /* armazenamento indisponível: segue o sistema */ }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('psicometria:theme', theme); } catch { /* ignora */ }
  }, [theme]);

  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))];
}
