<!-- 添加权限对话框 -->
<template>
  <Modal
    title="添加权限"
    width="800"
    :maskClosable="false"
    :loading="isLoading"
    v-model="isShowModal"
    @on-ok="onClickOk"
    @on-cancel="onClickCancel"
  >
    <Form
      :model="resourceData"
      :label-width="80"
      ref="formValidate">
      <FormItem label="资源类型" prop="type">
        <Select
          transfer
          style="width: 300px"
          v-model="resourceData.typeId"
          @on-change="onTypeChange">
          <Option
            :value="item.id"
            v-for="item in resourceTypeList"
            :key="item.id">
            {{ item.name }}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="资源列表">
        <div class="form-card">
          <Transfer
            :data="getTransferData"
            filterable
            :style="{width: '702px', margin: '0 auto'}"
            :list-style="{height: '300px', width: '300px'}"
            :target-keys="resourceData.selectKeys"
            :selected-keys="resourceData.selectKeys"
            :titles="resourceData.titles"
            @on-change="handleChange"
            @on-dblclick="handleChange">
          </Transfer>
        </div>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import { Modal, Form, FormItem, Select, Option } from 'iview'
import Transfer from '@/components/kfc-transfer'

import api from '../api'

export default {
  name: 'ResourceEdit',
  components: {
    Modal,
    Form,
    FormItem,
    Select,
    Option,
    Transfer
  },
  props: {
    currentUser: {
      type: Object,
      required: true
    },
    isShowAuthModal: {
      type: Boolean,
      required: true
    },
    resourceTypeList: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    typeId: {
      type: Number,
      required: false
    }
  },
  data () {
    return {
      isShowModal: this.isShowAuthModal,
      isLoading: true,
      resourceData: {
        typeId: this.typeId,
        data: [],
        selectKeys: [],
        titles: ['未选权限', '已选权限']
      }
    }
  },
  computed: {
    getTransferData () {
      if (this.resourceData.data.length === 0) return []
      return this.resourceData.data.map(item => {
        return {
          key: item.id,
          label: item.name
        }
      })
    }
  },
  watch: {
    isShowAuthModal: {
      handler (curVal, oldVal) {
        this.isShowModal = curVal
        // 清空选中参数
        this.resourceData.selectKeys.splice(0, this.resourceData.selectKeys.length)
        this.resourceData.typeId = this.typeId
        this.resourceData.data.splice(0, this.resourceData.data.length)
        if (!curVal || this.typeId < 0) return
        this.onTypeChange()
      }
    }
  },
  methods: {
    // 新建权限
    onClickOk () {
      let resourceIds = this.resourceData.selectKeys.join(',')
      let permission = {
        resourceTypeId: this.resourceData.typeId,
        resourceIds
      }
      if (!resourceIds) {
        this.$Message.warning('请选择权限！')
        this.isLoading = false
        this.$nextTick(() => {
          this.isLoading = true
        })
        return
      }

      this.$axios.put(`${api.authorizes}/${this.currentUser.id}/permissions`, permission).then(res => {
        this.$Message.success('新建成功！')
        this.$emit('on-submit', this.resourceData.typeId)
        this.$refs.formValidate.resetFields()
      }).finally(() => {
        this.isLoading = false
        this.$nextTick(() => {
          this.isLoading = true
        })
      })
    },
    onClickCancel () {
      this.$emit('on-close')
      this.$refs.formValidate.resetFields()
    },
    getResourceData () {
      let { typeId } = this.resourceData
      if (!typeId) return
      this.$axios.get(`${api.resources}?typeId=${typeId}`).then(res => {
        this.resourceData.data = res.data.body.resources
      })
    },
    onTypeChange () {
      // 清空选中参数
      this.resourceData.selectKeys.splice(0, this.resourceData.selectKeys.length)
      this.getResourceData()

      let { typeId } = this.resourceData
      let { id } = this.currentUser
      let url = `${api.authorizes}/${id}/permissions?resourceTypeId=${typeId}`

      if (typeId === undefined) return

      this.$axios.get(url).then(res => {
        this.resourceData.selectKeys = res.data.body.permissions.map(item => item.resourceId)
      })
    },
    handleChange (selectedFields) {
      this.resourceData.selectKeys = selectedFields
    }
  }
}
</script>

<style lang="css" scoped>
.form-card {
  height: 280px;
}
</style>
