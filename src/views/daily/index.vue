<template>
  <div class="page">
    <van-nav-bar
      v-if="$store.state.user.user.userType === 1"
      title="日报管理"
      left-text="返回首页"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-nav-bar
      v-if="$store.state.user.user.userType === 2"
      title="日报"
      left-text="返回首页"
      right-text="发布日报"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRigth"
    />
    <van-search
      v-model="key"
      show-action
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="onCancel"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
    <!-- **下拉列表不会在学生端日报出现** -->
    <!-- 下拉列表 -->
    <van-dropdown-menu v-if="$store.state.user.user.userType === 1">
      <van-dropdown-item v-model="classId" :options="selectClassList" @change="changeClass" />
    </van-dropdown-menu>

    <van-cell v-if=" list.length > 0">
      <!-- 表单 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <!-- 滑动单元格 -->
        <van-swipe-cell v-for="item in list" :key="item.id">
          <van-cell is-link :border="true" @click="toDetail(item)">
            <template #title>
              <span class="actionDiv">{{ item.title }}</span>
              <br>
              <span>{{ item.studentName }}</span>
            </template>
            <template #default>
              <van-tag v-if="item.comment" plain type="success">已评价</van-tag>
              <van-tag v-else plain type="primary">未评价</van-tag>
            </template>
            <template #label>
              <span v-if="item.createdTime">{{ item.createdTime }}</span>
              <span v-else>{{ item.updatetTime }}</span>
            </template>
          </van-cell>

          <template v-if="$store.state.user.user.userType === 2" #right>
            <van-button class="btn" square type="primary" text="编辑" @click="editDaily(item)" />
            <van-button class="btn" square type="danger" text="删除" @click="deleted(item)" />
          </template>
        </van-swipe-cell>
      </van-pull-refresh>
      <!-- 分页组件 -->
      <van-pagination v-model="currentPage" :page-count="total" mode="simple" @change="nextPage" />
    </van-cell>
    <v-touch class="wrapper" @swiperight="swiperright">
      <van-empty
        v-if="loading===false && list.length === 0"
        class="custom-image"
        image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
        description="暂无数据"
      />
    </v-touch>


    <van-dialog
      v-model="showDailyDetail"
      class="myDialog"
      title="日报详情"
      :confirm-button-text="btnText"
      @closed="clearInput"
    >
      <van-cell-group>
        <van-cell>
          <span class="title">日报名称：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> <span class="content">{{ daily.title }}</span>
        </van-cell>
        <van-cell>
          <span class="title">日报内容：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> <span class="content">{{ daily.content }}</span>
        </van-cell>
        <van-cell v-if="$store.state.user.user.userType === 2">
          <span class="title">教师评语：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span v-if="daily.comment" class="content">{{ daily.comment }}</span>
          <span v-else class="content">暂未评价</span>
        </van-cell>
        <van-field
          v-else
          v-model="daily.comment"
          placeholder="请输入教师评语"
          rows="2"
          autosize
          type="textarea"
          maxlength="50"
          show-word-limit
          @change="saveComment"
        >
          <template #label>
            <span class="title">教师评语：</span>
          </template>
        </van-field>
      </van-cell-group>
    </van-dialog>


    <van-dialog
      v-model="showDailyEdit"
      :title="showDailyEditTitle"
      show-cancel-button
      :before-close="beforeClose"
      @confirm="submitDiscuss"
      @cancel="clearInput"
    >
      <van-cell-group>
        <van-field
          v-model="daily.title"
          label="日报标题"
          placeholder="请输入日报标题"
          rows="2"
          autosize
          type="textarea"
          maxlength="15"
          show-word-limit
        />
        <van-field
          v-model="daily.content"
          label="日报内容"
          placeholder="请输入日报内容"
          rows="2"
          autosize
          type="textarea"
          maxlength="50"
          show-word-limit
        />
      </van-cell-group>
    </van-dialog>

  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { getClassList } from '../../api/class.js'
import { getList, addDailyReport, modifyDailyReport, deletedDailyReport } from '../../api/daily.js'
export default {
  name: 'DailyIndex',
  data: function() {
    return {
      msg: '主页',
      dialogTitle: '',
      list: [],
      key: '',
      currentPage: 1,
      total: 20,
      refreshing: false,
      daily: {},
      showTaskEdit: false,
      classId: 0,
      selectClassList: [
        { text: '全部班级', value: 0 }
      ],
      chooseClass: '',
      loading: true,
      showDailyEditTitle: '',
      showDailyEdit: false,
      showDailyDetail: false,
      btnText: this.$store.state.user.user.userType === 2 ? '取消' : '确定'
    }
  },
  // 进入页面前执行的钩子函数
  mounted() {
    if (this.$store.state.user.user.userType === 1) {
      getClassList({
        page: 0
      }).then((res) => {
        const list = res.data.data.list
        list.forEach(element => {
          this.selectClassList.push({
            text: element.className,
            value: element.id
          })
        })
      })
    }
    this.getList()
  },
  methods: {
    // 点击顶部导航栏左侧
    onClickLeft() {
      this.$router.go(-1)
    },
    // 点击顶部导航栏右侧
    onClickRigth() {
      console.log('发布')
      this.showDailyEditTitle = '发布日报'
      this.showDailyEdit = true
    },

    // 弹窗关闭前调用方法
    beforeClose(action, done) {
      done(false)
    },
    // 刷新前调用
    onLoad() {
      setTimeout(() => {
        if (this.refreshing) {
          this.list = []
          this.refreshing = false
        }
        // =========== 获取班级列表方法
        this.getList()
        // ===============

        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 1000)
    },
    // 刷新列表
    onRefresh() {
      // 清空列表数据
      this.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    },
    // 修改按钮执行方法
    editDaily(item) {
      this.showDailyEditTitle = '编辑日报'
      this.showDailyEdit = true
      this.daily = item
    },
    // 删除按钮执行方法
    deleted(item) {
      Dialog.confirm({
        message: '确定删除吗？'
      }).then(() => {
        console.log('确认删除', item.id)
        deletedDailyReport(item).then((res) => {
          Toast(res.data.msg)
          // 刷新列表
          this.getList()
        })
      }).catch(() => {
        console.log('取消删除')
      })
    },
    // 搜索框执行方法
    onSearch() {
      this.currentPage = 1
      this.getList()
    },
    onCancel() {
      this.key = ''
    },
    // 请求下一页
    nextPage() {
      this.getList()
    },
    // 获取列表方法
    getList() {
      // 包装参数
      const patams = {
        page: this.currentPage,
        size: 10,
        key: this.key
      }
      if (this.classId > 0) {
        patams.relationClassId = this.classId
      }
      // 请求接口
      getList(patams).then((res) => {
        this.list = res.data.data.list
        this.total = res.data.data.pages
        this.loading = false
      })
    },
    // 编辑任务信息弹窗调用方法
    submitDiscuss() {
      console.log(this.daily)
      if (this.daily.id) {
        modifyDailyReport(this.daily).then(res => {
          Toast(res.data.msg)
          this.clearInput()
        })
      } else {
        addDailyReport(this.daily).then(res => {
          Toast(res.data.msg)
          this.clearInput()
        })
      }
    },
    saveComment() {
      console.log(this.daily)
      modifyDailyReport(this.daily).then((res) => {
        Toast(res.data.msg)
        this.clearInput()
      })
    },
    // 清除弹窗信息
    clearInput() {
      this.showDailyEdit = false
      this.daily = {}
      // 刷新列表
      this.getList()
    },
    changeClass() {
      console.log(this.classId)
      this.getList()
    },
    onConfirm(value) {
      this.chooseClass = value
      this.showClassPicker = false
      console.log(this.chooseClass)
      this.selectClassList.forEach(el => {
        if (el.text === this.chooseClass) {
          // 从下拉列表中获取班级id
          this.task.relationClassId = el.value
        }
      })
    },
    toDetail(item) {
      console.log('进入详情页')
      this.daily = item
      this.showDailyDetail = true
    },
    swiperright() {
      this.$router.go(-1)
    }
  }
}

</script>

  <style scoped>
.btn {
  height: 100%;
}
  </style>

