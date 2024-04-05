<template>
  <div class="page">
    <van-nav-bar
      title="任务管理"
      left-text="返回首页"
      left-arrow
      @click-left="onClickLeft"
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

    <van-cell v-if=" list.length > 0">
      <!-- 表单 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <!-- 滑动单元格 -->
        <span v-for="item in list" :key="item.id">
          <!-- <van-cell :border="true" :title="item.taskName" class="actionDiv" @click="toDetail(item)" /> -->
          <van-cell :value="item.score+'分'" is-link :border="true" @click="toDetail(item)">
            <template #title>
              <span class="actionDiv">{{ item.taskName }}</span>
              <van-tag
                :type="item.taskStatus==0?'warning':(item.taskStatus==1?'danger':'success')"
              >{{ item.taskStatus==0?'未开始':(item.taskStatus==1?'进行中':'已完成') }}</van-tag>
            </template>
          </van-cell>
        </span>
      </van-pull-refresh>
      <!-- 分页组件 -->
      <van-pagination v-model="currentPage" :page-count="total" mode="simple" @change="nextPage" />
    </van-cell>
    <v-touch class="wrapper" @swiperight="swiperright">
      <van-empty
        v-if="loading === false && list.length === 0"
        class="custom-image"
        image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
        description="暂无数据"
      />
    </v-touch>

    <van-dialog
      v-model="showTaskEdit"
      class="myDialog"
      title="查看任务"
      confirm-button-text="返回"
    >
      <van-cell-group>
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
          <span class="title">我的成绩：</span> <span class="content">{{ task.score }}</span>
        </van-cell>
      </van-cell-group>
    </van-dialog>

  </div>
</template>

<script>
import { getTaskListForStudent } from '../../../api/task.js'
export default {
  name: 'TaskList',
  data: function() {
    return {
      msg: '主页',
      dialogTitle: '',
      list: [],
      key: '',
      currentPage: 1,
      total: 20,
      refreshing: false,
      task: {},
      showTaskEdit: false,
      loading: true
    }
  },
  // 进入页面前执行的钩子函数
  mounted() {
    this.getList()
  },
  methods: {
    // 点击顶部导航栏左侧
    onClickLeft() {
      this.$router.push('/student/index')
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
      getTaskListForStudent(patams).then((res) => {
        this.list = res.data.data.list
        this.total = res.data.data.pages
        this.loading = false
      })
    },
    toDetail(item) {
      this.task = item
      if (!item.score) {
        this.task.score = '暂无成绩'
      }
      this.showTaskEdit = true
    },
    swiperright() { // 右滑切换到detail页
      this.$router.push('/student/index')
    }
  }
}

</script>

  <style scoped>
.actionDiv:active {
  background-color: rgb(229, 229, 229);
}
.actionDiv:focus {
  background-color: rgb(229, 229, 229);
}

  </style>

