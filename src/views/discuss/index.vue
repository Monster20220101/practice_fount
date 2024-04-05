<template>
  <div class="page">
    <van-nav-bar
      title="答 疑"
      left-text="返回首页"
      right-text="发布"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <!-- 下拉列表 -->
    <van-dropdown-menu v-if="this.$store.state.user.user.userType === 1">
      <van-dropdown-item v-model="classId" :options="selectClassList" @change="changeClass" />
    </van-dropdown-menu>
    <van-cell v-if=" list.length > 0">
      <!-- 表单 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          ref="check"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :immediate-check="false"
          offset="100"
          @load="onLoad"
        >
          <van-collapse v-for="(item) in list" :key="item.id" v-model="activeName" center accordion @change="changeColl($event)">
            <van-cell>
              <template #title>
                <div style="display: flex">
                  <van-badge color="transparent">
                    <van-image
                      style="height: 40px; width: 40px; margin-top: 5px;"
                      round
                      :src="item.userAva?item.userAva : require('../../assets/ava.png')"
                    />
                    <template #content>
                      <van-tag type="primary">{{ item.relationTeacherId?'教师':'学生' }}</van-tag>
                    </template>
                  </van-badge>

                  <div style="margin-left: 15px">
                    <span style="font-size: 16px; font-weight: 700">{{ item.userName }} {{ item.createdBy === userId?'(我)':'' }}</span> <br>
                    <span style="color: #A1A1A1; font-size: 12px;">{{ item.createdTime }}</span>
                  </div>
                </div>
                <div style="padding-top: 15px">
                  {{ item.content }}
                </div>
                <div style="margin-top: 10px;">
                  <span v-for="(url,i) in item.imgsInfoUrlList" :key="i" style="margin-right: 3px; margin-top: 3px;">
                    <van-image
                      fit="cover"
                      style="height: 120px; width: 120px;"
                      :src="url"
                      @click="openToSee(url)"
                    />
                  </span>
                </div>
                <div style="margin-top: 10px;">
                  <span v-if="item.createdBy === userId" style="margin-right: 10px; color: #2F6AA5" @click="deleted(item)">删除</span>
                  <span style="color: #2F6AA5" @click="reply(item)">添加评论</span>
                </div>
              </template>
            </van-cell>
            <van-collapse-item
              style=" margin-bottom: 10px;"
              :name="item.id"
              title="评论"
              icon="chat"
            >
              <div v-if="replyList.length===0" style="padding: 12px 16px">
                暂无评论~
              </div>
              <div v-else class="cmt">
                <van-cell v-for="cmt in replyList" :key="cmt.id">
                  <template #title>
                    <div style="display: flex; margin-bottom: -25px;">
                      <van-badge color="transparent">
                        <van-image
                          style="height: 30px; width: 30px;"
                          round
                          :src="cmt.userAva?cmt.userAva : require('../../assets/ava.png')"
                        />
                        <template #content>
                          <van-tag style="transform: translate(0%, -60%);" type="primary">{{ cmt.relationTeacherId?'教师':'学生' }}</van-tag>
                        </template>
                      </van-badge>
                      <div style="margin-left: 15px">
                        <span style="font-size: 16px; font-weight: 700">{{ cmt.userName }} {{ cmt.createdBy === userId?'(我)':'' }}</span> <br>
                      </div>
                    </div>
                  </template>

                  <template #label>
                    <div style="padding-left: 45px;">
                      <div style="padding-top: 15px; color: #323233">
                        {{ cmt.content }}
                      </div>
                      <div style="margin-top: 10px;">
                        <span v-for="(url,i) in cmt.imgsInfoUrlList" :key="i" style="margin-right: 3px; margin-top: 3px;">
                          <van-image
                            fit="cover"
                            style="height: 40px; width: 40px;"
                            :src="url"
                            @click="openToSee(url)"
                          />
                        </span>
                      </div>
                      <div style="margin-top: 10px;">
                        <span style="color: #A1A1A1; font-size: 12px;">{{ cmt.createdTime }}</span>
                        <span v-if="cmt.createdBy === userId" style="margin: 0 15px" @click="deleted(cmt)">删除</span>
                        <span @click="reply(cmt)">评论</span>
                      </div>
                    </div>
                  </template>
                </van-cell>
              </div>
            </van-collapse-item>
          </van-collapse>
        </van-list>
      </van-pull-refresh>
    </van-cell>
    <v-touch @swiperight="swiperright">
      <van-empty
        v-if="loading === false && list.length === 0"
        class="custom-image"
        image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
        description="暂无数据"
      />
    </v-touch>

    <van-action-sheet
      v-model="showDiscussEdit"
      cancel-text="取消"
      close-on-click-action
      :actions="[{ name: '点 击 发 布',
                   className: (discuss.content!==undefined&&discuss.relationClassId!==undefined&&discuss.content.trim()!=='')?'sub':'nosub',
                   disabled: !(discuss.content!==undefined&&discuss.relationClassId!==undefined&&discuss.content.trim()!=='') }]"
      @select="submitDiscuss"
      @closed="closedSheet"
    >
      <div class="contentAll">
        <!-- 班级选择器 -->
        <van-field
          v-if="(!discuss.id)&&(discuss.relationDiscussId===undefined)&&($store.state.user.user.userType === 1)"
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
            visible-item-count="3"
            show-toolbar
            :columns="columns"
            @confirm="onConfirm"
            @cancel="showClassPicker = false"
          />
        </van-popup>

        <van-field
          v-model="discuss.content"
          label="内容"
          placeholder="请输入内容"
          rows="2"
          autosize
          type="textarea"
          maxlength="100"
          show-word-limit
        />
        <van-field name="uploader" label="添加图片">
          <template #input>
            <van-uploader
              v-model="fileList"
              accept="image/*"
              max-count="4"
              multiple
            />
          </template>
        </van-field>
      </div>
    </van-action-sheet>

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
import { getClassList } from '../../api/class'
import { getDiscussList, deletedDiscuss, addDiscuss, getReplyList } from '../../api/discuss'

export default {
  name: 'DiscussIndex',
  data: function() {
    return {
      list: [],
      replyList: [],
      classId: 0,
      selectClassList: [
        { text: '全部班级', value: 0 }
      ],
      chooseClass: '',
      columns: [],
      currentPage: 1,
      size: 3,
      total: 20,
      refreshing: false,
      classInfo: {},
      discuss: {},
      userId: this.$store.state.user.user.id,
      showClassEdit: false,
      activeName: '1',
      showClassPicker: false,
      showDiscussEdit: false,
      loading: true,
      finished: false,
      fileList: [],
      showPicture: false,
      showPictureUrl: '',
      relationDiscussIdForAddReply: -1
    }
  },
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
          this.columns.push(element.className)
        })
      })
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    onClickRight() {
      this.showDiscussEdit = true
    },
    swiperright() {
      this.$router.go(-1)
    },
    onLoad() {
      setTimeout(() => {
        if (this.refreshing) {
          this.list = []
          this.refreshing = false
        } else {
          this.loading = true
          this.currentPage++
          console.log('currentPage=', this.currentPage)
        }
        const params = {
          page: this.currentPage,
          size: this.size,
          key: this.key
        }
        if (this.classId > 0) {
          params.relationClassId = this.classId
        }
        getDiscussList(params).then((res) => {
          if (res.data.data.list.length < this.size) {
            this.finished = true
          }
          if (res.data.data.list.length > 0) {
            const newList = res.data.data.list
            newList.forEach(item => {
              this.list.push(item)
            })
          }
          this.discuss.relationDiscussId = undefined
          this.loading = false
        })
      }, 1000)
    },
    onRefresh() {
      this.finished = false
      this.currentPage = 1
      this.loading = true
      this.onLoad()
    },
    nextPage() {
      this.getList()
    },
    getList() {
      const params = {
        page: this.currentPage,
        size: this.size
      }
      if (this.$store.state.user.user.userType === 2) {
        this.classId = this.$store.state.user.user.studentInfo.relationClassId
        this.discuss.relationClassId = this.$store.state.user.user.studentInfo.relationClassId
      }
      if (this.classId > 0) {
        params.relationClassId = this.classId
      }
      getDiscussList(params).then((res) => {
        this.list = res.data.data.list
        this.total = res.data.data.pages

        if (this.list.length !== 0) {
          if (this.relationDiscussIdForAddReply !== -1) {
            this.activeName = this.relationDiscussIdForAddReply
            this.changeColl(this.relationDiscussIdForAddReply)
          } else {
            this.activeName = this.list[0].id
            this.changeColl(this.list[0].id)
          }
          this.relationDiscussIdForAddReply = -1 // 还原
        }
        this.loading = false
      })
    },
    onConfirm(value) {
      this.chooseClass = value
      this.showClassPicker = false
      console.log(this.chooseClass)
      this.selectClassList.forEach(el => {
        if (el.text === this.chooseClass) {
          this.discuss.relationClassId = el.value
        }
      })
    },
    deleted(item) {
      Dialog.confirm({
        message: '确认删除？'
      }).then(() => {
        console.log('确认删除', item.id)
        deletedDiscuss({
          id: item.id
        }).then((res) => {
          Toast(res.data.msg)
          if (item.relationDiscussId !== undefined) {
            this.relationDiscussIdForAddReply = item.relationDiscussId
          }
          this.currentPage = 1
          this.getList()
        })
      }).catch(() => {
        console.log('取消删除')
      })
    },
    changeClass() {
      this.currentPage = 1
      this.selectClassList.forEach(el => {
        if (el.value === this.classId) {
          this.chooseClass = el.text
          this.discuss.relationClassId = el.value
        }
      })
      this.getList()
    },
    closedSheet() {
      this.clearInput()
    },
    clearInput() {
      this.chooseClass = ''
      this.discuss.content = ''
      if (this.$store.state.user.user.userType === 1) {
        this.discuss.relationClassId = undefined
      }
      this.fileList = []
    },
    submitDiscuss() {
      const formData = new FormData()
      this.fileList.forEach(el => {
        formData.append('files', el.file)
      })
      formData.append('content', this.discuss.content)
      formData.append('relationClassId', this.discuss.relationClassId)
      if (this.discuss.relationDiscussId !== undefined) {
        formData.append('relationDiscussId', this.discuss.relationDiscussId)
        this.relationDiscussIdForAddReply = this.discuss.relationDiscussId
      }
      // console.log(...formData)
      addDiscuss(formData).then((res) => {
        Toast(res.data.msg)
        this.clearInput()
        if (this.discuss.relationDiscussId === undefined) {
          this.getList()
        } else {
          this.changeColl(this.relationDiscussIdForAddReply)
          this.relationDiscussIdForAddReply = -1
        }
      })
    },
    openToSee(url) {
      this.showPicture = true
      this.showPictureUrl = url
    },
    reply(item) {
      if (item.relationDiscussId === '-1') {
        this.discuss.relationDiscussId = item.id
      } else {
        this.discuss.relationDiscussId = item.relationDiscussId
      }
      this.discuss.relationClassId = item.relationClassId
      this.showDiscussEdit = true
    },
    changeColl(e) {
      if (e !== '') {
        const params = {
          relationDiscussId: e
        }
        getReplyList(params).then((res) => {
          this.replyList = res.data.data.replyList
        })
      }
    }
  }
}
</script>
<style scoped>
.page {
  overflow-y: visible;
}
.contentAll {
  padding: 0 16px;
}
.sub {
  background-color: #36D7B7;
  font-weight: 700;
  color: white
}
.nosub {
  font-weight: 500;
}
/deep/ .van-badge--fixed {
  top: 37px;
  left: -16px;
  transform: translate(30%, -50%);
}
/deep/ .van-badge {
  border: none
}
.overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
/deep/ .van-collapse-item__content {
  padding: 0
}
/deep/ .van-collapse {
  border-bottom: 2px solid #E8E8E9;
}
  </style>
