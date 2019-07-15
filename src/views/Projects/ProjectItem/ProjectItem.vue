<template>
  <div class="project-item p-3 relative h-full">
    <Spin fix size="large" v-if="loading" />
    <div class="border-grey-light border-solid border rounded p-3">
      <div class="h-10 font-bold text-sm" style="line-height: 2.5rem">
        {{ projectName }}
      </div>
      <Row class="p-3 pl-0">
        <ICol span="8">
          负责人：{{ assignee }}
        </ICol>
        <ICol span="8">
          业主：{{ owner.join('，') }}
        </ICol>
        <ICol span="8">
          设计阶段：投标
        </ICol>
        <ICol span="8" class="my-3">
          创建时间：{{ created }}
        </ICol>
        <ICol span="8" class="my-3">
          截止日期：
        </ICol>
        <ICol span="24">
          <span class="overflow-hidden">描述：</span>
          <pre class="description">{{ description }}</pre>
        </ICol>
      </Row>
    </div>

    <div class="border-grey-light border-solid border rounded p-3 mt-3">
      <div class="h-10 font-bold text-sm mb-4" style="line-height: 2.5rem">
        处理进度
      </div>
      <Steps :current="current">
        <Step content="" v-for="(item, idx) in taskStatus" :key="item.id">
          <div v-if="idx <= current" slot="title">
            <Poptip
              transfer
              trigger="hover"
              content="content">
              {{ item.name }}
              <div slot="content">
                <div class="font-bold text-sm">
                  负责人：xxx
                </div>
                <div>
                  <p>计划完成时间：2019-03-03</p>
                  <p>滞后时间：12小时</p>
                  <p>耗时：xx</p>
                </div>
              </div>
            </Poptip>
          </div>
          <div v-else slot="title">
            {{ item.name }}
          </div>
        </Step>
      </Steps>
    </div>

    <div class="border-grey-light border-solid border rounded p-3 mt-3 mb-3">
      <div class="h-10 font-bold text-sm mb-4" style="line-height: 2.5rem">
        子任务
      </div>
      <div>
        <Tabs v-if="subtasks.length >0">
          <TabPane :label="item.fields.summary" v-for="item in subtasks" :key="item.id">
            <SubTask :taskId="item.id" />
          </TabPane>
        </Tabs>
        <div v-else>
          无
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Row, Col, Poptip, Tabs, TabPane, Spin } from 'iview'
import Steps from '@/components/Steps'
import g6 from '@antv/g6'
import { jiraUrl } from '@/config'
import { firstData, secondData, thirdData } from './dataPick'
import D from 'dayjs'
import { taskStatus, subTaskStatus } from './status'
import SubTask from './SubTask'

export default {
  name: 'ProjectItem',
  components: {
    Row,
    ICol: Col,
    Steps,
    Step: Steps.Step,
    Poptip,
    Tabs,
    TabPane,
    Spin,
    SubTask
  },
  data () {
    return {
      projectName: '',
      assignee: '',
      owner: [],
      created: '',
      planFinished: '',
      progress: 0,
      loading: true,
      taskStatus,
      subTaskStatus,
      current: 0,
      subCurrent: 0,
      subtasks: [],
      description: ''
    }
  },
  mounted () {
    this.getProjectInfo()
    this.$nextTick(() => {
      // this.draw()
    })
  },
  methods: {
    async getProjectInfo () {
      const { projectId } = this.$route.params
      try {
        let res = await this.$ky(`issue/${projectId}`, {
          prefixUrl: jiraUrl,
          timeout: 10000
        })
        if (res.ok) {
          res = await res.json()
          this.projectName = res.fields.summary
          this.description = res.fields.description
          this.assignee = res.fields.assignee.displayName
          this.owner = res.fields.customfield_10801
          this.created = D(res.fields.created).format('YYYY-MM-DD hh:mm:ss')
          this.current = this.taskStatus.findIndex(t => t.id === res.fields.status.id) || 0
          this.planFinished = res.fields.customfield_11013
          this.loading = false
          this.subtasks = res.fields.subtasks
        } else {
          throw new Error('网络或服务器异常')
        }
      } catch (error) {
        this.$Message.error(error.message)
        this.loading = false
      }
    },
    draw () {
      const width = this.$refs.flow.offsetWidth - 100
      const height = this.$refs.flow.offsetHeight
      console.log(width, height)

      const graph = new g6.Graph({
        container: 'flow',
        width,
        height: 800,
        modes: {
          default: [{
            type: 'tooltip',
            formatText (model) {
              let display = ''
              if (model.active) {
                display = (
                  `
                  <div class="ido-canvas-tooltip">
                    <div>负责人：xxx</div>
                    <div>开始时间：2019-06-12<div>
                    <div>工作进度：延误<div>
                    <div>预计完成时间：2019-07-12<div>
                  </div>
                  `
                )
              }
              return display
            }
          }]
        }
      })

      graph.data({
        nodes: firstData.nodes.concat(secondData.nodes).concat(thirdData.nodes),
        edges: firstData.edges.concat(secondData.edges).concat(thirdData.edges)
      })
      graph.render()
    }
  }
}
</script>
<style lang="less">
.g6-tooltip {
  // padding: 10px 6px;
  color: #fff;
  background-color: rgba(70,76,91,.9);
  // border: 1px solid #e2e2e2;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.ido-canvas-tooltip {
  padding: 10px;
}
.description {
  width: calc(100% - 46px);
  float: right;
}
</style>
