import * as core from '@actions/core'
import * as github from '@actions/github'
const { getIssueLabels } = require('./functions')
const { getRepoLabels, addLabels } = require('./github')

export async function run() {
  try {
    const token = core.getInput('repo-token', {required: true})
    const ignoreComments = core.getInput('ignore-comments')
    const labelsNotAllowed = core.getInput('labels-not-allowed').split('|').filter(elem => elem !== "")
    const client = new github.GitHub(token)
    const issue = github.context.payload.issue
    if (issue === undefined) {
      throw new Error('Issue undefined')
    }
    console.log('Getting repository labels...')
    const repoLabels: string = await getRepoLabels(client, labelsNotAllowed)
    console.log(`Repository labels found: ${repoLabels.length}`)

    console.log('Reading labels in issue...')
    const issueLabels: string[] = getIssueLabels(issue.body, repoLabels, ignoreComments)
    console.log(`Labels found: ${issueLabels.length}`)
    if (issueLabels.length !== 0 ) {
      console.log('Adding labels to issue...')
      await addLabels(client, issue.number, issueLabels)
      console.log('Done')
    } else {
      console.log('Done')
    }
  } catch (error) {
    core.setFailed(error.message)
    throw error;
  }
}

run()
