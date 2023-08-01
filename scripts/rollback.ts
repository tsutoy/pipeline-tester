import { context, getOctokit } from '@actions/github';
import * as fs from 'fs';
import { shell } from './utils/shell';

const RELEASE_ID = process.env.RELEASE_ID || '';
const FRONTEND_AUTO_COMMIT_ID = process.env.FRONTEND_AUTO_COMMIT_ID || '';
const BACKEND_AUTO_COMMIT_ID = process.env.BACKEND_AUTO_COMMIT_ID || '';
const REPO_AUTO_COMMIT_ID = process.env.REPO_AUTO_COMMIT_ID || '';
const TAG_ID = process.env.TAG_ID || '';

const getGitHubToken = () => {
    if (typeof process.env.GITHUB_TOKEN === 'undefined')
      throw new Error('Missing github token from env');
  
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
    if (!GITHUB_TOKEN.length)
      throw new Error("Github token can't be a empty string");
  
    return GITHUB_TOKEN;
  };

async function run() {
  const GITHUB_TOKEN = getGitHubToken();

  const github = getOctokit(GITHUB_TOKEN).rest;
  const repo = context.payload?.repository;

  if (!repo) throw Error('Missing repository from payload');

  const owner = repo.owner;
  const args = { owner: owner.name || owner.login, repo: repo.name };

  if (FRONTEND_AUTO_COMMIT_ID) {
    shell.exec(`git revert ${FRONTEND_AUTO_COMMIT_ID} --no-edit --no-commit`, {
      onErrorMessage: 'failed to revert auto commit.',
    });
  }

  if (BACKEND_AUTO_COMMIT_ID) {
    shell.exec(`git revert ${BACKEND_AUTO_COMMIT_ID} --no-edit --no-commit`, {
      onErrorMessage: 'failed to revert auto commit.',
    });
  }

  if (REPO_AUTO_COMMIT_ID) {
    shell.exec(`git revert ${REPO_AUTO_COMMIT_ID} --no-edit --no-commit`, {
      onErrorMessage: 'failed to revert auto commit.',
    });
  }

  if (FRONTEND_AUTO_COMMIT_ID || BACKEND_AUTO_COMMIT_ID || REPO_AUTO_COMMIT_ID) {
    shell.exec(`echo "REVERT_COMMIT=true" >> $GITHUB_OUTPUT `);
  }

  if (RELEASE_ID) {
    await github.repos.deleteRelease({
      ...args,
      release_id: Number(RELEASE_ID),
    });
  }

  if (TAG_ID) {
    const ref = `tags/${TAG_ID}`;
    await github.git.deleteRef({ ...args, ref });
  }
}

run();
