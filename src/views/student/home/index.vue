<template>
  <div class="page">
    <van-nav-bar>
      <template #title>
        <van-image
          width="30"
          height="20"
          src="http://practice.yketang.com/static/img/logo.abd239a4.png"
        />
        <span>实训云-『学生端』</span>
      </template>
    </van-nav-bar>
    <van-grid :column-num="columnNum" square>
      <van-grid-item icon="completed" text="项目任务" to="/student/task" />
      <van-grid-item icon="upgrade" text="资源" to="/resource/index" />
      <van-grid-item icon="question-o" text="答疑" to="/discuss/index" />
      <van-grid-item icon="todo-list-o" text="日报" to="/daily/index" />
      <van-grid-item icon="video-o" text="视频管理" to="/video/index" />
    </van-grid>
    <van-tabbar v-model="active" @change="onChange">
      <van-tabbar-item name="home" icon="wap-home">主页</van-tabbar-item>
      <van-tabbar-item name="my" icon="friends-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'StudentIndex',
  data: function() {
    return {
      msg: '主页',
      active: 'home'
    }
  },
  computed: {
    columnNum() {
      if (screen.height > screen.width * 2) {
        return 2
      }
      return 3
    }
  },
  methods: {
    onChange(index) {
      if (index === 'my') {
        this.$store.dispatch('setting/setRouter', index)
        this.$router.push({ path: '/my/index' })
      }
    }
  }
}

</script>

<style scoped>
/deep/ .van-grid-item:active .van-grid-item__content {
  background-color: #F0FAFA;
}
.page {
  overflow-y: visible !important;
}
</style>
