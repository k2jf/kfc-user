<template>
  <div class="data-analysis h-full">
    <Row style="height:100%;">
      <ICol span="12" class="h-half overflow-hidden p-3">
        <Chart :options="weight2LoadOptions" autoresize />
      </ICol>
      <ICol span="12" class="h-half overflow-hidden p-3">
        <Chart :options="length2WeightOptions" autoresize />
      </ICol>
      <ICol span="12" class="h-half relative overflow-hidden p-3">
        <aside
          class="absolute pin-r mr-3"
          :style="{
            height: opreator === 'Close' ? '90px': '24px'
          }">
          <div class="xaxis axis flex" v-show="opreator === 'Close'">
            <div class="flex-2">
              xAxis
            </div>
            <div class="flex-3">
              <Select
                style="width:90%;"
                size="small"
                v-model="xAxis"
                @on-change="handleChange($event, 'xAxis')">
                <Option :value="item.name" v-for="(item, ind) in axies" :key="ind">
                  {{ item.name }}
                </Option>
              </Select>
            </div>
          </div>
          <div class="yaxis axis flex" v-show="opreator === 'Close'">
            <div class="flex-2">
              yAxis
            </div>
            <div class="flex-3">
              <Select
                style="width:90%;"
                size="small"
                v-model="yAxis"
                @on-change="handleChange($event, 'yAxis')">
                <Option :value="item.name" v-for="(item, ind) in axies" :key="ind">
                  {{ item.name }}
                </Option>
              </Select>
            </div>
          </div>
          <div class="btn" @click="opreator = opreator === 'Close' ? 'Open' : 'Close'">
            {{ opreator }} Controls
          </div>
        </aside>
        <Chart :options="axisOptions" autoresize />
      </ICol>
    </Row>
  </div>
</template>
<script>
import { weight2LoadOptions, length2WeightOptions, axisOptions, getSeries, schema2 as axies } from '@/config/analytics'
import { Select, Option, Row, Col } from 'iview'

export default {
  name: 'DataAnalytics',
  components: {
    Select,
    Option,
    Row,
    ICol: Col
  },
  data () {
    return {
      weight2LoadOptions,
      length2WeightOptions,
      axisOptions: { ...axisOptions },
      opreator: 'Close',
      axies,
      xAxis: 'Mxy/MW',
      yAxis: 't/MW'
    }
  },
  methods: {
    handleChange (value, key) {
      this.axisOptions[key].name = value
      this.axisOptions.series[0].data = getSeries(this.xAxis, this.yAxis)
    }
  }
}
</script>
<style lang="less" scoped>
  aside {
    // top: 0;
    width: 260px;
    // height: 90px;
    background: #1a1a1a;
    z-index: 999;

    .axis {
      height: 32px;
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
</style>
<style lang="less">
.data-analysis .ivu-select-small.ivu-select-single .ivu-select-selection {
  border-radius: 0 !important;
  margin-top: 3px;
}
</style>
