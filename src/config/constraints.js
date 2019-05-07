const stress = {
  _checked: false,
  multiple: true,
  name: 'stress',
  combination: '',
  dead: '',
  members: '',
  waveLoad: '',
  windLoad: '',
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
}

const deflection = {
  _checked: false,
  multiple: true,
  name: 'deflection',
  combination: '',
  dead: '',
  members: '',
  waveLoad: '',
  windLoad: '',
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
    },
    {
      name: 'D_settlement',
      operator: null,
      value: null
    }
  ]
}

const highPileDeflection = {
  _checked: false,
  multiple: true,
  name: 'deflection',
  combination: '',
  dead: '',
  members: '',
  waveLoad: '',
  windLoad: '',
  limitedValue: [
    {
      name: 'D_tilt',
      operator: null,
      value: null
    },
    {
      name: 'D_settlement',
      operator: null,
      value: null
    }
  ]
}

const compression = {
  _checked: false,
  multiple: false,
  name: 'compression',
  combination: '',
  dead: '',
  members: '',
  waveLoad: '',
  windLoad: '',
  limitedValue: [
    {
      name: 'allowable',
      operator: null,
      value: null
    }
  ]
}

const tension = {
  _checked: false,
  multiple: false,
  name: 'tension',
  combination: '',
  dead: '',
  members: '',
  waveLoad: '',
  windLoad: '',
  limitedValue: [
    {
      name: 'allowable',
      operator: null,
      value: null
    }
  ]
}

const mode = {
  _checked: false,
  multiple: false,
  name: 'mode',
  combination: '',
  dead: '',
  members: '',
  waveLoad: '',
  windLoad: '',
  limitedValue: [
    {
      name: 'frequency',
      operator: null,
      value: null
    }
  ]
}

const fatigue = {
  _checked: false,
  multiple: false,
  name: 'fatigue',
  combination: '',
  dead: '',
  members: '',
  waveLoad: '',
  windLoad: '',
  limitedValue: [
    {
      name: 'P1',
      operator: null,
      value: null
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
