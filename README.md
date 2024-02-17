# xlsx-to-csv-action

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

A GitHub action to convert `.xlsx` file to `.csv` file, with the ability to
filter / rename columns.

## Usage

Create a GitHub action workflow file, e.g., `.github/workflows/sample.yml`

### Input

| Field            | Description                                                                                                   | Required |
| ---------------- | ------------------------------------------------------------------------------------------------------------- | -------- |
| `inputFile`      | Input file path, must be a `.xlsx` file                                                                       | ✅       |
| `outputDir`      | Output directory                                                                                              | ✅       |
| `outputFilename` | Output filename                                                                                               |          |
| `filter`         | A JSON string of the columns to filter and rename<br />e.g., `{ "Segment": "segment", "Country": "country" }` |          |

### Output

| Field        | Description                    |
| ------------ | ------------------------------ |
| `outputFile` | Output file path of the `.csv` |

### Example

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: xlsx To csv Action
    id: xlsx-to-csv-action
    uses: actions/xlsx-to-csv-action@v1 # Commit with the `v1` tag
    with:
      inputFile: './public/sample.xlsx'
      outputDir: './public/'
      outputFilename: 'sample-filtered'
      filter: '{ "Segment": "segment", "Country": "country" }'

  - name: Print Output
    id: output
    run: echo "${{ steps.xlsx-to-csv-action.outputs.outputFile }}"
```
