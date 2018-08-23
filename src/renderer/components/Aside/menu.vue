<template>
   <el-scrollbar class="aside-menu-container scroll-page">
       <div class="menu-group">
            <div class="menu-title">在线音乐</div>
            <div class="menu-item active"><i class="iconfont icon-yinle"></i>音乐馆</div>
            <div class="menu-item" @click="$_autoupdate"><i class="iconfont icon-mv"></i>更新测试</div>
            <div class="menu-item" @click="$_notification"><i class="iconfont icon-diantai"></i>通知测试</div>
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
// const fs = require('fs')
export default {
  name: 'aside-menu',
  methods: {
    // 自动更新测试
    $_autoupdate () {
      this.$electron.ipcRenderer.send('autoupdate')
    },
    // 通知测试--html5的原生标签暂时无法使用
    $_notification () {
      // let notice = new Notification('状态更新提醒', {
      //   body: '你的朋友圈有3条新状态，快去查看吧',
      //   tag: 'linxin', // 区别各通知标签，如果一样将只会出现一条通知
      //   data: {
      //     // 通知携带的信息
      //     url: 'https://www.baidu.com'
      //   },
      //   icon: 'http://blog.gdfengshuo.com/images/avatar.jpg',
      //   requireInteraction: false
      // })
      // notice.onclick = function () {
      //   window.open(notice.data.url, '_blank') // 打开网址
      //   notice.close() // 并且关闭通知
      // }
      this.$electron.ipcRenderer.send('notification')
    },
    // 打印测试
    $_print () {
      // 系统自带打印管理工具
      this.$electron.remote.webContents
        .getFocusedWebContents()
        .print(
          { silent: false, printBackground: true, deviceName: '' },
          function () {
            console.log('完成')
          }
        )

      // 使用window对象方法
      // window.print()

      // 页面转pdf预览
      // this.$electron.remote.webContents
      //   .getFocusedWebContents()
      //   .printToPDF(
      //     { marginsType: 0, pageSize: 'A4', printBackground: true, printSelectionOnly: false, landscape: true },
      //     (error, data) => {
      //       if (error) throw error
      //       fs.writeFile('./test.pdf', data, (error) => {
      //         if (error) throw error
      //         console.log('Write PDF successfully.')
      //       })
      //       console.log('完成')
      //     }
      //   )
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
