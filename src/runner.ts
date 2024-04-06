import * as core from '@actions/core'
import * as github from '@actions/github'
import { validate } from './validate'
import { version } from '../package.json'
import { addLabels, getRepoLabels } from './service/github'
import { removeLabelsNotAllowed } from './domain/labelsNotAllowed'
import { getIssueLabels } from './scraper/text'

export async function run() {
  try {
    validate()
    core.info(`*** running renato66/auto-label version ${version} ***`)

    const token = core.getInput('repo-token', {required: true})
    const octokit = github.getOctokit(token)
    const issue = github.context.payload.issue!

    core.startGroup('Getting repository labels')
    const repoLabels = await getRepoLabels(octokit)
    core.info(`Repository labels found: ${repoLabels.length}`)
    const filteredLabels = removeLabelsNotAllowed(repoLabels)
    core.info(`Considered labels: ${filteredLabels.length}`)
    core.endGroup()

    core.startGroup('Getting repository labels')
    const issueLabels: string[] = getIssueLabels(issue.body!, repoLabels)
    core.info(`Labels found: ${issueLabels.length}`)
    core.endGroup()

    if (issueLabels.length !== 0) {
      core.startGroup('Adding labels to issue')
      await addLabels(octokit, issue.number, issueLabels)
      core.endGroup()
    }
    core.info('*** Done ***')
  } catch (error: any) {
    core.setFailed(error)
    throw error
  }
}