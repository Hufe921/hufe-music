<template>
    <div class="player-container">
        <!-- 控制区 -->
        <div class="player-control">
            <el-button type="text" @click="playBefore">
                <i class="iconfont icon-kuaitui"></i>
            </el-button>
            <el-button class="play-btn" type="text" @click="$_playClick">
                <i class="iconfont icon-zanting" v-if="!is_play"></i>
                <i class="iconfont icon-bofang" v-else></i>
            </el-button>
            <el-button type="text" @click="playAfter">
                <i class="iconfont icon-kuaijin"></i>
            </el-button>
        </div>
        <!-- 封面 -->
        <div class="player-cover">
           <img :src="cover"/>
           <audio v-show="false" ref="audio" v-if="play_url" :src="play_url" preload/>
        </div>
        <!-- 音效 -->
        <div class="player-tone">
            <el-dropdown trigger="click" placement="top" size="medium">
                <span class="el-dropdown-link">
                    标准<i class="el-icon-arrow-up el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" style="width:220px">
                    <el-dropdown-item>
                        <div class="flex-c-l">
                            <div class="check" style="width: 30px">
                                <i class="el-icon-check" style="color: #31c27c;"></i>
                            </div>
                            <span>标准品质</span>
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <div class="flex-c-l">
                            <div class="check" style="width: 30px"></div>
                            <span>HQ高品质</span>
                        </div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <div class="flex-c-l">
                            <div class="check" style="width: 30px"></div>
                            <span>SQ无损品质</span>
                        </div>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown class="mt-10" trigger="click" placement="top" size="medium">
                <span class="tone-dropdown">音效<i class="el-icon-arrow-up el-icon--right"></i></span>
                <el-dropdown-menu slot="dropdown" style="width: 200px">
                    <el-dropdown-item>关闭</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <!-- 播放进度信息 -->
        <div class="player-info">
            <div class="player-info-top">
                <div class="player-name">
                    <span class="music-name">{{name}}</span>
                    <span class="music-singer-name"> - {{ar_name}}</span>
                </div>
                <div class="player-time">
                    {{play_time*1000|formatDuring}} / {{song.dt-60|formatDuring}}
                </div>
            </div>
            <div class="player-progress">
                <el-slider :show-tooltip="false" v-model="play_time" input-size="mini" :min="0" 
                :max="song.dt/1000" 
                @change="playTimeChange">
                </el-slider>
            </div>
        </div>
        <!-- 其他操作 -->
        <div class="player-actions">
            <el-button type="text">
                <i class="iconfont icon-xiai"></i>
            </el-button>
            <el-button type="text">
                <i class="iconfont icon-liebiaoxunhuan"></i>
            </el-button>
            <el-button type="text">
                <i class="iconfont icon-shengyin"></i>
            </el-button>
            <el-popover
              placement="top"
              width="300"
              trigger="click"
              popper-class="ls"
              content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
              <play-table/>
              <el-button type="text" slot="reference">
                <i class="iconfont icon-liebiao"></i>
              </el-button>
            </el-popover>
        </div>
    </div>
</template>

<script>
import PlayTable from '../Aside/playtable'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations, mapActions } = createNamespacedHelpers('home')
const { ipcRenderer } = require('electron')
export default {
  name: 'player',
  data () {
    return {
      audio: null,
      play_time: 0,
      interval: null,
      src: ''
    }
  },
  components: {
    PlayTable
  },
  mounted () {
    // 本地播放
    // let data = this.$_getConfig()
    // this.src =
    //   data.address && data.address.length
    //     ? `http://localhost:${data.port}/url=${data.address[0]}`
    //     : ''
  },
  watch: {
    is_play (val) {
      this.$nextTick(() => {
        this.audio = this.$refs['audio']
        if (val) {
          this.audio.play()
          this.getPlayTime()
          this.audio.addEventListener('ended', () => {
            this.playEnd()
          })
        } else {
          this.audio.pause()
          clearInterval(this.interval)
        }
      })
    },
    currentTime (val) {
      this.play_time = val
    }
  },
  methods: {
    // 本地播放
    $_getConfig () {
      return ipcRenderer.sendSync('get-config')
    },
    // 播放or暂停
    $_playClick () {
      this.SET_PLAYER_DATA({ is_play: !this.is_play })
    },
    // 获取当前已播放时间
    getPlayTime () {
      this.interval = setInterval(() => {
        this.SET_PLAYER_DATA({ currentTime: this.audio.currentTime })
      }, 1000)
    },
    // 改变播放时间
    playTimeChange (val) {
      this.audio.currentTime = val
      this.SET_PLAYER_DATA({ currentTime: this.audio.currentTime })
    },
    playEnd () {
      console.log('播放结束')
      clearInterval(this.interval)
      this.playAfter()
    },
    playBefore () {
      if (this.before_song) {
        this.playMusic(this.before_song.id)
      }
    },
    playAfter () {
      console.log(this.after_song)
      if (this.after_song) {
        this.playMusic(this.after_song.id)
      }
    },
    // vuex方法
    ...mapMutations(['SET_PLAYER_DATA']),
    ...mapActions(['playMusic'])
  },
  computed: {
    ...mapState(['is_play', 'currentTime', 'song', 'playlist']),
    play_url () {
      let url = this.song.id
        ? `http://music.163.com/song/media/outer/url?id=${this.song.id}.mp3`
        : false
      return url
    },
    cover () {
      try {
        return this.song.al.picUrl
      } catch (e) {
        return 'http://p1.music.126.net/dPn_6T9d5VUuCDvhJdZ_8A==/109951163399691488.jpg'
      }
    },
    name () {
      try {
        return this.song.name || 'Hufe'
      } catch (e) {
        return 'Hufe'
      }
    },
    ar_name () {
      try {
        return this.song.ar[0].name
      } catch (e) {
        return 'music'
      }
    },
    before_song () {
      let sindex = -1
      this.playlist.map((item, index) => {
        if (this.song.id === item.id && index > 0) {
          sindex = index - 1
        }
      })
      return sindex >= 0 ? this.playlist[sindex] : false
    },
    after_song () {
      let sindex = -1
      this.playlist.map((item, index) => {
        if (this.song.id === item.id && index < this.playlist.length - 1) {
          sindex = index + 1
        }
      })
      return sindex >= 0 ? this.playlist[sindex] : false
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 70px;
.player-container {
  height: 70px;
  display: flex;
  align-items: center;
  .player-control {
    width: 230px;
    display: flex;
    justify-content: center;
    button {
      margin: 0px 15px;
      color: #31c27c;
      i {
        font-size: 32px;
      }
      &:hover {
        color: #2fab67;
      }
    }
    .play-btn {
      i {
        font-size: 38px;
      }
    }
  }
  .player-cover {
    width: $height;
    height: $height;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    img {
      width: $height - 20px;
      height: $height - 20px;
      border-radius: 2px;
    }
  }
  .player-tone {
    width: 75px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .el-dropdown {
      width: 35px;
      border: 1px solid #999;
      font-size: 10px;
      color: #333;
      padding: 1px 5px;
      border-radius: 2px;
      cursor: pointer;
      &:hover {
        color: #31c27c;
        border: 1px solid #31c27c;
      }
    }
  }
  .player-info {
    display: flex;
    flex: 1;
    padding: 0px;
    flex-direction: column;
    justify-content: center;
    .player-info-top {
      font-size: 13px;
      color: #666;
      display: flex;
      justify-content: space-between;
      .music-name {
        font-size: 14px;
        color: #444;
      }
      .player-time {
        font-size: 12px;
        color: #999;
      }
    }
    .player-progress {
      margin-top: 10px;
      /deep/ .el-progress {
        .el-progress-bar__outer {
          border-radius: 0;
        }
        .el-progress-bar__inner {
          border-radius: 0;
        }
      }
      /deep/ .el-slider {
        .el-slider__runway {
          height: 2px;
          margin: 2px 0;
        }
        .el-slider__bar {
          height: 2px;
        }
        .el-slider__button-wrapper {
          width: 6px;
          height: 6px;
          top: -10px;
        }
        .el-slider__button {
          width: 2px;
          height: 2px;
        }
      }
    }
  }
  .player-actions {
    width: 200px;
    display: flex;
    justify-content: space-around;
    button {
      color: #333;
      flex: 1;
    }
    button:first-child {
      margin-left: 5px;
    }
    button:hover {
      color: #31c27c;
    }
  }
}
</style>
