<template>
  <div class="ido-login" id="ido-login">
    <div class="video">
      <aside>
        <a class="ido-link" href="javascript:void 0;" @click="handleVideoPlay">{{ operate }}</a>
      </aside>
      <video
        :src="videoSrc"
        autoplay=""
        muted=""
        playsinline=""
        loop=""
        id="video"
        ref="video">
      </video>
    </div>
    <div class="header">
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

/* eslint-disable */
const mapping = {
  'kk':             'fe',
  'kangkai':        'fe',
  'zhanghao':       '123',
  'zhangrongtao':   '123',
  'wangyanan':      '123',
  'xiangguangjie':  '123',
  'changxue':       '123',
  'zhouyiming':     '123'
}
/* eslint-enable */

export default {
  name: 'Login',
  props: {
    videoSrc: {
      type: String,
      default: 'http://www.goldwind.com.cn/images/video-banner-de59b60727.mp4'
    },
    title: {
      type: String,
      default: 'IDO'
    },
    subTitle: {
      type: String,
      default: '海上风机一体化设计平台'
    }
  },
  data: () => ({
    user: '',
    password: '',
    operate: 'PAUSE'
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
    },
    handleVideoPlay () {
      const video = this.$refs.video
      if (video.paused) {
        this.operate = 'PAUSE'
        video.play()
      } else {
        this.operate = 'PLAY'
        video.pause()
      }
    }
  }
}
</script>

<style lang="less" scoped>

.ido-login {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.video {
  width: 100%;
  height: 100%;
  position: relative;
  // background: url(http://www.goldwind.com.cn/images/index/slide/green-4b6771e38d.jpg);
  // background-size: cover;

  aside {
    width: 40px;
    height: 20px;
    position: absolute;
    right: 20px;
    bottom: 20px;
    z-index: 9;
  }

  video {
    height: 100%;
  }
}

.header{
  position: absolute;
  top: calc(50% - 35px);
  left: calc(50% - 255px);
  z-index: 2;

  h1 {
    color: #5379fa !important;
    font-family: 'Exo', sans-serif;
    font-size: 35px;
    font-weight: bold;
  }

  h2 {
    font-size: 20px;
    color: #fff;
  }
}

.login{
  position: absolute;
  top: calc(50% - 75px);
  left: 50%;
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

.ido-link {
  color: #fff;
  font-size: 14px;
}
</style>
