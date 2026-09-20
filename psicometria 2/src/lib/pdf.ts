/**
 * Exportação. Dois caminhos:
 * 1) printSheet: window.print() + regras @media print (index.css). Gera PDF vetorial e é o caminho recomendado.
 * 2) downloadPdf: html2pdf.js (html2canvas + jsPDF), carregado sob demanda. Baixa o arquivo direto, em imagem.
 */
export function printSheet(): void {
  window.print();
}

export async function downloadPdf(element: HTMLElement, filename: string): Promise<void> {
  const { default: html2pdf } = await import('html2pdf.js');
  // "pagebreak" existe na biblioteca, mas falta na tipagem publicada: por isso o objeto é montado à parte.
  const options = {
    margin: [12, 12, 14, 12], // mm
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'], avoid: '.avoid-break' },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await html2pdf().set(options as any).from(element).save();
}
