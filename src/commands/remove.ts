import { Command, flags } from '@oclif/command';
import { cwd } from 'process';
import dedent from 'ts-dedent';
import { allBookmarks, removeBookmark } from '../lib/bookmarks';
import { userConfig } from '../lib/config';

export default class Remove extends Command {
	static description = 'remove an existing file path bookmark';

	static examples = [
		dedent`
			$ file-path-bookmarks remove
			$ file-path-bookmarks remove /some/absolute/path
		`,
	];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	static args = [{ name: 'path', description: 'absolute file path of bookmark (defaults to pwd)', required: false }];

	async run() {
		const { args } = this.parse(Remove);

		const USER_CONFIG = await userConfig(this.config);
		const { bookmarks } = allBookmarks(USER_CONFIG);

		await removeBookmark(USER_CONFIG, args.path || cwd(), bookmarks);
	}
}
