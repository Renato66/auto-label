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
      - uses: Renato66/auto-label@v2.1.0
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          labels-synonyms: '{"bug":["error","need fix","not working"],"enhancement":["upgrade"],"question":["help"]}'
          labels-not-allowed: '["good first issue"]'
          default-labels: '["help wanted"]'
```

