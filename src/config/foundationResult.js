export const monopile = [
  {
    title: '应力-UC杆件',
    key: 'pile',
    render: (h, params) => {
      const value = params.row.pile || '-'
      return h('div', [value])
    }
  },
  {
    title: '应力-UC桩',
    key: 'mast',
    render: (h, params) => {
      const value = params.row.mast || '-'
      return h('div', [value])
    }
  },
  {
    title: '变形-D泥面(cm)',
    key: 'd_mudline',
    render: (h, params) => {
      const value = params.row.d_mudline || '-'
      return h('div', [value])
    }
  },
  {
    title: '变形-D桩端(cm)',
    key: 'd_pileTip',
    render: (h, params) => {
      const value = params.row.d_pileTip || '-'
      return h('div', [value])
    }
  },
  {
    title: '变形-R转角(rad)',
    key: 'd_tilt',
    render: (h, params) => {
      const value = params.row.d_tilt || '-'
      return h('div', [value])
    }
  },
  {
    title: '变形-S沉降(cm)',
    key: 'd_settlement',
    render: (h, params) => {
      const value = params.row.d_settlement || '-'
      return h('div', [value])
    }
  },
  {
    title: '抗压承载力(kN)',
    key: 'compression',
    render: (h, params) => {
      const value = params.row.compression || '-'
      return h('div', [value])
    }
  },
  {
    title: '频率(Hz)',
    key: 'frequency',
    render: (h, params) => {
      const value = params.row.frequency || '-'
      return h('div', [value])
    }
  },
  {
    title: 'D损伤',
    key: 'damage',
    render: (h, params) => {
      const value = params.row.damage || '-'
      return h('div', [value])
    }
  }
]

export const highMonopile = [
  {
    title: '应力-UC杆件',
    key: 'pile',
    render: (h, params) => {
      const value = params.row.pile || ''
      return h('div', [value])
    }
  },
  {
    title: '应力-UC桩',
    key: 'mast',
    render: (h, params) => {
      const value = params.row.mast || '-'
      return h('div', [value])
    }
  },
  {
    title: '变形-R基础顶转角(rad)',
    width: 180,
    key: 'd_tilt',
    render: (h, params) => {
      const value = params.row.d_tilt || '-'
      return h('div', [value])
    }
  },
  {
    title: '变形-S沉降(cm)',
    key: 'd_settlement',
    render: (h, params) => {
      const value = params.row.d_settlement || '-'
      return h('div', [value])
    }
  },
  {
    title: '抗压承载力(kN)',
    key: 'compression',
    render: (h, params) => {
      const value = params.row.compression || '-'
      return h('div', [value])
    }
  },
  {
    title: '抗拔承载力(kN)',
    key: 'tension',
    render: (h, params) => {
      const value = params.row.tension || '-'
      return h('div', [value])
    }
  },
  {
    title: '模态-频率(Hz)',
    key: 'frequency',
    render: (h, params) => {
      const value = params.row.frequency || '-'
      return h('div', [value])
    }
  }
]
