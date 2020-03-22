import { IConfig } from '@oclif/config';
import { existsSync, mkdirpSync, readJSONSync, writeFileSync } from 'fs-extra';
import { prompt } from 'inquirer';
import { extname, isAbsolute, join } from 'path';
import { prettyJSON } from '../util';

export interface UserConfiguration {
	bookmarksFileName: string;
	bookmarksFilePath: string;
}

export const CLI_CONFIG_FILE_NAME = 'config.json';
export const DEFAULT_BOOKMARK_FILE_NAME = 'bookmarks.json';

export const DEFAULT_USER_CONFIG: UserConfiguration = {
	bookmarksFileName: DEFAULT_BOOKMARK_FILE_NAME,
	bookmarksFilePath: '',
};

export function userConfigIsComplete(userConfig: UserConfiguration) {
	return userConfig.bookmarksFileName && userConfig.bookmarksFilePath;
}

export async function userConfig(runtime: IConfig, skipConfigure: boolean = false): Promise<UserConfiguration> {
	ensureUserConfigFileExists(runtime);

	const CONFIG_FILE = join(runtime.configDir, CLI_CONFIG_FILE_NAME);
	const USER_CONFIG = readJSONSync(CONFIG_FILE) as UserConfiguration;

	if (userConfigIsComplete(USER_CONFIG) || skipConfigure) {
		return USER_CONFIG;
	}

	return await promptUserForConfig(runtime, USER_CONFIG);
}

export async function promptUserForConfig(runtime: IConfig, userConfig: UserConfiguration) {
	const WIZARD_ANSWERS = await configPrompts(runtime);

	userConfig.bookmarksFileName = WIZARD_ANSWERS.bookmarksFileName;
	userConfig.bookmarksFilePath = WIZARD_ANSWERS.bookmarksFilePath;

	writeUserConfig(runtime, userConfig);

	return userConfig;
}

function ensureUserConfigFileExists(runtime: IConfig) {
	const CONFIG_FILE = join(runtime.configDir, CLI_CONFIG_FILE_NAME);

	if (!existsSync(CONFIG_FILE)) {
		mkdirpSync(runtime.configDir);
		writeFileSync(CONFIG_FILE, prettyJSON(DEFAULT_USER_CONFIG));
	}
}

async function configPrompts(runtime: IConfig) {
	return await prompt([
		{
			type: 'input',
			default: 'bookmarks.json',
			message: 'What should the bookmark file be called?',
			name: 'bookmarksFileName',
			validate: (answer: string) => {
				return extname(answer) === '.json' ? true : 'Must be a json file';
			},
		},
		{
			type: 'input',
			default: runtime.dataDir,
			message: 'Where should bookmark file be saved?',
			name: 'bookmarksFilePath',
			validate: (answer: string) => {
				return isAbsolute(answer) ? true : 'Must be an absolute path';
			},
		},
	]);
}

function writeUserConfig(runtime: IConfig, userConfig: UserConfiguration) {
	const CONFIG_FILE = join(runtime.configDir, CLI_CONFIG_FILE_NAME);

	writeFileSync(CONFIG_FILE, prettyJSON(userConfig));
}
