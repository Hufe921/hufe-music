<template>
    <div class="choiceness-view">
        <banner/>
        <personal/>
    </div>
</template>

<script>
import Banner from './components/banner'
import Personal from './components/personal'
export default {
  name: 'choicness',
  components: {
    Banner,
    Personal
  }
}
</script>

<style lang="scss" scoped>
</style>
