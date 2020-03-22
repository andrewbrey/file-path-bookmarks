import { existsSync, mkdirpSync, readJSONSync, writeFileSync } from 'fs-extra';
import { join } from 'path';
import { UserConfiguration } from '../config';
import { prettyJSON } from '../util';

export interface Bookmark {
	name: string;
	path: string;
}

export interface SavedBookmarks {
	bookmarks: Bookmark[];
}

export const DEFAULT_BOOKMARKS: SavedBookmarks = { bookmarks: [] };

export function allBookmarks(userConfig: UserConfiguration) {
	ensureBookmarksFileExists(userConfig);

	const BOOKMARKS_PATH = join(userConfig.bookmarksFilePath, userConfig.bookmarksFileName);
	const USER_BOOKMARKS = readJSONSync(BOOKMARKS_PATH) as SavedBookmarks;

	return USER_BOOKMARKS;
}

function ensureBookmarksFileExists(userConfig: UserConfiguration) {
	const BOOKMARKS_FILE = join(userConfig.bookmarksFilePath, userConfig.bookmarksFileName);

	if (!existsSync(BOOKMARKS_FILE)) {
		mkdirpSync(userConfig.bookmarksFilePath);
		writeFileSync(BOOKMARKS_FILE, prettyJSON(DEFAULT_BOOKMARKS));
	}
}
