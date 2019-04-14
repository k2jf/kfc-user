import XLSX from 'xlsx'

export const baseUrl = process.env.VUE_APP_BASE_URL + 'ido/api/v1/'
export const jiraUrl = process.env.VUE_APP_BASE_URL + 'jira/rest/api/2/'

/**
 * use of tailwindcss
 *
 * border:                  border border-solid border-grey-light
 * card-title-bgcolor:      bg-grey-lighter
 * border-radius:           rounded
 */

export const sheetJSFT = [
  'xlsx',
  'xlsb',
  'xlsm',
  'xls',
  'csv',
  'txt',
  'html',
  'htm'
].map(function (x) { return '.' + x }).join(',')

export const makeCols = refstr => Array(XLSX.utils.decode_range(refstr).e.c + 1)
  .fill(0).map((x, i) => ({ name: XLSX.utils.encode_col(i), key: i }))
