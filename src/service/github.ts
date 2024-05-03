import * as github from '@actions/github'
import type { GitHub } from '@actions/github/lib/utils'

const getRepoLabels = async (
  client: InstanceType<typeof GitHub>
): Promise<string[]> => {
  let list: string[] = []
  let page = 1
  let hasMorePages = false
  do {
    const { data: labelList } = await client.rest.issues.listLabelsForRepo({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      per_page: 100,
      page
    })
    list = [...list, ...labelList.map((elem) => elem.name)]
    hasMorePages = labelList.length === 100
    page++
  } while (hasMorePages)

  return list
}

const addLabels = async (
  client: InstanceType<typeof GitHub>,
  issueNumber: number,
  labels: string[]
) => {
  await client.rest.issues.addLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: issueNumber,
    labels
  })
}
export { getRepoLabels, addLabels }
