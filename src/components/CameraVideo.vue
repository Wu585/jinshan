<template>
  <div class="camera-container">
    <header>
      <div>视频播放</div>
      <img src="../assets/images/camera-title-line.png" alt="">
      <i class="el-icon-close" @click="$store.commit('SET_componentName','')" />
    </header>
    <main>
      <div v-for="(item,index) in cameraArray" :key="index">
        <div class="camera">
          <div :id="`video${index}`"></div>
          <i class="el-icon-close" @click="handleDelete(index)" />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import bus from "@/utils/bus";
import { findHlsByIndexCode } from "@/apis/information";

export default {
  name: "CameraVideo",
  data() {
    return {
      cameraArray: [],
      currentIndexCode: ""
    };
  },
  async mounted() {
    this.cameraArray.push(this.$store.getters.firstCameraId);
    const { data } = await findHlsByIndexCode(this.$store.getters.firstCameraId);
    const videoStream = data.data.data;
    cyberplayer(`video${this.cameraArray.length - 1}`).setup({
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
    bus.$on("update:description", async (des, id, name) => {
      console.log("listen----------");
      if (this.cameraArray.length >= 4) {
        return;
      }
      if (name === "monitor") {
        this.cameraArray.push(id);
        console.log("this.cameraArray");
        console.log(this.cameraArray);
        this.currentIndexCode = id;
        const { data } = await findHlsByIndexCode(id);
        const videoStream = data.data.data;
        this.$nextTick(() => {
          cyberplayer(`video${this.cameraArray.length - 1}`).setup({
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
        });
      }
    });
  },
  methods: {
    handleDelete(index) {
      this.cameraArray.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.camera-container {
  width: 564px;
  height: 533px;
  position: absolute;
  z-index: 999;
  background: url("../assets/images/camera-video-bg.png");
  top: 220px;
  right: 10px;

  header {
    color: white;
    font-size: 18px;
    font-weight: 600;
    padding: 12px 24px;

    .el-icon-close {
      cursor: pointer;
      font-size: 20px;
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }

  main {
    width: 522px;
    height: 361px;
    margin: auto;
    margin-top: 24px;
    display: flex;
    flex-wrap: wrap;

    .camera {
      width: 258px;
      height: 180px;
      //background: #007FD0;
      border: 1px solid #007FD0;
      margin-bottom: 2px;
      margin-right: 2px;
      position: relative;
    }

    .el-icon-close {
      color: white;
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
    }
  }
}
</style>
