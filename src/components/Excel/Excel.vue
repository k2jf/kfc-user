<template>
  <Modal
    :closable="false"
    fullscreen
    :title="title"
    :value="visible"
    ok-text="保存"
    @on-ok="ok"
    @on-cancel="cancel">
    <Tabs>
      <TabPane
        :label="tab.label"
        :name="tab.label"
        v-for="tab in tabs"
        :key="tab.label">
        {{ tab.label }}
      </TabPane>
    </Tabs>
  </Modal>
</template>

<script>
import { Modal, Tabs, TabPane } from 'iview'

export default {
  name: 'Excel',
  components: {
    Modal,
    Tabs,
    TabPane
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
    sheets: {
      type: Object,
      required: true
    }
  },
  computed: {
    tabs () {
      const tabs = []
      Object.keys(this.sheets).forEach(s => {
        tabs.push({ label: s, value: this.sheets[s] })
      })
      console.log(tabs)
      return tabs
    }
  },
  methods: {
    ok () {
      this.$emit('on-ok')
    },
    cancel () {
      this.$emit('on-cancel')
    }
  }
}
</script>
