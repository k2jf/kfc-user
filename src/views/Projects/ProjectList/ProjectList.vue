<template>
  <div class="ido-projects h-full">
    <div class="h-16 p-3">
      <RadioGroup type="button">
        <Radio :label="item.value" v-for="item in radioGroup" :key="item.id" />
      </RadioGroup>
      <Input
        class="ml-3"
        placeholder="请输入项目名称"
        icon="ios-search"
        style="width: 160px"
        v-model="value" />
      <a class="float-right underline ido-link" href="http://jira.goldwind.com.cn/" target="_blank">
        进入jira管理页面
      </a>
    </div>
    <div class="h-calc-16">
      <Row v-if="projects.length > 0">
        <ICol
          class="p-3 bt-4"
          :xs="12"
          :sm="8"
          :md="8"
          :lg="8"
          :xl="6"
          :xxl="6"
          v-for="item in projects"
          :key="item.id">
          <Card class="w-full h-32 cursor-pointer" @click.native="linkToInfo(item.projectId)">
            <div>
              <div class="info" style="height: 5em;">
                <div class="w-16 h-16 float-left border">
                </div>
                <div class="overflow-hidden pl-2">
                  <div class="text-sm">
                    {{ item.projectName }}
                  </div>
                  <div class="text-xs text-grey-dark">
                    负责人：{{ item.riskOwner }}
                  </div>
                  <div class="text-xs text-grey-dark">
                    项目截止日期：{{ D(item.endTime).format('YYYY-MM-DD') }}
                  </div>
                </div>
              </div>
              <Divider style="margin:6px 0;" />
              <div class="status h-6">
                <Icon class="text-red" type="md-close-circle" v-if="item.status === '驳回'" />
                <span class="text-xs" v-if="item.status === '驳回'">&ensp;驳回</span>
                <Icon class="text-green" type="md-checkmark-circle" v-if="item.status === '通过'" />
                <span class="text-xs" v-if="item.status === '通过'">&ensp;通过</span>
              &ensp;
                <span class="text-xs text-grey">{{ item.date }}</span>
              </div>
            </div>
          </Card>
        </ICol>
      </Row>
      <div v-else>
        暂无项目
      </div>
      <!-- <div
        class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-4 p-3"
        v-for="item in projects"
        :key="item.id">
      </div> -->
    </div>
  </div>
</template>

<script>
import { RadioGroup, Radio, Input, Card, Divider, Icon, Row, Col } from 'iview'
import D from 'dayjs'

export default {
  name: 'ProjectList',
  components: {
    RadioGroup,
    Radio,
    Input,
    Card,
    Divider,
    Icon,
    Row,
    ICol: Col
  },
  data () {
    return {
      radioGroup: [
        { id: 'all', value: '全部' },
        { id: 'processing', value: '进行中' },
        { id: 'done', value: '已完成' }
      ],
      value: '',
      projects: [],
      D
    }
  },
  async mounted () {
    const res = await this.$get('projects')
    this.projects = res.body.items
  },
  methods: {
    linkToInfo (projectId) {
      this.$router.push({ name: 'project-info', params: { projectId } })
    }
  }
}
</script>
