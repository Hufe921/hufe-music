<template>
    <div class="footer-container" style="height:70px">
      <player-view/>
    </div>
</template>

<script>
import PlayerView from './player'
export default {
  name: 'footer-view',
  components: {
    PlayerView
  }
}
</script>

<style lang="scss" scoped>
.footer-container {
  position: relative;
  z-index: 200;
  background: #F7F7F7;
}
</style>


