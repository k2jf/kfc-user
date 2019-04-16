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

export const baseConfig = [
  {
    _checked: false,
    multiple: false,
    name: 'mode',
    limitedValue: [
      {
        name: 'frequency',
        operator: null,
        value: null
      }
    ]
  },
  {
    _checked: false,
    multiple: false,
    name: 'capacity',
    limitedValue: [
      {
        name: 'tolerance',
        operator: null,
        value: null
      }
    ]
  },
  {
    _checked: false,
    multiple: true,
    name: 'deflection',
    limitedValue: [
      {
        name: 'D_mudline',
        operator: null,
        value: null
      },
      {
        name: 'D_pileTip',
        operator: null,
        value: null
      },
      {
        name: 'D_tilt',
        operator: null,
        value: null
      }
    ]
  },
  {
    _checked: false,
    multiple: true,
    name: 'stress',
    limitedValue: [
      {
        name: 'P1',
        operator: null,
        value: null
      },
      {
        name: 'P2',
        operator: null,
        value: null
      }
    ]
  },
  {
    _checked: false,
    multiple: false,
    name: 'fatigue',
    limitedValue: [
      {
        name: 'P1',
        operator: null,
        value: null
      }
    ]
  }
]

/* eslint-disable */
export const baseDictionary = {
  mode:               '模态',
  frequency:          '频率',
  capacity:           '承受力',
  tolerance:          '承受度',
  deflection:         '变形',
  D_mudline:          'D泥面',
  D_pileTip:          'D桩端',
  D_tilt:             'R转角',
  stress:             '应力',
  P1:                 'P1',
  P2:                 'P2',
  fatigue:            '疲劳',
  gt:                 '>',
  gte:                '>=',
  lt:                 '<',
  lte:                '<=',
  eq:                 '='
}
/* eslint-enable */

export const expressions = [
  {
    label: '>',
    value: 'gt'
  },
  {
    label: '>=',
    value: 'gte'
  },
  {
    label: '<',
    value: 'lt'
  },
  {
    label: '<=',
    value: 'lte'
  },
  {
    label: '=',
    value: 'eq'
  }
]
