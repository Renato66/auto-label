# Auto-label

![Unit test](https://github.com/Renato66/auto-label/workflows/Unit%20test/badge.svg)

The Auto label action will check for every new issue and automatically adds a label based on the body of the issue. This means that finding specifc issues will be much more easy.

## Creating

Check out the app to make yml file
[https://renato66.github.io/auto-label/](https://renato66.github.io/auto-label/)

or

add a file to `.github/workflows/issue.yml`

```yml
name: Labeling new issue
on:
  issues:
    types: ['opened']
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: Renato66/auto-label@v2
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          ignore-comments: true
          labels-synonyms: '{"bug":["error","need fix","not working"],"enhancement":["upgrade"],"question":["help"]}'
          labels-not-allowed: '["good first issue"]'
          default-labels: '["help wanted"]'
```

### Change bot apperance
If you want to change who added the labels, you can provide a user token

![image](https://user-images.githubusercontent.com/9284273/79672221-678bf080-81a6-11ea-908e-fb875772121a.png)

![image](https://user-images.githubusercontent.com/9284273/79672289-e123de80-81a6-11ea-9faa-237adc0873f0.png)

The [token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) will only need the `public_repo` scope

You will need to provide it as [secret](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) `GITHUB_USER_TOKEN`
and update the issue.yml repo-token with:
`repo-token: ${{ secrets.GITHUB_USER_TOKEN }}`
