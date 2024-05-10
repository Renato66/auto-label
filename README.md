# Auto-label

![Unit test](https://github.com/Renato66/auto-label/workflows/Unit%20test/badge.svg)
[![Auto Label](https://github.com/Renato66/auto-label/workflows/Labeling%20new%20issue/badge.svg)](https://github.com/Renato66/auto-label)

![image](https://user-images.githubusercontent.com/9284273/79672530-57c1db80-81a9-11ea-900c-3b4f73984e0a.png)

The Auto label action will check for every new issue and automatically adds a label based on the body of the issue. This means that finding specific issues will be much easier.

## Creating

Add a file to `.github/workflows/auto-label.yml`

```yml
name: Labeling new issue
on:
  issues:
    types: ['opened']
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          sparse-checkout: |
            .github/workflows
          sparse-checkout-cone-mode: false
      - uses: Renato66/auto-label@v3
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

Add a config file to `.github/workflows/auto-label.json5`

```json5
// see inputs for more examples
{
  labelsSynonyms: {
    bug: ['error', 'need fix', 'not working'],
    enhancement: ['upgrade'],
    question: ['help', 'how can i']
  },
  labelsNotAllowed: [
    'documentation',
    'duplicate',
    'good first issue',
    'help wanted',
    'invalid'
  ],
  defaultLabels: ['triage'],
  ignoreComments: true
}
```


## Inputs

| Name               | Description                         | Required | Default                            |          Examples          |
| ------------------ | ----------------------------------- | -------- | ---------------------------------- | :------------------------: |
| repo-token         | GitHub token for the repository     | true     | -                                  | [...](#repo-token)         |
| configuration-file | Configuration file path             | true     | .github/workflows/auto-label.json5 | [...](#configuration-file) |
| ignore-comments    | Ignore labels inside issue comments | false    | true                               | [...](#ignore-comments)    |
| labels-synonyms    | Text synonyms for labels            | false    | -                                  | [...](#labels-synonyms)    |
| labels-not-allowed | Labels to ignore                    | false    | -                                  | [...](#labels-not-allowed) |
| default-labels     | Labels that will always be set      | false    | -                                  | [...](#default-labels)     |

### Repo Token

Repo token is provided automatically by GitHub; just need to add

```
repo-token: ${{ secrets.GITHUB_TOKEN }}
```

### Configuration File

Configuration file can be created at any place at your repository, it will need another action to get the file like:

```yml
      - uses: actions/checkout@v4
        with:
          sparse-checkout: |
            .github/workflows/
          sparse-checkout-cone-mode: false
```

and it will look for any file named auto-label with the extension `JSON` or `JSON5` or `JSONC` but you can also define a specific extension

```yml
      - uses: actions/checkout@v4
        with:
          sparse-checkout: |
            .github/workflows/auto-label.json5
          sparse-checkout-cone-mode: false
```

to set another place to store your configuration file, you should checkout and point with `configuration-file` input:

```yml
      - uses: actions/checkout@v4
        with:
          sparse-checkout: |
            src/actions/configuration.json
          sparse-checkout-cone-mode: false
      - uses: Renato66/auto-label@v3
        with:
          configuration-file: 'src/actions/configuration.json'
```



#### Change bot appearance

If you want to change who added the labels, you can provide a user token

![image](https://user-images.githubusercontent.com/9284273/79672221-678bf080-81a6-11ea-908e-fb875772121a.png)

![image](https://user-images.githubusercontent.com/9284273/79672289-e123de80-81a6-11ea-9faa-237adc0873f0.png)

The [token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) will only need the `public_repo` scope

You will need to provide it as [secret](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) `GITHUB_USER_TOKEN`
and update the issue.yml repo-token with:
`repo-token: ${{ secrets.GITHUB_USER_TOKEN }}`

### Ignore Comments

If you prefer to leave as default (true) You can provide a list of labels in a [template](https://help.github.com/en/github/building-a-strong-community/configuring-issue-templates-for-your-repository#configuring-the-template-chooser) for the author to choose which labels are available to pick
But if you prefer to set it as false, the author can set the labels inside a comment so it doesn't appear on issue body

### Scoped blocks

You can set a custom part of your issue/pr to be labeled using this structure:

```
Some text that could have a label that wouldn't be set
<!-- AUTO-LABEL:START -->
Another text that could have a label and will be set as a label
<!-- AUTO-LABEL:END -->
```

thanks to [@dielduarte](https://github.com/dielduarte) and [@PauloGoncalvesBH](https://github.com/PauloGoncalvesBH)

### Labels Synonyms

Sometimes labels can be set upon other texts, as an example, if you have a label like `C: VCombobox` it would be hard to match the label in a normal issue, but you can provide a JSON to set it synonyms:

```
labels-synonyms: '{"C: VCombobox":["combobox","v-combobox","combo box"]}'
```

### Labels Not Allowed

Some labels are restricted to repo owners such as `needs priority` `testing` `won't fix` they can be set in an Array form:

```
labels-not-allowed: '["needs priority","testing","won't fix"]'
```

### Default Labels

Labels that will always be set when an issue is created/updated such as `triage`, they can be set in an Array form:

```
default-labels: '["triage"]'
```

## Badge

To add a badge simple replace owner and repository

<!-- Replace <OWNER> and <REPOSITORY>. It assumes workflow name is "Labeling%20new%20issue" -->

[![Auto Label](https://github.com/Renato66/auto-label/workflows/Labeling%20new%20issue/badge.svg)](https://github.com/Renato66/auto-label)

```
<!-- Replace <OWNER> and <REPOSITORY>. It assumes workflow name is "Labeling%20new%20issue" -->
[![Auto Label](https://github.com/<OWNER>/<REPOSITORY>/workflows/Labeling%20new%20issue/badge.svg)](https://github.com/Renato66/auto-label)
```
