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
    <div v-show="currentIndexCode" style="height: 60%;width: 95%">
      <div class="video" ref="video"></div>
    </div>
  </div>
</template>

<script>
import { clearBubble } from "@/utils/tools";
import bus from "@/utils/bus";
import { findHlsByIndexCode } from "@/apis/information";

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
  watch: {
    currentIndexCode: {
      async handler(val) {
        const { data } = await findHlsByIndexCode(val);
        const videoStream = data.data.data;
        cyberplayer(this.$refs.video).setup({
          width: "100%", // 宽度，也可以支持百分比（不过父元素宽度要有）
          height: "100%", // 高度，也可以支持百分比
          // title: '通道号'+channelId<10?`0${channelId}`:channelId, // 标题
          isLive: true, // 必须设置，表明是直播视频
          file: videoStream,
          // image: coverUrl, // 预览图
          autostart: true, // 是否自动播放
          stretching: "fill", // 拉伸设置
          repeat: false, // 是否重复播放
          volume: 100, // 音量，注：仅当用户同意、网站由用户激活或媒体无声时允许自动播放
          controls: "over", // 是否显示控制栏
          hls: {
            reconnecttime: 5 // hls直播重连间隔秒数
          },
          controlbar: {
            barLogo: false
          },
          ak: "cc6b1a67f6954c928cac5a02c8307088" // 百度智能云平台注册（https://cloud.baidu.com）即可获得accessKey
        });
      }
    }
  },
  mounted() {
    bus.$on("update:description", (des, id, name) => {
      console.log('name');
      console.log(name);
      this.currentIndexCode = id;
      if (name !== "monitor") {
        console.log("here");
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
    overflow: auto;
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
