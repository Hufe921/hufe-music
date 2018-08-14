<template>
    <header>
      <span>electron-vue</span>
    </header>
</template>

<script>
export default {
  name: 'the-head'
}
</script>

<style lang='scss' scoped>
header {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(7, 17, 27, 0.1);
  span {
    color: #6f7d94;
    font-size: 23px;
    margin-top: 5px;
    margin-left: 25px;
  }
}
</style>
