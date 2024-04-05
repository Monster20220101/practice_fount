<template>
  <div id="app">
    <router-view
      :style="{
        '--height':height}"
    />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      height: screen.height + 'px'
    }
  },
  created() {
    // 这个代码是禁用鼠标右键的
    // document.oncontextmenu = function(e) {
    //   return false
    // }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2C3E50;
}
.page {
  height: var(--height);
  overflow-y: hidden;
}
.wrapper {
  height: 100%;
}

/* 把样式弄成实训云 */

/* header */
.van-nav-bar__content {
  background-color: #12B3B3;
}
.van-nav-bar__title {
  color: white;
  font-weight: 700;
  letter-spacing: 3px;
}

/* footer tabbar */
.van-tabbar {
  border-top: 5px solid transparent;
  box-shadow: 0 -2px 3px #F2F1F7;
}
.van-tabbar-item {
  color: #5C6666;
}
.van-tabbar-item--active {
  color: #17E6E6;
}

/* dialog弹窗 */
.van-dialog__header {
  font-weight: 800;
  font-size: 18px;
  padding-bottom: 15px;
  padding-top: 15px;
}

/* header */
.van-nav-bar__text {
  color: white;
}
i.van-icon.van-nav-bar__arrow::before {
  color: white;
}

/* 分页 */
.van-pagination__item {
  color: white;
  background-color: #0CC;
}
.van-pagination__item--disabled {
  color: #606266;
  background-color: #F4F4F5;
}

/* main button */
.van-button--info {
  background-color: #00B3B3;
  border-color: #00B3B3;
}

/* 列表间隔颜色 */
.van-pull-refresh__track .van-swipe-cell:nth-child(2n+1) .van-cell {
  background-color: #FAFAFA;
}
.van-pull-refresh__track .van-swipe-cell .van-cell:active,
.van-pull-refresh__track .van-swipe-cell .van-cell:focus {
  background-color: #F0FAFA;
}

</style>
