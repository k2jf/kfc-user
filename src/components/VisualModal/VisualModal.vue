<template>
  <Modal
    :closable="false"
    :mask-closable="false"
    :title="title"
    :width="700"
    :value="visible">
    <div v-if="multiple">
      <Tabs :animated="false" @on-click="onTabClick">
        <TabPane label="折线图" name="line-chart">
          <SimpleChart :data="data" />
        </TabPane>
        <TabPane label="表格" name="table">
          <SimpleGrid
            :copyData="data"
            :sheetdata="formatData"
            :columns="columns"
            v-if="clickTable" />
        </TabPane>
      </Tabs>
    </div>
    <SimpleGrid
      :copyData="data"
      :sheetdata="formatData"
      :columns="columns"
      v-else />
    <div slot="footer">
      <Button
        ghost
        type="primary"
        @click="onClose">
        关闭
      </Button>
    </div>
    </div>
  </Modal>
</template>
<script>
import { Modal, Tabs, TabPane, Button } from 'iview'
import SimpleGrid from './SimpleGrid'
import SimpleChart from './SimpleChart'

export default {
  name: 'VisualModal',
  components: {
    Modal,
    Tabs,
    TabPane,
    Button,
    SimpleGrid,
    SimpleChart
  },
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    multiple: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      clickTable: false
    }
  },
  computed: {
    formatData () {
      const { headers, items } = this.data
      if (headers && items) {
        return items.map(item => {
          const obj = {}
          item.forEach((e, i) => {
            obj[headers[i]] = typeof e === 'number' ? e.toFixed(3) : e
          })
          return obj
        })
      }
      return []
    },
    columns () {
      const headers = this.data.headers || []
      return headers.map(h => ({
        title: h,
        key: h,
        width: h === 'Flange ULS' && 152
      }))
    }
  },
  // watch: {
  //   visible (newValue) {
  //     if (newValue) {
  //       this.$nextTick(() => {
  //         window.dispatchEvent(new Event('resize'))
  //       })
  //     }
  //   }
  // },
  methods: {
    onClose () {
      this.$emit('change', false)
    },
    onTabClick (name) {
      if (name === 'table') {
        this.$nextTick(() => {
          this.clickTable = true
        })
      }
    }
  }
}
</script>
