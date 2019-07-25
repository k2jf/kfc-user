<!-- 资源类型信息 -->
<template>
  <div style="height: 100%;">
    <Row :gutter="16" class="margin-bottom">
      <Col span="18">
      资源类型:
      <Select
        transfer
        style="max-width:200px;margin-left:10px;"
        v-model="resourceData.typeId"
        @on-change="onTypeChange"
      >
        <Option :value="-1">
          全部资源
        </Option>
        <Option
          :value="item.id"
          v-for="item in resourceTypeList"
          :key="item.id">
          {{ item.name }}
        </Option>
      </Select>
      <Button
        type="primary"
        style="margin-left: 10px"
        @click="isShowAuthModal = true"
      >
        添加权限
      </Button>
      <Button
        type="primary"
        style="margin-left: 10px"
        @click="showSettingModal"
      >
        批量编辑
      </Button>
      <Button
        type="primary"
        style="margin-left: 10px"
        @click="showConfirmModal(getResourceIds.join(','))"
      >
        批量删除
      </Button>
      </Col>
      <Col span="6">
      <Input
        placeholder="搜索资源个例"
        v-model="resourceData.fuzzyName"
        @on-blur="onSearchClick"></Input>
      </Col>
    </Row>
    <ResourceEdit
      :currentUser="currentUser"
      :resourceTypeList="resourceTypeList"
      :isShowAuthModal="isShowAuthModal"
      :typeId="resourceData.typeId"
      v-if="currentUser"
      @on-submit="getSubmitResource"
      @on-close="isShowAuthModal = false" />
    <ResourceSetting
      :currentUser="currentUser"
      :isShowSettingModal="isShowSettingModal"
      :resourceIdList="getResourceIds"
      :operations="getOperations"
      v-if="currentUser"
      @on-submit="onReloadList"
      @on-close="isShowSettingModal = false" />
    <Table
      :columns="resourceData.columns"
      :data="resourceData.data"
      size="small"
      :loading="resourceData.loading"
      class="margin-bottom"
      @on-selection-change="onSelectionChange"></Table>
    <ConfirmModal ref="confirmModal" @transfer-ok="onDeleteClick"></ConfirmModal>
  </div>
</template>

<script>
// eslint-disable-next-line
import { Col, Row, Input, Select, Option, Table, Icon, Button, Switch, DatePicker } from 'iview'
import ResourceEdit from './ResourceEdit.vue'
import ResourceSetting from './ResourceSetting.vue'
import OperationCell from './OperationCell.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

import api from '../api'

export default {
  name: 'ResourceInfo',
  components: {
    Col,
    Row,
    Input,
    Select,
    Option,
    Table,
    Button,
    ResourceEdit,
    ConfirmModal,
    ResourceSetting
  },
  props: {
    currentUser: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      isShowSettingModal: false,
      isShowAuthModal: false,
      resourceTypeList: [],
      id: null, // 删除id
      resourceData: {
        loading: false,
        fuzzyName: '',
        typeId: -1,
        data: [],
        selections: [],
        columns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: '资源个例名称', key: 'resourceName', minWidth: 100 },
          { title: '操作类型',
            minWidth: 220,
            render: (h, params) => {
              return h(OperationCell, {
                props: {
                  operations: params.row.operations,
                  operationList: this.getOperations
                },
                on: {
                  change: (operations) => {
                    this.onOperationChange(operations, params.index)
                  }
                }
              })
            }
          },
          { title: '起止时间',
            minWidth: 220,
            render: (h, params) => {
              return h('div', {
                class: this.getTimeStatus(params.row.valiableTime)
              }, [
                h(DatePicker, {
                  props: {
                    type: 'daterange',
                    transfer: true,
                    value: params.row.valiableTime,
                    disabled: !params.row.disabled
                  },
                  on: {
                    'on-change': (valiableTime) => {
                      this.resourceData.data[params.index].effectTime = valiableTime[0]
                      this.resourceData.data[params.index].expireTime = valiableTime[1]
                      this.resourceData.data[params.index].valiableTime = valiableTime
                      this.onStatusChange(params.index)
                    }
                  }
                })
                // h('span', this.getTimeStatus(params.row.valiableTime))
              ])
            }
          },
          { title: '是否启用',
            width: 90,
            render: (h, params) => {
              return h('div', [
                h(Switch, {
                  props: {
                    value: params.row.disabled,
                    size: 'small'
                  },
                  on: {
                    'on-change': (isDisabled) => {
                      this.resourceData.data[params.index].disabled = isDisabled
                      this.onStatusChange(params.index)
                    }
                  }
                })
              ])
            }
          },
          {
            title: '操作',
            width: 70,
            render: (h, params) => {
              return h(
                'span',
                {
                  style: {
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.showConfirmModal(params.row.resourceId)
                    }
                  }
                },
                [
                  h(
                    'Icon',
                    {
                      props: {
                        type: 'ios-trash',
                        size: 16,
                        color: '#5cadff'
                      }
                    }
                  )
                ]
              )
            }
          }
        ]
      }
    }
  },
  computed: {
    getResourceIds () {
      return this.resourceData.selections.map(item => item.resourceId)
    },
    getOperations () {
      let typeId = this.resourceData.typeId
      if (typeId < 0) {
        let operations = []
        this.resourceTypeList.forEach(item => operations.push(...item.operations))
        return operations
      }
      let typeInfo = this.resourceTypeList.find(item => item.id === typeId)
      if (!this.resourceTypeList.length || !typeInfo) return []
      return typeInfo ? typeInfo.operations : []
    }
  },
  watch: {
    currentUser: {
      handler (curVal, oldVal) {
        if (curVal && curVal.id && this.resourceData.typeId) {
          this.getResourceData()
        }
      }
    }
  },
  mounted () {
    // 获取资源类型列表
    this.$axios.get(`${api.restyps}`).then(res => {
      this.resourceTypeList = res.data.body.restyps
    })
    this.getResourceData()
  },
  methods: {
    // 搜索资源
    onSearchClick () {
      this.getResourceData()
    },
    onSelectionChange (selections) {
      this.resourceData.selections = selections
    },
    // 删除权限
    showConfirmModal (id) {
      this.id = id
      if (!id) {
        this.$Message.warning('请选择权限！')
        return
      }
      this.$refs.confirmModal.handleModal({
        content: '是否确认删除？'
      })
    },
    showSettingModal () {
      if (!this.resourceData.selections.length) {
        this.$Message.warning('请选择权限！')
        return
      }
      this.isShowSettingModal = true
    },
    // 确认删除
    onDeleteClick () {
      this.$axios.delete(`${api.authorizes}/${this.currentUser.id}/permissions?resourceIds=${this.id}`).then(res => {
        this.$Message.success('删除成功！')
        this.getResourceData()
      })
    },
    // 获取资源列表
    getResourceData () {
      this.resourceData.loading = true
      let { typeId, fuzzyName } = this.resourceData
      let { id } = this.currentUser
      let url = `${api.authorizes}/${id}/permissions?resourceTypeId=${typeId}`

      url = fuzzyName ? `${url}&fuzzyResName=${fuzzyName}` : url

      if (typeId < 0) {
        url = `${api.authorizes}/${id}/permissions`
      }

      this.$axios.get(url).then(res => {
        res.data.body.permissions.forEach(item => {
          item.disabled = item.disabled === undefined ? false : item.disabled
          item.effectTime = item.effectTime || new Date()
          item.expireTime = item.expireTime || new Date()
          item.valiableTime = [new Date(item.effectTime), new Date(item.expireTime)]
        })
        this.resourceData.data = res.data.body.permissions
      }).finally(() => {
        this.resourceData.loading = false
      })
    },
    onStatusChange (index) {
      let { resourceId, effectTime, expireTime, disabled } = this.resourceData.data[index]
      effectTime = Number(new Date(effectTime))
      expireTime = Number(new Date(expireTime))
      let url = `${api.authorizes}/${this.currentUser.id}/permissions?resourceIds=${resourceId}&action=config`
      this.$axios.put(url, { effectTime, expireTime, disabled }).then(() => {
        this.getResourceData()
      })
    },
    onOperationChange (operations, index) {
      let { resourceId } = this.resourceData.data[index]
      let url = `${api.authorizes}/${this.currentUser.id}/permissions?resourceIds=${resourceId}&action=config`
      this.$axios.put(url, { operations })
    },
    // 资源类型改变
    onTypeChange () {
      this.getResourceData()
    },
    // 获取新增权限
    getSubmitResource (typeId) {
      this.isShowAuthModal = false
      if (typeId === this.resourceData.typeId) {
        // 新增权限类型为当前列表显示类型刷新页面
        this.getResourceData()
      }
    },
    // 批量编辑权限后刷新页面
    onReloadList () {
      this.isShowSettingModal = false
      this.resourceData.selections = []
      this.getResourceData()
    },
    getTimeStatus (valiableTime) {
      let now = Number(new Date())
      let expireTime = Number(valiableTime[1])
      if (expireTime < now) return 'time-disabled'
      return ''
    }
  }
}
</script>

<style scoped lang="css">
.margin-bottom >>> .time-disabled .ivu-input {
  color: #c5c8ce !important;
}
</style>
