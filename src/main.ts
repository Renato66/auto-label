const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const myInput = core.getInput('myInput');
    core.debug(`Hello ${myInput} from inside a container`);

    // Get github context data
    const context = github.context;
    console.log(`We can even get context data, like the repo2: ${context}`)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
