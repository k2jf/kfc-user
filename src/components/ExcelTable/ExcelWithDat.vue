<template>
  <div class="wrap">
    <div class="split-left">
      <h2 class="text-sm bg-grey-lighter pl-2 relative">
        <aside class="absolute pin-t pin-r w-8 h-8 z-10">
          <Icon type="ios-expand" @click="modal = true" />
        </aside>
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
    <Modal
      draggable
      scrollable
      footer-hide
      :title="datName"
      width="700"
      :mask-closable="false"
      :styles="{top: '36px'}"
      v-model="modal">
      <div class="ido-dat">
        <pre>
          {{ datContent }}
        </pre>
      </div>
    </Modal>
  </div>
</template>

<script>
import { Modal, Icon } from 'iview'
import ExcelTable from './ExcelTable'

export default {
  name: 'ExcelWithDat',
  components: {
    Modal,
    Icon,
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
    modal: false
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
  .ido-dat {
    height: 240px;
    overflow: auto;
  }
  h2 {
    height: 40px;
    line-height: 40px;

    i:hover {
      color: rgb(47, 106, 184);
      font-weight: bold;
      cursor: pointer;
      transform: scale(1.1);
    }
  }
</style>
