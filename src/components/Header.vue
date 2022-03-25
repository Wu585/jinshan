<template>
  <div class="header">
    <div class="title">
      <div class="logo"></div>
      <span>金山区地图中台展示系统</span>
    </div>
    <div class="features">
      <div
        v-for="item in featuresArray"
        @click="handleSelect(item)"
        :key="item.name"
        :class="{
          active: selectedFeature && selectedFeature.name === item.name,
        }"
        class="feature-wrapper"
      >
        <el-popover
          placement="bottom-start"
          width="200"
          trigger="hover"
          :visible-arrow="false"
          :disabled="!item.isPopover"
        >
          <ul class="header-popover-content" v-if="item.children">
            <li
              v-for="child in item.children"
              :key="child.name"
              @click="handleSelect(child)"
            >
              <img :src="child.image" alt="" />
              <span style="padding: 12px">{{ child.name }}</span>
            </li>
          </ul>
          <div slot="reference" class="feature-wrapper">
            <div class="icon" :style="backgroundStyle(item.image)"></div>
            <span>{{ item.name }}</span>
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
import { featureMap } from "@/utils/featureMap";
import * as tools from "@/utils/tools";

export default {
  name: "Header",
  data() {
    return {
      featuresArray: [
        // {
        //   name: "点查询",
        //   image: require("../assets/images/header/dcx.png"),
        //   isPopover: false,
        // },
        {
          name: "框选",
          image: require("../assets/images/header/kuangxuan.png"),
          isPopover: false,
        },
        {
          name: "测量",
          image: require("../assets/images/header/celiang.png"),
          isPopover: true,
          children: [
            {
              name: "建筑物高度测量",
              image: require("../assets/images/header/gdcl.png"),
            },
            {
              name: "距离测量",
              image: require("../assets/images/header/jlcl.png"),
            },
          ],
        },
        {
          name: "全景",
          image: require("../assets/images/header/quanjing.png"),
          isPopover: false,
        },
        {
          name: "视点管理",
          image: require("../assets/images/header/shidian.png"),
          isPopover: false,
        },
        {
          name: "场景漫游",
          image: require("../assets/images/header/manyou.png"),
          isPopover: false,
        },
        {
          name: "天际线分析",
          image: require("../assets/images/header/tjxfx.png"),
          isPopover: false,
        },
        {
          name: "可视域分析",
          image: require("../assets/images/header/ksyfx.png"),
          isPopover: false,
        },
        {
          name: "清除",
          image: require("../assets/images/header/clear.png"),
          isPopover: false,
        },
      ],
      selectedFeature: null,
    };
  },
  computed: {
    backgroundStyle() {
      return (imgPath) => ({
        backgroundImage: "url(" + imgPath + ")",
        width: "22px",
        height: "22px",
        backgroundRepeat: "no-repeat",
      });
    },
  },
  methods: {
    handleSelect(item) {
      this.selectedFeature = item;
      tools[featureMap[item.name]]?.();
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  z-index: 999;
  position: absolute;
  width: 100%;
  height: 78px;
  background: rgb(19, 42, 74);
  background: linear-gradient(
    90deg,
    rgba(19, 42, 74, 1) 0%,
    rgba(28, 36, 32, 1) 100%
  );
  display: flex;
  align-items: center;
  color: white;
  padding-left: 26px;
  justify-content: space-between;

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 24px;

    .logo {
      width: 31px;
      height: 31px;
      margin-right: 14px;
      background-image: url("../assets/images/header/logo.png");
    }
  }

  .features {
    height: 100%;
    display: flex;

    .feature-wrapper {
      width: 105px;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      &.active {
        background: rgba(85, 174, 249, 0.26);
      }

      &:hover {
        cursor: pointer;
      }

      &:not(:first-child) {
        &:before {
          display: inline-block;
          content: "";
          width: 2px;
          height: 40px;
          position: absolute;
          transform: translateX(-53px);
          background: linear-gradient(to top, black, white, black);
        }
      }

      .icon {
      }
    }
  }
}
</style>
