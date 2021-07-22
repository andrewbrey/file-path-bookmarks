// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prettyJSON(what: any): string {
  return JSON.stringify(what, null, 2);
}

export function replaceEnvTokens(from: string) {
  let resolved = from || '';

  const replaceableEnvTokens = ['HOME', 'FILE_PATH_BOOKMARKS_PATH'];
  for (const t of replaceableEnvTokens) {
    const tokenValue = (process.env[t] || '').trim();
    resolved = resolved.replace(`$${t}`, tokenValue);
  }

  return resolved;
}
