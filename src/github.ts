import {getLabelsNotAllowed} from './functions'
import * as github from '@actions/github'

const getRepoLabels: Function = async (client: any) => {
  const labelsNotAllowed = getLabelsNotAllowed()
  let list: any = []
  let page: number = 1
  let hasMorePages: Boolean = false
  do {
    const {data: labelList} = await client.issues.listLabelsForRepo({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      per_page: 100,
      page: page
    })
    list = [...list, ...labelList]
    hasMorePages = labelList.length === 100
    page++
  } while (hasMorePages)

  return list
    .map((elem: any) => {
      return elem.name
    })
    .filter((elem: string) => {
      return (
        labelsNotAllowed.find((label: string) => {
          return label.toLowerCase() === elem.toLowerCase()
        }) === undefined
      )
    })
}

const addLabels: Function = async (
  client: any,
  issueNumber: number,
  labels: string[]
) => {
  await client.issues.addLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: issueNumber,
    labels: labels
  })
}
export {getRepoLabels, addLabels}
