const REPLACEABLE_ENV_TOKENS = ['HOME', 'FILE_PATH_BOOKMARKS_PATH'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prettyJSON(what: any): string {
  return JSON.stringify(what, null, 2);
}

export function removeEnvTokens(from: string) {
  let resolved = from || '';

  for (const t of REPLACEABLE_ENV_TOKENS) {
    const tokenValue = (process.env[t] || '').trim();
    resolved = resolved.replace(`$${t}`, tokenValue);
  }

  return resolved;
}

export function addEnvTokens(from: string) {
  let resolved = from || '';

  for (const t of REPLACEABLE_ENV_TOKENS) {
    const tokenValue = (process.env[t] || '').trim();

    if (tokenValue) {
      resolved = resolved.replace(`${tokenValue}`, `$${t}`);
    }
  }

  return resolved;
}
