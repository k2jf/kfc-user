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
    <div class="h-calc-16 flex flex-wrap justify-between">
      <div
        class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 mb-4 p-3"
        v-for="item in projects"
        :key="item.id">
        <Card class="w-full h-48" dis-hover>
          <div style="text-align:center">
            <div class="info h-32">
              info
            </div>
            <div class="status h-16">
              status
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import { RadioGroup, Radio, Input, Card } from 'iview'

const generate = (num) => {
  let arr = []
  for (let i = 0; i < num; i++) {
    arr.push({ id: i, name: 'card' + i })
  }
  return arr
}

export default {
  name: 'Projects',
  components: {
    RadioGroup,
    Radio,
    Input,
    Card
  },
  data () {
    return {
      radioGroup: [
        { id: 'all', value: '全部' },
        { id: 'processing', value: '进行中' },
        { id: 'done', value: '已完成' }
      ],
      value: '',
      projects: generate(12)
    }
  },
  mounted () {
    console.log(this)
  }
}
</script>
<style lang="less">
  .ido-link {
    padding: 2px 0;

    &:hover {
    text-decoration: none;
    background: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 5'><path fill='none' stroke='%232d8cf0' d='M0 3.5c5 0 5-3 10-3s5 3 10 3 5-3 10-3 5 3 10 3'/></svg>") repeat-x 0 100%;
    background-size: 20px auto;
    animation: waveMove 1s infinite linear;
    }
  }

  @keyframes waveMove {
    0% {
    background-position: 0 100%;
    }
    100% {
    background-position: -20px 100%;
    }
  }
</style>
