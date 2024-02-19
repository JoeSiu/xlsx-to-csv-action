import * as core from '@actions/core'
import { convertXlsxToCsv } from 'xlsx-to-csv-ts'

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

    const result = await convertXlsxToCsv({
      inputFile,
      outputDir: outputDir || './',
      outputFilename: outputFilename || undefined,
      filter: filter ? JSON.parse(filter) : undefined
    })

    core.info(`Output file: ${result.outputPath}`)

    // set the output path as an output of the action
    core.setOutput('outputFile', result.outputPath)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
