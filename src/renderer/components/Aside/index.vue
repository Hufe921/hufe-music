<template>
    <div class="aside-container">
        <aside-user/>
        <aside-menu/>
    </div>
</template>

<script>
import AsideMenu from './menu'
import AsideUser from './user'
export default {
  components: {
    AsideUser,
    AsideMenu
  }
}
</script>

<style lang="scss" scoped>
.aside-container{
    display:flex;
    flex-direction: column;
}
</style>

