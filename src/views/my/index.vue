<template>
  <div class="page">
    <van-nav-bar
      title="我的个人信息"
    />

    <div v-if="userAva" class="image">
      <van-uploader :after-read="afterRead">
        <van-image :src="userAva" round width="100" height="100" fit="cover" />
      </van-uploader>
    </div>
    <div v-else class="image">
      <van-uploader :after-read="afterRead" max-count="1" @click="afterRead" />
    </div>
    <div
      style=""
      class="headDiv"
    >
      <h3>{{ name }}</h3>
      <p style="color: #7D8688">{{ info }}</p>
    </div>

    <div class="actionDiv topActionDiv">
      <span class="divTest"><van-icon name="smile" />{{ userType === 1?'工号':'学号' }}</span>
      <span class="divIcon">{{ accountNum }}&nbsp;&nbsp;</span>
    </div>
    <div class="actionDiv">
      <span class="divTest">
        <van-icon name="underway" />
        生日
      </span>
      <span class="divIcon" style="width: 100%; text-align: right;">{{ birthday===''?'未知': birthday }}&nbsp;&nbsp;</span>
    </div>
    <div class="actionDiv " @click="updateTelephone">
      <span class="divTest"><van-icon name="phone-circle" />手机号</span>
      <i class="divIcon van-icon van-icon-arrow van-cell__right-icon" />
    </div>
    <div class="actionDiv bottomActionDiv" @click="updatePasswordBtn">
      <span class="divTest"><van-icon name="lock" />修改密码</span>
      <i class="divIcon van-icon van-icon-arrow van-cell__right-icon" />
    </div>



    <van-button size="large" style="max-width: 300px;" type="danger" round @click="logout">退出登录</van-button>
    <van-tabbar v-model="active" @change="onChange">
      <van-tabbar-item name="home" icon="wap-home-o">主页</van-tabbar-item>
      <van-tabbar-item name="my" icon="friends">我的</van-tabbar-item>
    </van-tabbar>

    <!-- dialog-update telephone -->
    <van-dialog
      v-model="showUpdateTelephone"
      :before-close="beforeCloseTelephone"
      title="修改手机号"
      show-cancel-button
      @confirm="editTelephone"
      @cancel="clearTelephone"
    >
      <van-cell-group>
        <van-field v-model="telephone" label="手机号" placeholder="请输入新的手机号" />
      </van-cell-group>
    </van-dialog>

    <!--  弹出框-修改密码  -->
    <van-dialog
      v-model="showUpdatePassword"
      :before-close="beforeClose"
      title="修改密码"
      show-cancel-button
      @confirm="editPassword"
      @cancel="clearPassword"
    >
      <van-cell-group>
        <van-field v-model="editPasswordData.password" label="旧密码" placeholder="请输入旧密码" />
        <van-field v-model="editPasswordData.newPassword" label="新密码" placeholder="请输入新密码" />
        <van-field v-model="editPasswordData.confirnPassword" label="确认密码" placeholder="请输入确认新密码" />
      </van-cell-group>
    </van-dialog>

  </div>
</template>

<script>
import { logout, updatePassword, updateUserAva, updateTelephone } from '../../api/user.js'
import { Toast } from 'vant'
export default {
  name: 'MyIndex',
  data: function() {
    return {
      msg: '主页',
      active: 'my',
      name: '',
      info: '',
      birthday: '',
      accountNum: this.$store.state.user.user.accountNum,
      userAva: this.$store.state.user.user.userAva,
      showUpdatePassword: false,
      editPasswordData: {
        password: '',
        newPassword: '',
        confirnPassword: ''
      },
      showUpdateTelephone: false,
      telephone: this.$store.state.user.user.telephone,
      userType: this.$store.state.user.user.userType
    }
  },
  mounted() {
    // created页面渲染前【初始化属性值 渲染成dom】 > 页面渲染 > mounted页面渲染后【对已有dom做操作】
    if (this.userType === 1) {
      this.name = this.$store.state.user.user.teacherInfo.teacherName
      this.info = this.$store.state.user.user.teacherInfo.workInfo
      this.birthday = this.$store.state.user.user.teacherInfo.birthday
    } else {
      this.name = this.$store.state.user.user.studentInfo.studentName
      this.info = this.$store.state.user.user.className
      this.birthday = this.$store.state.user.user.studentInfo.birthday
    }
  },
  methods: {
    onChange(index) {
      console.log(index)
      if (index === 'home') {
        this.$store.dispatch('setting/setRouter', index)
        const userType = this.$store.state.user.user.userType
        if (userType === 1) {
        // 教师
          this.$router.push({ path: '/teacher/index' })
        }
        if (userType === 2) {
        // 学生
          this.$router.push({ path: '/student/index' })
        }
      }
    },
    logout() {
      logout().then((res) => {
        // 清理缓存
        this.$store.state.user.clear
        localStorage.clear()
        this.$router.push('/login')
      })
    },
    // 修改密码
    updatePasswordBtn() {
      this.showUpdatePassword = true
      console.log('修改密码')
    },
    editPassword() {
      const op = this.editPasswordData.password
      const np = this.editPasswordData.newPassword
      const cp = this.editPasswordData.confirnPassword
      if (op === undefined || op.length <= 0) {
        Toast('请输入原密码')
      } else
      if (np === undefined || np.length <= 0) {
        Toast('请输入新密码')
      } else
      if (cp === undefined || cp.length <= 0) {
        Toast('请输入确认密码')
      } else {
        if (op === np) {
          Toast('未对密码进行修改')
        } else if (np === cp) {
          updatePassword(this.editPasswordData).then((res) => {
            this.clearPassword()
            this.showUpdatePassword = false
            Toast('修改成功！')
          })
        } else {
          Toast('两次输入的密码不一致')
        }
      }
    },
    clearPassword() {
      this.editPasswordData.password = ''
      this.editPasswordData.newPassword = ''
      this.editPasswordData.confirnPassword = ''
      this.showUpdatePassword = false
    },
    beforeClose(action, done) {
      done(false)
    },
    // 修改头像
    afterRead(files) {
      updateUserAva(files).then((res) => {
        const userDto = this.$store.state.user.user
        userDto.userAva = res.data.data.userAva
        this.$store.commit('user/SET_USER', userDto)
        this.userAva = this.$store.state.user.user.userAva
      })
    },
    // 修改手机号
    updateTelephone() {
      this.showUpdateTelephone = true
      console.log('修改手机号')
    },
    beforeCloseTelephone(action, done) {
      done(false)
    },
    editTelephone() {
      // 做一下正则校验
      var patt = /^1[3-9]\d{9}$/
      var b = patt.test(this.telephone)
      if (this.telephone === undefined || this.telephone.length <= 0) {
        Toast('未输入手机号')
      } else if (!b) {
        Toast('手机号格式错误！')
      } else {
        updateTelephone({ telephone: this.telephone }).then((res) => {
          const userDto = this.$store.state.user.user
          userDto.telephone = res.data.data.telephone
          this.$store.commit('user/SET_USER', userDto)

          this.clearTelephone()
          this.showUpdateTelephone = false
          Toast('修改成功!')
        })
      }
    },
    clearTelephone() {
      this.telephone = this.$store.state.user.user.telephone
      this.showUpdateTelephone = false
    }
  }
}

</script>

<style scoped>
.headDiv {
  margin: -50px 20px -15px 20px;
  padding: 33px 0 0 0;
  height: 100px;
  background-color: white;
}
.headDiv h3 {
  color: #12B3B3;
  margin-bottom: -5px;
}
.actionDiv {
  display: flex;
  padding: 7px 10px 7px 20px;
  height: 40px;
  margin-right: 20px;
  margin-left: 20px;
  background-color: white;
}
.actionDiv span i {
  margin-right: 10px;
  transform: scale(1.2);
  transition: all .1s;
}
.actionDiv:active {
  background-color: #E6FAFA;
}
.actionDiv:focus {
  background-color: #E6FAFA;
}
.actionDiv:active span i,
.actionDiv:focus span i {
  color: #33D6D6;
  transform: scale(1.3);
}
.divIcon {
  line-height: 40px;
  float: right;
  color: #777;
}
.divTest {
  line-height: 40px;
  font-size: large;
  width: 90%;
  text-align: left;
}
.page {
  background-color: #F2F1F7;
  overflow-y: visible !important;
}
.topActionDiv {
  margin-top: 30px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.bottomActionDiv {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  margin-bottom: 30px;
}
.image {
  margin-top: 20px;
}
</style>
