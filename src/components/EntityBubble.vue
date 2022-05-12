<template>
  <div class="bubble-wrapper">
    <div style="height: 22px;">
      <div class="title" v-show="!currentIndexCode">属性面板</div>
    </div>
    <i class="el-icon-close" @click="close"></i>
    <ul class="content custom-scroll" v-if="description&&JSON.stringify(description)!=='{}'"
        :class="{fullHeight:!currentIndexCode}">
      <li v-for="(val, key) in description" :key="key">
        <span class="key">{{ key }}: </span>
        <span>{{ val }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { clearBubble } from "@/utils/tools";
import bus from "@/utils/bus";

export default {
  name: "EntityBubble",
  data() {
    return {
      currentIndexCode: undefined
    };
  },
  props: {
    description: {
      type: Object
    },
    isCamera: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    bus.$on("update:description", (des, id, name) => {
      this.currentIndexCode = id;
      if (name !== "monitor") {
        this.currentIndexCode = false;
      }
    });
  },
  methods: {
    close() {
      clearBubble();
    }
  }
};
</script>

<style lang="scss" scoped>
.bubble-wrapper {
  z-index: 999;
  color: white;
  width: 280px;
  height: 240px;
  background-image: url("../assets/images/bubble-bg.png");
  background-size: 100% 100%;
  padding-top: 8px;
  padding-left: 8px;
  position: absolute;
  top: -250px;
  left: 0;

  .fullHeight {
    height: 180px !important;
    overflow: auto;
    margin-top: 12px;
  }

  .el-icon-close {
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
    padding: 6px 6px;
    height: 50px;

    > li {
      padding: 2px 0;

      .key {
        color: #0ae8fc;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
}
</style>
