import * as core from '@actions/core'
// import * as github from '@actions/github'
import { validate } from './validate'
// import {getIssueLabels} from './functions'
// const {getRepoLabels, addLabels} = require('./github')
import { version } from '../package.json'
// import validate from './validate'

export async function run() {
  try {
    core.info(`*** running renato66/auto-label version ${version} ***`)
    validate()
    // const token = core.getInput('repo-token', {required: true})
    // const octokit = github.getOctokit(token)
    // const issue = github.context.payload.issue!
   
    // console.log('Getting repository labels...')
    // const repoLabels: string = await getRepoLabels(octokit)
    // console.log(`Repository labels found: ${repoLabels.length}`)

    // console.log('Reading labels in issue...')
    // const issueLabels: string[] = getIssueLabels(issue.body!, repoLabels)
    // console.log(`Labels found: ${issueLabels.length}`)

    // if (issueLabels.length !== 0) {
    //   console.log('Adding labels to issue...')
    //   await addLabels(octokit, issue.number, issueLabels)
    // }
    core.info('*** Done ***')
  } catch (error: any) {
    core.setFailed(error)
    throw error
  }
}