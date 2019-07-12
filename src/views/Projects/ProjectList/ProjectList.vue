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
          class="p-2 bt-4"
          span="6"
          v-for="item in projects"
          :key="item.id">
          <Card class="w-full cursor-pointer" @click.native="linkToInfo(item.projectId)">
            <div class="overflow-hidden pl-2">
              <div class="text-sm py-1 text-overflow" :title="item.projectName">
                {{ item.projectName }}
              </div>
              <div class="status py-1 text-grey-dark text-xs">
                状态：
                <Tag><span class="text-xs">{{ item.status }}</span></Tag>
              </div>
              <div class="text-xs py-1 text-grey-dark">
                负责人：{{ item.riskOwner }}
              </div>
              <div class="text-xs py-1 text-grey-dark">
                项目截止日期：{{ D(item.endTime).format('YYYY-MM-DD') }}
              </div>
            </div>
          </Card>
        </ICol>
      </Row>
      <div v-else>
        暂无项目
      </div>
    </div>
  </div>
</template>

<script>
import { RadioGroup, Radio, Input, Card, Divider, Row, Col, Tag } from 'iview'
import D from 'dayjs'

export default {
  name: 'ProjectList',
  components: {
    RadioGroup,
    Radio,
    Input,
    Card,
    // Divider,
    Row,
    ICol: Col,
    Tag
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
<style lang="less" scoped>
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
</style>
