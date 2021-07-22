import { Command, flags } from '@oclif/command';
import { map } from 'lodash';
import dedent from 'ts-dedent';
import { allBookmarks, fuzzyFind } from '../lib/bookmarks';
import { userConfig } from '../lib/config';

export default class Find extends Command {
  static description = 'find a saved bookmark';

  static examples = [
    dedent`
			$ file-path-bookmarks find "project folder"
			$ file-path-bookmarks find blog
		`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [{ name: 'name', description: 'bookmark name to search for' }];

  async run() {
    const { args } = this.parse(Find);

    const USER_CONFIG = await userConfig(this.config);
    const { bookmarks } = allBookmarks(USER_CONFIG);

    const { top, others } = await fuzzyFind(args.name, bookmarks);

    if (others.length) {
      this.warn(dedent`
				Matching alternatives [ "${map(others, 'name').join('", "')}" ]
			`);
    }

    if (top) {
      this.log(top.path);
    } else {
      this.error(`No bookmark found for [ ${args.name} ]`, { exit: 1 });
    }
  }
}
