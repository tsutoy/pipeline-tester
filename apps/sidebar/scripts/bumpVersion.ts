import * as core from '@actions/core';
import { shell } from './utils/shell';

type BranchTypes = 'major' | 'minor' | 'patch';

function bumpVersion(type: BranchTypes, context: 'repo' | 'frontend'): string {
  const rootDir = shell.pwd();

  const path = {
    repo: '../..',
    frontend: '.',
  };

  shell.cd(`${path[context]}`);

  const { stdout } = shell.exec(
    `yarn version --${type} --no-commit-hooks --no-git-tag-version`,
    { onErrorMessage: `failed to bump package.json version.` },
  );

  const version = (stdout.match(/(?<=New version: )[0-9.]*/g) || [''])[0];

  shell.cd(rootDir);

  return version;
}

async function main() {
  const bumpType = 'patch';
  core.info(`Version bump type: ${bumpType}`);

  const frontendVersion = bumpVersion(bumpType, 'frontend');

  core.info(`Bump frontend to version: ${frontendVersion}`);

  const repoVersion = bumpVersion(bumpType, 'repo');

  core.info(`Bump repository to version: ${repoVersion}`);

  shell.exec(`echo "frontend_version=${frontendVersion}" >> $GITHUB_OUTPUT`, {
    onErrorMessage: 'failed to output version.',
  });

  shell.exec(`echo "repo_version=${repoVersion}" >> $GITHUB_OUTPUT`, {
    onErrorMessage: 'failed to output version.',
  });
}

main();
