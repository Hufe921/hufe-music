<template>
   <el-scrollbar class="aside-menu-container scroll-page">
       <div class="menu-group">
            <div class="menu-title">在线音乐</div>
            <div class="menu-item active"><i class="iconfont icon-yinle"></i>音乐馆</div>
            <div class="menu-item"><i class="iconfont icon-mv"></i>MV</div>
            <div class="menu-item"><i class="iconfont icon-diantai"></i>个性电台</div>
            <div class="menu-item" @click="$_print"><i class="iconfont icon-shoucang2"></i>打印测试</div>
       </div>

       <div class="menu-group">
            <div class="menu-title">我的音乐</div>
            <div class="menu-item"><i class="iconfont icon-shoucang hot"></i>我喜欢</div>
            <div class="menu-item"><i class="iconfont icon-screen"></i>本地和下载</div>
            <div class="menu-item"><i class="iconfont icon-lishi"></i>播放历史</div>
            <div class="menu-item"><i class="iconfont icon-shiting"></i>试听列表</div>
       </div>

       <div class="menu-group">
            <div class="menu-title menu-title-edit">
                <div class="left">我创建的歌单</div>
                <div class="right">
                    <i class="iconfont icon-jia-copy"></i>
                    <i class="iconfont icon-xiangxia"></i>
                </div>
            </div>
            <div class="menu-item" v-for="item in 3" :key="item"><i class="iconfont icon-yinyue"></i>Hufe</div>
       </div>

       <div class="menu-group">
            <div class="menu-title menu-title-edit">
                <div class="left">我收藏的歌单</div>
                <div class="right"><i class="iconfont icon-xiangxia"></i></div>  
           </div>
            <div class="menu-item"><i class="iconfont icon-yinyue"></i>Collection</div>
       </div>

   </el-scrollbar>
</template>

<script>

export default {
  name: 'aside-menu',
  methods: {
    $_print () {
      console.log(this.$electron.remote.webContents.getFocusedWebContents().getPrinters())
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-page {
  overflow: hidden;
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
.aside-menu-container {
  height: 565px;
  .menu-group {
    padding: 0 20px;
    margin-bottom: 30px;
    .menu-title {
      margin-bottom: 10px;
      font-size: 12px;
      padding-left: 10px;
      color: #666;
      .right {
        .iconfont {
          cursor: pointer;
          margin-right: 3px;
        }
      }
    }
    .menu-title-edit {
      display: flex;
      justify-content: space-between;
    }
    .menu-item {
      padding: 5px 10px;
      font-size: 13px;
      border-radius: 2px;
      margin-bottom: 5px;
      cursor: pointer;
      .iconfont {
        font-size: 15px;
        color: #0f0e0e;
        margin-right: 10px;
        cursor: pointer;
      }
      .iconfont.hot {
        color: #ff4400;
      }
    }
    .active .iconfont {
      font-size: 16px;
      color: #fff;
    }
    .menu-item:hover {
      background: #e6e7e7;
    }
    .menu-item.active {
      background: #31c27c;
      color: #fff;
    }
  }
}
</style>
