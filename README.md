# Auto-label

[![GitHub Checks Workflow Status](https://img.shields.io/github/actions/workflow/status/Renato66/auto-label/checks.yml?logo=github&label=Build)](https://github.com/Renato66/auto-label/actions/workflows/checks.yml)
[![Auto Label](https://img.shields.io/github/actions/workflow/status/Renato66/auto-label/auto-label.yml?logo=github&label=Auto%20Label)](https://github.com/Renato66/auto-label/actions/workflows/auto-label.yml)
[![Codecov](https://img.shields.io/codecov/c/github/renato66/auto-label?logo=codecov)](https://codecov.io/gh/Renato66/auto-label)
[![Usage](https://img.shields.io/badge/used_by-125-blue?logo=githubactions&logoColor=FFF&logoSize=small)](https://github.com/search?q=%22uses%3A+renato66%2Fauto-label%22+path%3A.github%2Fworkflows&type=code)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/Renato66/auto-label/assets/9284273/2913d95b-0c38-4183-9663-fb5c659fe851">
  <img alt="Example" src="https://github.com/Renato66/auto-label/assets/9284273/b913689a-e1dd-4d04-85be-0d542199b7db">
</picture>

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
            .github/workflows/auto-label.json5
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
| configuration-file | Configuration file path             | false    | .github/workflows/auto-label.json5 | [...](#configuration-file) |
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

Configuration file can be created at any place at your repository, it will need another [action](https://github.com/actions/checkout?tab=readme-ov-file#fetch-only-a-single-file) to get the file like:

```yml
      - uses: actions/checkout@v4
        with:
          sparse-checkout: |
            .github/workflows
```

and it will look for any file named `auto-label` with the extension `JSON` or `JSON5` or `JSONC` but you can also define a specific extension

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

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/Renato66/auto-label/assets/9284273/775b53f3-356d-4b7c-8c71-ed007beb6bf1">
  <img alt="Example" src="https://github.com/Renato66/auto-label/assets/9284273/ab29c070-e511-4a25-ac34-784842b93d77">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/Renato66/auto-label/assets/9284273/edc852c3-4962-475b-8da7-ac61bd340a2b">
  <img alt="Example" src="https://github.com/Renato66/auto-label/assets/9284273/aedcdd0b-c538-437f-96cc-c4331a7c328c">
</picture>

The [token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) will only need the `public_repo` scope

You will need to provide it as [secret](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) `GITHUB_USER_TOKEN`
and update the issue.yml repo-token with:
`repo-token: ${{ secrets.GITHUB_USER_TOKEN }}`

### Ignore Comments

If you prefer to leave as default (true) You can provide a list of labels in a [template](https://help.github.com/en/github/building-a-strong-community/configuring-issue-templates-for-your-repository#configuring-the-template-chooser) for the author to choose which labels are available to pick
But if you prefer to set it as false, the author can set the labels inside a comment so it doesn't appear on issue body

```json5
// .github/workflows/auto-label.json5
{
  "ignoreComments": true
}
```

<details>
  <summary>yml (deprecating)</summary>

  ```yml
  ignore-comments: true
  ```
</details>


#### Scoped blocks

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

```json5
// .github/workflows/auto-label.json5
{
  "labelsSynonyms": {"C: VCombobox": ["combobox", "v-combobox", "combo box"]}
}
```

<details>
  <summary>yml (deprecating)</summary>

  ```yml
  labels-synonyms: '{"C: VCombobox":["combobox","v-combobox","combo box"]}'
  ```
</details>

### Labels Not Allowed

Some labels are restricted to repo owners such as `needs priority` `testing` `won't fix` they can be set in an Array form:

```json5
// .github/workflows/auto-label.json5
{
  "labelsNotAllowed": ["needs priority", "testing", "won't fix"]
}
```

<details>
  <summary>yml (deprecating)</summary>

  ```yml
  labels-not-allowed: '["needs priority","testing","won't fix"]'
  ```
</details>

### Default Labels

Labels that will always be set when an issue is created/updated such as `triage`, they can be set in an Array form:

```json5
// .github/workflows/auto-label.json5
{
  "defaultLabels": ["needs priority", "testing", "won't fix"]
}
```

<details>
  <summary>yml (deprecating)</summary>

  ```yml
  default-labels: '["triage"]'
  ```
</details>

### Failover Labels

Labels that will be set when an issue is created/updated they no labels found in the text, they will be set even if default labels are set
they can be set in an Array form:

```json5
// .github/workflows/auto-label.json5
{
  "failoverLabels": ["need more information"]
}
```

<details>
  <summary>yml (deprecating)</summary>

  ```yml
  failover-labels: '["need more information"]'
  ```
</details>


## Badge

To add a badge simple replace <OWNER>, <REPOSITORY> and <FILE-NAME> name:

```markdown
[![Auto Label](https://img.shields.io/github/actions/workflow/status/<OWNER>/<REPOSITORY>/<FILE-NAME>.yml?logo=github&label=Auto%20Label)](https://github.com/Renato66/auto-label)
```
