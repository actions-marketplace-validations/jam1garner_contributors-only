import * as core from '@actions/core'
import * as github from '@actions/github'
import {inspect} from 'util'

async function run(): Promise<void> {
  core.debug('This is contributors-only')

  try {
    const inputs = {
      token: core.getInput('token'),
      repository: core.getInput('repository'),
      comment: core.getInput('comment')
    }
    core.debug(`Inputs: ${inspect(inputs)}`)

    const context = github.context;
    const payload = context.payload;

    if (payload.action !== 'opened') {
      core.debug('No issue or PR was opened, skipping');
      return;
    }

    // Do nothing if its not a pr or issue
    const isIssue: boolean = !!payload.issue;

    if (!isIssue && !payload.pull_request) {
      core.debug(
        'The event that triggered this action was not a pull request or issue, skipping.'
      );
      return;
    }

    if (!payload.sender) {
      throw new Error('Internal error, no sender provided by GitHub');
    }

    const issue: {owner: string; repo: string; number: number} = context.issue;

    const [owner, repo] = inputs.repository.split('/')
    core.debug(`Repo: ${inspect(repo)}`)

    const octokit = github.getOctokit(inputs.token)

    const issueNumber = issue.number;

    core.debug(`User: ${payload.sender.login}`);

    const permissionLevel = (await octokit.rest.repos.getCollaboratorPermissionLevel({
      owner: owner,
      repo: repo,
      username: payload.sender.login,
    })).data.permission;

    core.info(`Permissions: ${permissionLevel}`)
    const allowedToPost: boolean = (permissionLevel === "admin") || (permissionLevel === "write");

    if(!allowedToPost) {
        if (inputs.comment && inputs.comment.length > 0) {
          core.info('Adding a comment before closing the issue')
          await octokit.rest.issues.createComment({
            owner: owner,
            repo: repo,
            issue_number: issueNumber,
            body: inputs.comment
          })
        }

        core.info('Closing the issue')
        await octokit.rest.issues.update({
          owner: owner,
          repo: repo,
          issue_number: issueNumber,
          state: 'closed'
        })
    }
  } catch (error: any) {
    core.debug(inspect(error))
    core.setFailed(error.message)
  }
}

run()
