import * as core from '@actions/core'
import * as github from '@actions/github'
/**
 * Returns an undefined if the value is valid.
 * Otherwise returns error message.
 *
 * @returns string
 */
export const validate = (): undefined => {
  const errors = []
  const token = core.getInput('repo-token')
  if (!token) {
    errors.push('No token set')
  }
  const issue = github.context.payload.issue
  if (issue === undefined) {
    errors.push('Issue undefined')
  }
  if (errors.length) {
    throw new Error(errors.join(', '))
  }
  return
}
