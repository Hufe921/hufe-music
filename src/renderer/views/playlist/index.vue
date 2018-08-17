<template>
    <el-scrollbar class="playlist-main-view scroll-page" v-loading="loading">
        <div class="playlist-container">
            <template v-if="playlist && show">
                <!-- 基本信息 -->
                <div class="playlist-basic">
                    <div class="p-basic-cover">
                        <img :src="playlist.coverImgUrl"/>
                    </div>
                    <div class="p-basic-info">
                        <div class="title">{{playlist.name}}</div>
                        <div class="author">
                            <img :src="playlist.creator.avatarUrl"/>
                            <span>{{playlist.creator.nickname}}</span>
                        </div>
                        <div class="discription line-1">{{playlist.description}}</div>
                        <div class="actions">
                            <el-button size="mini" type="primary" icon="iconfont icon-bofangsanjiaoxing">播放全部</el-button>
                            <el-button size="mini" icon="iconfont icon-shoucang">收藏</el-button>
                            <el-button size="mini" icon="iconfont icon-xiazai2">下载</el-button>
                            <el-button size="mini" icon="iconfont icon-piliangcaozuo">批量操作</el-button>
                            <el-button size="mini" icon="iconfont icon-20">分享</el-button>
                        </div>
                    </div>
                </div>
                <!-- 详细列表 -->
                <div class="playlist-table">
                    <el-table size="small" :data="playlist.tracks">
                        <el-table-column label="歌曲">
                            <template slot-scope="scope">
                                <div class="name-row">
                                    <div class="left">
                                        <i class="iconfont icon-shoucang shoucang"></i>
                                        <span>{{scope.row.name}}</span>
                                        <img class="tag" src="../../assets/images/sq.png"/>
                                        <img v-if="scope.row.mv>0" class="tag" src="../../assets/images/mv.png"/>
                                    </div>
                                    <div class="btns">
                                        <i class="iconfont icon-zanting play" @click="$_play(scope.row)"></i>
                                        <i class="iconfont icon-gengduo more"></i>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column width="200" label="歌手">
                            <template slot-scope="scope">
                                <span style="width: 140px;" class="line-1 hover">{{scope.row.ar[0].name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="200" label="专辑">
                            <template slot-scope="scope">
                                <span style="width: 190px;" class="line-1 hover">{{scope.row.al.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="60" label="时长">
                            <template slot-scope="scope">
                                <span>{{scope.row.dt|formatDuring}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </template>     
        </div>
    </el-scrollbar>
</template>

<script>
export default {
  name: 'playlist',
  data () {
    return {
      id: '',
      loading: true,
      show: false,
      playlist: false
    }
  },
  activated () {
    let id = this.$route.query.id
    if (id !== this.id) {
      this.id = id
      this.$_getData()
    } else {
      this.show = true
    }
  },
  deactivated () {
    this.show = false
  },
  methods: {
    // 获取详细数据
    async $_getData () {
      this.loading = true
      console.log(this.id)
      let data = await this.$store.dispatch('home/getPlaylistDetail', {
        id: this.id
      })
      if (data.code === 200) {
        this.playlist = data.playlist
        this.show = true
        this.loading = false
      }
    },
    async $_play (item) {
      console.log(item.id)
      this.$store.dispatch('home/playMusic', item.id)
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
.playlist-main-view {
  flex: 1;
}
$color-primary: #31c27c;
.playlist-container {
  .playlist-basic {
    padding: 25px 30px;
    display: flex;
    .p-basic-cover {
      width: 147px;
      height: 147px;
      flex-shrink: 0;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .p-basic-info {
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        font-size: 22px;
        color: #000;
        font-weight: bold;
      }
      .author {
        display: flex;
        align-items: center;
        font-size: 13px;
        color: #555;
        img {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          margin-right: 10px;
        }
      }
      .discription {
        font-size: 13px;
        color: #555;
        line-height: 20px;
      }
      /deep/ .actions {
        button {
          min-width: 90px;
          i {
            font-size: 13px;
            margin-right: 3px;
          }
        }
      }
    }
  }
  /deep/ .playlist-table {
    background: #fafafa;
    padding: 0 30px;
    .el-table {
      background: none;
      th {
        background: none;
      }
      tr {
        background: none;
        &:hover {
          .btns {
            .iconfont {
              display: block;
              &:hover {
                color: $color-primary;
              }
            }
          }
        }
      }
    }
    .name-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        .shoucang {
          font-size: 15px;
          margin-right: 8px;
          cursor: pointer;
          &:hover {
            color: $color-primary;
          }
        }
        .tag {
          height: 20px;
          cursor: pointer;
          margin-left: 8px;
        }
      }
      .btns {
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 20px;
          cursor: pointer;
          margin-right: 10px;
          color: #999;
          display: none;
        }
      }
    }
  }
}
</style>
