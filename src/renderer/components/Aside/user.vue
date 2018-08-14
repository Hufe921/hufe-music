<template>
    <div class="user-container no-drag">
        <!-- 头像 -->
        <div class="avatar no-drag">
            <img src="../../assets/images/max.png"/>
        </div>
        <!-- 登录或用户姓名 -->
        <div class="mt">
            <el-button style="color:#555;" type="text" class="no-drag" size="mini">
                立即登录
            </el-button>
        </div>
        <!-- 用户身份 -->
        <div class="user-icon">
            <i class="iconfont icon-LV5"></i>
            <i class="iconfont icon-vip"></i>
        </div>
    </div>
</template>

<script>
export default {
  name: 'user'
}
</script>

<style lang="scss" scoped>
.user-container {
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .avatar {
    width: 50px;
    height: 50px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      cursor: pointer;
    }
  }
  .mt{
      margin-top: 5px;
  }
  .user-icon{
      display: flex;
      justify-content: center;
      i{
          font-size:22px;
          color: #999;
          margin-left: 8px;
      }
      i:first-child{
          margin-left: 0px;
      }
  }
}
</style>
