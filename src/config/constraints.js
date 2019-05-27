const stress = {
  _checked: false,
  multiple: true,
  name: 'stress',
  combination: '0.70',
  dead: '1.00',
  members: '1.10',
  waveLoad: '1.35',
  windLoad: '1.35',
  limitedValue: [
    {
      name: 'mast',
      operator: 'lt',
      value: 1
    },
    {
      name: 'pile',
      operator: 'lt',
      value: 1
    }
  ]
}

const deflection = {
  _checked: false,
  multiple: true,
  name: 'deflection',
  combination: '0.70',
  dead: '1.00',
  members: '1.00',
  waveLoad: '1.00',
  windLoad: '1.00',
  limitedValue: [
    {
      name: 'D_mudline',
      operator: 'lt',
      value: 1
    },
    {
      name: 'D_pileTip',
      operator: 'lt',
      value: 1
    },
    {
      name: 'D_tilt',
      operator: 'lt',
      value: 1
    },
    {
      name: 'D_settlement',
      operator: 'lt',
      value: 1
    }
  ]
}

const highPileDeflection = {
  _checked: false,
  multiple: true,
  name: 'deflection',
  combination: '0.70',
  dead: '1.00',
  members: '1.00',
  waveLoad: '1.00',
  windLoad: '1.00',
  limitedValue: [
    {
      name: 'D_tilt',
      operator: 'lt',
      value: 1
    },
    {
      name: 'D_settlement',
      operator: 'lt',
      value: 1
    }
  ]
}

const compression = {
  _checked: false,
  multiple: false,
  name: 'compression',
  combination: '0.70',
  dead: '1.10',
  members: '1.10',
  waveLoad: '1.35',
  windLoad: '1.35',
  limitedValue: [
    {
      name: 'allowable',
      operator: 'gt',
      value: -500
    }
  ]
}

const tension = {
  _checked: false,
  multiple: false,
  name: 'tension',
  combination: '0.70',
  dead: '0.90',
  members: '1.10',
  waveLoad: '1.35',
  windLoad: '1.35',
  limitedValue: [
    {
      name: 'allowable',
      operator: 'lt',
      value: 500
    }
  ]
}

const mode = {
  _checked: false,
  multiple: false,
  name: 'mode',
  combination: '0.70',
  dead: '1.00',
  members: '1.00',
  waveLoad: '1.00',
  windLoad: '1.00',
  limitedValue: [
    {
      name: 'frequency',
      operator: 'gt',
      value: 1.1
    },
    {
      name: 'frequency',
      operator: 'lt',
      value: 1.1
    }
  ]
}

const fatigue = {
  _checked: false,
  multiple: false,
  name: 'fatigue',
  limitedValue: [
    {
      name: 'damage',
      operator: 'lt',
      value: 1
    }
  ]
}

export const singlePileConfig = [
  stress,
  deflection,
  compression,
  mode,
  fatigue
]

export const highPileConfig = [
  stress,
  highPileDeflection,
  tension,
  mode
]
