<!-- 资源类型信息 -->
<template>
  <div style="height: 100%;">
    <Row :gutter="16" class="margin-bottom">
      <Col span="16">
      资源类型:
      <Select
        transfer
        style="max-width:200px;margin-left:10px;"
        v-model="resourceData.typeId"
        @on-change="onTypeChange"
      >
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
      </Col>
      <Col span="8">
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
    <Table
      :columns="resourceData.columns"
      :data="resourceData.data"
      size="small"
      height="300"
      :loading="resourceData.loading"
      class="margin-bottom"></Table>
    <ConfirmModal ref="confirmModal" @transfer-ok="onDeleteClick"></ConfirmModal>
  </div>
</template>

<script>
// eslint-disable-next-line
import { Col, Row, Input, Select, Option, Table, Icon, Button, Switch, DatePicker } from 'iview'
import ResourceEdit from './ResourceEdit.vue'
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
    ConfirmModal
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
      isShowAuthModal: false,
      resourceTypeList: [],
      id: null, // 删除id
      resourceData: {
        loading: false,
        fuzzyName: '',
        typeId: 0,
        data: [],
        columns: [
          { title: '资源个例名称', key: 'resource', minWidth: 130 },
          { title: '权限', key: 'operations', minWidth: 80 },
          { title: '开始时间',
            minWidth: 150,
            render: (h, params) => {
              return h('div', [
                h(DatePicker, {
                  props: {
                    type: 'date',
                    value: params.row.startTime
                  }
                })
              ])
            }
          },
          { title: '结束时间',
            minWidth: 150,
            render: (h, params) => {
              return h('div', [
                h(DatePicker, {
                  props: {
                    type: 'date'
                  },
                  on: {
                    // click: () => {
                    //   this.show(params.index)
                    // }
                  }
                })
              ])
            }
          },
          { title: '是否生效',
            minWidth: 100,
            render: (h, params) => {
              return h('div', [
                h(Switch, {
                  props: {
                    value: false,
                    size: 'small'
                  },
                  on: {
                    // click: () => {
                    //   this.show(params.index)
                    // }
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
                      this.showConfirmModal(params.row.id)
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
  },
  methods: {
    // 搜索资源
    onSearchClick () {
      this.getResourceData()
    },
    // 删除权限
    showConfirmModal (id) {
      this.id = id
      this.$refs.confirmModal.handleModal({
        content: '是否确认删除？'
      })
    },
    // 确认删除
    onDeleteClick () {
      this.$axios.delete(`${api.authorizes}?subjectId=${this.currentUser.id}&subjectType=role&appResTypeId=${this.resourceData.typeId}&appResInfoId=${this.id}`).then(res => {
        this.$Message.success('删除成功！')
        this.getResourceData()
      })
    },
    // 获取资源列表
    getResourceData () {
      this.resourceData.loading = true
      let { typeId } = this.resourceData
      let { id } = this.currentUser

      this.$axios.get(`${api.authorizes}?typeId=${typeId}&userId=${id}`).then(res => {
        this.resourceData.data = res.data.body.authorizes
      }).finally(() => {
        this.resourceData.loading = false
      })
    },
    // 资源类型改变
    onTypeChange () {
      this.getResourceData()
    },
    // 获取新增权限
    getSubmitResource (resource) {
      this.isShowAuthModal = false
      if (resource && resource.typeId === this.resourceData.typeId) {
        // 新增权限类型为当前列表显示类型刷新页面
        this.getResourceData()
      }
    }
  }
}
</script>
