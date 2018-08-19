<template>
    <div class="play-table">
        <div class="play-table-top">
            <div class="title">播放队列</div>
            <div class="p-table-grid">
                <div class="action-item">{{playlist.length}}首歌曲</div>
                <div class="action-item"><i class="iconfont icon-piliangchuli"></i>批量操作</div>
                <div class="action-item"><i class="iconfont icon-qingkong"></i>清空</div>
            </div>
        </div>
        <el-scrollbar class="play-table-list scroll-page">
            <div class="song-item" v-for="(item,index) in playlist" :key="index" :class="{'active':song.id===item.id}">
                <div class="name">
                    {{item.name}}
                    <img class="tag" src="../../assets/images/sq.png"/>
                    <img v-if="item.mv>0" class="tag" src="../../assets/images/mv.png"/>
                    <div class="spin" v-show="song.id===item.id"><i class="iconfont icon-yinleren"></i></div>
                </div>
                <div class="info" >
                    <div class="singer">{{item.ar[0].name}}</div>
                    <div class="time">{{item.dt|formatDuring}}</div>
                </div>
                <div class="icon">
                  <i class="iconfont icon-bofangsanjiaoxing" :class="{'icon-zanting1':item.id===song.id}" @click="playMusic(item.id)"></i>
                  <i class="iconfont icon-shoucang"></i>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('home')
export default {
  name: 'play-table',
  watch: {
    playlist () {
      console.log(this.playlist)
    }
  },
  methods: {
    ...mapActions(['playMusic'])
  },
  computed: {
    ...mapState(['playlist', 'song'])
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

.play-table {
  .play-table-top {
    height: 80px;
    background: #f8f8f8;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    .title {
      margin-top: 20px;
    }
    .p-table-grid {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 5px;
      .action-item {
        font-size: 12px;
        display: flex;
        align-items: center;
        i {
          margin-right: 3px;
          margin-top: -1px;
        }
      }
    }
  }
  .play-table-list {
    height: 560px;
    overflow: hidden;
    .song-item {
      display: flex;
      flex-direction: column;
      padding: 10px 20px;
      position: relative;
      border-bottom: 1px #f4f4f4 solid;
      &:hover,
      &:hover .icon {
        opacity: 1;
        background-color: #f8f8f8 !important;
      }
      .name {
        width: 210px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        div.spin {
          color: #31c27c;
          margin-left: 5px;
          line-height: 20px;
          text-align: center;
          display: inline-block;
          transform-origin: 50% 50%;
          animation: spin 4s linear infinite;
        }
        .tag {
          height: 20px;
          margin-left: 5px;
          margin-top: -2px;
          cursor: pointer;
          vertical-align: middle;
        }
      }
      .info {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
        font-size: 13px;
        .singer {
          color: #666;
        }
        .time {
          color: #aaa;
        }
      }
      .icon {
        width: 55px;
        height: 63px;
        right: 0;
        bottom: 0;
        position: absolute;
        opacity: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        background-color: #fff;
        i {
          margin-left: 5px;
          font-size: 17px;
          &:hover {
            cursor: pointer;
            color: #31c27c;
          }
        }
      }
    }
  }
  .active {
    background-color: #f8f8f8;
    .name {
      color: #31c27c;
    }
    .info {
      .singer {
        color: #31c27c !important;
      }
    }
    .icon {
      opacity: 1 !important;
      background-color: #f8f8f8 !important;
    }
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
