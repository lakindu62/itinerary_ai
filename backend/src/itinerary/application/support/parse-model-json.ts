export function parseModelJson(content: unknown): unknown {
  const raw = typeof content === 'string' ? content : JSON.stringify(content);
  let s = raw.trim();
  if (s.startsWith('```json'))
    s = s.replace(/```json\n?/, '').replace(/\n?```$/, '');
  else if (s.startsWith('```'))
    s = s.replace(/```\n?/, '').replace(/\n?```$/, '');
  return JSON.parse(s);
}
