// TODO: 本文件应放在 config 文件夹下
export default {
  title: {
    x: 'center',
    textStyle: {
      color: '#7e8692',
      align: 'center',
      lineHeight: '30px'
    }
  },
  xAxis: {
    scale: true, // 是否是脱离 0 值比例，设置成 true 后坐标刻度不会强制包含零刻度。
    axisLine: {
      onZero: false,
      lineStyle: { color: '#b1acac' }
    },
    axisTick: {
      show: true
    },
    axisLabel: {
      color: '#333'
    },
    nameTextStyle: {
      color: '#333',
      fontWeight: 'bold'
    },
    splitLine: { show: false }
  },
  yAxis: {
    scale: true,
    type: 'value',
    axisLine: {
      onZero: false,
      lineStyle: { color: '#b1acac' }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#333'
    },
    nameTextStyle: {
      color: '#333',
      fontWeight: 'bold'
    },
    splitLine: { show: false }
  },
  grid: {
    show: true,
    top: '40',
    left: '1%',
    right: '2%',
    containLabel: true,
    backgroundColor: 'transparent',
    borderwidth: 0,
    borderColor: 'transparent'
  },
  tooltip: {
    axisPointer: {
      type: 'cross'
    }
  },
  // dataZoom: {
  //   type: 'inside'
  // },
  // renderer: 'canvas',
  animation: false,
  legend: {
    show: true
  },
  toolbox: {
    show: true,
    feature: {
      dataZoom: {
        // xAxisIndex: [0],
        // yAxisIndex: false
      },
      dataView: {
        show: false,
        readOnly: false
      },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  }
}
