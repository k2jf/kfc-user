<template>
  <div class="ido-login" id="ido-login">
    <div class="bg"></div>
    <aside class="logo">
      <img :src="src" alt="logo">
    </aside>
    <div class="header">
      <aside>
        <img :src="idoLogo" alt="">
      </aside>
      <slot name="title">
        <h1 v-if="title">
          {{ title }}
        </h1>
        <h2 v-if="subTitle">
          {{ subTitle }}
        </h2>
      </slot>
    </div>
    <div class="login">
      <!-- eslint-disable -->
      <input type="text" autofocus="autofocus" placeholder="用户名" v-model="user"><br>
			<input type="password" placeholder="密码" v-model="password" @keydown.enter="handleLogin"><br>
			<input type="button" value="登录" @click="handleLogin">
      <!-- eslint-enable -->
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import src from '@/assets/color_logo2.png'
import idoLogo from '@/assets/ido_logo.svg'

/* eslint-disable */
const mapping = {
  'kk':             'fe',
  'kangkai':        'fe',
  'zhanghao':       '123',
  'zhangrongtao':   '123',
  'wangyanan':      '123',
  'xiangguangjie':  '123',
  'changxue':       '123',
  'zhouyiming':     '123',
  'zhengminyi':     '123',
  'lixiaoyong':     '123',
  'zhangxingang':   '123',
  'lirongfu':       '123',
  'xuxin':          '123',
  'guoxiaohui':     '123'
}
/* eslint-enable */

export default {
  name: 'Login',
  props: {
    title: {
      type: String,
      default: 'Integrated Design Offshore Platform'
    },
    subTitle: {
      type: String,
      default: '海上风机支撑结构一体化设计平台'
    }
  },
  data: () => ({
    user: '',
    password: '',
    src,
    idoLogo
  }),
  methods: {
    ...mapMutations(['setUserName']),
    handleLogin () {
      if (!this.user || !this.password) {
        this.$Message.info('请输入用户名和密码')
      } else {
        this.handleCheck()
      }
    },
    handleCheck () {
      if (Reflect.has(mapping, this.user) && Reflect.get(mapping, this.user) === this.password) {
        this.setUserName(this.user)
        // this.$Message.success('登录成功')
        setTimeout(() => {
          this.$router.push({ name: 'index' })
        }, 600)
      } else {
        this.$Message.error('用户名或密码错误')
      }
    }
  }
}
</script>

<style lang="less">
  @font-face {
    font-family: HelveticaNeueLTPro-Roman;
    src: url(../../assets/fonts/HelveticaNeueLTPro-Roman.otf);
  }

.ido-login {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.logo {
  position: absolute;
  width: 200px;
  height: 60px;
  left: 20px;
  top: 20px;
  z-index: 2;
}

.bg {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: url(../../assets/login_bg.jpg);
  background-size: 124%;
  background-position-y:-100px;
  background-repeat: no-repeat;
}

.header{
  position: absolute;
  top: calc(40% - 35px);
  left: calc(24%);
  z-index: 2;

  aside {
    position: absolute;
    left: -300px;
    top: 0;
    width: 300px;
    height: 100px;
    text-align: right;

    img {
      width: 80%;
    }
  }

  h1 {
    color: rgb(1,112,169) !important;
    font-family: 'HelveticaNeueLTPro-Roman.otf', sans-serif;
    font-size: 36px;
    font-weight: bold;
  }

  h2 {
    font-size: 20px;
    color: #fff;
    font-family: Helvetica, 'Hiragino Sans GB', 'Microsoft Yahei', '微软雅黑', Arial, sans-serif;
  }
}

.login{
  position: absolute;
  top: calc(40% - 25px);
  left: 60%;
  height: 150px;
  width: 350px;
  padding: 10px;
  z-index: 2;

  input[type=text]{
    width: 250px;
    height: 30px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.6);
    border-radius: 2px;
    color: #fff;
    font-family: 'Exo', sans-serif;
    font-size: 16px;
    font-weight: 400;
    padding: 4px;

    &:focus{
      outline: none;
      font-weight: bold;
      border: 1px solid rgba(255,255,255,0.9);
    }
  }

  input[type=password]{
    width: 250px;
    height: 30px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.6);
    border-radius: 2px;
    color: #fff;
    font-family: 'Exo', sans-serif;
    font-size: 16px;
    font-weight: 400;
    padding: 4px;
    margin-top: 10px;

    &:focus{
      outline: none;
      font-weight: bold;
      border: 1px solid rgba(255,255,255,0.9);
    }
  }

  input[type=button]{
    width: 250px;
    height: 35px;
    background: #fff;
    border: 1px solid #fff;
    cursor: pointer;
    border-radius: 2px;
    color: #a18d6c;
    font-family: 'Exo', sans-serif;
    font-size: 16px;
    font-weight: 400;
    padding: 6px;
    margin-top: 10px;

    &:hover{
      opacity: 0.8;
    }

    &:active{
      opacity: 0.6;
    }

    &:focus{
      outline: none;
    }
  }
}

::-webkit-input-placeholder{
   color: rgba(255,255,255,0.6);
}

::-moz-input-placeholder{
   color: rgba(255,255,255,0.6);
}

</style>
