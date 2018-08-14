<template>
<div class="music-container">
  <!-- 内容区 -->
  <pre>{{searchResult}}</pre>
</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('home')
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
  },
  computed: {
    ...mapState(['searchResult'])
  }
}
</script>

<style lang='scss' scoped>
.music-container {
  background: #fff;
  border: 1px solid red;
}
</style>
