<template>
  <div class="wrap">
    <Split v-model="split">
      <div class="split-left" slot="left" ref="data-grid">
        <h2 class="text-sm bg-grey-lighter pl-2">
          {{ excelName }}
        </h2>
        <ExcelTable
          :name="paramType"
          :sheetdata="sheetdata"
          :ws="ws"
          v-if="excelName" />
        <div class="text-sm text-center pt-32" v-else>
          请先上传excel文件
        </div>
      </div>
      <div class="split-right" slot="right">
        <h2 class="text-sm bg-grey-lighter pl-2">
          {{ datName }}
        </h2>
        <div class="dat p-2">
          <pre>
              {{ datContent }}
            </pre>
        </div>
      </div>
    </split>
  </div>
</template>

<script>
import { Split } from 'iview'
import ExcelTable from './ExcelTable'

export default {
  name: 'Excel2Dat',
  components: {
    Split,
    ExcelTable
  },
  props: {
    excelName: {
      type: String,
      default: ''
    },
    datName: {
      type: String,
      default: ''
    },
    datContent: {
      type: String,
      defautl: ''
    },
    paramType: {
      type: String,
      required: true
    },
    sheetdata: {
      type: Array,
      required: true
    },
    ws: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    split: 0.8
  })
}
</script>

<style lang="less" scoped>
  .wrap {
    height: 340px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    overflow: hidden;
  }

  .split-left {
    height: 300px;
  }

  .split-right {
    height: 300px;
  }
  .dat {
    height: 100%;
    overflow: auto;
  }
  h2 {
    height: 40px;
    line-height: 40px;
  }
</style>
