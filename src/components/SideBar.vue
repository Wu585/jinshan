<template>
  <ul class="sidebar custom-scroll">
    <li
      v-for="item in layersArray"
      :key="item.name"
      @click="handleClick(item)"
      :class="{ active: selectedItem === item }"
    >
      <div v-if="selectedItem===item" :style="backgroundStyle(item.activeImage)"></div>
      <div v-else :style="backgroundStyle(item.image)"></div>
      <span>{{ item.name }}</span>
    </li>
  </ul>
</template>

<script>
import layersTreeJson from "../assets/json/layer.json";
import fxftJson from "../assets/json/fxft.json";
import bus from "@/utils/bus";
import { getTree } from "@/apis/information";

export default {
  name: "SideBar",
  data() {
    return {
      layersArray: [
        {
          name: "时空基础数据",
          image: require("../assets/images/sidebar/skjc.png"),
          activeImage: require("../assets/images/sidebar/skjc-active.png"),
          defaultKeys: [101, 103]
        },
        {
          name: "资源调查数据",
          image: require("../assets/images/sidebar/zydc.png"),
          activeImage: require("../assets/images/sidebar/zydc-active.png")
        },
        {
          name: "规划管控数据",
          image: require("../assets/images/sidebar/ghgk.png"),
          activeImage: require("../assets/images/sidebar/ghgk-active.png")
        },
        {
          name: "工程建设项目数据",
          image: require("../assets/images/sidebar/gcjsxm.png"),
          activeImage: require("../assets/images/sidebar/gcjsxm-active.png")
        },
        {
          name: "公共专题数据",
          image: require("../assets/images/sidebar/ggzt.png"),
          activeImage: require("../assets/images/sidebar/ggzt-active.png")
        },
        {
          name: "物联感知数据",
          image: require("../assets/images/sidebar/wlgz.png"),
          activeImage: require("../assets/images/sidebar/wlgz-active.png")
        },
        {
          name: "部门专题数据",
          image: require("../assets/images/sidebar/bmzt.png"),
          activeImage: require("../assets/images/sidebar/bmzt-active.png")
        },
        {
          name: "市级城运体征数据",
          image: require("../assets/images/sidebar/sjcy.png"),
          activeImage: require("../assets/images/sidebar/sjcy-active.png")
        },
        {
          name: "城市地下空间数据",
          image: require("../assets/images/sidebar/csdxkj.png"),
          activeImage: require("../assets/images/sidebar/csdikj-active.png")
        },
        {
          name: "社会POI数据",
          image: require("../assets/images/sidebar/shpoi.png"),
          activeImage: require("../assets/images/sidebar/shpoi-active.png"),
          defaultKeys: [387]
        }
      ],
      selectedItem: null,
      treeDataChildren: null,
      wlwTreeDataChildren: null
    };
  },
  computed: {
    backgroundStyle() {
      return (imgPath) => ({
        backgroundImage: "url(" + imgPath + ")",
        width: "30px",
        height: "30px",
        backgroundRepeat: "no-repeat"
      });
    }
  },
  props: {
    title: {},
    treeData: {}
  },
  async mounted() {
    bus.$on("push-fxft", () => {
      this.layersArray.unshift({
        name: "防汛防台数据",
        image: require("../assets/images/sidebar/csdxkj.png"),
        activeImage: require("../assets/images/sidebar/csdikj-active.png")
      });
    });
    this.layersArray.forEach((item) => {
      if (item.defaultKeys) {
        sessionStorage.setItem(item.name, JSON.stringify(item.defaultKeys));
      } else {
        sessionStorage.setItem(item.name, "[]");
      }
    });
    this.treeDataChildren = await this.handleClickWLGZ();
  },
  methods: {
    async handleClickWLGZ() {
      const { data } = await getTree();
      console.log(data);
      const newTreeData = [];
      data.data.list.forEach((item) => {
        newTreeData.push({
          name: item.collectionName,
          collectionCode: item.collectionCode,
          type: "monitor",
          id: item.id,
          count: item.count,
          children: item.children.map((point) => ({
            name: point.collectionName,
            type: "monitor",
            collectionCode: point.collectionCode,
            id: point.id,
            count: point.count,
            children: point.children.map((x) => ({
              name: x.collectionName,
              type: "monitor",
              collectionCode: x.collectionCode,
              id: x.id,
              count: x.count,
              children: x.children.map(y => ({
                name: y.collectionName,
                type: "monitor",
                collectionCode: y.collectionCode,
                id: y.id,
                count: y.count
              }))
            }))
          }))
        });
      });
      return newTreeData;
    },
    async handleClick(item) {
      this.selectedItem = item;
      const treeData = layersTreeJson.find((layer) => layer.name === item.name);
      if (item.name === "物联感知数据") {
        treeData.children.find(item => item.name === "视频监控数据").children = this.treeDataChildren;
      }
      if (item.name === "防汛防台数据") {
        this.$emit("update:treeData", fxftJson[0].children);
        this.$emit("show-layers-tree");
        return;
      }
      this.$emit("show-layers-tree");
      this.$emit("update:title", item.name);
      this.$emit("update:treeData", treeData.children);
      bus.$emit("update:defaultCheckedKeys");
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  position: absolute;
  z-index: 999;
  left: 10px;
  top: 11+78px;
  color: white;
  background-size: cover;
  background: rgba(19, 48, 82, 0.6);
  border: 3px solid #2175a9;
  cursor: pointer;
  overflow: auto;
  height: 820px;

  > li {
    padding: 16px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    &.active {
      background: rgba(10, 232, 252, 0.2);
      color: #0ae8fc;
    }
  }
}
</style>
