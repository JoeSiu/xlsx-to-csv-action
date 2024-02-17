import * as core from '@actions/core'
import * as xlsx from 'xlsx'
import * as fs from 'fs'
import path from 'path'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // get the input file and header
    const inputFile = core.getInput('inputFile', { required: true })
    const outputDir = core.getInput('outputDir')
    const outputFilename = core.getInput('outputFilename')
    const filter = core.getInput('filter')

    // check if the file is a xlsx file
    if (!inputFile.endsWith('.xlsx')) {
      throw new Error('The input file must be a xlsx file')
    }

    // read the xlsx file and get the first worksheet
    const workbook = xlsx.readFile(inputFile)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // convert the xlsx to csv
    let csv = xlsx.utils.sheet_to_csv(worksheet)

    // if filter is provided, rename the header row and remove unwanted columns
    if (filter) {
      // parse the filter as a json object
      const filterObj = JSON.parse(filter)

      // split the csv by line
      const lines = csv.split('\n')

      // get the original header row and split by comma
      const header = lines[0].split(',')

      // create a new header row and a map of column indices to keep
      let newHeader = ''
      const columnsToKeep = new Map<number, boolean>()

      // iterate over the original header and check if it matches any key in the filter object
      for (let col = 0; col < header.length; col++) {
        const key = header[col]
        if (Object.hasOwn(filterObj, key)) {
          // if yes, append the corresponding value to the new header and mark the column index to keep
          newHeader += `${filterObj[key]},`
          columnsToKeep.set(col, true)
          if (key !== filterObj[key]) {
            core.info(
              `The column "${key}" have been renamed to "${filterObj[key]}"`
            )
          }
        } else {
          // if no, warn to console and skip the column index
          core.info(
            `The column "${key}" is not listed in the header object and will be removed`
          )
        }
      }

      // remove the trailing comma from the new header
      newHeader = newHeader.slice(0, -1)

      core.info(`The header has been updated to: ${newHeader}`)

      // create a new csv with only the columns to keep
      let newCsv = ''

      // iterate over the lines and split by comma
      for (let row = 0; row < lines.length; row++) {
        // replace the first line of the csv with the new header
        if (row === 0) {
          newCsv += `${newHeader}\n`
          continue
        }

        const values = lines[row].split(',')

        // create a new line with only the values from the columns to keep
        let newLine = ''

        // iterate over the values and check the column index
        for (let i = 0; i < values.length; i++) {
          if (columnsToKeep.has(i)) {
            // if the column index is marked to keep, append the value to the new line
            newLine += `${values[i]},`
          }
        }

        // remove the trailing comma from the new line
        newLine = newLine.slice(0, -1)

        // append the new line to the new csv
        newCsv += `${newLine}\n`
      }

      // replace the csv with the new csv
      csv = newCsv
    }

    // create a new file
    const outputFile = `${path.join(
      outputDir,
      outputFilename || path.basename(inputFile, '.xlsx')
    )}.csv`

    // write the csv content to the new file
    fs.writeFileSync(outputFile, csv)

    // get the output path of the new file
    const outputPath = path.resolve(outputFile)

    core.info(`Output file: ${outputPath}`)

    // set the output path as an output of the action
    core.setOutput('outputFile', outputPath)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
