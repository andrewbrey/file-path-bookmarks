import * as chalk from 'chalk';
import { existsSync, mkdirpSync, readJSONSync, statSync, writeFileSync } from 'fs-extra';
import { filter } from 'fuzzy';
import { prompt } from 'inquirer';
import { lowerCase } from 'lodash';
import { isAbsolute, join, normalize } from 'path';
import dedent from 'ts-dedent';
import { UserConfiguration } from '../config';
import { addEnvTokens, prettyJSON, removeEnvTokens } from '../util';

export interface Bookmark {
  name: string;
  path: string;
}

export interface SavedBookmarks {
  bookmarks: Bookmark[];
}

export type ErrorMessage = string | undefined;
export interface FuzzyMatchResult {
  top?: Bookmark;
  others: Bookmark[];
}

export const DEFAULT_BOOKMARKS: SavedBookmarks = { bookmarks: [] };
export const MAX_NAME_LENGTH = 20;

export function allBookmarks(userConfig: UserConfiguration) {
  ensureBookmarksFileExists(userConfig);

  const BOOKMARKS_PATH = join(removeEnvTokens(userConfig.bookmarksFilePath), userConfig.bookmarksFileName);
  const USER_BOOKMARKS = readJSONSync(BOOKMARKS_PATH) as SavedBookmarks;

  USER_BOOKMARKS.bookmarks = USER_BOOKMARKS.bookmarks.map(bookmarkWithRealPath);

  return USER_BOOKMARKS;
}

export async function fuzzyFind(search = '', bookmarks: Bookmark[] = []): Promise<FuzzyMatchResult> {
  const MATCHES = filter(search, bookmarks, { extract: ({ name }) => name });

  return {
    top: MATCHES.shift()?.original,
    others: MATCHES.map(({ original }) => original) || [],
  };
}

export async function addBookmark(
  userConfig: UserConfiguration,
  path: string,
  currentBookmarks: Bookmark[] = [],
  name = ''
): Promise<ErrorMessage | void> {
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

  const EXISTING = existingBookmarkByPath(path, currentBookmarks);
  if (EXISTING) {
    EXISTING.name = name;
  } else {
    currentBookmarks.push({ name, path });
  }

  writeBookmarksFile(sortBookmarksByName(currentBookmarks), userConfig);
}

export async function removeBookmark(
  userConfig: UserConfiguration,
  path: string,
  currentBookmarks: Bookmark[] = []
): Promise<void> {
  const EXISTING_IDX = existingBookmarkIndexByPath(path, currentBookmarks);

  if (EXISTING_IDX > -1) {
    currentBookmarks.splice(EXISTING_IDX, 1);
    writeBookmarksFile(sortBookmarksByName(currentBookmarks), userConfig);
  }
}

function existingBookmarkByPath(newBookmarkPath: string, bookmarks: Bookmark[]) {
  return bookmarks.find((bm) => normalize(bm.path) === normalize(newBookmarkPath));
}

function existingBookmarkIndexByPath(newBookmarkPath: string, bookmarks: Bookmark[]) {
  return bookmarks.findIndex((bm) => normalize(bm.path) === normalize(newBookmarkPath));
}

function sortBookmarksByName(bookmarks: Bookmark[]) {
  return bookmarks.sort((a, b) => a.name.localeCompare(b.name));
}

function ensureBookmarksFileExists(userConfig: UserConfiguration) {
  const BOOKMARKS_FILE = join(removeEnvTokens(userConfig.bookmarksFilePath), userConfig.bookmarksFileName);

  if (!existsSync(BOOKMARKS_FILE)) {
    mkdirpSync(userConfig.bookmarksFilePath);
    writeFileSync(BOOKMARKS_FILE, prettyJSON(DEFAULT_BOOKMARKS));
  }
}

function bookmarkWithEnvPath(b: Bookmark): Bookmark {
  return { name: b.name, path: addEnvTokens(b.path) };
}

function bookmarkWithRealPath(b: Bookmark): Bookmark {
  return { name: b.name, path: removeEnvTokens(b.path) };
}

function writeBookmarksFile(bookmarks: Bookmark[], userConfig: UserConfiguration) {
  const BOOKMARKS_FILE = join(removeEnvTokens(userConfig.bookmarksFilePath), userConfig.bookmarksFileName);

  writeFileSync(BOOKMARKS_FILE, prettyJSON({ bookmarks: bookmarks.map(bookmarkWithEnvPath) } as SavedBookmarks));
}
