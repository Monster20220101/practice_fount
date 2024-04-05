<template>
  <div class="page">
    <van-nav-bar
      title="欢迎注册实训云"
      left-text="返回登录"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-image
      width="100"
      height="100"
      round
      fit="cover"
      :src="url"
    />
    <van-form @submit="onSubmit">
      <van-field
        v-model="teacherNum"
        name="teacherNum"
        label="工号"
        required
        placeholder="请填写工号"
        :rules="[{ pattern: teacherNumPattern, required: true, message: '工号为6位数字'}]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        required
        placeholder="请填写密码"
        :rules="[{ required: true}]"
      />
      <van-field
        v-model="teacherName"
        name="teacherName"
        label="姓名"
        required
        placeholder="请填写姓名"
        :rules="[{ required: true}]"
      />
      <van-field
        v-model="telephone"
        name="telephone"
        label="手机号"
        placeholder="请填写手机号"
        required
        :rules="[{required: true, //pattern: telephonePattern,
                  message: '请输入正确的手机号'}]"
      />

      <van-field name="gender" label="性别">
        <template #input>
          <van-radio-group v-model="gender" direction="horizontal">
            <van-radio name="1">男</van-radio>
            <van-radio name="2">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>

      <van-field
        readonly
        clickable
        name="birthday"
        :value="birthday"
        label="生日"
        placeholder="点击选择生日"
        @click="showCalendar = true"
      />
      <van-calendar v-model="showCalendar" :min-date="new Date(1950,0,1)" @confirm="onBirthdayConfirm" />

      <van-field
        readonly
        clickable
        name="workInfo"
        :value="workInfo"
        label="职务"
        placeholder="点击选择职务"
        @click="showPicker = true"
      />
      <van-popup v-model="showPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="workInfoColumns"
          @confirm="onWorkInfoConfirm"
          @cancel="showPicker = false"
        />
      </van-popup>


      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit" style="letter-spacing: 5px; font-size: 16px;">注册</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data: function() {
    return {
      msg: '欢迎注册实训云',
      url: require('../assets/logo.png'),
      teacherNum: '',
      teacherName: '',
      password: '',
      gender: '2',
      birthday: '',
      showCalendar: false,
      workInfo: '',
      showPicker: false,
      workInfoColumns: ['普通教师', '教导主任', '系主任', '院长'],
      telephone: '',
      teacherNumPattern: /^\d{6}$/,
      telephonePattern: /^1[3-9]\d{9}$/
    }
  },
  methods: {
    onClickLeft() {
      // 跳转登陆页 router
      this.$router.push('/login')
    },
    async onSubmit(values) {
      console.log('submit', values)
      await this.$store.dispatch('user/register', values)
      this.$router.push('/teacher/index')
    },
    formatDate(birthday) {
      return `${birthday.getFullYear()}/${birthday.getMonth() + 1}/${birthday.getDate()}`
    },
    onBirthdayConfirm(birthday) {
      this.showCalendar = false
      this.birthday = this.formatDate(birthday)
      console.log(this.birthday)
    },
    onWorkInfoConfirm(workInfo) {
      this.workInfo = workInfo
      this.showPicker = false
    }
  }
}

</script>

<style scoped>
.regsitBtn {
  margin-top: 30px;
}
.page {
  overflow-y: visible !important;
}
</style>
