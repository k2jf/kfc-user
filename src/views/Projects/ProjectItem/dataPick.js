import g6 from '@antv/g6'
import { first, second, third } from './flow'

g6.registerEdge('kk', {
  draw (cfg, group) {
    const startPoint = cfg.startPoint
    const endPoint = cfg.endPoint
    const shape = group.addShape('path', {
      attrs: {
        stroke: '#1e86e0',
        path: [
          ['M', startPoint.x + 35, startPoint.y + 20],
          ['L', startPoint.x + 35, startPoint.y + 60],
          ['L', endPoint.x - 35, endPoint.y + 60],
          ['L', endPoint.x - 35, endPoint.y + 20],
          ['L', endPoint.x - 40, endPoint.y + 30],
          ['L', endPoint.x - 35, endPoint.y + 20],
          ['L', endPoint.x - 30, endPoint.y + 30]
        ]
      }
    })
    return shape
  }
})

function generateData (flow, uuid, num) {
  const parentNodes = flow.map(node => ({
    id: uuid + node.id,
    x: node.id * 90 + 30,
    y: 200 * num,
    label: node.label,
    active: node.active,
    shape: node.shape,
    color: node.color,
    size: node.size,
    style: {
      fill: node.active ? node.color : '#fff'
    },
    labelCfg: {
      style: {
        fill: node.active ? '#fff' : node.color,
        fontSize: 11,
        fontWeight: 'bold'
      }
    }
  }))

  const childNodes = flow.filter(f => f.node).map(node => {
    return {
      id: uuid + '-child' + node.id,
      x: node.id * 90 + 30,
      y: 200 * num - 70,
      label: node.node.label,
      shape: node.node.shape,
      size: [60, 40],
      labelCfg: {
        style: {
          fontWeight: 'bold',
          fontSize: 11
        }
      }
    }
  })

  const parentEdges = flow.map(node => {
    return {
      source: uuid + node.id,
      target: uuid + (node.id + 1),
      style: {
        endArrow: true,
        stroke: node.color
      }
    }
  })

  const childEdgs = flow.filter(f => f.node).map(node => {
    return {
      source: uuid + node.id,
      target: uuid + '-child' + node.id
    }
  })

  return {
    nodes: parentNodes.concat(childNodes),
    edges: parentEdges.concat(childEdgs)
  }
}

export const firstData = generateData(first, 'first', 1)

const secondData = generateData(second, 'second', 2)
secondData.edges = secondData.edges.concat([
  {
    source: 'second4',
    target: 'second3',
    shape: 'kk',
    style: {
      endArrow: true
    }
  },
  {
    source: 'second6',
    target: 'second5',
    shape: 'kk',
    style: {
      endArrow: true
    }
  },
  {
    source: 'second8',
    target: 'second7',
    shape: 'kk',
    style: {
      endArrow: true
    }
  }
])

const thirdData = generateData(third, 'third', 3)
thirdData.edges = thirdData.edges.concat([
  {
    source: 'third4',
    target: 'third3',
    shape: 'kk',
    style: {
      endArrow: true
    }
  },
  {
    source: 'third6',
    target: 'third5',
    shape: 'kk',
    style: {
      endArrow: true
    }
  },
  {
    source: 'third8',
    target: 'third7',
    shape: 'kk',
    style: {
      endArrow: true
    }
  }
])
export { secondData, thirdData }
