export function decodeHtml(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

export function encodeBungieName(name: string): string {
  return name.replace(/#/g, '%23');
}

export function splitBungieName(name: string): { displayName: string; code: string } | null {
  const idx = name.lastIndexOf('#');
  if (idx === -1) return null;
  return {
    displayName: name.substring(0, idx),
    code: name.substring(idx + 1),
  };
}
