import * as github from "@actions/github";

// TODO: get github type
const getRepoLabels = async (client: any): Promise<string[]> => {
  let list: any = [];
  let page: number = 1;
  let hasMorePages: Boolean = false;
  do {
    const { data: labelList } = await client.rest.issues.listLabelsForRepo({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      per_page: 100,
      page: page,
    });
    list = [...list, ...labelList];
    hasMorePages = labelList.length === 100;
    page++;
  } while (hasMorePages);

  return list.map((elem: any) => {
    return elem.name;
  });
};

const addLabels: Function = async (
  client: any,
  issueNumber: number,
  labels: string[]
) => {
  await client.issues.addLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: issueNumber,
    labels: labels,
  });
};
export { getRepoLabels, addLabels };
