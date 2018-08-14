<template>
<div class="container">
  <the-head/>
  <!-- 内容区 -->
  <div class="content">
    <h1>Hello Electron</h1>
    <p>{{msg}}</p>
  </div>
  <the-foot/>
</div>
</template>

<script>
import TheHead from '../../components/TheHead'
import TheFoot from '../../components/TheFoot'
export default {
  name: 'home',
  data () {
    return {
      msg: ''
    }
  },
  created () {
    this.$nextTick(() => {
      this.$_getSearch()
    })
  },
  methods: {
    async $_getSearch () {
      let data = await this.$store.dispatch('home/getSearch', {keywords: '海阔天空'})
      this.msg = data
    }
  },
  components: {
    TheFoot,
    TheHead
  }
}
</script>

<style lang='scss' scoped>
.container {
  .content{
    background: #fff;
  }
}
</style>
