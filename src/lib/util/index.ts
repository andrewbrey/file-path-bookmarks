// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prettyJSON(what: any): string {
	return JSON.stringify(what, null, 2);
}
