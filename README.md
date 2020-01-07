# Creating

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