# Creating

add a file to `.github/workflows/new-issue.yml`

```yml
name: Labeling new issue

on:
    issues:
        types: [opened]
    
jobs:
  build:
    runs-on: ubuntu-latest

    steps: 
        - uses: Renato66/labeler@master
          with:
              repo-token: ${{ secrets.GITHUB_TOKEN }}
              allow-create: false # default false
              is-hidden: true # default false
```

```
# new issue
<!--
- [] valid-label-1
- [x] valid-label-2
-->
- [] valid-label-3
- [x] valid-label-4

```
labels: valid-label-2