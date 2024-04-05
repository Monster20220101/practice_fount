<template>
  <div class="page">
    <van-nav-bar
      v-if="$store.state.user.user.userType === 2"
      title="视频管理"
      left-text="返回首页"
      right-text="上传"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRigth"
    />
    <van-nav-bar
      v-if="$store.state.user.user.userType === 1"
      title="视频管理"
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
    <!-- 下拉列表 -->
    <van-dropdown-menu v-if="$store.state.user.user.userType === 1">
      <van-dropdown-item v-model="classId" :options="selectClassList" @change="changeClass" />
    </van-dropdown-menu>

    <van-cell v-if=" list.length > 0">
      <!-- 表单 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <!-- 滑动单元格 -->
        <van-swipe-cell v-for="item in list" :key="item.id">
          <van-cell :border="true" :title="item.title" class="actionDiv" @click="openToSee(item)" />
          <template v-if="$store.state.user.user.userType === 2" #right>
            <van-button square type="danger" text="删除" @click="deleteVideo(item)" />
          </template>
          <template #left>
            <van-button square type="primary" text="下载" @click="download(item)" />
          </template>
        </van-swipe-cell>
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
      v-model="showVideoEdit"
      title="添加视频"
      show-cancel-button
      :before-close="beforeClose"
      @confirm="editVideo"
      @cancel="clearInput"
    >
      <van-cell-group>
        <van-field v-model="video.title" label="资源名称" placeholder="请输入资源名称" />
        <van-uploader
          v-model="fileList"
          accept="video/*"
          max-count="1"
          :after-read="afterRead"
        />
        <!-- video只能上传视频 -->
      </van-cell-group>
    </van-dialog>

    <!-- 图片遮罩层 -->
    <van-overlay :show="showPicture" @click="showPicture = false">
      <div class="overlay">
        <video
          id="video"
          autoplay
          width="100%"
          :src="showVideoUrl"
          controls="controls"
          preload="auto"
        />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { getClassList } from '../../api/class.js'
import { deletedVideo, getVideoList, addVideo } from '../../api/video.js'
export default {
  name: 'VideoIndex',
  data: function() {
    return {
      msg: '主页',
      dialogTitle: '',
      list: [],
      key: '',
      currentPage: 1,
      total: 20,
      refreshing: false,
      video: {},
      classId: 0,
      selectClassList: [
        { text: '全部班级', value: 0 }
      ],
      chooseClass: '',
      columns: [],
      showClassPicker: false,
      showVideoEdit: false,
      fileList: [],
      showPicture: false,
      showVideoUrl: '',
      loading: true
    }
  },
  // 进入页面前执行的钩子函数
  // created -> dom -> mounted -> destroyed
  mounted() {
    this.getList()
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
          // 选择菜单
          this.columns.push(element.className)
        })
      })
    }
  },
  methods: {
    // 点击顶部导航栏左侧
    onClickLeft() {
      this.$router.go(-1)
    },
    // 点击顶部导航栏右侧
    onClickRigth() {
      console.log('添加')
      this.video = {}
      this.dialogTitle = '添加资源'
      this.showVideoEdit = true
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
    // 删除按钮执行方法
    deleteVideo(item) {
      Dialog.confirm({
        message: '确定删除【' + item.title + '】吗？'
      }).then(() => {
        // 调用接口
        console.log('确认删除', item.id)
        deletedVideo({
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
      getVideoList(patams).then((res) => {
        this.list = res.data.data.list
        this.total = res.data.data.pages
        this.loading = false
      })
    },
    // 编辑任务信息弹窗调用方法
    editVideo() {
      // 参数判断
      if (!this.video.title) {
        Toast('缺少资源名称')
        return
      }
      const formData = new FormData()
      formData.append('files', this.fileList[0].file)
      formData.append('title', this.video.title)
      console.log(...formData)
      addVideo(formData).then(res => {
        Toast(res.data.msg)
        // 刷新列表
        this.getList()
        // 结束后调用
        this.clearInput()
      })
    },
    // 清除弹窗信息
    clearInput() {
      this.showVideoEdit = false
      // 刷新列表
      this.getList()
      this.video = {}
      this.chooseClass = ''
    },
    changeClass() {
      console.log(this.classId)
      this.getList()
    },
    swiperright() { // 右滑切换到detail页
      if (this.$store.state.user.user.userType === 1) {
        this.$router.push('/teacher/index')
      } else {
        this.$router.push('/student/index')
      }
    },
    afterRead(files) {
      console.log(files)
      let filename = files.file.name
      filename = filename.substring(0, filename.lastIndexOf('.'))
      this.video.title = filename
    },
    download(item) {
      window.location.href = 'http://localhost:8082/imgsInfo/getFile?' +
      'filePath=' + item.videoUrl + '&name=' + item.title
      '?attname=' + item.title
    },
    openToSee(item) {
      this.showPicture = true
      this.showVideoUrl = item.videoUrl
    }
  }
}

</script>

  <style scoped>
.overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
  </style>

