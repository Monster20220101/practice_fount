<template>
  <div class="page">
    <van-nav-bar
      v-if="$store.state.user.user.userType === 1"
      title="资源管理"
      left-text="返回首页"
      right-text="上传"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRigth"
    />
    <van-nav-bar
      v-if="$store.state.user.user.userType === 2"
      title="资源管理"
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
      <van-pull-refresh v-if="$store.state.user.user.userType === 1" v-model="refreshing" @refresh="onRefresh">
        <!-- 滑动单元格 -->
        <van-swipe-cell v-for="item in list" :key="item.id">
          <van-cell :border="true" :title="item.resourceName" class="actionDiv" @click="openToSee(item)" />
          <template #right>
            <van-button square type="danger" text="删除" @click="deleteResource(item)" />
          </template>
          <template #left>
            <van-button square type="primary" text="下载" @click="download(item)" />
          </template>
        </van-swipe-cell>
      </van-pull-refresh>
      <van-pull-refresh v-if="$store.state.user.user.userType === 2" v-model="refreshing" @refresh="onRefresh">
        <!-- 滑动单元格 -->
        <van-swipe-cell v-for="item in list" :key="item.id">
          <van-cell :border="true" :title="item.resourceName" class="actionDiv" @click="openToSee(item)" />
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
      v-model="showResourceEdit"
      :title="dialogTitle"
      show-cancel-button
      :before-close="beforeClose"
      @confirm="editResource"
      @cancel="clearInput"
    >
      <van-cell-group>
        <!-- 班级选择器 -->
        <van-field
          v-if="!resource.id"
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

        <van-field v-model="resource.resourceName" label="资源名称" placeholder="请输入资源名称" />
        <van-uploader
          v-model="fileList"
          accept=".doc,.docx,image/*,.xls,.xlsx,.ppt,.pptx,.pdf"
          max-count="1"
          :after-read="afterRead"
        />
      </van-cell-group>
    </van-dialog>

    <!-- 图片遮罩层 -->
    <van-overlay :show="showPicture" @click="showPicture = false">
      <div class="overlay">
        <van-image
          width="100%"
          fit="contain"
          :src="showPictureUrl"
          @click.stop
        />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import { getClassList } from '../../api/class.js'
import { deletedResource, getResourceList, addResource } from '../../api/resource.js'
export default {
  name: 'ResourceIndex',
  data: function() {
    return {
      msg: '主页',
      dialogTitle: '',
      list: [],
      key: '',
      currentPage: 1,
      total: 20,
      refreshing: false,
      resource: {},
      classId: 0,
      selectClassList: [
        { text: '全部班级', value: 0 }
      ],
      chooseClass: '',
      columns: [],
      showClassPicker: false,
      showResourceEdit: false,
      fileList: [],
      showPicture: false,
      showPictureUrl: '',
      loading: true
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
          // 选择菜单
          this.columns.push(element.className)
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
      console.log('添加')
      this.resource = {}
      this.dialogTitle = '添加资源'
      this.showResourceEdit = true
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
    deleteResource(item) {
      Dialog.confirm({
        message: '确定删除【' + item.resourceName + '】吗？'
      }).then(() => {
        // 调用接口
        console.log('确认删除', item.id)
        deletedResource({
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
      getResourceList(patams).then((res) => {
        this.list = res.data.data.list
        this.total = res.data.data.pages
        this.loading = false
      })
    },
    // 编辑任务信息弹窗调用方法
    editResource() {
      // 参数判断
      if (!this.resource.resourceName) {
        Toast('缺少资源名称')
        return
      }
      if (!this.resource.relationClassId || this.resource.relationClassId <= 0) {
        Toast('请选择班级')
        return
      }
      const formData = new FormData()
      formData.append('files', this.fileList[0].file)
      formData.append('resourceName', this.resource.resourceName)
      formData.append('relationClassId', this.resource.relationClassId)
      console.log(...formData)
      addResource(formData).then(res => {
        Toast(res.data.msg)
        // 刷新列表
        this.getList()
        // 结束后调用
        this.clearInput()
      })
    },
    // 清除弹窗信息
    clearInput() {
      this.showResourceEdit = false
      // 刷新列表
      this.getList()
      this.resource = {}
      this.chooseClass = ''
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
          this.resource.relationClassId = el.value
        }
      })
    },
    swiperright() {
      this.$router.go(-1)
    },
    afterRead(files) {
      console.log(files)
      let filename = files.file.name
      filename = filename.substring(0, filename.lastIndexOf('.'))
      this.resource.resourceName = filename
    },
    download(item) {
      window.location.href = 'http://localhost:8082/imgsInfo/getFile?' +
      'filePath=' + item.resourceUrl + '&name=' + item.resourceName
      '?attname=' + item.resourceName
    },
    openToSee(item) {
      const url = item.resourceUrl
      var suffix = url.substring(url.lastIndexOf('.') + 1)
      if (suffix === 'png' || suffix === 'jpg' || suffix === 'jpeg' || suffix === 'jfjf') {
        this.showPicture = true
        this.showPictureUrl = url
      }
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

