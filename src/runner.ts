import * as core from '@actions/core'
import * as github from '@actions/github'
import { validate } from './validate'
import { version } from '../package.json'
import { addLabels, getRepoLabels } from './service/github'
import { removeLabelsNotAllowed } from './domain/removeLabelsNotAllowed'
import { getIssueLabels } from './scraper/text'
import { getConfigFile } from './domain/getConfigFile'
import { parseText } from './domain/parseText'

export async function run() {
  try {
    validate()
    core.info(`*** running renato66/auto-label version ${version} ***`)

    core.startGroup('Getting repository configuration')
    const token = core.getInput('repo-token', { required: true })
    const octokit = github.getOctokit(token)
    const issue = github.context.payload.issue!
    const {
      labelsNotAllowed,
      defaultLabels,
      labelsSynonyms,
      ignoreComments,
      includeTitle,
      failoverDefaultLabels
    } = getConfigFile()
    core.endGroup()

    core.startGroup('Getting repository labels')
    const repoLabels = await getRepoLabels(octokit)

    core.info(`Repository labels found: ${repoLabels.length}`)
    const filteredLabels = removeLabelsNotAllowed(repoLabels, labelsNotAllowed)
    core.info(`Considered labels: ${filteredLabels.length}`)
    core.endGroup()

    core.startGroup(`Parsing body${includeTitle ? 'and Title' : ''}`)
    const parsedBody = parseText(
      issue.body || '',
      issue.title || '',
      ignoreComments,
      includeTitle
    )
    core.endGroup()

    core.startGroup('Looking for labels')
    const issueLabels: string[] = getIssueLabels(
      parsedBody,
      repoLabels,
      labelsSynonyms
    )
    core.info(`Labels found: ${issueLabels.length}`)
    core.endGroup()

    core.startGroup('Adding labels to issue')

    if ([...issueLabels, ...defaultLabels, ...failoverDefaultLabels].length) {
      const labels = issueLabels.length ? issueLabels : failoverDefaultLabels
      core.startGroup('Adding labels to issue')
      await addLabels(octokit, issue.number, [...new Set([...labels, ...defaultLabels])])
      core.endGroup()
    }
    core.info('*** Done ***')
  } catch (error: any) {
    core.setFailed(error)
    throw error
  }
}
