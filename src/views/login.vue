<template>
  <div class="login">
    <div class="title">
      <van-image src="http://practice.yketang.com/static/img/logo.abd239a4.png" width="100" height="70" />
      <h2>{{ msg }}</h2>
    </div>

    <van-form @submit="onSubmit">
      <van-field
        v-model="accountNum"
        left-icon="user-o"
        name="accountNum"
        label="用户名"
        placeholder="请填写用户名"
        :rules="[{ required: true}]"
      />
      <van-field
        v-model="password"
        left-icon="lock"
        type="password"
        name="password"
        label="密码"
        placeholder="请填写密码"
        :rules="[{ required: true }]"
      />
      <div class="btn">
        <van-button round block type="info" native-type="submit">登录</van-button>
      </div>

      <div style="color: #777; text-align: right; margin-top: 15px; padding-right: 30px;">
        <span @click="registerBtn">注册账号</span>
      </div>
    </van-form>
  </div>
</template>

<script>


// import { login } from '../api/user'
import { Toast } from 'vant'
export default {
  name: 'Login',
  data() {
    return {
      msg: '欢迎使用实训云',
      accountNum: '',
      password: '',
      data: {},
      url: require('../assets/logo.png')
    }
  },
  methods: {
    async onSubmit(values) {
      const params = {
        password: this.password,
        accountNum: this.accountNum
      }
      // 请求接口 vuex缓存
      // 异步的两种方法：promiss和.then()
      // 这里的dispatch('仓库名/方法名', 参数)就是使用store里面的方法
      await this.$store.dispatch('user/login', params)

      // 判断身份进行跳转
      const userType = this.$store.state.user.user.userType
      if (userType === 1) {
        this.$router.push({ path: '/teacher/index' })
        console.log('我是教师')
      } else if (userType === 2) {
        this.$router.push({ path: '/student/index' })
        console.log('我是学生')
      } else {
        Toast('未知身份')
      }
    },
    registerBtn() {
      this.$router.push('/register')
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  margin-bottom: 10px;
  padding-top: 50px;
  height: 160px;
  width: 100%;
  background-color: #00B3B3;
}
.title h2 {
  color: white;
}
.btn {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}
.btn button {
  width: 320px;
}
/deep/ .van-button--round {
  border-radius: 12px;
  font-size: 17px;
  letter-spacing: 5px;
}
.page {
  overflow-y: visible !important;
}
</style>
