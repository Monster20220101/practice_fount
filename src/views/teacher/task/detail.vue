<template>
  <div class="page">
    <van-nav-bar
      title="任务评分"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-cell>
      <van-cell>
        <span class="title">任务名称：</span> <span class="content">{{ task.taskName }}</span>
      </van-cell>
      <van-cell>
        <span class="title">起止时间：<br></span> <span class="content">{{ task.startTime }} -- {{ task.endTime }}</span>
      </van-cell>
      <van-cell>
        <span class="title">任务要求：</span> <span class="content">{{ task.content }}</span>
      </van-cell>
      <van-cell>
        <span class="title">任务状态：</span> <span class="content">{{ task.taskStatus==0?'未开始':(task.taskStatus==1?'进行中':'已完成') }}</span>
      </van-cell>
      <van-cell>
        <span class="title">平均分数：</span> <span class="content">{{ avgScore }}</span>
      </van-cell>
    </van-cell>
    <van-search
      v-model="key"
      show-action
      placeholder="请输入搜索关键词"
      @search="onSearch"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>

    <van-cell v-if="list.length > 0">
      <!-- 下拉刷新 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <!-- 滑动单元格 -->
        <van-swipe-cell v-for="item in list" :key="item.id">
          <van-cell
            :border="true"
            :title="item.studentName+'('+item.studentNum+')'"
            class="actionDiv"
            :value="typeof item.score === 'number' ? item.score : '待评分...'"
            @click="showDailog(item)"
          />
        </van-swipe-cell>
      </van-pull-refresh>
      <!-- 分页组件 -->
      <van-pagination v-model="currentPage" style="margin-top: 20px" :page-count="total" mode="simple" @change="nextPage" />
    </van-cell>

    <van-empty
      v-else
      class="custom-image"
      image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
      description="暂无数据"
    />

    <van-dialog
      v-model="showPicker"
      title="评分"
      show-cancel-button
      :before-close="beforeClose"
      @confirm="scoreStudent"
      @cancel="clearInput"
    >
      <van-cell-group>
        <!-- <van-field v-model="classInfo.id" label="编号" placeholder="请输入编号" /> -->
        <van-field v-model="student.score" type="digit" label="当前分数" placeholder="请输入分数" maxlength="3" />
      </van-cell-group>
    </van-dialog>

  </div>
</template>

<script>
import { Toast } from 'vant'
import { getTaskById, getStudentScoreList, scoreForStudent } from '../../../api/task.js'

export default {
  name: 'TaskDetail',
  data: function() {
    return {
      msg: '主页',
      dialogTitle: '',
      list: [],
      key: '',
      currentPage: 1,
      total: 20,
      refreshing: false,
      student: {},
      classId: 0,
      selectClassList: [{ text: '全部班级', value: 0 }],
      chooseClass: '',
      columns: [],
      showPicker: false,
      task: {},
      taskId: this.$route.params.id,
      avgScore: 0,
      loading: true
    }
  },
  // 进入页面前执行的钩子函数
  mounted() {
    if (!this.taskId) {
      this.$router.push('/teacher/task')
    }
    getTaskById({
      id: this.taskId
    }).then((res) => {
      this.task = res.data.data
    })
    console.log('任务id', this.task)
    this.getList()
    // console.log('班级页面渲染完成', this.list)
  },
  methods: {
    // 点击顶部导航栏左侧
    onClickLeft() {
      this.$router.push('/teacher/task')
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
    onSearch() {
      this.currentPage = 1
      this.getList()
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
        key: this.key,
        id: this.taskId
      }
      if (this.classId > 0) {
        patams.relationClassId = this.classId
      }
      // 请求接口
      getStudentScoreList(patams).then((res) => {
        this.list = res.data.data.list
        this.total = res.data.data.pages
        this.avgScore = res.data.data.avgScore
        this.loading = false
      })
    },
    // 清除弹窗信息
    clearInput() {
      this.score = 0
      this.showPicker = false
      // 刷新列表
      this.getList()
    },
    showDailog(item) {
      console.log(item)
      this.student = item
      this.showPicker = true
      console.log(typeof item.score)
    },
    scoreStudent() {
      const score = this.student.score
      if (score > 100) {
        this.student.score = 100
        Toast('请填写0-100之间的整数')
        return
      }
      const params = {
        score: this.student.score,
        studentId: this.student.id,
        id: this.taskId
      }
      scoreForStudent(params).then((res) => {
        Toast(res.data.msg)
        this.clearInput()
      })
    }
  }
}

</script>

<style scoped>
.title {
  line-height: 35px;
  font-size: 16px;
  font-weight: 600;
}
.content {
  font-size: 14px;
}
.actionDiv:active {
  background-color: rgb(229, 229, 229);
}
.actionDiv:focus {
  background-color: rgb(229, 229, 229);
}
.page {
  overflow-y: visible !important;
}

</style>
