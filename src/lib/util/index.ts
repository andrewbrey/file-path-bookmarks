export function prettyJSON(what: any): string {
	return JSON.stringify(what, null, 2);
}
