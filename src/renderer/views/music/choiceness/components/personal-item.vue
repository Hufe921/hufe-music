<template>
    <div class="personal-item-container">
        <div class="cover">
            <img :src="item.picUrl"/>
            <!-- 遮罩和播放按钮 -->
            <div class="bg hover-bg">
                <i class="iconfont icon-iconset0481" onClick="event.cancelBubble = true"></i>
            </div>
            <!-- 播放量统计 -->
            <div class="play-count">
                <i class="el-icon-service"></i>
                <span>{{item.playCount|changeCount}}</span>
            </div>
        </div>
        <div class="info">
            <div class="title hover-color">{{item.name}}</div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'personal-item',
  props: {
    item: Object
  }
}
</script>

<style lang="scss" scoped>
.personal-item-container {
  .cover {
    position: relative;
    img {
      width: 100%;
      vertical-align: middle;
    }
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0);
      .iconfont {
        font-size: 30px;
        color: white;
        opacity: 0;
        position: absolute;
        bottom: 5px;
        right: 5px;
        cursor: pointer;
        transition: color 0.8s linear;
      }
    }
    .bg:hover {
      background: rgba(0, 0, 0, 0.3);
      .iconfont {
        transition: color 0.3s linear;
        opacity: 1;
        color: white;
      }
      .iconfont:hover {
        color: #31c27c;
      }
    }
    .play-count {
      position: absolute;
      left: 8px;
      bottom: 5px;
      color: #fff;
      font-size: 13px;
    }
  }
  .info {
    height: 60px;
    padding: 10px 0;
    overflow: hidden;
    .title {
      font-size: 13px;
      color: #333;
      line-height: 20px;
      height: 40px;
      overflow: hidden;
      cursor: pointer;
    }
    .title:hover {
      color: #31c27c;
    }
  }
}
</style>
