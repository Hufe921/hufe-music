<template>
    <div class="personal-container">
        <div class="title">为你推荐歌单</div>
        <div class="class-list mt-5">
            <div class="class-item hover-bg" v-for="item in class_list" :key="item">{{item}}</div>
        </div>
        <el-row :gutter="15" class="mt-10">
            <el-col :span="20" v-for="(item,index) in personalized" :key="index">
                <personal-item :item="item"  />
            </el-col>
        </el-row>
    </div>
</template>

<script>
import PersonalItem from './personal-item'
export default {
  components: {
    PersonalItem
  },
  data () {
    return {
      personalized: [],
      class_list: [
        '情歌',
        '网络歌曲',
        '经典',
        'KTV热歌',
        '背景音乐',
        '伤感',
        '英语',
        '国语',
        '全部分类'
      ]
    }
  },
  mounted () {
    this.$_getPersonal()
  },
  methods: {
    async $_getPersonal () {
      let data = await this.$store.dispatch('home/getPersonal')
      console.log(data)
      this.personalized = data.code === 200 ? data.result : []
    }
  }
}
</script>

<style lang='scss' scoped>
.personal-container {
  padding: 0px 40px;
  .title {
    font-size: 18px;
    letter-spacing: 5px;
  }
  .class-list {
    padding: 15px 0;
    display: flex;
    .class-item {
      flex: 1;
      background-color: #fff;
      margin-left: 5px;
      text-align: center;
      font-size: 12px;
      color: #555;
      line-height: 30px;
      cursor: pointer;
      &:first-child {
        margin-left: 0;
      }
      &:hover {
        background-color: #eeeeee;
      }
    }
  }
}
.el-col-20 {
  width: 20%;
}
</style>
