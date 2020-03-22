import { Command, flags } from '@oclif/command';

export default class List extends Command {
	static description = 'List all file path bookmarks';

	static examples = [`$ fpb list`];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	async run() {
		this.parse(List);

		this.log('todo: list bookmarks');
	}
}
