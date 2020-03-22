import * as chalk from 'chalk';
import { existsSync, mkdirpSync, readJSONSync, statSync, writeFileSync } from 'fs-extra';
import { prompt } from 'inquirer';
import { lowerCase } from 'lodash';
import { isAbsolute, join, normalize } from 'path';
import dedent from 'ts-dedent';
import { UserConfiguration } from '../config';
import { prettyJSON } from '../util';

export interface Bookmark {
	name: string;
	path: string;
}

export interface SavedBookmarks {
	bookmarks: Bookmark[];
}

export type ErrorMessage = string | undefined;

export const DEFAULT_BOOKMARKS: SavedBookmarks = { bookmarks: [] };
export const MAX_NAME_LENGTH = 20;

export function allBookmarks(userConfig: UserConfiguration) {
	ensureBookmarksFileExists(userConfig);

	const BOOKMARKS_PATH = join(userConfig.bookmarksFilePath, userConfig.bookmarksFileName);
	const USER_BOOKMARKS = readJSONSync(BOOKMARKS_PATH) as SavedBookmarks;

	return USER_BOOKMARKS;
}

export async function addBookmark(
	userConfig: UserConfiguration,
	path: string,
	currentBookmarks: Bookmark[] = [],
	name: string = ''
): Promise<ErrorMessage> {
	if (!(isAbsolute(path) && existsSync(path) && statSync(path).isDirectory())) {
		return chalk.bold.red(dedent`
			[ ${path} ] is not a valid absolute path to an existing directory.
			Ensure the path:
				(a) is absolute
				(b) already exists
				(c) points to a directory
			`);
	}

	if (!name) {
		const WIZARD_ANSWERS = await prompt([
			{
				message: 'What should this bookmark be called?',
				type: 'input',
				name: 'name',
				transformer: (input: string) => lowerCase(input),
				validate: (answer: string) => {
					return answer.length <= MAX_NAME_LENGTH ? true : `Name can be at most ${MAX_NAME_LENGTH} characters`;
				},
			},
		]);

		name = WIZARD_ANSWERS.name;
	} else {
		if (name.length > MAX_NAME_LENGTH) {
			return chalk.bold.red(`Bookmark name must be no more than ${MAX_NAME_LENGTH} characters long`);
		}

		name = lowerCase(name);
	}

	const EXISTING = existingBookmarkByProperty(path, currentBookmarks, 'path');
	if (EXISTING) {
		EXISTING.name = name;
	} else {
		currentBookmarks.push({ name, path });
	}

	writeBookmarksFile(sortBookmarksByProperty(currentBookmarks, 'name'), userConfig);
}

function existingBookmarkByProperty(newBookmarkPath: string, bookmarks: Bookmark[], property: keyof Bookmark) {
	return bookmarks.find(bm => normalize(bm[property]) === normalize(newBookmarkPath));
}

function sortBookmarksByProperty(bookmarks: Bookmark[], property: keyof Bookmark) {
	return bookmarks.sort((a, b) => a[property].localeCompare(b[property]));
}

function ensureBookmarksFileExists(userConfig: UserConfiguration) {
	const BOOKMARKS_FILE = join(userConfig.bookmarksFilePath, userConfig.bookmarksFileName);

	if (!existsSync(BOOKMARKS_FILE)) {
		mkdirpSync(userConfig.bookmarksFilePath);
		writeFileSync(BOOKMARKS_FILE, prettyJSON(DEFAULT_BOOKMARKS));
	}
}

function writeBookmarksFile(bookmarks: Bookmark[], userConfig: UserConfiguration) {
	const BOOKMARKS_FILE = join(userConfig.bookmarksFilePath, userConfig.bookmarksFileName);

	writeFileSync(BOOKMARKS_FILE, prettyJSON({ bookmarks } as SavedBookmarks));
}
