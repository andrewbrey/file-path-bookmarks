import { Command, flags } from '@oclif/command';
import { cwd } from 'process';
import dedent from 'ts-dedent';
import { addBookmark, allBookmarks } from '../lib/bookmarks';
import { userConfig } from '../lib/config';

export default class Add extends Command {
	static description = 'add a new file path bookmark';

	static examples = [
		dedent`
			$ file-path-bookmarks add
			$ file-path-bookmarks add /some/absolute/path
		`,
	];

	static flags = {
		name: flags.string({
			char: 'n',
			name: 'name',
			description: 'name of this bookmark (will be converted to lower case)',
		}),
		help: flags.help({ char: 'h' }),
	};

	static args = [{ name: 'path', description: 'absolute file path of bookmark', required: false }];

	async run() {
		const { flags, args } = this.parse(Add);

		const USER_CONFIG = await userConfig(this.config);
		const { bookmarks } = allBookmarks(USER_CONFIG);

		const ERROR_MESSAGE = await addBookmark(USER_CONFIG, args.path || cwd(), bookmarks, flags.name);

		if (ERROR_MESSAGE) {
			this.log(ERROR_MESSAGE);
		}
	}
}
