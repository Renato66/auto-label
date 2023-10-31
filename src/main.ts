import * as core from '@actions/core'
import * as github from '@actions/github'
import {getIssueLabels} from './functions'
const {getRepoLabels, addLabels} = require('./github')

export async function run() {
  try {
    console.log('*** running renato66/auto-label version 2.3.1 ***')
    const token = core.getInput('repo-token', {required: true})
    const client = new github.GitHub(token)
    const issue = github.context.payload.issue
    if (issue === undefined) {
      console.log('Issue undefined')
      return
    }
    if (issue.body === undefined) {
      console.log('Issue body undefined')
      return
    }
    console.log('Getting repository labels...')
    const repoLabels: string = await getRepoLabels(client)
    console.log(`Repository labels found: ${repoLabels.length}`)

    console.log('Reading labels in issue...')
    const issueLabels: string[] = getIssueLabels(issue.body, repoLabels)
    console.log(`Labels found: ${issueLabels.length}`)

    if (issueLabels.length !== 0) {
      console.log('Adding labels to issue...')
      await addLabels(client, issue.number, issueLabels)
    }
    console.log('Done')
  } catch (error) {
    core.setFailed(error.message)
    throw error
  }
}

run()
