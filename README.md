# Contributors Only

A GitHub action to close issues unless the user has write access to the repository.

## Example Workflow

```yml
name: Non-Contributor Issue Closer
on:
  issues:
    types: [opened]
permissions:
  contents: write
  issues: write
jobs:
  autoclose:
    runs-on: ubuntu-latest
    steps:
      - name: Close Issue
        uses: jam1garner/contributors-only@v3
        with:
          comment: Auto-closing issue, user is not a contributor
```

**Note:** may require using a repo-scoped [personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) to function. (If anyone takes the time to figure out what the minimum permissions/access token setup needed is, please submit a PR!)

### Action inputs

| Name | Description | Default |
| --- | --- | --- |
| `token` | `GITHUB_TOKEN` or a `repo` scoped [PAT](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token). | `GITHUB_TOKEN` |
| `repository` | The GitHub repository containing the issue. | Current repository |
| `comment` | A comment to make on the issue before closing. | |

### Accessing issues in other repositories

You can close issues in another repository by using a [PAT](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) instead of `GITHUB_TOKEN`.
The user associated with the PAT must have write access to the repository.

## License

[MIT](LICENSE)
