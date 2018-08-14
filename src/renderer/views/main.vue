<template>
    <div class="main">
        <!-- 整体布局 -->
        <el-container class="container">
            <el-container>
                <el-aside class="aside" width="230px">
                    <aside-view/>
                </el-aside>
                <el-container>
                    <el-header class="header" height="50px">
                        <header-view/>
                    </el-header>
                    <el-main>
                        <keep-alive>
                            <router-view></router-view>
                        </keep-alive>
                    </el-main>
                </el-container>
            </el-container>  
            <!-- 播放器 -->
            <el-footer class="footer" height="70px">
                <foot-view/>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
import HeaderView from '../components/Header/index'
import AsideView from '../components/Aside/index'
import FootView from '../components/Footer/index'
export default {
  name: 'hufe-main',
  components: {
    FootView,
    AsideView,
    HeaderView
  }
}
</script>

<style lang="scss" scoped>
.main {
  .aside {
    background: linear-gradient(to bottom, #efefef, #efefef);
  }
  .container {
    height: 100vh;
  }
  .header {
    background: #fafafa;
    -webkit-app-region: drag;
  }
  .footer {
    background: #f7f7f7;
  }
  .el-main {
    padding: 20px 0px;
  }
  .el-header {
    padding: 0px;
  }
}
</style>
