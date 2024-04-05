<template>
  <div class="page">
    <van-nav-bar
      title="任务管理"
      left-text="返回首页"
      right-text="添加"
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
    <!-- 下拉列表 -->
    <van-dropdown-menu>
      <van-dropdown-item v-model="classId" :options="selectClassList" @change="changeClass" />
    </van-dropdown-menu>

    <van-cell v-if=" list.length > 0">
      <!-- 表单 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <!-- 滑动单元格 -->
        <van-swipe-cell v-for="item in list" :key="item.id">
          <van-cell is-link :border="true" @click="toDetail(item)">
            <template #title>
              <span class="actionDiv">{{ item.taskName }}</span>
              <van-tag
                :type="item.taskStatus==0?'warning':(item.taskStatus==1?'danger':'success')"
              >{{ item.taskStatus==0?'未开始':(item.taskStatus==1?'进行中':'已完成') }}</van-tag>
            </template>
          </van-cell>

          <template #right>
            <van-button square type="primary" text="编辑" @click="modifyTask(item)" />
            <van-button square type="danger" text="删除" @click="deleteTask(item)" />
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
      v-model="showTaskEdit"
      :title="dialogTitle"
      show-cancel-button
      :before-close="beforeClose"
      @confirm="editTask"
      @cancel="clearInput"
    >
      <van-cell-group>
        <van-field v-model="task.taskName" label="任务名称" placeholder="请输入任务名称" />
        <van-field v-model="task.content" label="任务要求" placeholder="请输入任务要求" />
        <!-- 班级选择器 -->
        <van-field
          v-if="!task.id"
          readonly
          clickable
          name="picker"
          :value="chooseClass"
          label="班级"
          placeholder="点击选择班级"
          @click="showClassPicker = true"
        />
        <van-popup v-model="showClassPicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @confirm="onConfirm"
            @cancel="showClassPicker = false"
          />
        </van-popup>
        <!-- 时间选择器startTime -->
        <van-field
          readonly
          clickable
          name="datetimePicker"
          :value="task.startTime"
          label="开始时间"
          placeholder="点击选择开始时间"
          @click="showStartTime"
        />
        <van-popup v-model="showStartPicker" position="bottom">
          <van-datetime-picker
            v-model="chooseStartTime"
            type="datetime"
            @confirm="selectStartTime"
            @cancel="showStartPicker = false"
          />
        </van-popup>

        <!-- 时间选择器-endTime -->
        <van-field
          readonly
          clickable
          name="datetimePicker"
          :value="task.endTime"
          label="结束时间"
          placeholder="点击选择结束时间"
          @click="showEndTime"
        />
        <van-popup v-model="showEndPicker" position="bottom">
          <van-datetime-picker
            v-model="chooseEndTime"
            type="datetime"
            @confirm="selectEndTime"
            @cancel="showEndPicker = false"
          />
        </van-popup>

      </van-cell-group>
    </van-dialog>

  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { getClassList } from '../../../api/class.js'
import { getTaskManagerList, addTask, modifyTask, deletedTask } from '../../../api/task.js'
export default {
  name: 'TaskManager',
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
      classId: 0,
      selectClassList: [
        { text: '全部班级', value: 0 }
      ],
      chooseClass: '',
      columns: [],
      showClassPicker: false,
      showStartPicker: false,
      chooseStartTime: new Date(),
      showEndPicker: false,
      chooseEndTime: new Date(),
      loading: true
    }
  },
  // 进入页面前执行的钩子函数
  mounted() {
    this.getList()
    // console.log('班级页面渲染完成', this.list)
    getClassList({
      page: 0
    }).then((res) => {
      const list = res.data.data.list

      list.forEach(element => {
        this.selectClassList.push({
          text: element.className,
          value: element.id
        })
        // 选择菜单
        this.columns.push(element.className)
      })
    })
  },
  methods: {
    // 点击顶部导航栏左侧
    onClickLeft() {
      this.$router.push('/teacher/index')
    },
    // 点击顶部导航栏右侧
    onClickRigth() {
      console.log('添加任务')
      this.task = {}
      this.dialogTitle = '发布任务'
      this.showTaskEdit = true
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
    modifyTask(item) {
      console.log(item)
      this.task = item
      this.dialogTitle = '编辑任务'
      this.chooseStartTime = new Date(item.startTime)
      this.chooseEndTime = new Date(item.endTime)
      // 显示弹窗
      this.showTaskEdit = true
    },
    // 删除按钮执行方法
    deleteTask(item) {
      Dialog.confirm({
        message: '确定删除【' + item.taskName + '】吗？'
      }).then(() => {
        // 调用接口
        console.log('确认删除', item.id)
        deletedTask({
          id: item.id
        }).then((res) => {
          Toast(res.data.msg)
          // 刷新列表
          this.getList()
        })
      }).catch(() => {
        console.log('取消删除')
      })
      console.log(item)
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
      getTaskManagerList(patams).then((res) => {
        this.list = res.data.data.list
        this.total = res.data.data.pages
        this.loading = false
      })
    },
    // 编辑任务信息弹窗调用方法
    editTask() {
      console.log(this.task)
      // 参数判断
      if (!this.task.taskName) {
        Toast('缺少任务名称')
        return
      }
      if (!this.task.content) {
        Toast('缺少任务要求')
        return
      }
      if (!this.task.startTime) {
        Toast('请选择开始时间')
        return
      }
      if (!this.task.endTime) {
        Toast('请选择结束时间')
        return
      }
      if (!this.task.relationClassId || this.task.relationClassId <= 0) {
        Toast('请选择班级')
        return
      }

      // 请求接口 如果id为空则为添加 不为空则为修改
      if (!this.task.id) {
        addTask(this.task).then(res => {
          Toast(res.data.msg)
          // 结束后调用
          this.clearInput()
        })
      } else {
        modifyTask(this.task).then(res => {
          Toast(res.data.msg)
          // 结束后调用
          this.clearInput()
        })
      }
    },
    // 清除弹窗信息
    clearInput() {
      this.showTaskEdit = false
      this.task = {}
      this.chooseClass = ''
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
      this.$router.push('/teacher/taskDetail/' + item.id)
    },
    selectStartTime(value) {
      const year = value.getFullYear()
      let month = value.getMonth() + 1
      let date = value.getDate()
      let hours = value.getHours()
      let minutes = value.getMinutes()

      if (month < 10) {
        month = '0' + month
      }
      if (date < 10) {
        date = '0' + date
      }
      if (hours < 10) {
        hours = '0' + hours
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      this.task.startTime = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':00'
      console.log(this.task)
      console.log(value)
      this.showStartPicker = false
    },
    showStartTime() {
      if (!this.task.id && !this.chooseStartTime) {
        this.chooseStartTime = new Date()
      }
      this.showStartPicker = true
    },
    selectEndTime(value) {
      const year = value.getFullYear()
      let month = value.getMonth() + 1
      let date = value.getDate()
      let hours = value.getHours()
      let minutes = value.getMinutes()

      if (month < 10) {
        month = '0' + month
      }
      if (date < 10) {
        date = '0' + date
      }
      if (hours < 10) {
        hours = '0' + hours
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      this.task.endTime = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':00'
      console.log(this.task)
      console.log(value)
      this.showEndPicker = false
    },
    showEndTime() {
      if (!this.task.id && !this.chooseEndTime) {
        this.chooseEndTime = new Date()
      }
      this.showEndPicker = true
    },
    swiperright() { // 右滑切换到detail页
      this.$router.push('/teacher/index')
    }
  }
}

</script>

  <style scoped>

  </style>

