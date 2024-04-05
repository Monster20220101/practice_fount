<template>
  <div class="page">
    <van-nav-bar
      title="学生管理"
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
          <van-cell :border="true" :title="item.studentName+'('+item.studentNum+')'" />
          <template #right>
            <van-button square type="primary" text="编辑" @click="modifyStudent(item)" />
            <van-button square type="danger" text="删除" @click="deleteStudent(item)" />
          </template>
        </van-swipe-cell>
      </van-pull-refresh>
      <!-- 分页组件 -->
      <van-pagination v-model="currentPage" :page-count="total" mode="simple" @change="nextPage" />
    </van-cell>
    <v-touch class="wrapper" @swiperight="swiperright">
      <van-empty
        v-if="loading===false&&list.length === 0"
        class="custom-image"
        image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
        description="暂无数据"
      />
    </v-touch>

    <van-dialog
      v-model="showStudentEdit"
      :title="dialogTitle"
      show-cancel-button
      :before-close="beforeClose"
      @confirm="editStudent"
      @cancel="clearInput"
    >
      <van-cell-group>
        <!-- <van-field v-model="classInfo.id" label="编号" placeholder="请输入编号" /> -->
        <van-field v-model="student.studentName" label="学生姓名" placeholder="请输入学生姓名" />
        <van-field v-model="student.studentNum" label="学号" placeholder="请输入学号" />
        <!-- 班级选择器 -->
        <van-field
          v-if="!student.id"
          readonly
          clickable
          name="picker"
          :value="chooseClass"
          label="班级"
          placeholder="点击选择班级"
          @click="showPicker = true"
        />
        <van-popup v-model="showPicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @confirm="onConfirm"
            @cancel="showPicker = false"
          />
        </van-popup>

      </van-cell-group>
    </van-dialog>

  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { getClassList } from '../../../api/class.js'
import { getStudentList, addStudent, modifyStudent, deletedStudent } from '../../../api/student.js'
export default {
  name: 'StudentManager',
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
      showStudentEdit: false,
      classId: 0,
      selectClassList: [
        { text: '全部班级', value: 0 }
      ],
      chooseClass: '',
      columns: [],
      showPicker: false,
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
      console.log('添加学生')
      this.student = {}
      this.dialogTitle = '添加学生信息'
      this.showStudentEdit = true
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
    modifyStudent(item) {
      console.log(item)
      this.student = item
      this.dialogTitle = '修改学生信息'
      // 显示弹窗
      this.showStudentEdit = true
    },
    // 删除按钮执行方法
    deleteStudent(item) {
      Dialog.confirm({
        message: '确定删除吗？'
      }).then(() => {
        // 调用接口
        console.log('确认删除', item.id)
        deletedStudent({
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
      getStudentList(patams).then((res) => {
        this.list = res.data.data.list
        this.total = res.data.data.pages

        this.loading = false
      })
    },
    // 编辑班级信息弹窗调用方法
    editStudent() {
      console.log(this.student)
      // 参数判断
      if (!this.student.studentName) {
        Toast('缺少学生姓名')
        return
      }
      if (!this.student.studentNum) {
        Toast('缺少学生学号')
        return
      }
      if (!this.student.relationClassId || this.student.relationClassId <= 0) {
        Toast('请选择班级')
        return
      }

      // 请求接口 如果id为空则为添加 不为空则为修改
      if (!this.student.id) {
        addStudent(this.student).then(res => {
          Toast(res.data.msg)
          // 刷新列表
          this.getList()
          // 结束后调用
          this.clearInput()
        })
      } else {
        modifyStudent(this.student).then(res => {
          Toast(res.data.msg)
          // 刷新列表
          this.getList()
          // 结束后调用
          this.clearInput()
        })
      }
    },
    // 清除弹窗信息
    clearInput() {
      this.showStudentEdit = false
      // 刷新列表
      this.getList()
      this.student = {}
      this.chooseClass = ''
    },
    changeClass() {
      console.log(this.classId)
      this.getList()
    },
    onConfirm(value) {
      this.chooseClass = value
      this.showPicker = false
      console.log(this.chooseClass)
      this.selectClassList.forEach(el => {
        if (el.text === this.chooseClass) {
          // 从下拉列表中获取班级id
          this.student.relationClassId = el.value
        }
      })
    },
    swiperright() { // 右滑切换到detail页
      this.$router.push('/teacher/index')
    }
  }
}

</script>

  <style scoped>

  </style>

