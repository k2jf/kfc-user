<!-- 添加权限对话框 -->
<template>
  <Modal
    title="添加权限"
    width="800"
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
          <K2Transfer
            :data="getTransferData"
            filterable
            :style="{width: '702px', margin: '0 auto'}"
            :list-style="{height: '300px', width: '300px'}"
            :target-keys="resourceData.selectKeys"
            :selected-keys="resourceData.selectKeys"
            :titles="resourceData.titles"
            @on-change="handleChange"
            @on-dblclick="handleChange">
          </K2Transfer>
        </div>
      </FormItem>
      <FormItem label="操作" prop="operations">
        <CheckboxGroup v-model="operations">
          <Checkbox
            :label="item"
            v-for="item in getOperations"
            :key="item"></Checkbox>
        </CheckboxGroup>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import { Modal, Form, FormItem, Select, Option, CheckboxGroup, Checkbox } from 'iview'
import K2Transfer from '@/components/kfc-k2transfer'

import api from '../api'

export default {
  name: 'ResourceEdit',
  components: {
    Modal,
    Form,
    FormItem,
    Select,
    Option,
    CheckboxGroup,
    Checkbox,
    K2Transfer
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
      operations: [], // 选中操作
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
    },
    getOperations () {
      if (!this.resourceData.typeId) return
      return this.resourceTypeList.find(item => item.id === this.resourceData.typeId).operations
    }
  },
  watch: {
    isShowAuthModal: {
      handler (curVal, oldVal) {
        this.isShowModal = curVal
        // 清空选中参数
        this.resourceData.selectKeys.splice(0, this.resourceData.selectKeys.length)
        this.operations.splice(0, this.operations.length)
        this.resourceData.typeId = ''
        this.resourceData.data.splice(0, this.resourceData.data.length)
      }
    },
    typeId: {
      handler (curVal, oldVal) {
        this.resourceData.typeId = curVal
        this.getResourceData()
      }
    }
  },
  mounted () {
    this.getResourceData()
  },
  methods: {
    // 新建权限
    onClickOk () {
      let resourceId = this.resourceData.selectKeys.join(',')
      let permission = {
        resourceId,
        typeId: this.resourceData.typeId,
        operations: this.operations.join(','),
        userId: this.currentUser.id
      }

      this.$axios.post(`${api.authorizes}`, permission).then(res => {
        this.$Message.success('新建成功！')
        this.$emit('on-submit', permission)
        this.$refs.formValidate.resetFields()
      }).catch(() => {
        this.$emit('on-close')
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
      this.operations.splice(0, this.operations.length)
      this.getResourceData()
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
