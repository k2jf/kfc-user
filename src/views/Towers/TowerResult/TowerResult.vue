<template>
  <div class="tower-result h-full w-full">
    <Row>
      <ICol span="12">
        <BarChart :series="barSeries" />
      </ICol>
      <ICol span="12">
        <!-- <BarChart /> -->
      </ICol>
      <ICol span="12">
        <!-- <BarChart /> -->
      </ICol>
      <ICol span="12">
        <!-- <BarChart /> -->
      </ICol>
    </Row>
  </div>
</template>

<script>
import { BarChart } from '@/components/Charts'
import { Row, Col } from 'iview'

export default {
  name: 'TowerResult',
  components: {
    BarChart,
    Row,
    ICol: Col
  },
  data: () => ({
    results: {}
  }),
  computed: {
    barSeries () {
      const { optWeight, checkedWeight } = this.results
      if (!optWeight || !checkedWeight) return []
      const _series = Object.keys(optWeight).map(ele => ({
        name: optWeight[ele].name,
        type: 'bar',
        stack: 'weight',
        // label: {
        //   normal: {
        //     show: true,
        //     position: 'insideRight'
        //   }
        // },
        itemStyle: {
          normal: {
          },
          emphasis: {
            barBorderWidth: 1,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0,0,0,0.5)'
          }
        },
        data: [0, 0, this.strip(checkedWeight[ele].data), this.strip(optWeight[ele].data)]
      }))
      return _series
    },
    // stepLineSeries () {
    //   const { towerCheck, optResult } = this.results
    //   if (!towerCheck || !optResult) return []
    //   const _check = towerCheck.items.map(t => ([t[0], t[1]]))
    //   const _opt = optResult.items.map(o => ([o[0], o[4]]))

    // },
    towerCheck () {
      return {

      }
    },
    optResult () {
      return {

      }
    }
  },
  mounted () {
    this.getTaskResult()
  },
  methods: {
    async getTaskResult () {
      const res = await this.$get(`towerTasks/${this.$route.params.taskId}/result`)
      this.results = res.body
    },
    strip (num) {
      return parseFloat(num.toFixed(3))
    }
  }
}
</script>
<style lang="less">
  .tower-result .ido-bar-chart {
    width: 100%;
    height: 360px;
    padding: 0 30px;
  }
</style>
