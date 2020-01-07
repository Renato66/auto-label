const github = require('@actions/github')

const getRepoLabels: Function = async (client: any, labelsNotAllowed: string[] = []) => {
  const {data: list} = await client.issues.listLabelsForRepo({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo
  })
  return list.map((elem: any) => {
    return elem.name
  }).filter((elem: string) => {
    return labelsNotAllowed.find((label: string) => {
      return label.toLowerCase() === elem.toLowerCase()
    }) === undefined
  })
}

const addLabels: Function = async (client: any, issueNumber: number, labels: string[]) => {
  await client.issues.addLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: issueNumber,
    labels: labels
  })
}
export {
  getRepoLabels,
  addLabels
}