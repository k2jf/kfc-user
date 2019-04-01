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
      <FormItem label="角色名">
        {{ currentRole.name }}
      </FormItem>
      <FormItem label="资源类型" prop="type">
        <Select
          :transfer="true"
          style="width: 46%"
          v-model="resourceData.appResTypeId"
          @on-change="onTypeChange">
          <template v-for="item in resourceTypeList">
            <Option
              :value="item.appResTypeId"
              :key="item.appResTypeId">
              {{ item.appResTypeName }}
            </Option>
          </template>
        </Select>
      </FormItem>
      <FormItem label="资源列表">
        <div class="form-card">
          <K2Transfer
            :data="getTransferData"
            filterable
            :style="{width: '702px', margin: '0 auto'}"
            :list-style="{height: '400px', width: '300px'}"
            :target-keys="resourceData.selectKeys"
            :selected-keys="resourceData.selectKeys"
            :titles="resourceData.titles"
            @on-change="handleChange"
            @on-dblclick="handleChange">
          </K2Transfer>
        </div>
      </FormItem>
      <FormItem label="操作" prop="operationNames">
        <CheckboxGroup v-model="operationNames">
          <Checkbox
            :label="item"
            v-for="item in operations"
            :key="item"></Checkbox>
        </CheckboxGroup>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import { Modal, Form, FormItem, Select, Option, CheckboxGroup, Checkbox } from 'iview'
import K2Transfer from '@/components/kfc-k2transfer'

import { api } from '../api'

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
    currentRole: {
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
    }
  },
  data () {
    return {
      isShowModal: this.isShowAuthModal,
      operations: [], // 操作列表
      operationNames: [], // 选中操作
      resourceData: {
        subjectType: 'role',
        appResTypeId: '',
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
          key: item.appResInfoId,
          label: item.appResInfoName
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
        this.operationNames.splice(0, this.operationNames.length)
        this.operations.splice(0, this.operations.length)
        this.resourceData.appResTypeId = ''
        this.resourceData.data.splice(0, this.resourceData.data.length)
      }
    }
  },
  methods: {
    // 新建权限
    onClickOk () {
      this.$emit('on-close')
      this.$refs.formValidate.resetFields()
      return
      // eslint-disable-next-line
      let appResInfoId = this.resourceData.selectKeys.join(',')
      let permission = {
        appResInfoId,
        appResTypeId: this.resourceData.appResTypeId,
        operationNames: this.operationNames,
        subjectId: this.currentRole.id,
        subjectType: 'role'
      }

      this.$axios.post(`${api.permissions}`, permission).then(res => {
        this.$emit('on-submit', permission)
        this.$refs.formValidate.resetFields()
      })
    },
    onClickCancel () {
      this.$emit('on-close')
      this.$refs.formValidate.resetFields()
    },
    getResourceData () {
      let { appResTypeId } = this.resourceData
      if (!appResTypeId) return
      this.$axios.get(`${api.resourceinfos}?type=all&appResTypeId=${encodeURIComponent(appResTypeId)}`).then(res => {
        this.resourceData.data = res.data.result
        this.operations = this.resourceData.data[0].operations
      })
    },
    onTypeChange () {
      // 清空选中参数
      this.resourceData.selectKeys.splice(0, this.resourceData.selectKeys.length)
      this.operationNames.splice(0, this.operationNames.length)
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
  height: 380px;
}
</style>
