import { Command, flags } from '@oclif/command';
import * as chalk from 'chalk';
import { cli } from 'cli-ux';
import { allBookmarks } from '../lib/bookmarks';
import { userConfig } from '../lib/config';

export default class List extends Command {
	static description = 'List all file path bookmarks';

	static examples = [`$ fpb list`];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	async run() {
		this.parse(List);

		const USER_CONFIG = await userConfig(this.config, true);
		const { bookmarks } = allBookmarks(USER_CONFIG);

		cli.table(
			bookmarks,
			{
				name: {
					minWidth: 5,
					get: ({ name }) => chalk.bold.whiteBright(name),
				},
				path: {
					get: ({ path }) => chalk.blue(path),
				},
			},
			{
				'no-header': true,
				sort: 'name',
			}
		);
	}
}
