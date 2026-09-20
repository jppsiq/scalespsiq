import type { ItemStimulus } from '../types/scale';

const isSvg = (src?: string) => !!src && (src.endsWith('.svg') || src.startsWith('data:image/svg'));
const WIDTH: Record<string, string> = { sm: 'w-72', md: 'w-[26rem]', lg: 'w-full max-w-2xl', auto: '' };

/** Estímulo mostrado ao paciente. Fundo sempre branco: as figuras são desenhos a traço preto. */
export function Stimulus({ stimulus: s, print }: { stimulus: ItemStimulus; print?: boolean }) {
  return (
    <figure className={`avoid-break ${print ? 'my-2' : 'mb-4 overflow-hidden rounded-md border border-line bg-white p-3 dark:border-slate-600'}`}>
      {s.kind === 'image' ? (
        <img src={s.src} alt={s.alt} className={`mx-auto block h-auto max-w-full ${WIDTH[s.size ?? (isSvg(s.src) ? 'sm' : 'auto')]}`} />
      ) : (
        <p aria-label={s.alt} className="py-6 text-center text-4xl font-bold tracking-wide text-black sm:text-5xl">{s.text}</p>
      )}
      {s.caption && !print && <figcaption className="mt-2 text-center text-sm text-slate-600">{s.caption}</figcaption>}
    </figure>
  );
}
