<template>
  <div>
    <van-nav-bar
      left-text="返回首页"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-empty description="路径错误，请检查url" style="margin-top: 40px" />
  </div>
</template>

<script>

export default {
  name: 'UrlErr',
  data() {
    return {
      msg: '欢迎使用实训云'
    }
  },
  methods: {
    onClickLeft() {
      if (this.$store.state.user.user.userType === 1) {
        this.$router.push('/teacher/index')
      } else if (this.$store.state.user.user.userType === 2) {
        this.$router.push('/student/index')
      } else {
        this.$router.push('/login')
      }
    }
  }
}

</script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
.page {
  overflow-y: visible !important;
}
  </style>

