import * as core from '@actions/core';
import { shell } from './utils/shell';

type BranchTypes = 'major' | 'minor' | 'patch';

function bumpVersion(type: BranchTypes): string {
  const { stdout } = shell.exec(
    `yarn version --${type} --no-commit-hooks --no-git-tag-version`,
    { onErrorMessage: `failed to bump package.json version.` },
  );

  const version = (stdout.match(/(?<=New version: )[0-9.]*/g) || [''])[0];

  shell.exec(`sed -i s/{{version}}/${version}/g ./manifest.json`, {
    onErrorMessage: `failed to bump manifest.json version.`,
  });

  return version;
}

async function main() {
  const bumpType = 'patch';
  core.info(`Version bump type: ${bumpType}`);

  const version = bumpVersion(bumpType);

  core.info(`Bump to version: ${version}`);

  shell.exec(`echo "version=${version}" >> $GITHUB_OUTPUT`, {
    onErrorMessage: 'failed to output version.',
  });
}

main();
