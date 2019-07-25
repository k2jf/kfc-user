<!-- 批量编辑权限对话框 -->
<template>
  <Modal
    title="资源设置"
    width="600"
    :maskClosable="false"
    :loading="isLoading"
    v-model="isShowModal"
    @on-ok="onClickOk"
    @on-cancel="onClickCancel"
  >
    <Form :model="resource" :label-width="120">
      <FormItem label="批量设置操作">
        <CheckboxGroup v-model="resource.operations">
          <Checkbox
            :label="item"
            v-for="item in operations"
            :key="item"></Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="批量设置起止时间">
        <DatePicker
          type="daterange"
          placement="bottom-start"
          placeholder="请选择起止时间"
          style="width: 200px"
          v-model="resource.valiableTime"></DatePicker>
      </FormItem>
      <FormItem label="批量生效失效">
        <CheckboxGroup v-model="resource.isDisabled" @on-change="onDisableChange">
          <Checkbox
            :label="item"
            :value="item"
            v-for="item in disableList"
            :key="item"></Checkbox>
        </CheckboxGroup>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import { Modal, Form, FormItem, DatePicker, CheckboxGroup, Checkbox } from 'iview'

import api from '../api'

export default {
  name: 'ResourceSetting',
  components: {
    Modal,
    Form,
    FormItem,
    DatePicker,
    CheckboxGroup,
    Checkbox
  },
  props: {
    currentUser: {
      type: Object,
      required: true
    },
    isShowSettingModal: {
      type: Boolean,
      required: true
    },
    resourceIdList: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    operations: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      isShowModal: this.isShowSettingModal,
      isLoading: true,
      disableList: ['是', '否'],
      resource: {
        isDisabled: [],
        operations: [],
        effectTime: null,
        expireTime: null,
        valiableTime: null
      }
    }
  },
  watch: {
    isShowSettingModal: {
      handler (curVal, oldVal) {
        this.isShowModal = curVal
        // 清空选中参数
        this.resource.operations.splice(0, this.resource.operations.length)
        this.resource.isDisabled = []
        this.resource.effectTime = null
        this.resource.expireTime = null
        this.resource.valiableTime = null
      }
    }
  },
  methods: {
    // 是否启用单选，都不选则不批量修改生效状态
    onDisableChange (status) {
      if (!status.length) return
      this.resource.isDisabled = [status.pop()]
    },
    // 批量设置权限
    onClickOk () {
      let { isDisabled, valiableTime, operations } = this.resource
      operations = operations.join(',')
      let disabled = isDisabled.length ? isDisabled[0] : null
      let resourceIds = this.resourceIdList.join(',')
      let configParams = {}
      let url = `${api.authorizes}/${this.currentUser.id}/permissions?resourceIds=${resourceIds}&action=config`

      if (disabled === null && !(valiableTime || [])[0] && !operations) {
        this.$Message.warning('请修改配置！')
        this.isLoading = false
        this.$nextTick(() => {
          this.isLoading = true
        })
        return
      }

      if (disabled !== null) {
        disabled = disabled === '是'
        configParams.disabled = disabled
      }

      if (valiableTime !== null && valiableTime[0]) {
        configParams.effectTime = Number(valiableTime[0])
        configParams.expireTime = Number(valiableTime[1])
      }

      if (operations) {
        configParams.operations = operations
      }

      this.$axios.put(url, configParams).then(res => {
        this.$Message.success('修改成功！')
        this.$emit('on-submit')
      }).finally(() => {
        this.isLoading = false
        this.$nextTick(() => {
          this.isLoading = true
        })
      })
    },
    onClickCancel () {
      this.$emit('on-close')
    }
  }
}
</script>
