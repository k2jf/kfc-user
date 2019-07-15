<template>
  <div class="foundation-chart-result h-full overflow-hidden">
    <Row style="height:100%;">
      <ICol class="h-half">
        <h3 class="text-center">
          几何尺寸图
        </h3>
        <div class="charts relative">
          <aside
            class="absolute"
            :style="{
              height: geoOperator === 'Close' ? '40px': '24px'
            }">
            <div class="xaxis axis flex" v-show="geoOperator === 'Close'">
              <div class="flex-2">
                xAxis
              </div>
              <div class="flex-3">
                <Select
                  style="width:90%;"
                  size="small"
                  v-model="geoAxis"
                  @on-change="handleChange($event, 'xAxis')">
                  <Option :value="item.index" v-for="(item, ind) in geoAxes" :key="ind">
                    {{ item.name }}
                  </Option>
                </Select>
              </div>
            </div>
            <div class="btn" @click="geoOperator = geoOperator === 'Close' ? 'Open' : 'Close'">
              {{ geoOperator }} Controls
            </div>
          </aside>
          <Chart :options="geoOptions" autoresize />
        </div>
      </ICol>
      <ICol class="h-half">
        <h3 class="text-center">
          位移图
        </h3>
        <div class="charts relative">
          <aside
            class="absolute"
            :style="{
              height: placeOperator === 'Close' ? '40px': '24px'
            }">
            <div class="xaxis axis flex" v-show="placeOperator === 'Close'">
              <div class="flex-2">
                xAxis
              </div>
              <div class="flex-3">
                <Select
                  style="width:90%;"
                  size="small"
                  v-model="placeAxis"
                  @on-change="handlePlaceChange($event, 'xAxis')">
                  <Option :value="item.index" v-for="(item, ind) in placeAxes" :key="ind">
                    {{ item.name }}
                  </Option>
                </Select>
              </div>
            </div>
            <div class="btn" @click="placeOperator = placeOperator === 'Close' ? 'Open' : 'Close'">
              {{ placeOperator }} Controls
            </div>
          </aside>
          <Chart :options="placeOptions" autoresize />
        </div>
      </ICol>
    </Row>
  </div>
</template>

<script>
import { Select, Option, Row, Col } from 'iview'
import options from '@/config/echartConf'

export default {
  components: {
    Select,
    Option,
    Row,
    ICol: Col
  },
  data () {
    return {
      geoOperator: 'Close',
      geoAxes: [],
      geoOptions: {},
      geoAxis: 1,
      placeOperator: 'Close',
      placeAxes: [],
      placeOptions: {},
      placeAxis: 1
    }
  },
  mounted () {
    this.initGeo()
    this.initPlace()
  },
  methods: {
    async initGeo () {
      const res = await this.$get(`foundations/${this.$route.params.foundationId}/geometry`)
      console.log(res)
      this.geoAxes = res.body.schema.filter(s => s.show)
      this.geoYaxis = res.body.schema[0].name
      this.items = res.body.items
      this.geoOptions = Object.assign({}, options, {
        grid: {
          ...options.grid,
          right: 80,
          left: 50,
          bottom: 100
        },
        toolbox: {
          ...options.toolbox,
          orient: 'vertical',
          top: 80
        },
        legend: {
          show: false
        },
        tooltip: {
          trigger: 'item',
          formatter: function (obj) {
            const value = obj.value
            return (
              `<div>
            ${res.body.schema[0].name}：${value[1]}
            </div>
            <div>
            ${res.body.schema[1].name}：${value[0]}
          </div>
          `)
          },
          axisPointer: {
            type: 'cross'
          }
        },
        yAxis: {
          ...options.yAxis,
          name: res.body.schema[0].name,
          nameLocation: 'center',
          nameGap: 40
        },
        xAxis: {
          ...options.xAxis,
          name: res.body.schema[1].name,
          nameLocation: 'center',
          nameGap: 30,
          axisLine: { onZero: true }
        },
        series: [{
          name: res.body.schema[1].name,
          type: 'scatter',
          data: res.body.items.map(item => [item[1], item[0]])
        }]
      })
    },
    async initPlace () {
      const res = await this.$get(`foundations/${this.$route.params.foundationId}/displacement`)
      this.placeAxes = res.body.schema.filter(s => s.show)
      this.placeYaxis = res.body.schema[0].name
      this.placeItems = res.body.items
      this.placeOptions = Object.assign({}, options, {
        grid: {
          ...options.grid,
          right: 80,
          left: 50,
          bottom: 100
        },
        toolbox: {
          ...options.toolbox,
          orient: 'vertical',
          top: 80
        },
        legend: {
          show: false
        },
        tooltip: {
          trigger: 'item',
          formatter: function (obj) {
            const value = obj.value
            return (
              `<div>
            ${res.body.schema[0].name}：${value[1]}
            </div>
            <div>
            ${res.body.schema[1].name}：${value[0]}
          </div>
          `)
          },
          axisPointer: {
            type: 'cross'
          }
        },
        yAxis: {
          ...options.yAxis,
          name: res.body.schema[0].name,
          nameLocation: 'center',
          nameGap: 40
        },
        xAxis: {
          ...options.xAxis,
          name: res.body.schema[1].name,
          nameLocation: 'center',
          nameGap: 30
        },
        series: [{
          name: res.body.schema[1].name,
          type: 'scatter',
          data: res.body.items.map(item => [item[1], item[0]])
        }]
      })
    },
    handleChange (index, key) {
      this.geoOptions[key].name = this.geoAxes.find(ele => ele.index === index).name
      this.geoOptions.series[0].data = this.items.map(item => [item[index], item[0]])
      this.geoOptions.series[0].name = this.geoAxes.find(ele => ele.index === index).name
      this.geoOptions.tooltip.formatter = obj => {
        const value = obj.value
        return (
          `<div>
            ${this.geoYaxis}：${value[1]}
            </div>
            <div>
            ${this.geoAxes[index - 1].name}：${value[0]}
          </div>
          `)
      }
    },
    handlePlaceChange (index, key) {
      this.placeOptions[key].name = this.placeAxes.find(ele => ele.index === index).name
      this.placeOptions.series[0].data = this.placeItems.map(item => [item[index], item[0]])
      this.placeOptions.series[0].name = this.placeAxes.find(ele => ele.index === index).name
      this.placeOptions.tooltip.formatter = obj => {
        const value = obj.value
        return (
          `<div>
            ${this.placeYaxis}：${value[1]}
            </div>
            <div>
            ${this.placeAxes[index - 1].name}：${value[0]}
          </div>
          `)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.foundation-chart-result .echarts {
  width: 100%;
  height: 100%;
  min-height: 200px;
  padding: 0 30px;
}

.charts {
  padding-right: 10px;
  height: 100%;
  aside {
    top: 0;
    right: 10px;
    width: 260px;
    // height: 90px;
    background: #1a1a1a;
    z-index: 999;
    .axis {
      height: 32px;
      line-height: 32px;
      border-bottom: 1px solid #2c2c2c;
      color: #eee;
      &:before {
        content: '';
        height: 31px;
        width: 3px;
        background: #1ed36f;
        display: inline-block;
      }
      .flex-2 {
        flex: 2;
        padding-left: 6px;
      }
      .flex-3 {
        flex: 3;
      }
    }
    .btn {
      height: 24px;
      line-height: 24px;
      text-align: center;
      color: #eee;
      background: #000;
      cursor: pointer;
      &:active {
        transform: translateY(1px);
      }
    }
  }
}
</style>
<style lang="less">
.foundation-chart-result .ivu-select-small.ivu-select-single .ivu-select-selection {
  border-radius: 0 !important;
  margin-top: 3px;
}
</style>
