<template>
    <div class="header-container">
        <!-- 搜索，返回等操作 -->
        <div class="header-left">
            <el-button class="no-drag" size="mini" type="text">
                <i class="btn el-icon-arrow-left"></i>
            </el-button>
            <el-button class="no-drag" size="mini" type="text">
                <i class="btn el-icon-arrow-right"></i>
            </el-button>
            <el-button class="no-drag hover-color" size="mini" type="text">
                <i class="btn el-icon-refresh"></i>
            </el-button>
            <!-- 搜索框 -->
            <div class="search no-drag">
                <el-input size="mini" prefix-icon="el-icon-search" placeholder="搜索音乐、MV、歌单、用户" v-model="search"></el-input>
            </div>
        </div>
        <!-- 窗口操作 -->
        <div class="header-right">
            <el-button @click="minimize" class="no-drag" size="mini" type="text">
                <i class="btn el-icon-minus"></i>
            </el-button>
            <el-button @click="close" class="no-drag hover-color" size="mini" type="text">
                <i class="btn el-icon-close"></i>
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'header-container',
  data () {
    return {
      search: ''
    }
  },
  created () {
    this.$nextTick(() => {
      this.$_search()
    })
  },
  methods: {
    close () {
      this.$confirm('确定退出Hufe音乐?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$electron.ipcRenderer.send('close')
      })
    },
    minimize () {
      this.$electron.ipcRenderer.send('minimize')
    },
    // 搜索
    $_search () {
      let self = this
      document.onkeydown = function (event) {
        let e = event || window.event
        // 回车，聚焦，不为空触发搜索事件
        if (
          e &&
          e.keyCode === 13 &&
          self.search &&
          document.activeElement === document.querySelector('.el-input__inner')
        ) {
          console.log('hfue')
        }
      }
      // await this.$store.dispatch('getSearch',{keywords:'测试'})
    }
  }
}
</script>

<style lang="scss" scoped>
.header-container {
  height: 50px;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .header-left {
    display: flex;
    .btn {
      font-size: 17px;
      color: #999;
    }
    .btn:hover {
      color: #31c27c;
    }
    .el-icon-refresh {
      color: #333;
    }
    .search {
      margin-left: 15px;
      width: 200px;
      /deep/ .el-input__inner {
        border: none;
        border-radius: 30px;
        background: #e9e9e9;
        color: #8c8c8c;
      }
    }
  }
  .header-right {
    .btn {
      font-size: 17px;
      color: #333;
    }
    .btn:hover {
      color: #31c27c;
    }
  }
}
</style>
