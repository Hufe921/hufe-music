<template>
<div class="music-container">
  <!-- 餐单区 -->
  <el-tabs v-model="activeName">
    <el-tab-pane label="精选" name="choiceness"></el-tab-pane>
    <el-tab-pane label="歌手" name="singer"></el-tab-pane>
    <el-tab-pane label="排行" name="toplist"></el-tab-pane>
    <el-tab-pane label="电台" name="dj"></el-tab-pane>
    <el-tab-pane label="分类歌单" name="playlist"></el-tab-pane>
    <el-tab-pane label="有声" name="ys"></el-tab-pane>
    <el-tab-pane label="数字专辑" name="szzj"></el-tab-pane>
  </el-tabs>
  <!-- 切换区 -->
  <el-scrollbar class="music-main-view scroll-page">
    <div class="music-main">
      <transition name="el-fade-in-linear">
        <Choiceness v-if="activeName==='choiceness'" />
        <Choiceness v-if="activeName==='singer'" />
      </transition>
    </div>
  </el-scrollbar> 
</div>
</template>

<script>
import Choiceness from './choiceness/index'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('home')
export default {
  name: 'home',
  components: {
    Choiceness
  },
  data () {
    return {
      activeName: 'choiceness'
    }
  },
  created () {
    this.$nextTick(() => {
      this.$_getSearch()
    })
  },
  methods: {
    async $_getSearch () {}
  },
  computed: {
    ...mapState(['searchResult'])
  }
}
</script>

<style lang='scss' scoped>
.music-container {
  /deep/ .el-tabs {
    height: 40px;
    background: #fafafa;
    .el-tabs__header {
      padding: 0;
      margin: 0;
    }
    .el-tabs__nav-scroll {
      display: flex;
      justify-content: center;
      padding: 0;
    }
    .el-tabs__nav-wrap::after {
      display: none;
    }
    .el-tabs__item {
      font-size: 14px;
    }
  }
  .scroll-page {
    overflow: hidden;
    /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
  .music-main-view{
      height: 635px;
      overflow: hidden;
  }
}
</style>
