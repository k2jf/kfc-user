<template>
  <div class="subtask overflow-hidden">
    <div class="pb-4 text-sm font-bold">
      当前轮次：{{ loop }}
    </div>
    <div class="pb-4 text-sm font-bold">
      处理进度
    </div>
    <Steps :current="current">
      <Step
        content=""
        block
        v-for="(status, idx) in subTaskStatus"
        :key="status.id">
        <div
          v-if="idx <= current"
          slot="title">
          <Poptip
            transfer
            trigger="hover"
            content="content">
            <span class="text-xs">{{ status.name }}</span>
            <div slot="content">
              <div class="font-bold text-sm">
                负责人：小龙女
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
          <span class="text-xs">{{ status.name }}</span>
        </div>
      </Step>
    </steps>
    <div class="h-10 font-bold text-sm mb-4" style="line-height: 2.5rem">
      人员分配
      <Row class="mt-3">
        <ICol
          span="3"
          class="mb-3"
          v-for="item in people"
          :key="item.id">
          <div class="text-center leading-loose">
            <Avatar size="large" :src="item.avatarUrls['48x48']" />
            <h5 class="font-normal text-xs" :title="item.name">
              {{ item.name }}
            </h5>
            <span>{{ item.people }}</span>
          </div>
        </ICol>
      </Row>
    </div>
  </div>
</template>

<script>
import { people, subTaskStatus } from './status'
import Steps from '@/components/Steps'
import { Poptip, Avatar, Row, Col } from 'iview'
import { jiraUrl } from '@/config'

export default {
  name: 'SubTask',
  components: {
    Steps,
    Step: Steps.Step,
    Poptip,
    Avatar,
    Row,
    ICol: Col
  },
  props: {
    taskId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      people: [],
      subTaskStatus,
      current: 0,
      loop: 0
    }
  },
  mounted () {
    this.getSubTask()
  },
  methods: {
    async getSubTask () {
      const res = await this.$ky(`issue/${this.taskId}`, {
        prefixUrl: jiraUrl
      }).json()
      this.loop = Math.floor(res.fields.customfield_11098 / 1) + 1
      this.current = this.subTaskStatus.findIndex(s => s.id === res.fields.status.id) || 0
      this.assignPeople(res.fields)
    },
    assignPeople (fields) {
      const assigned = people.map(item => {
        if (fields[item.id]) {
          item.people = fields[item.id].displayName
          item.avatarUrls = fields[item.id].avatarUrls
        }
        return item
      })
      this.people = assigned.filter(a => a.people)
    }
  }
}
</script>

<style lang="less" scoped>
.font-normal {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
}
</style>
