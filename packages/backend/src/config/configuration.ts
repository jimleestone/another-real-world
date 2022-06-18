import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import { join } from 'path';
import { DEFAULT_CONFIG_FILE } from 'src/shared/constants';
import Utility from 'src/shared/utils';

export default () => {
  const configuration = yaml.load(
    readFileSync(
      join(
        __dirname,
        !!process.env.NODE_ENV
          ? `config.${process.env.NODE_ENV}.yml`
          : DEFAULT_CONFIG_FILE,
      ),
      'utf8',
    ),
  ) as Record<string, any>;
  // convert keys and extract ENV areas
  return Utility.camelCaseKeysAndExtractEnv(configuration);
};
