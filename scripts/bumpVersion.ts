import * as core from '@actions/core';
import { shell } from './utils/shell';

type BranchTypes = 'major' | 'minor' | 'patch';

function bumpVersion(type: BranchTypes): string {
  const { stdout } = shell.exec(
    `yarn version --${type} --no-commit-hooks --no-git-tag-version`,
    { onErrorMessage: `failed to bump package.json version.` },
  );

  const newVersion = (stdout.match(/(?<=New version: )[0-9.]*/g) || [''])[0];
  const oldVersion = (stdout.match(/(?<=Current version: )[0-9.]*/g) || [''])[0];

  return { newVersion, oldVersion };
}

async function main() {
  const bumpType = 'patch';
  core.info(`Version bump type: ${bumpType}`);

  const { newVersion, oldVersion } = bumpVersion(bumpType);

  core.info(`Bump to version: ${newVersion}`);

  shell.exec(`echo "new_version=${newVersion}" >> $GITHUB_OUTPUT`, {
    onErrorMessage: 'failed to output version.',
  });

  shell.exec(`echo "old_version=${oldVersion}" >> $GITHUB_OUTPUT`, {
    onErrorMessage: 'failed to output version.',
  });
}

main();
