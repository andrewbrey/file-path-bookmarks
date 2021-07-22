import { Command, flags } from '@oclif/command';
import * as chalk from 'chalk';
import { dedent } from 'ts-dedent';
import { promptUserForConfig, userConfig, userConfigIsComplete } from '../lib/config';
import { prettyJSON } from '../lib/util';

export default class Configure extends Command {
  static description = 'show or update bookmark configuration';

  static examples = [
    dedent`
		  $ file-path-bookmarks configure
		  $ file-path-bookmarks configure --show
		`,
  ];

  static flags = {
    show: flags.boolean({ char: 's', name: 'show', description: 'show current configuration' }),
    help: flags.help({ char: 'h' }),
  };

  async run() {
    const { flags } = this.parse(Configure);

    const USER_CONFIG = await userConfig(this.config, true);

    if (flags.show) {
      if (!userConfigIsComplete(USER_CONFIG)) {
        await promptUserForConfig(this.config, USER_CONFIG);
      }

      this.log(prettyJSON(USER_CONFIG));
    } else {
      await promptUserForConfig(this.config, USER_CONFIG);

      this.log(chalk.bold.green(`Configuration saved to [ ${this.config.configDir} ]`));
    }
  }
}
