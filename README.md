# Auto-label

![Unit test](https://github.com/Renato66/auto-label/workflows/Unit%20test/badge.svg)

The Auto label action will check for every new issue and automatically adds a label based on the body of the issue. This means that finding specifc issues will be much more easy

## Creating

add a file to `.github/workflows/new-issue.yml`

```yml
name: Labeling new issue

on:
    issues:
        types: [opened] # || [opened, edited]
    
jobs:
  build:
    runs-on: ubuntu-latest

    steps: 
        - uses: Renato66/auto-label@v2.0.0
          with:
              repo-token: ${{ secrets.GITHUB_TOKEN }}
              ignore-comments: true # default true
              labels-not-allowed: 'wontfix|duplicate' # default ''

```

```
# new issue
<!--
Label list: Front end, Bug, Test, Vue
-->
 I found a `bug` in the code 
```