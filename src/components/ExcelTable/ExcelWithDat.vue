<template>
  <div class="wrap">
    <div class="split-left">
      <h2 class="text-sm bg-grey-lighter pl-2 relative">
        <aside class="absolute pin-t pin-r w-24 h-8 z-10" @click="modal = !modal">
          <span class="open-dat pr-2">{{ modal ? '关闭' : '打开' }}dat文件</span>
          <Icon type="md-code" />
        </aside>
        {{ excelName }}
      </h2>
      <ExcelTable
        :name="paramType"
        :sheetdata="sheetdata"
        :ws="ws"
        ref="excelTable" />
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
        <pre>{{ datContent }}</pre>
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
  // watch: {
  //   datContent (value) {
  //     if (value && value.length > 0) {
  //       this.modal = true
  //     }
  //   }
  // }
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

    .open-dat {
      font-size: 12px;
      font-weight: normal;
    }

    aside:hover {
      i, span {
        color: rgb(47, 106, 184);
        font-weight: bold;
        cursor: pointer;
        // transform: scale(1.1);
      }
    }
  }
</style>
