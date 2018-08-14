<template>
<div class="container">
  <!-- 内容区 -->
  <div class="content">
    <h1>Hello Electron</h1>
  </div>
</div>
</template>

<script>
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
    }
  }
}
</script>

<style lang='scss' scoped>
.container {
  height: 800px;
  .content{
    background: #fff;
  }
  border: 1px solid red;
}
</style>
