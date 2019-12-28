const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const token = core.getInput('repo-token', {required: true});
    const client = new github.GitHub(token);
    const context = github.context;

    const labels: string[] = getLabels(context.payload.issue.body)

    console.log('adding labels...')
	  await addLabels(client, context.payload.issue.number, labels)
    console.log(`done ${labels.length} labels added`)

  } catch (error) {
    core.setFailed(error.message);
  }
}

async function addLabels(
  client: any,
  issueNumber: number,
  labels: string[]
) {
  await client.issues.addLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: issueNumber,
    labels: labels
  });
}

function getLabels (body: string) {
  let comentary: boolean = false
  let labels: string[] = []
  body.split('\n').forEach((line: string) => {
      if (line.includes('<!--')) {
        comentary = true
      } if (line.includes('-->')) {
        comentary = false
      }
      if (comentary) {
          if (line.includes('[x]')) {
            labels.push(line.split('[x]')[1].trim())
        } 
      }
  })
  return labels
}

run();
