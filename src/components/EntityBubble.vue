<template>
  <div class="bubble-wrapper">
    <div class="title">属性面板</div>
    <i class="el-icon-close" @click="close"></i>
    <ul class="content custom-scroll">
      <li v-for="(val, key) in description" :key="val">
        <span class="key">{{ key }}: </span>
        <span>{{ val }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { clearBubble } from "@/utils/tools";

export default {
  name: "EntityBubble",
  props: {
    description: {
      type: Object,
    },
  },
  methods:{
    close(){
      clearBubble()
    }
  }
};
</script>

<style lang="scss" scoped>
.bubble-wrapper {
  z-index: 999;
  color: white;
  width: 210px;
  height: 256px;
  background-image: url("../assets/images/bubble-bg.png");
  padding-top: 8px;
  padding-left: 8px;

  .el-icon-close{
    position: absolute;
    right: 16px;
    cursor: pointer;
  }

  .title {
    font-weight: 500;
    font-size: 16px;
    padding-bottom: 10px;
    padding-left: 4px;
  }

  .content {
    padding: 6px;
    overflow: auto;
    height: 200px;

    > li {
      padding: 4px 0;

      .key {
        color: #0ae8fc;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
}
</style>
